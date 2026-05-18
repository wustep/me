import * as React from 'react'

import { useInView } from '@/lib/use-in-view'

import { ChapterBody } from './ChapterBody'
import styles from './PromptingPage.module.css'

export function MindsetContent() {
  return (
    <ChapterBody>
      <p>
        If you&apos;ve been writing software with agents for a while, you might
        be starting to feel competent. Don&apos;t trust the feeling.
      </p>

      <EloChart />

      <p>
        AI coding is roughly three years old. Chess is five hundred. Three years
        of chess might get you to 1200 ELO &mdash; past most casual players, but
        a long way short of anyone you&apos;d call expert. The frontier of the
        curve is somewhere out around 2800. That&apos;s where we all are with
        this skill.
      </p>

      <p>
        The danger of feeling expert too early is that your curve flattens. You
        stop reading tutorials, skip the bootcamp, ignore the patterns the model
        just enabled last week. Look at where your workflow was twelve months
        ago, then project that forward &mdash; most of the meta hasn&apos;t been
        uncovered yet.
      </p>

      <h3 className={styles.mindsetForkHeading}>The fork in the road</h3>

      <p>
        Sooner or later the model will let you down. It writes the wrong code.
        Picks the wrong abstraction. Hallucinates an API. Confidently does the
        opposite of what you asked. In that moment you face a small, quiet
        choice that ends up shaping your entire trajectory.
      </p>

      <div className={styles.mindsetPair}>
        <section
          className={`${styles.mindsetCard} ${styles.mindsetCardClosed}`}
        >
          <span className={styles.mindsetCardLabel}>Closed</span>
          <h4 className={styles.mindsetCardHeading}>Blame the AI.</h4>
          <p>
            &ldquo;The model is bad.&rdquo; &ldquo;It&apos;s overhyped.&rdquo;
            &ldquo;It can&apos;t do real work.&rdquo; Comforting, easy, and a
            dead end &mdash; the verdict shuts the door before you check what
            actually happened. Tomorrow&apos;s task goes the same way as
            today&apos;s.
          </p>
        </section>

        <section className={`${styles.mindsetCard} ${styles.mindsetCardOpen}`}>
          <span className={styles.mindsetCardLabel}>Open</span>
          <h4 className={styles.mindsetCardHeading}>
            Ask what you could have done differently.
          </h4>
          <p>
            Was the prompt actually clear, or could it be read two ways? What
            context was missing? Each failure becomes a rep &mdash; often the
            fix is just writing what you meant more plainly. That&apos;s how the
            curve keeps climbing.
          </p>
        </section>
      </div>

      <p>
        There&apos;s a useful little phrase that lives in gaming culture:{' '}
        <em>skill issue</em>. When your character keeps dying, the level
        isn&apos;t broken &mdash; you&apos;re missing something. It sounds
        flippant, but the move underneath it is serious: assume, provisionally,
        that the bottleneck is you. Not because it always is, but because
        that&apos;s the assumption that produces growth.
      </p>

      <p>
        Most of the time, the model isn&apos;t the limit; your brief is, your
        context is, your model choice is, your patience is. Once you adopt the
        bottleneck-is-me stance by default, the same frustrating moment turns
        into a small lab. Why did it go sideways? What signal did I miss? Which
        lever, pulled differently, would have changed the result? Each one is a
        piece of edge other people aren&apos;t collecting because they&apos;ve
        already decided the tool is bad.
      </p>

      <p>
        The beginner&apos;s mindset isn&apos;t humility for its own sake.
        It&apos;s the faster path. Three years in, the people pulling away are
        the ones still treating themselves like beginners &mdash; still reading,
        still experimenting, still updating their priors when the model
        surprises them.
      </p>

      <p>
        The rest of this guide is what the next 1200 points of ELO look like, at
        least from where I&apos;m standing right now. A few mental models, then
        a small repertoire of moves. None of it is magic; all of it is
        learnable. Stay curious.
      </p>

      <div className={styles.synthesis}>
        <h3 className={styles.synthesisHeading}>
          <span className={styles.synthesisSymbol} aria-hidden='true'>
            ✦
          </span>
          We&apos;re all beginners
        </h3>
        <p>
          Closed minds blame the model. Open minds ask what they missed. The
          first stops you learning; the second compounds.
        </p>
      </div>
    </ChapterBody>
  )
}

/* ─────────────────────────────────────────────────────────
 * ELO CHART STORYBOARD
 *
 *    0ms   waiting for IntersectionObserver (threshold 0.4)
 *  200ms   density curve fill fades in
 *  300ms   density curve stroke draws left → right (1400ms)
 * 1400ms   axis ticks + tier labels fade in
 * 1600ms   "You · 1200" marker fades in (line + dot + label)
 * 1900ms   gap arrow draws between the two markers
 * 2200ms   "Magnus · 2839" marker fades in
 * 2600ms   caption fades in below
 * ───────────────────────────────────────────────────────── */

/**
 * Smooth bell-shaped density curve. Three cubic beziers stitched with
 * C¹ continuity (horizontal tangent at the peak so it reads as a round
 * dome, not a V). Peak around ELO ~1050 (x=140).
 * x mapping: x = 40 + (ELO - 600) / 4.62.
 *
 * Marker height at ELO 1200 (x=170) ≈ y=35.
 */
const CURVE_PATH =
  'M 40,70 C 60,55 100,30 140,30 C 180,30 215,60 240,80 C 265,100 310,124 360,130 L 560,130'
const CURVE_FILL_PATH = `${CURVE_PATH} L 40,130 Z`

const YOU_X = 170
const YOU_Y = 35

function EloChart() {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.35 })

  return (
    <figure
      ref={ref}
      className={`${styles.eloChart} ${inView ? styles.eloChartVisible : ''}`}
    >
      <svg
        viewBox='0 0 600 180'
        className={styles.eloChartSvg}
        role='img'
        aria-label='Chess ELO distribution. Player density peaks around 1200 — where about three years of practice puts you. Magnus Carlsen, the world #1, sits at 2839 ELO, far out in the right tail.'
        preserveAspectRatio='xMidYMid meet'
      >
        <defs>
          <linearGradient id='eloFill' x1='0' x2='0' y1='0' y2='1'>
            <stop offset='0%' stopColor='#b439df' stopOpacity='0.35' />
            <stop offset='100%' stopColor='#e5337e' stopOpacity='0.04' />
          </linearGradient>
          <linearGradient id='eloStroke' x1='0' x2='1' y1='0' y2='0'>
            <stop offset='0%' stopColor='#b439df' />
            <stop offset='100%' stopColor='#e5337e' />
          </linearGradient>
        </defs>

        <path
          d={CURVE_FILL_PATH}
          fill='url(#eloFill)'
          className={styles.eloChartCurveFill}
        />

        <path
          d={CURVE_PATH}
          fill='none'
          stroke='url(#eloStroke)'
          strokeWidth='1.75'
          strokeLinecap='round'
          pathLength={100}
          className={styles.eloChartCurveStroke}
        />

        <line
          x1='40'
          y1='130'
          x2='560'
          y2='130'
          className={styles.eloChartAxis}
        />

        <g className={styles.eloChartTicks}>
          <line x1='40' y1='130' x2='40' y2='135' />
          <line x1='170' y1='130' x2='170' y2='135' />
          <line x1='300' y1='130' x2='300' y2='135' />
          <line x1='430' y1='130' x2='430' y2='135' />
          <line x1='560' y1='130' x2='560' y2='135' />
        </g>

        <g className={styles.eloChartTierLabels}>
          <text x='40' y='150' textAnchor='start'>
            600
          </text>
          <text x='300' y='150' textAnchor='middle'>
            1800
          </text>
          <text x='560' y='150' textAnchor='end'>
            3000
          </text>
        </g>

        <g className={styles.eloChartGap}>
          <line x1='176' y1='38' x2='519' y2='128' strokeDasharray='2 4' />
          <text x='347' y='76' textAnchor='middle'>
            Tons more to learn
          </text>
        </g>

        <g className={`${styles.eloChartMarker} ${styles.eloChartMarkerYou}`}>
          <line x1={YOU_X} y1={YOU_Y} x2={YOU_X} y2='130' />
          <circle cx={YOU_X} cy={YOU_Y} r='5.5' />
          <text x={YOU_X} y={YOU_Y - 13} textAnchor='middle'>
            You · 1200
          </text>
        </g>

        <g
          className={`${styles.eloChartMarker} ${styles.eloChartMarkerMagnus}`}
        >
          <line x1='525' y1='100' x2='525' y2='130' />
          <circle cx='525' cy='130' r='5.5' />
          <text x='525' y='91' textAnchor='middle'>
            Magnus · 2839
          </text>
        </g>
      </svg>

      <figcaption className={styles.eloChartCaption}>
        Most chess players sit in the 600&ndash;1000 range. Three years of
        practice gets you to about 1200 &mdash; past most players, but nowhere
        near the frontier. Magnus is still finding new things every year.
      </figcaption>
    </figure>
  )
}
