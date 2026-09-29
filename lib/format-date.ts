/**
 * Date formatting for Notion property values.
 *
 * Notion `start_date`s are bare `YYYY-MM-DD` strings, which `new Date()` reads
 * as UTC midnight. Reading any part back in the viewer's local zone (as
 * `toLocaleString` / `getFullYear` do by default) shifts 1st-of-month dates
 * into the previous month west of UTC — and since pages are prerendered in
 * UTC, the client then disagrees with the server HTML and hydration warns.
 * Every part here is computed in UTC so server and client always agree.
 */

type DateInput = string | number | Date

/** "Dec 2016" */
export function formatMonthYear(input: DateInput): string {
  return new Date(input).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  })
}

/** "December 1, 2016" (or "Dec 1, 2016" with `month: 'short'`) */
export function formatLongDate(
  input: DateInput,
  { month = 'long' }: { month?: 'long' | 'short' } = {}
): string {
  return new Date(input).toLocaleString('en-US', {
    month,
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  })
}
