import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { formatLongDate, formatMonthYear } from '../format-date'

// Run as a viewer west of UTC — where local-time formatting used to slip a
// 1st-of-month Notion date back into the previous month.
let originalTZ: string | undefined
beforeEach(() => {
  originalTZ = process.env.TZ
  process.env.TZ = 'America/Los_Angeles'
})
afterEach(() => {
  process.env.TZ = originalTZ
})

describe('formatMonthYear', () => {
  it('keeps 1st-of-month dates in their own month', () => {
    expect(formatMonthYear('2016-12-01')).toBe('Dec 2016')
    expect(formatMonthYear('2024-03-01')).toBe('Mar 2024')
  })

  it('keeps Jan 1 in its own year', () => {
    expect(formatMonthYear('2020-01-01')).toBe('Jan 2020')
    expect(formatMonthYear('2019-12-31')).toBe('Dec 2019')
  })
})

describe('formatLongDate', () => {
  it('formats a bare Notion date without shifting the month or day', () => {
    expect(formatLongDate('2024-03-01')).toBe('March 1, 2024')
    expect(formatLongDate('2020-01-01')).toBe('January 1, 2020')
  })

  it('accepts timestamps and short months', () => {
    expect(formatLongDate(Date.UTC(2023, 6, 4), { month: 'short' })).toBe(
      'Jul 4, 2023'
    )
  })
})
