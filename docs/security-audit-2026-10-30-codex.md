> **Status (2026-10-30):** independent second audit (Codex), kept verbatim. Its medium/low findings overlap the Claude report and are addressed on branch `security/audit-2026-10-30`; owner-login rate limiting is left to a Vercel Firewall rule.

# Security audit — wustep.me

Date: 2026-10-30. Scope: read-only review of the local `wustep/me` checkout and public production responses at `https://wustep.me`. No files in the repository were changed. Findings are ranked by practical risk; conditional risks are labeled.

## Findings

### Medium — Social image endpoint can disclose metadata for unlisted Notion pages

`pages/api/social-image.tsx:27-38, 198-225` accepts any syntactically valid Notion page ID and fetches it through the configured Notion client. The only authorization check is that a returned block belongs to `rootNotionSpaceId`; it does not check whether the page is in the site's published index. An attacker who knows an unlisted page ID may obtain its title, author, cover, and icon in a generated image if the configured Notion session can read it. This is especially relevant if `NOTION_TOKEN_V2` is configured. **Fix:** resolve IDs only through the published page index or apply the same publication ACL as page rendering before fetching/rendering. Keep the Notion credential scoped to public content.

### Medium — Owner login has no visible attempt throttling; sessions live one year

`pages/api/owner-mode.ts:50-64` accepts unlimited POST guesses in application code. `lib/owner-mode-server.ts:7,15-18,52-62` creates a deterministic HMAC cookie valid for a year, with no per-session expiry or revocation except changing `OWNER_MODE_SECRET`. The minimum accepted secret is only eight characters (`lib/owner-mode-server.ts:8,32-39`). The cookie does have `HttpOnly`, `SameSite=Lax`, and production `Secure`. **Fix:** use a long random secret, rate limit POST by IP/account, shorten session life, and add a timestamp to the signed token. Review Vercel WAF limits if already configured.

### Low — Browser security headers are largely absent

Production `GET /` and `HEAD /owner` return HSTS (`max-age=63072000`) but no `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, or `Permissions-Policy`. `next.config.js:67-95` configures only `Vary` and a narrow CORS header. A CSP would reduce the impact of an HTML/script injection in Notion content or dependencies. **Fix:** add a tested CSP and the other headers globally; account for Next scripts, Notion embeds, images, and Giscus. Consider `frame-ancestors` and an explicit `Referrer-Policy`.

### Low — Public Notion file signer accepts arbitrary block IDs and loosely checks URL hosts

`pages/api/notion-file.ts:27-56` calls `getSignedFileUrls` for any valid block ID without checking the published index. `lib/signed-file-urls.ts:11-24` accepts any `*.amazonaws.com` host and has a substring fallback for malformed URLs. The Notion API should still enforce file permissions, so this is a conditional exposure if the server's Notion credential has access to private blocks and IDs are known. **Fix:** require a strict HTTPS URL with an exact allowlisted host and authorize the block against published content before requesting a signed URL.

### Info — Historical `.env` commit contains a public identifier, not an observed credential

Commit `935e782` added `.env` and `067d7b7` removed it. The only assignment in that historical file is `NEXT_PUBLIC_GOOGLE_ID` (value intentionally omitted). The `NEXT_PUBLIC_` prefix indicates a client-facing identifier; no private key was observed in that file. Current tracked files contain only `.env.example`. **Fix:** verify this ID was intended to be public; keep secret-bearing environment files ignored and run repository secret scanning on all history.

## Checks and limits

- `pnpm audit --json` completed against npm: **0 critical, high, moderate, low, or info advisories** across 694 dependencies. This is an advisory database check, not a guarantee of safety.
- Public `/.env`, `/.git/config`, and a conventional `/_next/static/chunks/pages/index.js.map` returned 404. No directory listing was observed. The map check covers one guessed path, not every deployed chunk.
- `/api/search-notion` returned 404 as configured; its code rejects arbitrary ancestor IDs if enabled. `/api/owner-mode` returned 405 for HEAD and no cookie. `/api/social-image` returned 200 for its default public page. `/api/notion-file` and `/api/tweet/123` returned 405 for HEAD, consistent with GET-only handlers.
- The downloaded home HTML contained `__NEXT_DATA__` but no literal `NOTION_TOKEN_V2`, `NOTION_ACTIVE_USER`, `OWNER_MODE_SECRET`, or `sk-` markers. Occurrences of `http://` were observed in markup but were not verified as active mixed-content loads. No `Set-Cookie` appeared on the sampled page responses.
- Tracked-file pattern scan found no obvious `sk-`, `ghp_`, private-key block, or assigned `NOTION_TOKEN_V2`/`API_KEY` value. This does not replace a dedicated full-history scanner. No server actions or `app/` routes were found.
- No open redirect was confirmed. `next.config.js:42-66` uses fixed destinations. The Notion `External URL` feature redirects based on content (`components/NotionPage.tsx:247-291`); treat those links as editorially trusted and validate scheme/host if untrusted editors can set them.

## Prioritized fixes

1. Restrict `/api/social-image` and `/api/notion-file` to published Notion content, especially if `NOTION_TOKEN_V2` is set in production.
2. Add owner-login rate limiting, require a long random secret, and shorten signed-cookie lifetime.
3. Deploy a tested global CSP and browser security headers.
4. Confirm the historical `NEXT_PUBLIC_GOOGLE_ID` was public and run dedicated full-history secret scanning.
