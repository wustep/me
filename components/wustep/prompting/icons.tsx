import styles from './PromptingPage.module.css'

/**
 * SparkleIcon — animated star used as the "Thinking" indicator.
 */
export function SparkleIcon() {
  return (
    <svg
      className={styles.sparkle}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden='true'
    >
      <path
        className={styles.sparkleCore}
        d='M12 2 L13.6 9.2 C13.85 10.3 14.7 11.15 15.8 11.4 L23 13 L15.8 14.6 C14.7 14.85 13.85 15.7 13.6 16.8 L12 24 L10.4 16.8 C10.15 15.7 9.3 14.85 8.2 14.6 L1 13 L8.2 11.4 C9.3 11.15 10.15 10.3 10.4 9.2 Z'
      />
      <path
        className={styles.sparkleAccent}
        d='M19 3 L19.6 5.6 C19.7 6 20 6.3 20.4 6.4 L23 7 L20.4 7.6 C20 7.7 19.7 8 19.6 8.4 L19 11 L18.4 8.4 C18.3 8 18 7.7 17.6 7.6 L15 7 L17.6 6.4 C18 6.3 18.3 6 18.4 5.6 Z'
      />
    </svg>
  )
}

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
