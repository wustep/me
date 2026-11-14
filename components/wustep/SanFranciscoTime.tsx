import * as React from 'react'

import { LONGEST_SF_TIME_LINE, sfTimeLine } from '@/lib/sf-time'

import styles from './SanFranciscoTime.module.css'

/**
 * A line for /contact that says what time it is for Stephen right now, how
 * far that is from the visitor, and what he is probably doing: "It's 3:12 am
 * in San Francisco, 8 hours behind you, so I'm probably asleep."
 *
 * The page is static, so the server (and anyone without JavaScript) gets a
 * plain sentence about the time zone, and the live line replaces it on
 * mount. Both sit on top of an invisible copy of the longest possible line,
 * which reserves the space up front: nothing below moves when the clock
 * arrives or when the wording changes with the hour.
 */
export function SanFranciscoTime() {
  const [now, setNow] = React.useState<Date | null>(null)

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      const date = new Date()
      setNow(date)
      // Wake just after the next minute begins.
      timer = setTimeout(tick, 60_000 - (date.getTime() % 60_000) + 50)
    }
    tick()
    return () => clearTimeout(timer)
  }, [])

  const line = now ? sfTimeLine(now, -now.getTimezoneOffset()) : null

  return (
    <p className={styles.line}>
      <span className={styles.sizer} aria-hidden='true'>
        {LONGEST_SF_TIME_LINE}
      </span>
      <span>
        {now && line ? (
          <>
            It&apos;s <time dateTime={now.toISOString()}>{line.time}</time> in
            San Francisco{line.rest}
          </>
        ) : (
          <>I&apos;m in San Francisco, on Pacific time.</>
        )}
      </span>
    </p>
  )
}
