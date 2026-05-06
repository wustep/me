// Minimal Standard MIDI File parser. Returns note events with absolute times
// in seconds. Supports format 0 and 1, ticks-per-quarter time division, and
// tempo meta events. SMPTE timecode division is approximated.

export type NoteEvent = {
  note: number
  time: number // seconds, absolute from start
  duration: number // seconds
  velocity: number // 0..127
}

export type ParsedMidi = {
  notes: NoteEvent[]
  duration: number // seconds
}

export function parseMidiFile(buffer: ArrayBuffer): ParsedMidi {
  const view = new DataView(buffer)
  if (readChunkId(view, 0) !== 'MThd') {
    throw new Error('Not a MIDI file (missing MThd header)')
  }
  const headerLen = view.getUint32(4)
  const division = view.getUint16(12)

  let ticksPerQuarter = 480
  let secondsPerTick = 0.5 / 480 // default 120bpm
  if ((division & 0x80_00) === 0) {
    ticksPerQuarter = division
    secondsPerTick = 0.5 / ticksPerQuarter
  } else {
    // SMPTE: approximate as 30fps * 80 ticks/frame
    const fps = -((division >> 8) & 0xff) || 30
    const ticksPerFrame = division & 0xff || 80
    secondsPerTick = 1 / (fps * ticksPerFrame)
  }

  let offset = 8 + headerLen

  type RawEvent = {
    tick: number
    type: 'on' | 'off' | 'tempo'
    note?: number
    velocity?: number
    microsPerQuarter?: number
  }
  const rawEvents: RawEvent[] = []

  while (offset < view.byteLength - 8) {
    const id = readChunkId(view, offset)
    const len = view.getUint32(offset + 4)
    offset += 8
    if (id !== 'MTrk') {
      offset += len
      continue
    }
    const trackEnd = offset + len
    let tick = 0
    let runningStatus = 0
    while (offset < trackEnd) {
      const { value: delta, next } = readVarInt(view, offset)
      offset = next
      tick += delta
      let status = view.getUint8(offset)
      if (status < 0x80) {
        // Running status
        status = runningStatus
      } else {
        offset += 1
        runningStatus = status
      }
      if (status === 0xff) {
        // Meta
        const metaType = view.getUint8(offset)
        offset += 1
        const { value: metaLen, next: afterLen } = readVarInt(view, offset)
        offset = afterLen
        if (metaType === 0x51 && metaLen === 3) {
          const microsPerQuarter =
            (view.getUint8(offset) << 16) |
            (view.getUint8(offset + 1) << 8) |
            view.getUint8(offset + 2)
          rawEvents.push({ tick, type: 'tempo', microsPerQuarter })
        }
        offset += metaLen
      } else if (status === 0xf0 || status === 0xf7) {
        const { value: sysLen, next: afterLen } = readVarInt(view, offset)
        offset = afterLen + sysLen
      } else {
        const high = status & 0xf0
        if (high === 0x90) {
          const note = view.getUint8(offset)
          const velocity = view.getUint8(offset + 1)
          offset += 2
          if (velocity > 0) {
            rawEvents.push({ tick, type: 'on', note, velocity })
          } else {
            rawEvents.push({ tick, type: 'off', note, velocity: 0 })
          }
        } else if (high === 0x80) {
          const note = view.getUint8(offset)
          const velocity = view.getUint8(offset + 1)
          offset += 2
          rawEvents.push({ tick, type: 'off', note, velocity })
        } else if (high === 0xa0 || high === 0xb0 || high === 0xe0) {
          offset += 2
        } else if (high === 0xc0 || high === 0xd0) {
          offset += 1
        } else {
          // Unknown — bail to avoid corruption
          break
        }
      }
    }
    offset = trackEnd
  }

  // Sort by tick (stable by insertion within track is fine since we merge)
  rawEvents.sort((a, b) => a.tick - b.tick)

  // Convert ticks to seconds, applying tempo changes
  let currentMicros = 500_000 // default 120bpm
  let lastTick = 0
  let lastTime = 0
  const tickToTime = new Map<number, number>()
  const events: Array<{ time: number; ev: RawEvent }> = []
  for (const ev of rawEvents) {
    const cached = tickToTime.get(ev.tick)
    let time: number
    if (cached != null) {
      time = cached
    } else {
      const deltaTicks = ev.tick - lastTick
      const tickSeconds =
        (division & 0x80_00) === 0
          ? currentMicros / 1_000_000 / ticksPerQuarter
          : secondsPerTick
      time = lastTime + deltaTicks * tickSeconds
      tickToTime.set(ev.tick, time)
      lastTick = ev.tick
      lastTime = time
    }
    if (ev.type === 'tempo' && ev.microsPerQuarter) {
      currentMicros = ev.microsPerQuarter
    } else {
      events.push({ time, ev })
    }
  }

  // Pair note-ons with note-offs to build NoteEvents
  const notes: NoteEvent[] = []
  const open = new Map<number, { time: number; velocity: number }>()
  for (const { time, ev } of events) {
    if (ev.type === 'on') {
      open.set(ev.note!, { time, velocity: ev.velocity ?? 100 })
    } else if (ev.type === 'off') {
      const prev = open.get(ev.note!)
      if (prev) {
        notes.push({
          note: ev.note!,
          time: prev.time,
          duration: Math.max(0.05, time - prev.time),
          velocity: prev.velocity
        })
        open.delete(ev.note!)
      }
    }
  }
  // Close any dangling notes
  const lastEventTime = events.length ? events.at(-1)!.time : 0
  for (const [note, prev] of open) {
    notes.push({
      note,
      time: prev.time,
      duration: Math.max(0.05, lastEventTime - prev.time + 0.5),
      velocity: prev.velocity
    })
  }

  notes.sort((a, b) => a.time - b.time)
  const duration = notes.reduce(
    (max, n) => Math.max(max, n.time + n.duration),
    0
  )
  return { notes, duration }
}

function readChunkId(view: DataView, offset: number): string {
  return String.fromCodePoint(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3)
  )
}

function readVarInt(
  view: DataView,
  offset: number
): { value: number; next: number } {
  let value = 0
  let next = offset
  for (let i = 0; i < 4; i++) {
    const byte = view.getUint8(next)
    next += 1
    value = (value << 7) | (byte & 0x7f)
    if ((byte & 0x80) === 0) break
  }
  return { value, next }
}
