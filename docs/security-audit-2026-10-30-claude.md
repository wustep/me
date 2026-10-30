> **Status (2026-10-30):** follow-up check of the production Vercel env found `NOTION_TOKEN_V2` / `NOTION_ACTIVE_USER` **not set**, so findings 1–2 stay Low. Fixes for findings 1–11 (except the dashboard-only Vercel Firewall rule) landed on branch `security/audit-2026-10-30`. The report below is unchanged from the original audit.

# Security review: `wustep/me` (wustep.me)

- **Reviewer:** Claude (Opus 5.5) via Claude Code
- **Date:** 2026-10-30
- **Commit:** `2e3218d` (main, clean tree)
- **Scope note:** the task prompt reached me truncated (it began at "…tical deps."). I treated the scope as a general audit: dependencies and supply chain, secrets in git history, the server/API surface, auth (owner mode), client-side injection sinks, headers and config, and CI.

## Summary

There are no critical or high findings. Two observations up front:

- **Dependencies are clean.** `pnpm audit` reports 0 advisories at every severity. Supply-chain hygiene is good.
- **No secrets in git history.** `.env` was committed once in 2023. It held only a public Google Analytics ID and was removed a minute later.

The main open question is whether **`NOTION_TOKEN_V2` is set in Vercel production**. I could not check that from the repo. If it is set, findings 1 and 2 go from Low to Medium. They then allow private-file signing and private-page rendering *as Stephen's Notion account*, which may belong to more workspaces than the personal one.

Labels: **Verified** means I confirmed the behavior against the code or the live site. **Config-level** means it follows from the code or config but I did not exploit it live.

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | `/api/notion-file` signs files for any block, with no workspace or source check | Low, or **Medium** if `NOTION_TOKEN_V2` is set | Verified (code) |
| 2 | Raw Notion IDs render any page in the workspace; with the token, private pages too | Low, or **Medium** if `NOTION_TOKEN_V2` is set | Verified (code) |
| 3 | Unauthenticated requests trigger unbounded Notion fetches (rate-limit and cost exhaustion) | Low–Medium | Verified (live) |
| 4 | Missing security headers (only HSTS is present) | Low | Verified (live) |
| 5 | Owner-mode login has no rate limit, the secret minimum is 8 characters, and sessions can't be revoked | Low | Verified (code) |
| 6 | Upstream error messages are echoed to clients | Low | Verified (live) |
| 7 | Image optimizer allows any `s3.us-west-2.amazonaws.com` path | Low | Config-level |
| 8 | CI actions use mutable tags and the workflow has no `permissions:` block | Low | Verified (code) |
| 9 | Lens markdown links have no scheme allowlist | Info | Verified (code) |
| 10 | Iframes delegate features with `allow='… *'`; all 12 origins checked live (no dangling takeover) | Info | Verified (live) |
| 11 | `JSON.stringify` inside `<script>` without escaping `<` | Info | Verified (code) |

---

## Findings

### 1. `/api/notion-file` signs files for any block with no workspace check

**File:** `pages/api/notion-file.ts:27-48`

The route takes `?id=<any block id>&url=<attachment:… | *.amazonaws.com | file.notion.* | img.notionusercontent.com>`, calls `notion.getSignedFileUrls`, and 302s to the result. Unlike `social-image.tsx` and `lib/acl.ts`, it never checks that the block belongs to `rootNotionSpaceId`. It also never checks that `url` is that block's own source.

- **Without `NOTION_TOKEN_V2`:** this is an open signer for files on *any public* Notion page in any workspace. The impact is small: it is a free proxy, and the 302 is CDN-cacheable for 5 minutes.
- **With `NOTION_TOKEN_V2`:** Notion signs as the logged-in user. That makes this a confused-deputy path to private files in every workspace the account can see, which could include an employer workspace. Exploiting it needs both the block ID and the file's UUID, so it is hard to do blind. IDs do leak through old shares, screenshots, and past collaborators.

**Fix:** before signing, load the block with `notion.getBlocks([pageId])`, then:
1. Require `space_id === rootNotionSpaceId`.
2. Require `source` to equal that block's own `properties.source[0][0]` or `format.display_source`, with the query and hash stripped.

HMAC-signing `(id, url)` would be neater, but `notionFileProxyUrl` runs inside `mapImageUrl` on the client, so it can't hold a secret. The workspace and source check is the practical fix.

### 2. Raw page IDs render any page in workspace `30725683…`

**Files:** `lib/resolve-page-id.ts:19-23`, `pages/[pageId].tsx` (`fallback: 'blocking'`), `pages/api/social-image.tsx`

`resolvePageIdFromMaps` returns any parsable UUID as-is, so `wustep.me/<uuid>` renders it. The ACL in `lib/acl.ts` only checks the workspace. As a result, any page in Stephen's workspace that Notion will serve can be rendered on wustep.me under the site's branding, whether or not it's in the committed index. `/api/social-image?id=` does the same for titles and covers.

- **Without the token:** only publicly shared pages are reachable, so this mostly works as designed. It does mean a page shared to the web for an unrelated reason becomes a wustep.me page.
- **With the token:** private pages in that workspace render too.

There is also a small ACL gap: in `lib/acl.ts:44`, the space check is skipped when `rootSpaceId` is falsy.

**Fix (pick one or both):**
- Keep `NOTION_TOKEN_V2` **unset in production**. If it is ever needed, use a throwaway Notion account that can see only the site's pages, never the main account.
- Limit raw-ID resolution to `publishedPageIds` (the logic already in `lib/is-published-on-site.ts`): `notFound` for unknown IDs. Treat a missing `space_id` as a failure.

### 3. Unauthenticated requests trigger unbounded Notion fetches

**Verified live:**
- `GET /00000000000000000000000000000003` → **500**, not 404.
- `GET /api/social-image?id=<random>` → **502**, with no cache header on the error.

Every unique UUID path runs a blocking ISR render that calls Notion. Every unique `social-image` or `notion-file` ID runs at least one Notion call; `social-image` also makes two `ky.head` requests on success. Error responses aren't negatively cached, and the 500 page is only cached for 10 seconds per path. Varying the ID defeats both. The code notes Notion's limit as roughly 300 requests per 300 seconds. A modest scripted loop can therefore exhaust the quota shared with real ISR revalidation. Pages then fail to regenerate and show the error page. Each request is also a billed Vercel function invocation.

**Fix:**
- Map Notion's "page not found" error to `{ notFound: true }` instead of a 500 in `pages/[pageId].tsx`.
- Apply the `publishedPageIds` restriction from finding 2.
- Put a short `s-maxage` on 4xx and 5xx responses from the API routes.
- Add a Vercel Firewall rate limit on `/api/*` and on unknown 32-hex paths.

### 4. Missing security headers

**Verified live** on `https://wustep.me/`: the only security header is `strict-transport-security: max-age=63072000`, which Vercel adds by default. Missing:

- `Content-Security-Policy`, including `frame-ancestors`
- `X-Frame-Options`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`

The practical exposure is small: there are no logged-in user actions, and the owner key form is only a clickjacking candidate. Still, these headers are cheap.

**Fix:** add a catch-all entry to `headers()` in `next.config.js`:
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`, or `CSP: frame-ancestors 'self'`
- A minimal `Permissions-Policy`

Ship a full CSP as `Content-Security-Policy-Report-Only` first. Notion embeds, tweets, KaTeX, Vercel Analytics, and the playground iframes will each need allowlisting.

### 5. Owner-mode auth hardening

**Files:** `lib/owner-mode-server.ts`, `pages/api/owner-mode.ts`

What's done well: comparison is HMAC-then-`timingSafeEqual`, the cookie is `HttpOnly; SameSite=Lax; Secure` in production, input length is capped, and there are unit tests.

Gaps:
- **No rate limiting or lockout** on `POST /api/owner-mode`. With the 8-character minimum (`MIN_OWNER_SECRET_LENGTH`), a weak secret can be brute-forced online.
- **The session token is deterministic:** `HMAC(secret, constant)`, valid for 1 year. There's no expiry inside the token and no way to revoke a session except rotating the secret, which logs out every device.
- **Impact is low today.** Owner mode only toggles client-side UI (`ownerOnly` playground entries), and no registry entry currently sets `ownerOnly: true`. Note that `ownerOnly` is *not* access control: entries and their pages ship in the public bundle and are routable by URL. Don't put anything sensitive behind it.

**Fix:**
- Raise the minimum to 32 characters. `.env.example` already recommends `openssl rand -base64 32`.
- Add a Vercel Firewall rule limiting `POST /api/owner-mode` to about 5 requests per minute per IP.
- Optionally, put an issued-at timestamp in the token so sessions can expire.

### 6. Upstream error messages are returned verbatim

**Files:** `pages/api/{notion-file,search-notion,tweet/[tweetId]}.ts`, `pages/api/social-image.tsx`

The `catch` blocks return `err.message` to the client. Verified live: `{"message":"Notion page not found \"0000…0002\""}`. Today this leaks only Notion and syndication error text. It is a habit that leaks more later, such as hostnames or token-related errors.

**Fix:** `console.error` the error and return a fixed message.

### 7. Image optimizer `remotePatterns` is broader than needed

**File:** `next.config.js:24-34` (config-level, not exploited)

`{ hostname: 's3.us-west-2.amazonaws.com' }` has no `pathname`. Any public object in *any* bucket in that region can be pulled through `wustep.me/_next/image?url=…`. That spends the site's Vercel image-optimization quota and serves arbitrary images from wustep.me. `img.notionusercontent.com` is similarly broad, but my one probe of its `/ext/` path returned 400.

**Fix:** add `pathname: '/secure.notion-static.com/**'` and `'/public.notion-static.com/**'` to the S3 entry. Also consider pathname limits on the Notion hosts.

### 8. CI hardening

**File:** `.github/workflows/build.yml`

- **No `permissions:` block.** `GITHUB_TOKEN` gets the repo default, which may be read/write.
- **Actions are pinned to mutable tags:** `actions/checkout@v4`, `actions/cache@v4`, and the third-party `jdx/mise-action@v2`. A compromised tag (as in the tj-actions incident) would run in CI.
- The blast radius is limited: the workflow uses no secrets and runs only `on: push`, with no `pull_request_target`.

**Fix:**
- Add top-level `permissions: { contents: read }`.
- Pin `jdx/mise-action`, and optionally all actions, to commit SHAs. The existing Dependabot `github-actions` config keeps SHA pins updated.

### 9. Lens markdown links have no scheme allowlist (Info)

**File:** `components/wustep/lenses/LensBody.tsx:27-36`

`[text](href)` becomes `<a href>` with no scheme check. The model-authored decks under `llms/*` render through the same path. React 19 replaces `javascript:` URLs in `href` with a blocking stub, so this is not exploitable today. It is defense in depth for content generated by models.

**Fix:** in `scripts/sync-lenses.mjs`, reject links that aren't `https?:`, `/`, `#`, or `mailto:`. CI already fails on validation errors.

### 10. Third-party iframes (Info)

**Files:** `pages/playground/*.tsx`

Twelve cross-origin iframes point at `*.vercel.app` and `wustep.github.io`. All 12 returned 200 or 307 today, so none is dangling and open to takeover. When a Vercel project is deleted, remove its iframe in the same change, or someone else can claim the name and serve content inside wustep.me.

Most frames use `allow='autoplay *; fullscreen *; …'`. The `*` hands those features to whatever origin the frame later navigates to. Prefer `allow='autoplay; fullscreen; midi'`, which defaults to the frame's own origin.

### 11. `JSON.stringify` inside `<script>` (Info)

**File:** `pages/index.tsx:33`

`dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}` is safe today because the data is static config. If Notion-derived text is ever added, a `</script>` in a title would break out of the tag.

**Fix:** use `JSON.stringify(x).replace(/</g, '\\u003c')`.

---

## Clean areas (checked, no action needed)

- **Dependencies:** `pnpm audit --json` reports 0 advisories at every severity. Key versions: `next@16.4.2`, `react@19.3.1`, `react-notion-x`, `notion-client`, `notion-utils` at `7.10.0`, `katex@0.19.0`, `prismjs@1.30.0`, `sharp@0.35.5`.
- **Supply chain:**
  - `pnpm-workspace.yaml` sets `minimumReleaseAge: 4320` (a 3-day quarantine) and an `onlyBuiltDependencies` allowlist (`sharp`, `simple-git-hooks`).
  - `--frozen-lockfile` is used in both CI and Vercel, and the pnpm version is pinned.
  - Dependabot runs weekly for npm and Actions.
  - `patches/notion-client@7.10.0.patch` contains only the API host change (`www.notion.so` → `app.notion.com`) and a `getBlockValue` fix. Nothing suspicious.
- **Secrets in history:** I grepped all of `git log --all -p` for `sk-`, `sk-ant-`, `ghp_`, `github_pat_`, `xox*`, `AKIA`, `AIza`, `secret_`, `ntn_`, PEM private keys, and assignments to `NOTION_TOKEN*`, `OWNER_MODE_SECRET`, `TWITTER_ACCESS_TOKEN`, `REDIS_*`, `API_KEY`, and `VERCEL_TOKEN`.
  - The only `.env` ever committed is `935e782` ("Upload .env to GItHub", 2023-01-21), removed in `067d7b7` one minute later. It contained only `NEXT_PUBLIC_GOOGLE_ID=UA-…`, a public analytics ID that ships to every browser anyway. **No rotation needed.**
  - The only other hit is the dummy test fixture `'a-long-enough-secret'` in `lib/__tests__/validate-env.test.ts`.
  - `.gitignore` covers `.env*`, `*.pem`, and `.vercel`.
- **`/api/search-notion`:** returns 404 while search is disabled. When enabled, `sanitizeSearchParams` pins `ancestorId` to the root page and drops client `filters`. This was fixed in the 2026-09-28 review.
- **`/api/site-markdown` and the middleware:** the path from the `x-markdown-path` header or query string only selects among static strings (`markdownForPath` uses a switch plus `isKnownSitePath`). There's no filesystem access, and the response is always `text/markdown` or `text/plain`.
- **`/api/social-image` workspace check:** present (`social-image.tsx:174-188`). The image-host `ky.head` SSRF is limited to URLs from pages in Stephen's own workspace, on the edge runtime.
- **`/api/tweet/[tweetId]`:** validates a numeric ID and uses no secrets.
- **XSS sinks:** the other `dangerouslySetInnerHTML` uses are static CSS/keyframes, CSS built from config block IDs, or the inlined dark-mode script. `LensBody` builds React nodes rather than raw HTML.
- **`images.dangerouslyAllowSVG`:** paired with the recommended `script-src 'none'; sandbox` CSP.

---

## Prioritized fix list

1. **Check Vercel production env for `NOTION_TOKEN_V2` and `NOTION_ACTIVE_USER`** (5 minutes): `vercel env ls production`. If set and not strictly needed, remove them. If needed, swap in a dedicated Notion account that can see only the site's pages. This decides whether findings 1 and 2 are Low or Medium.
2. **Lock down `/api/notion-file`** (S): check the block's `space_id` against `rootNotionSpaceId`, and check that `url` matches the block's own source (finding 1).
3. **Stop resolving arbitrary raw IDs** (S): `notFound` unless the ID is in `publishedPageIds`, and map Notion "not found" to 404 instead of 500. This covers findings 2 and 3, and cuts the Notion-quota exhaustion vector.
4. **Rate-limit with Vercel Firewall** (S, dashboard only): about 5 requests per minute per IP on `POST /api/owner-mode`, and a reasonable cap on `/api/*` (findings 3 and 5).
5. **Add baseline security headers** in `next.config.js` (S): `nosniff`, `Referrer-Policy`, `frame-ancestors 'self'` / `X-Frame-Options`, `Permissions-Policy`. Then a CSP in report-only mode (finding 4).
6. **Stop echoing `err.message`** from API routes, and give 4xx/5xx a short negative cache (XS, findings 3 and 6).
7. **Raise `MIN_OWNER_SECRET_LENGTH` to 32** and confirm the production secret is a random 32-byte value (XS, finding 5).
8. **Narrow the S3 entry in `images.remotePatterns`** to the Notion buckets' paths (XS, finding 7).
9. **CI:** add `permissions: contents: read` and SHA-pin `jdx/mise-action` (XS, finding 8).
10. **Defense in depth** (XS each):
    - Link-scheme allowlist in `sync-lenses.mjs` (finding 9).
    - Drop `*` from iframe `allow=` (finding 10).
    - Escape `<` in the JSON-LD on `index.tsx` (finding 11).
