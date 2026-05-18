/**
 * ChevronIcon — small downward chevron, used in selectors and disclosure
 * affordances throughout the prompt-input demo and debug checklist.
 */
export function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='m6 9 6 6 6-6' />
    </svg>
  )
}

/**
 * TocIcon — three stacked horizontal lines used as the
 * table-of-contents affordance in the page chrome.
 */
export function TocIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.75'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M4 7h12' />
      <path d='M4 12h16' />
      <path d='M4 17h10' />
    </svg>
  )
}

/**
 * ReplayIcon — circular arrow used to re-run a demo (PromptInput
 * auto-type, EquationDemo replay).
 */
export function ReplayIcon() {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M3 12a9 9 0 1 0 3-6.7' />
      <path d='M3 4v5h5' />
    </svg>
  )
}
