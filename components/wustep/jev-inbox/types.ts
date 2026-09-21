/** Gmail `users.messages` resource plus the flattened helpers connectors add. */

export type GmailHeader = {
  name: string
  value: string
}

export type GmailBody = {
  size: number
  data: string | null
  attachmentId?: string
}

export type GmailPart = {
  partId?: string
  mimeType: string
  filename?: string
  headers?: GmailHeader[]
  body?: GmailBody
  parts?: GmailPart[]
}

export type GmailPayload = {
  partId?: string
  mimeType: string
  filename?: string
  headers: GmailHeader[]
  body?: GmailBody
  parts?: GmailPart[]
}

/**
 * Shape mirrors Gmail `users.messages.get` (format=full) plus common
 * connector flattening. Content in this demo is fictional; field names
 * and nesting match the real API.
 */
export type GmailMessage = {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  historyId: string
  internalDate: string
  sizeEstimate: number
  payload: GmailPayload
  subject: string
  sender: string
  toRecipients: string[]
  ccRecipients: string[]
  date: string
  plaintextBody: string
}

export const TRIAGE_ACTIONS = ['Delete', 'Review', 'Leave'] as const
export type TriageAction = (typeof TRIAGE_ACTIONS)[number]

export const REASON_IDS = [
  'spam',
  'promotional',
  'someday',
  'person',
  'receipt',
  'reminder',
  'recruiting',
  'newsletter',
  'security'
] as const

export type ReasonId = (typeof REASON_IDS)[number]

export type ReasonActivations = Record<ReasonId, number>

export type ReasonPolicy = {
  enabled: boolean
  /** Relative importance. 1 is the default; 0 is off even if enabled. */
  weight: number
}

export type ReasonSettings = Record<ReasonId, ReasonPolicy>

export type ActionScores = Record<TriageAction, number>

export type ChoiceLike = {
  type: 'choice'
  choice: TriageAction
  /** How peaked the triad is (TypeSafe-style concentration). */
  confidence: number
  probabilities: ActionScores
}

export type TriageResult = {
  recommended: TriageAction
  /** Per-action confidence in [0, 1]; the three values sum to 1. */
  scores: ActionScores
  reasons: { id: ReasonId; weight: number; activation: number }[]
  choice: ChoiceLike
}

export type InboxItem = {
  message: GmailMessage
  /** Closed-enum reason activations Jev would emit as parallel Nouls. */
  reasons: ReasonActivations
}
