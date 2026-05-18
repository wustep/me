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

export const TOTAL_CHAPTERS = 7

/* ─────────────────────────────────────────────────────────
 * Chapter index
 *
 *   Canonical ordered list of every page in the series, used
 *   by the floating table-of-contents overlay. Intro sits at
 *   index 0; chapters 1–7 follow.
 * ───────────────────────────────────────────────────────── */
export const CHAPTERS: ReadonlyArray<{
  index: number
  title: string
  href: string
}> = [
  { index: 0, title: 'Intro', href: '/prompting' },
  { index: 1, title: 'The beginner’s mindset', href: '/prompting/mindset' },
  { index: 2, title: 'The equation', href: '/prompting/equation' },
  { index: 3, title: 'Techniques', href: '/prompting/techniques' },
  { index: 4, title: 'The tree', href: '/prompting/tree' },
  { index: 5, title: 'The colleague', href: '/prompting/colleague' },
  { index: 6, title: 'Orchestration', href: '/prompting/orchestration' },
  { index: 7, title: 'Recap', href: '/prompting/recap' }
]

export const FAKE_MODELS = [
  { name: 'Claude Opus', tag: 'deep work' },
  { name: 'GPT Pro', tag: 'balanced' },
  { name: 'Gemini Ultra', tag: 'long context' },
  { name: 'Claude Sonnet', tag: 'fast' },
  { name: 'Grok Heavy', tag: 'reasoning' },
  { name: 'DeepSeek Reasoner', tag: 'efficient' }
]

export const ERROR_MESSAGES = [
  'Insufficient credits. Top up to keep going.',
  'Rate limit exceeded. Give the model a moment.',
  'Quota exhausted for this model. Try again later or switch models.',
  'This model is temporarily unavailable. Try again in a moment.'
]

/* PROMPT INPUT auto-type storyboard */
export const AUTO_PROMPT = 'Center this div'
export const AUTO_TYPE_INITIAL_DELAY_MS = 1400
export const AUTO_TYPE_CHAR_MS = 70
export const AUTO_TYPE_SEND_DELAY_MS = 700
