import type {
  GmailHeader,
  GmailMessage,
  InboxItem,
  ReasonActivations
} from './types'
import { emptyActivations } from './triage'

const YOU = 'you@example.com'

export function utf8ToBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCodePoint(byte)
  }
  return btoa(binary)
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/u, '')
}

export function gmailBase64UrlToUtf8(data: string): string {
  const padded = data.replaceAll('-', '+').replaceAll('_', '/')
  const padLen = padded.length % 4 === 0 ? 0 : 4 - (padded.length % 4)
  const binary = atob(padded + '='.repeat(padLen))
  const bytes = Uint8Array.from(binary, (char) => char.codePointAt(0) ?? 0)
  return new TextDecoder().decode(bytes)
}

function rfc2822(iso: string): string {
  return new Date(iso).toUTCString().replace('GMT', '+0000')
}

function snippetOf(body: string): string {
  const collapsed = body.replaceAll(/\s+/gu, ' ').trim()
  if (collapsed.length <= 96) return collapsed
  return `${collapsed.slice(0, 93).trimEnd()}…`
}

function htmlWrap(subject: string, body: string): string {
  const escaped = body
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('\n', '<br>\n')
  return `<html><body><p>${escaped}</p><p style="color:#888">${subject}</p></body></html>`
}

type MessageDraft = {
  id: string
  threadId?: string
  from: string
  to?: string[]
  cc?: string[]
  subject: string
  date: string
  labels: string[]
  body: string
  extraHeaders?: GmailHeader[]
  historyId?: string
}

export function makeGmailMessage(draft: MessageDraft): GmailMessage {
  const to = draft.to ?? [YOU]
  const cc = draft.cc ?? []
  const iso = draft.date
  const internalDate = String(Date.parse(iso))
  const plaintextBody = draft.body.trim()
  const plainData = utf8ToBase64Url(plaintextBody)
  const htmlBody = htmlWrap(draft.subject, plaintextBody)
  const htmlData = utf8ToBase64Url(htmlBody)
  const snippet = snippetOf(plaintextBody)

  const headers: GmailHeader[] = [
    { name: 'MIME-Version', value: '1.0' },
    { name: 'Date', value: rfc2822(iso) },
    { name: 'Message-ID', value: `<${draft.id}@mail.example>` },
    { name: 'Subject', value: draft.subject },
    { name: 'From', value: draft.from },
    { name: 'To', value: to.join(', ') },
    ...(cc.length > 0 ? [{ name: 'Cc', value: cc.join(', ') }] : []),
    {
      name: 'Content-Type',
      value: 'multipart/alternative; boundary="000000000000_example"'
    },
    ...(draft.extraHeaders ?? [])
  ]

  const payload: GmailMessage['payload'] = {
    partId: '',
    mimeType: 'multipart/alternative',
    filename: '',
    headers,
    body: { size: 0, data: null },
    parts: [
      {
        partId: '0',
        mimeType: 'text/plain',
        filename: '',
        headers: [
          { name: 'Content-Type', value: 'text/plain; charset="UTF-8"' }
        ],
        body: { size: plaintextBody.length, data: plainData }
      },
      {
        partId: '1',
        mimeType: 'text/html',
        filename: '',
        headers: [
          { name: 'Content-Type', value: 'text/html; charset="UTF-8"' }
        ],
        body: { size: htmlBody.length, data: htmlData }
      }
    ]
  }

  const headerBytes = headers.reduce(
    (sum, item) => sum + item.name.length + item.value.length + 4,
    0
  )

  return {
    id: draft.id,
    threadId: draft.threadId ?? draft.id,
    labelIds: draft.labels,
    snippet,
    historyId:
      draft.historyId ??
      String(21_000_000 + Number.parseInt(draft.id.slice(-6), 16)),
    internalDate,
    sizeEstimate: headerBytes + plaintextBody.length + htmlBody.length + 420,
    payload,
    subject: draft.subject,
    sender: draft.from,
    toRecipients: to,
    ccRecipients: cc,
    date: iso,
    plaintextBody
  }
}

export function item(
  draft: MessageDraft,
  reasons: Partial<ReasonActivations>
): InboxItem {
  return {
    message: makeGmailMessage(draft),
    reasons: { ...emptyActivations(), ...reasons }
  }
}

export function senderName(from: string): string {
  const angled = from.match(/^(.*)<.*>$/u)
  if (angled?.[1]?.trim()) return angled[1].trim().replaceAll(/^"|"$/gu, '')
  return from.split('@')[0] ?? from
}
