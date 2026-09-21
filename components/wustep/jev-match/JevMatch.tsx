'use client'

import { Shuffle } from 'lucide-react'
import { useMemo, useState } from 'react'

import { mulberry32, shuffleInPlace } from '../jev-shared'
import styles from './JevMatch.module.css'
import { rankPeople, toggleIn } from './match'
import { DEFAULT_YOU, PEOPLE } from './people'
import {
  ENERGIES,
  type Energy,
  HOBBIES,
  type Hobby,
  LOOKING_FOR,
  type LookingFor,
  type Person,
  type YouProfile
} from './types'

const JEV_POST =
  'https://typesafe.ai/blog/introducing-system-one-models-and-jev'

const SHOW = 8

function pct(value: number): string {
  return `${Math.round(value * 100)}`
}

function pickPeople(seed: number): Person[] {
  const rng = mulberry32(seed)
  return shuffleInPlace([...PEOPLE], rng).slice(0, SHOW)
}

export function JevMatch() {
  const [you, setYou] = useState<YouProfile>(DEFAULT_YOU)
  const [seed, setSeed] = useState(7)
  const people = useMemo(() => pickPeople(seed), [seed])
  const ranked = useMemo(() => rankPeople(you, people), [you, people])

  const patch = (partial: Partial<YouProfile>) => {
    setYou((prev) => ({ ...prev, ...partial }))
  }

  return (
    <div className={styles.root}>
      <header className={styles.top}>
        <div className={styles.kicker}>
          <h2 className={styles.title}>Jev Match</h2>
          <span className={styles.stub}>Heuristic stub</span>
        </div>
        <p className={styles.lede}>
          Structured questions over hobbies and looking-for — the{' '}
          <a href={JEV_POST} target='_blank' rel='noreferrer'>
            Jev
          </a>{' '}
          shape, not a chatbot. Each nobody gets a hypothesis, a fit score, a
          confidence, and reasons. Edit &quot;you&quot; and the ranking
          recomputes. Fictional people only.
        </p>
        <div className={styles.toolbar}>
          <button
            type='button'
            className={styles.btn}
            onClick={() => setSeed((n) => n + 1)}
          >
            <Shuffle size={14} aria-hidden='true' />
            Reshuffle nobodies
          </button>
        </div>
      </header>

      <div className={styles.frame}>
        <aside className={styles.you}>
          <h3 className={styles.asideTitle}>You</h3>
          <label className={styles.label} htmlFor='you-name'>
            Name
          </label>
          <input
            id='you-name'
            className={styles.field}
            value={you.name}
            onChange={(event) => patch({ name: event.target.value })}
          />
          <label className={styles.label} htmlFor='you-city'>
            City
          </label>
          <input
            id='you-city'
            className={styles.field}
            value={you.city}
            onChange={(event) => patch({ city: event.target.value })}
          />
          <label className={styles.label} htmlFor='you-energy'>
            Energy
          </label>
          <select
            id='you-energy'
            className={styles.energy}
            value={you.energy}
            onChange={(event) =>
              patch({ energy: event.target.value as Energy })
            }
          >
            {ENERGIES.map((energy) => (
              <option key={energy} value={energy}>
                {energy}
              </option>
            ))}
          </select>
          <label className={styles.label} htmlFor='you-bio'>
            Bio
          </label>
          <textarea
            id='you-bio'
            className={styles.area}
            value={you.bio}
            onChange={(event) => patch({ bio: event.target.value })}
          />
          <span className={styles.label}>Hobbies</span>
          <div className={styles.chips}>
            {HOBBIES.map((hobby) => (
              <button
                key={hobby}
                type='button'
                className={styles.chip}
                data-on={you.hobbies.includes(hobby)}
                onClick={() =>
                  patch({ hobbies: toggleIn(you.hobbies, hobby) as Hobby[] })
                }
              >
                {hobby}
              </button>
            ))}
          </div>
          <span className={styles.label}>Looking for</span>
          <div className={styles.chips}>
            {LOOKING_FOR.map((wish) => (
              <button
                key={wish}
                type='button'
                className={styles.chip}
                data-on={you.lookingFor.includes(wish)}
                onClick={() =>
                  patch({
                    lookingFor: toggleIn(you.lookingFor, wish) as LookingFor[]
                  })
                }
              >
                {wish}
              </button>
            ))}
          </div>
        </aside>

        <div className={styles.list}>
          {ranked.map((result) => (
            <article key={result.person.id} className={styles.card}>
              <div className={styles.nameRow}>
                <span className={styles.name}>{result.person.name}</span>
                <span className={styles.meta}>
                  {result.person.age} · {result.person.city}
                </span>
              </div>
              <p className={styles.hypothesis}>{result.hypothesis}</p>
              <div className={styles.fitRow}>
                <span className={styles.fitNum}>{pct(result.fit)}</span>
                <span className={styles.track}>
                  <span
                    className={styles.fill}
                    style={{ transform: `scaleX(${result.fit})` }}
                  />
                </span>
                <span className={styles.conf}>
                  {pct(result.confidence)} conf
                </span>
              </div>
              {result.reasons.map((reason) => (
                <div key={reason.id} className={styles.reason}>
                  <span className={styles.reasonLabel}>{reason.label}</span>
                  <span className={styles.reasonScore}>
                    {pct(reason.score)}
                  </span>
                  <span className={styles.reasonNote}>{reason.note}</span>
                </div>
              ))}
              <p className={styles.bio}>{result.person.bio}</p>
              <div className={styles.tags}>
                {result.person.hobbies.map((hobby) => (
                  <span key={hobby} className={styles.tag}>
                    {hobby}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
