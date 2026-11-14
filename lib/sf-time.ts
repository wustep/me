/**
 * What time it is for Stephen, for the line on /contact: the wall-clock time
 * in San Francisco, how far that is from the visitor, and a guess at what he
 * is up to. Pure functions of a `Date`, so they are unit-tested; the ticking
 * lives in components/wustep/SanFranciscoTime.tsx.
 */

const SF_TIME_ZONE = 'America/Los_Angeles'

export type SfMoment = {
  /** 0–23, San Francisco wall clock. */
  hour: number
  minute: number
  /** Saturday or Sunday in San Francisco. */
  weekend: boolean
  /** San Francisco's offset from UTC in minutes (-480 PST, -420 PDT). */
  offsetMinutes: number
}

const partsFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: SF_TIME_ZONE,
  hourCycle: 'h23',
  weekday: 'short',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric'
})

export function sanFranciscoMoment(date: Date): SfMoment {
  const parts: Record<string, string> = {}
  for (const part of partsFormat.formatToParts(date)) {
    parts[part.type] = part.value
  }
  const hour = Number(parts.hour)
  const minute = Number(parts.minute)
  // The same wall-clock reading taken as UTC, minus the real instant, is the
  // zone's offset.
  const wallAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    hour,
    minute,
    Number(parts.second)
  )
  return {
    hour,
    minute,
    weekend: parts.weekday === 'Sat' || parts.weekday === 'Sun',
    offsetMinutes: Math.round((wallAsUtc - date.getTime()) / 60_000)
  }
}

/** "3:12 am", with a no-break space so the time never wraps mid-way. */
export function formatSfTime({ hour, minute }: SfMoment) {
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  const period = hour < 12 ? 'am' : 'pm'
  return `${hour12}:${String(minute).padStart(2, '0')}\u00A0${period}`
}

const FRACTIONS: Record<number, string | undefined> = {
  15: '¼',
  30: '½',
  45: '¾'
}

/**
 * How far San Francisco is from the visitor, as "9 hours behind you" or
 * "3½ hours ahead of you". `undefined` when they share a clock, or for an
 * offset that does not land on a quarter hour.
 */
export function describeHoursApart(
  sfOffsetMinutes: number,
  visitorOffsetMinutes: number
): string | undefined {
  const apart = sfOffsetMinutes - visitorOffsetMinutes
  if (apart === 0) return undefined
  const minutes = Math.abs(apart)
  const whole = Math.floor(minutes / 60)
  const remainder = minutes % 60
  const fraction = remainder === 0 ? '' : FRACTIONS[remainder]
  if (fraction === undefined) return undefined
  const amount =
    whole === 0
      ? `${fraction} hour`
      : `${whole}${fraction} ${whole === 1 && !fraction ? 'hour' : 'hours'}`
  return `${amount} ${apart < 0 ? 'behind you' : 'ahead of you'}`
}

/**
 * A guess at what Stephen is doing at this hour, to follow "so I'm …". The
 * evening and weekend guesses come from the home page bio.
 */
export function guessActivity({ hour, weekend }: SfMoment) {
  if (hour < 7) return 'probably asleep'
  if (hour < 9) return 'probably still waking up'
  if (hour < 18) {
    return weekend
      ? 'probably tinkering with a side project'
      : 'probably in the middle of my workday'
  }
  if (hour < 23) return 'probably at the piano or mid-run in a deckbuilder'
  return 'probably about to call it a night'
}

export type SfTimeLine = {
  /** "3:12 am" */
  time: string
  /** Everything after "It's {time} in San Francisco", punctuation included. */
  rest: string
}

/**
 * The parts of "It's 3:12 am in San Francisco, 9 hours behind you, so I'm
 * probably asleep." for `date`, as seen by a visitor whose own UTC offset is
 * `visitorOffsetMinutes` (`-date.getTimezoneOffset()` in a browser).
 */
export function sfTimeLine(
  date: Date,
  visitorOffsetMinutes: number
): SfTimeLine {
  const moment = sanFranciscoMoment(date)
  const apart = describeHoursApart(moment.offsetMinutes, visitorOffsetMinutes)
  return {
    time: formatSfTime(moment),
    rest: `${apart ? `, ${apart},` : ','} so I'm ${guessActivity(moment)}.`
  }
}

/**
 * The longest line `sfTimeLine` can produce. The component lays the live
 * line over an invisible copy of this, so the space is reserved before the
 * clock mounts and nothing below it ever moves.
 */
export const LONGEST_SF_TIME_LINE =
  "It's 10:00\u00A0pm in San Francisco, 12½ hours behind you, so I'm probably at the piano or mid-run in a deckbuilder."
