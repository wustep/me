import { describe, expect, it } from 'vitest'

import {
  describeHoursApart,
  formatSfTime,
  guessActivity,
  LONGEST_SF_TIME_LINE,
  sanFranciscoMoment,
  sfTimeLine
} from '../sf-time'

const NBSP = '\u00A0'

const timeAt = (hour: number, minute: number) =>
  formatSfTime({ hour, minute, weekend: false, offsetMinutes: -480 })

const activityAt = (hour: number, weekend = false) =>
  guessActivity({ hour, minute: 0, weekend, offsetMinutes: -480 })

describe('sanFranciscoMoment', () => {
  it('reads the wall clock in winter (PST)', () => {
    // Saturday 14 Nov 2026, 3:12 am in San Francisco.
    const moment = sanFranciscoMoment(new Date('2026-11-14T11:12:00Z'))
    expect(moment).toEqual({
      hour: 3,
      minute: 12,
      weekend: true,
      offsetMinutes: -480
    })
  })

  it('reads the wall clock in summer (PDT)', () => {
    // Wednesday 1 Jul 2026, 12:30 pm in San Francisco.
    const moment = sanFranciscoMoment(new Date('2026-07-01T19:30:00Z'))
    expect(moment).toEqual({
      hour: 12,
      minute: 30,
      weekend: false,
      offsetMinutes: -420
    })
  })

  it('reports midnight as hour 0, not 24', () => {
    expect(sanFranciscoMoment(new Date('2026-11-14T08:05:00Z')).hour).toBe(0)
  })
})

describe('formatSfTime', () => {
  it('uses a 12-hour clock with a lowercase period', () => {
    expect(timeAt(0, 5)).toBe(`12:05${NBSP}am`)
    expect(timeAt(3, 12)).toBe(`3:12${NBSP}am`)
    expect(timeAt(12, 0)).toBe(`12:00${NBSP}pm`)
    expect(timeAt(23, 59)).toBe(`11:59${NBSP}pm`)
  })
})

describe('describeHoursApart', () => {
  it('says nothing when the visitor shares the clock', () => {
    expect(describeHoursApart(-480, -480)).toBeUndefined()
  })

  it('counts whole hours either way', () => {
    // London in winter is 8 hours ahead of San Francisco.
    expect(describeHoursApart(-480, 0)).toBe('8 hours behind you')
    // Honolulu is 2 hours behind San Francisco in winter.
    expect(describeHoursApart(-480, -600)).toBe('2 hours ahead of you')
    expect(describeHoursApart(-480, -420)).toBe('1 hour behind you')
  })

  it('writes half and quarter hours as fractions', () => {
    // India (UTC+5:30) and Nepal (UTC+5:45).
    expect(describeHoursApart(-480, 330)).toBe('13½ hours behind you')
    expect(describeHoursApart(-480, 345)).toBe('13¾ hours behind you')
    expect(describeHoursApart(-480, -450)).toBe('½ hour behind you')
  })

  it('gives up on an offset that is not on a quarter hour', () => {
    expect(describeHoursApart(-480, -473)).toBeUndefined()
  })
})

describe('guessActivity', () => {
  it('covers every hour of the day', () => {
    expect(activityAt(0)).toBe('probably asleep')
    expect(activityAt(6)).toBe('probably asleep')
    expect(activityAt(7)).toBe('probably still waking up')
    expect(activityAt(9)).toBe('probably in the middle of my workday')
    expect(activityAt(17)).toBe('probably in the middle of my workday')
    expect(activityAt(18)).toBe(
      'probably at the piano or mid-run in a deckbuilder'
    )
    expect(activityAt(22)).toBe(
      'probably at the piano or mid-run in a deckbuilder'
    )
    expect(activityAt(23)).toBe('probably about to call it a night')
  })

  it('does not claim a workday at the weekend', () => {
    expect(activityAt(13, true)).toBe('probably tinkering with a side project')
  })
})

describe('sfTimeLine', () => {
  it('includes the gap for a visitor in another zone', () => {
    // A visitor in London (UTC+0) while it is 3:12 am in San Francisco.
    expect(sfTimeLine(new Date('2026-11-14T11:12:00Z'), 0)).toEqual({
      time: `3:12${NBSP}am`,
      rest: ', 8 hours behind you, so I’m probably asleep.'
    })
  })

  it('leaves the gap out for a visitor on Pacific time', () => {
    expect(sfTimeLine(new Date('2026-07-01T19:30:00Z'), -420)).toEqual({
      time: `12:30${NBSP}pm`,
      rest: ', so I’m probably in the middle of my workday.'
    })
  })

  it('never produces a line longer than the one space is reserved for', () => {
    // Every quarter hour of a week, from the farthest zones in each direction.
    const start = Date.parse('2026-11-09T00:00:00Z')
    for (let step = 0; step < 7 * 24 * 4; step++) {
      const date = new Date(start + step * 15 * 60_000)
      for (const visitorOffset of [-720, -480, 0, 330, 345, 765, 840]) {
        const { time, rest } = sfTimeLine(date, visitorOffset)
        const line = `It’s ${time} in San Francisco${rest}`
        expect(line.length).toBeLessThanOrEqual(LONGEST_SF_TIME_LINE.length)
      }
    }
  })
})
