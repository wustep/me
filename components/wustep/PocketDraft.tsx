import { useRouter } from 'next/router'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'

import {
  type CardDef,
  type CombatResult,
  type Deal,
  dealRun,
  DRAFT_ROUNDS,
  normalizeSeed,
  PLAYER_HP,
  randomSeed,
  resolveCombat,
  SUIT_LABEL
} from '@/lib/pocket-draft'
import { cn } from '@/lib/utils'

import styles from './PocketDraft.module.css'

type Phase = 'draft' | 'ready' | 'playing' | 'done'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function writeSeed(pathname: string, seed: string) {
  const url = `${pathname}?seed=${encodeURIComponent(seed)}`
  window.history.replaceState(null, '', url)
}

export function PocketDraft() {
  const router = useRouter()
  const seedFieldId = useId()
  const bootstrapped = useRef(false)
  const [deal, setDeal] = useState<Deal | null>(null)
  const [picks, setPicks] = useState<CardDef[]>([])
  const [seedDraft, setSeedDraft] = useState('')
  const [phase, setPhase] = useState<Phase>('draft')
  const [playIndex, setPlayIndex] = useState(-1)
  const [result, setResult] = useState<CombatResult | null>(null)

  const startRun = useCallback(
    (raw: string, persistUrl = true) => {
      const seed = normalizeSeed(raw) || randomSeed()
      const next = dealRun(seed)
      setDeal(next)
      setPicks([])
      setSeedDraft(next.seed)
      setPhase('draft')
      setPlayIndex(-1)
      setResult(null)
      if (persistUrl) writeSeed(router.pathname, next.seed)
    },
    [router.pathname]
  )

  useEffect(() => {
    if (!router.isReady || bootstrapped.current) return
    bootstrapped.current = true
    const querySeed =
      typeof router.query.seed === 'string' ? router.query.seed : ''
    startRun(querySeed)
  }, [router.isReady, router.query.seed, startRun])

  const round = picks.length
  const pack = deal?.packs[round]
  const liveMessage = useMemo(() => {
    if (!deal) return 'Loading Pocket Draft.'
    if (phase === 'draft' && pack) {
      return `Round ${round + 1} of ${DRAFT_ROUNDS}. Pick one of three cards.`
    }
    if (phase === 'ready') return 'Hand complete. Play the recital.'
    if (phase === 'playing') {
      const card = playIndex >= 0 ? picks[playIndex] : undefined
      return card ? `Playing ${card.name}.` : 'The recital starts.'
    }
    if (result) {
      return result.won
        ? `The Silence breaks. Score ${result.score}.`
        : `The recital fades. Score ${result.score}.`
    }
    return ''
  }, [deal, pack, phase, playIndex, picks, result, round])

  const pickCard = useCallback(
    (card: CardDef) => {
      if (!deal) return
      setPicks((current) => {
        if (current.length >= DRAFT_ROUNDS) return current
        const currentPack = deal.packs[current.length]
        if (!currentPack?.some((item) => item.id === card.id)) return current
        const next = [...current, card]
        if (next.length >= DRAFT_ROUNDS) setPhase('ready')
        return next
      })
    },
    [deal]
  )

  useEffect(() => {
    if (phase !== 'playing' || !deal) return

    if (prefersReducedMotion()) {
      setResult(resolveCombat(picks, deal.enemy))
      setPhase('done')
      return
    }

    if (playIndex >= picks.length - 1) {
      const timer = window.setTimeout(() => {
        setResult(resolveCombat(picks, deal.enemy))
        setPhase('done')
      }, 320)
      return () => window.clearTimeout(timer)
    }

    const timer = window.setTimeout(
      () => {
        setPlayIndex((index) => index + 1)
      },
      playIndex < 0 ? 80 : 280
    )
    return () => window.clearTimeout(timer)
  }, [deal, phase, picks, playIndex])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!deal || phase !== 'draft' || !pack) return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')
      ) {
        return
      }
      const index = ['1', '2', '3'].indexOf(event.key)
      if (index === -1) return
      const card = pack[index]
      if (!card) return
      event.preventDefault()
      pickCard(card)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deal, pack, phase, pickCard])

  function playRecital() {
    if (!deal || picks.length !== DRAFT_ROUNDS) return
    setPlayIndex(-1)
    setPhase('playing')
  }

  if (!deal) {
    return <div className={styles.stage}>Shuffling the table…</div>
  }

  return (
    <div className={styles.stage}>
      <div className={styles.live} aria-live='polite'>
        {liveMessage}
      </div>
      <header className={styles.header}>
        <div>
          <p className={styles.kicker}>A pocket recital</p>
          <h2 className={styles.title}>Pocket Draft</h2>
          <p className={styles.status}>
            {phase === 'draft'
              ? `Round ${round + 1} of ${DRAFT_ROUNDS}`
              : phase === 'ready'
                ? 'Hand complete'
                : phase === 'playing'
                  ? 'Playing the recital'
                  : result?.won
                    ? 'Silence breaks'
                    : 'The room goes quiet'}
            {' · '}
            You {PLAYER_HP} HP · {deal.enemy.name} {deal.enemy.hp} HP /{' '}
            {deal.enemy.attack} ATK
          </p>
        </div>
        <form
          className={styles.seedForm}
          onSubmit={(event) => {
            event.preventDefault()
            startRun(seedDraft)
          }}
        >
          <label className={styles.seedLabel} htmlFor={seedFieldId}>
            Seed
          </label>
          <input
            id={seedFieldId}
            className={styles.seedInput}
            value={seedDraft}
            spellCheck={false}
            autoCapitalize='off'
            autoComplete='off'
            onChange={(event) => setSeedDraft(event.target.value)}
          />
          <button
            className={cn(styles.button, styles.buttonGhost)}
            type='submit'
          >
            Deal
          </button>
          <button
            className={cn(styles.button, styles.buttonGhost)}
            type='button'
            onClick={() => startRun(randomSeed())}
          >
            New
          </button>
        </form>
      </header>

      <ol className={styles.hand} aria-label='Drafted hand'>
        {Array.from({ length: DRAFT_ROUNDS }, (_, index) => {
          const card = picks[index]
          return (
            <li
              key={card?.id ?? `empty-${index}`}
              className={cn(
                styles.slot,
                card && styles.slotFilled,
                phase === 'playing' && playIndex === index && styles.slotPlaying
              )}
            >
              {card ? (
                <>
                  <span className={styles.slotName}>{card.name}</span>
                  <span className={styles.slotMeta}>
                    {SUIT_LABEL[card.suit]} · {card.attack}/{card.block}
                  </span>
                </>
              ) : (
                <span className={styles.slotEmpty}>{index + 1}</span>
              )}
            </li>
          )
        })}
      </ol>

      {phase === 'draft' && pack ? (
        <>
          <div
            className={styles.offers}
            role='group'
            aria-label='Choose a card'
          >
            {pack.map((card, index) => (
              <button
                key={card.id}
                type='button'
                className={cn(styles.offer, styles[card.suit])}
                onClick={() => pickCard(card)}
              >
                <span className={styles.suit}>
                  <span className={styles.dot} aria-hidden='true' />
                  {SUIT_LABEL[card.suit]}
                  <span aria-hidden='true'> · {index + 1}</span>
                </span>
                <span className={styles.offerName}>{card.name}</span>
                <p className={styles.offerHint}>{card.hint}</p>
                <div className={styles.stats}>
                  <span>ATK {card.attack}</span>
                  <span>BLK {card.block}</span>
                </div>
              </button>
            ))}
          </div>
          <p className={styles.hint}>
            Pick 1 of 3. Same seed, same packs. Keys 1–3 also work.
          </p>
        </>
      ) : null}

      {phase === 'ready' || phase === 'playing' ? (
        <div className={styles.actions}>
          {phase === 'ready' ? (
            <button
              className={styles.button}
              type='button'
              onClick={playRecital}
            >
              Play the recital
            </button>
          ) : (
            <p className={styles.hint}>
              Cards resolve in order, then one clash.
            </p>
          )}
        </div>
      ) : null}

      {phase === 'done' && result ? (
        <div className={styles.result}>
          <h3
            className={cn(
              styles.resultTitle,
              result.won ? styles.win : styles.loss
            )}
          >
            {result.won ? 'The Silence breaks' : 'You go quiet'}
          </h3>
          <p className={styles.score}>
            Score {result.score} · {result.attack} atk / {result.block} blk ·{' '}
            {result.remainingHp} HP left
          </p>
          <ol className={styles.log}>
            {result.log.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
          <div className={styles.actions}>
            <button
              className={styles.button}
              type='button'
              onClick={() => startRun(deal.seed)}
            >
              Replay seed
            </button>
            <button
              className={cn(styles.button, styles.buttonGhost)}
              type='button'
              onClick={() => startRun(randomSeed())}
            >
              New seed
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
