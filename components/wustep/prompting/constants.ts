export const TITLE = 'How to talk to coding agents'
export const TITLE_WORDS = TITLE.split(' ')

/* ─────────────────────────────────────────────────────────
 * Intro animation timing
 *
 *   The "Thinking" indicator holds for ~1200ms before the title
 *   blurs in word-by-word. Body content lands just as the title
 *   settles, then staggers down the page.
 * ───────────────────────────────────────────────────────── */
export const THINKING_DURATION_MS = 1200
export const PER_WORD_STAGGER_MS = 50
export const BODY_BASE_DELAY_MS = 600
export const BODY_STAGGER_MS = 110

export const TOTAL_CHAPTERS = 5

export const FAKE_MODELS = [
  { name: 'Claude Opus 9.7', tag: '1Q ctx' },
  { name: 'GPT-7o-turbo-omni-pro', tag: 'thinks?' },
  { name: 'Gemini 5 Ultra Diamond', tag: 'shiny' },
  { name: 'Sonnet 12 Hyperdrive', tag: 'fast' },
  { name: 'Grok Heavy Heavy', tag: 'heavy' },
  { name: 'DeepSeek V9', tag: 'probably AGI' }
]

export const ERROR_MESSAGES = [
  'Insufficient credits. Top up to keep going.',
  'Rate limit exceeded. Give the model a moment.',
  'Quota exhausted for this model. Try again later or switch models.'
]

/* PROMPT INPUT auto-type storyboard */
export const AUTO_PROMPT = 'Center this div'
export const AUTO_TYPE_INITIAL_DELAY_MS = 1400
export const AUTO_TYPE_CHAR_MS = 70
export const AUTO_TYPE_SEND_DELAY_MS = 700
