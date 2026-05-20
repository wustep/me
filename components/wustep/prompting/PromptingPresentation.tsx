import Link from 'next/link'
import * as React from 'react'
import BodyClassName from 'react-body-classname'

import { ColleagueDemo } from './ColleagueDemo'
import { EquationDemo } from './EquationDemo'
import styles from './PromptingPresentation.module.css'
import { PromptInputDemo } from './PromptInputDemo'

type Visual =
  | { kind: 'section'; number: string; label: string }
  | { kind: 'promptDemo' }
  | { kind: 'agenda' }
  | { kind: 'pawn' }
  | { kind: 'elo' }
  | { kind: 'fork' }
  | { kind: 'eloPractice' }
  | { kind: 'quoteAvatar' }
  | { kind: 'pygmalion' }
  | { kind: 'equationDemo' }
  | { kind: 'none' }
  | { kind: 'toolLever' }
  | { kind: 'modelLever' }
  | { kind: 'promptLever' }
  | { kind: 'contextLever' }
  | { kind: 'moves' }
  | { kind: 'rules' }
  | { kind: 'audienceQ' }
  | { kind: 'treeDemo' }
  | { kind: 'choice' }
  | { kind: 'colleagueDemo' }
  | { kind: 'colleague' }
  | { kind: 'brief' }
  | { kind: 'timeline' }
  | { kind: 'stagger' }
  | { kind: 'fanout' }
  | { kind: 'roles' }
  | { kind: 'contract' }
  | { kind: 'close' }
  | { kind: 'qa' }

type Slide = {
  eyebrow: string
  title: string
  body?: string
  note: string
  visual: Visual
  tone?: 'dark' | 'paper'
  layout?: 'standard' | 'visual' | 'icon' | 'quote'
}

export const SLIDES: Slide[] = [
  {
    eyebrow: 'Opening',
    title: 'It’s 2026 and coding looks a little bit more like this.',
    note: 'Use the actual intro from the article. More and more, engineering is talking to machines. Let the prompt demo fail; that sets up the rest of the talk.',
    visual: { kind: 'promptDemo' },
    tone: 'dark'
  },
  {
    eyebrow: 'The question',
    title:
      'What does it mean to be good at talking to Claude, Codex, or whoever’s next?',
    note: 'This is the question at the end of the intro chapter. The structure should feel like the article: mindset, equation, techniques, tree, colleague, orchestration, recap.',
    visual: { kind: 'none' },
    tone: 'dark',
    layout: 'quote'
  },
  {
    eyebrow: 'The question',
    title: '',
    note: 'Let the structure become the table of contents for the talk.',
    visual: { kind: 'agenda' },
    layout: 'quote'
  },
  {
    eyebrow: 'Section',
    title: 'The beginner’s mindset.',
    note: 'Section break. This starts the mindset chapter: we are early, and the people still learning are going to pull away.',
    visual: { kind: 'section', number: '01', label: 'Mindset' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Chess',
    title: '',
    note: 'Silent beat. Let the pawn do the transition into the chess analogy.',
    visual: { kind: 'pawn' },
    tone: 'dark',
    layout: 'icon'
  },
  {
    eyebrow: 'Beginner mindset',
    title: 'Three years in is about 1200 ELO.',
    body: 'Past casual. Nowhere near expert.',
    note: 'Use the chess analogy from the article. The important bit is: do not trust the feeling of competence too early.',
    visual: { kind: 'elo' }
  },
  {
    eyebrow: 'Two responses',
    title: 'Sooner or later the model will let you down.',
    note: 'This slide should be mostly visual. Closed: blame the AI. Open: ask what you could have done differently. That is the article’s core posture.',
    visual: { kind: 'fork' },
    tone: 'dark'
  },
  {
    eyebrow: 'Practice curve',
    title: 'Every useful failure can become a little ELO.',
    note: 'Say this like the chess puzzle analogy. If you try something new, notice what worked, and update your repertoire, you gain a point or two. If you close the question with “the model is bad,” you stop practicing and can regress.',
    visual: { kind: 'eloPractice' }
  },
  {
    eyebrow: 'Pragmatic optimism',
    title:
      '“I suggest just being 2 or 10 times more ambitious than before, because it might just work.”',
    note: 'Pragmatic optimism strategy. The point is not blind hype. It is a useful prior: try the slightly more ambitious thing before assuming the boundary is fixed.',
    visual: { kind: 'quoteAvatar' },
    tone: 'dark',
    layout: 'quote'
  },
  {
    eyebrow: 'Expectations',
    title: '',
    note: 'Pygmalion effect versus Golem effect. If you expect the agent to be capable, you give it better work, better context, and more chances to surprise you. If you expect it to fail, you under-explain it, under-scope it, and collect evidence for the belief.',
    visual: { kind: 'pygmalion' },
    layout: 'icon'
  },
  {
    eyebrow: 'Section',
    title: 'Pull the levers.',
    note: 'Section break. Shift from posture to diagnosis: what part of the setup produced this output?',
    visual: { kind: 'section', number: '02', label: 'The equation' },
    tone: 'paper',
    layout: 'visual'
  },
  {
    eyebrow: 'Equation',
    title: 'Better outputs start with better inputs.',
    note: 'Use the article equation. First AGENT × INPUT, then expand it. This is the frame everything else hangs on.',
    visual: { kind: 'equationDemo' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Tool',
    title: 'Use the best tool.',
    note: 'This is usually not the biggest lever because most of us are already using agent-native tools. But tool quality still matters: even updating Cursor to the latest version can fix a surprising number of system prompt bugs.',
    visual: { kind: 'toolLever' },
    tone: 'dark'
  },
  {
    eyebrow: 'Model',
    title: 'Pick the smartest model the work warrants.',
    note: 'Use the article’s calibration frame: Composer/Sonnet for fast edits, Opus for taste, GPT5.5 for hard technical problems, and higher effort when the task has real ambiguity.',
    visual: { kind: 'modelLever' }
  },
  {
    eyebrow: 'Human prompt',
    title: 'Be specific. Show the model what good looks like.',
    note: 'Use the article’s concrete-over-abstract examples. “Make this faster” gives the model nothing. “First paint is 2.4s, target under 1s, profile and start with the biggest wins” gives it a job.',
    visual: { kind: 'promptLever' },
    tone: 'dark'
  },
  {
    eyebrow: 'Context',
    title: 'The prompt is the verb. Context is the noun.',
    note: 'Use the exact phrasing from the article. Context is boring and high leverage. Load files, docs, screenshots, traces, project rules, MCPs. If you rewrite the same prompt five times, the lever you need is probably context.',
    visual: { kind: 'contextLever' }
  },
  {
    eyebrow: 'Section',
    title: 'Collect moves.',
    note: 'Section break. This is the techniques portion of the article: prompting as a repertoire of small moves.',
    visual: { kind: 'section', number: '03', label: 'Techniques' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Techniques',
    title: 'Build a repertoire.',
    note: 'This comes straight from the techniques chapter: openings, tactics, endgame moves. Keep the slide light: mostly the eight prompts.',
    visual: { kind: 'moves' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Pay it forward',
    title: 'When a move works, stop carrying it in your head.',
    note: 'This is the “lift them into skills” section. Show rules as the compounding artifact: the agent reads the lesson next time.',
    visual: { kind: 'rules' }
  },
  {
    eyebrow: 'Q',
    title: 'Q: what are some of your favorite prompting techniques?',
    note: 'Let people name their own openings, tactics, and repair moves before introducing the tree.',
    visual: { kind: 'audienceQ' },
    tone: 'dark'
  },
  {
    eyebrow: 'Section',
    title: 'Use the tree.',
    note: 'Section break. The next step after collecting moves is knowing where each move belongs.',
    visual: { kind: 'section', number: '04', label: 'The tree' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'The tree',
    title: 'Every change lives somewhere on a 2D map.',
    note: 'Use the interactive article tree. The axes are breadth and depth; the move is ask, plan, or delegate. Click Take a tour if presenting live.',
    visual: { kind: 'treeDemo' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Choosing your move',
    title: 'Ask. Plan. Delegate.',
    note: 'Tie the tree to the three moves. The article’s warning is the line to say out loud: the most expensive prompts are the ones in the wrong cell.',
    visual: { kind: 'choice' },
    tone: 'dark'
  },
  {
    eyebrow: 'Section',
    title: 'Treat it like a colleague.',
    note: 'Section break. The agent is fast and capable, but only sees what you show it.',
    visual: { kind: 'section', number: '05', label: 'The colleague' },
    tone: 'paper',
    layout: 'visual'
  },
  {
    eyebrow: 'Colleague model',
    title: 'Same task, same model. Different setup.',
    note: 'Use the article’s colleague demo. Click file, screenshot, rules, history. The point is the asymmetry between what you see and what the agent sees.',
    visual: { kind: 'colleagueDemo' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'The colleague',
    title: 'Onboard. Explain. Review.',
    note: 'This is the article’s colleague chapter compressed. The same things that help a teammate help an agent.',
    visual: { kind: 'colleague' },
    layout: 'visual'
  },
  {
    eyebrow: 'Q',
    title:
      'Q: what are your mental models for how you think about talking to the AI?',
    note: 'Ask this after the colleague frame lands. Listen for metaphors people already use: intern, pair programmer, search engine, compiler, reviewer, weird teammate.',
    visual: { kind: 'audienceQ' },
    tone: 'dark'
  },
  {
    eyebrow: 'Section',
    title: 'Tune the hour.',
    note: 'Section break. This starts orchestration: from one prompt at a time to managing several runs.',
    visual: { kind: 'section', number: '06', label: 'Orchestration' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Orchestration',
    title: 'If you know the next step, put it in the task.',
    note: 'Use the article’s pinging versus full-task example. The model loses nothing by knowing the destination; you lose four context switches.',
    visual: { kind: 'brief' },
    tone: 'dark'
  },
  {
    eyebrow: 'Chain, don’t ping',
    title: 'Same work. Different wall-clock cost.',
    note: 'This is the first orchestration visual. The grey blocks are you deciding what to type next. That is the hidden cost.',
    visual: { kind: 'timeline' },
    tone: 'dark',
    layout: 'visual'
  },
  {
    eyebrow: 'Stagger and overlap',
    title: 'You can only write one task at a time.',
    note: 'Use the article’s cascade idea. Purple is you. Pink is the agent. Your bars do not overlap; theirs do.',
    visual: { kind: 'stagger' },
    tone: 'dark'
  },
  {
    eyebrow: 'Fan out',
    title: 'Independent work can run side by side.',
    note: 'Good candidates: tests beside implementation, unrelated bugs, library spikes. Bad candidates: chains where B needs A’s output.',
    visual: { kind: 'fanout' }
  },
  {
    eyebrow: 'Specialize',
    title: 'Researcher → implementer → reviewer.',
    note: 'Use the article’s role split. Each role wants a different mindset and a different context window.',
    visual: { kind: 'roles' },
    tone: 'dark'
  },
  {
    eyebrow: 'Long jobs',
    title: 'Long runs need a contract, not babysitting.',
    note: 'Talk about the instinct to hover. If the task can survive without you, the agent can return a branch instead of a half-finished conversation. The contract is goal, clarity, success criterion, judgment boundary, and fallback.',
    visual: { kind: 'contract' }
  },
  {
    eyebrow: 'Q',
    title: 'Q: what are your tips for managing many agents at once?',
    note: 'This should pull out practical habits: naming threads, staggered task descriptions, review queues, keeping scope boundaries sharp.',
    visual: { kind: 'audienceQ' },
    tone: 'dark'
  },
  {
    eyebrow: 'Section',
    title: 'Keep climbing.',
    note: 'Section break. This is the recap: we are early, the skill is real, and there is a lot left to learn.',
    visual: { kind: 'section', number: '07', label: 'Recap' },
    tone: 'paper',
    layout: 'visual'
  },
  {
    eyebrow: 'Close',
    title: 'We’re all early. The next 1200 is wide open.',
    note: 'End with the recap chapter. The most useful move is paying attention while everyone else assumes they have figured it out.',
    visual: { kind: 'close' }
  },
  {
    eyebrow: 'Q&A',
    title: 'Q&A',
    note: 'Open floor.',
    visual: { kind: 'qa' },
    tone: 'dark',
    layout: 'quote'
  }
]

function slideIndexFromHash() {
  const raw = window.location.hash.replace('#', '')
  const number = Number.parseInt(raw, 10)

  if (Number.isFinite(number) && number >= 1 && number <= SLIDES.length) {
    return number - 1
  }

  return 0
}

export function PromptingPresentation() {
  const [index, setIndex] = React.useState(0)
  const current = SLIDES[index] ?? SLIDES[0]!

  const go = React.useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(SLIDES.length - 1, next)))
  }, [])

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(event.target.tagName)
      ) {
        return
      }

      if (
        event.key === 'ArrowRight' ||
        event.key === 'PageDown' ||
        event.key === ' '
      ) {
        event.preventDefault()
        go(index + 1)
      }
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        go(index - 1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [go, index])

  React.useEffect(() => {
    const syncFromHash = () => setIndex(slideIndexFromHash())

    syncFromHash()
    window.addEventListener('hashchange', syncFromHash)
    return () => {
      window.removeEventListener('hashchange', syncFromHash)
    }
  }, [])

  React.useEffect(() => {
    window.history.replaceState(null, '', `#${index + 1}`)
  }, [index])

  return (
    <>
      <BodyClassName className='notion dark-mode' />
      <main className={styles.presenter}>
        <header className={styles.chrome}>
          <Link href='/prompting' className={styles.backLink}>
            How to talk to coding agents
          </Link>
          <div className={styles.controls}>
            <Link
              href={`/prompting/notes#${index + 1}`}
              className={styles.controlButton}
            >
              Notes
            </Link>
            <button
              type='button'
              className={styles.iconButton}
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label='Previous slide'
            >
              ←
            </button>
            <span className={styles.counter}>
              {String(index + 1).padStart(2, '0')} / {SLIDES.length}
            </span>
            <button
              type='button'
              className={styles.iconButton}
              onClick={() => go(index + 1)}
              disabled={index === SLIDES.length - 1}
              aria-label='Next slide'
            >
              →
            </button>
          </div>
        </header>

        <section
          key={index}
          className={`${styles.slide} ${
            current.tone === 'dark' ? styles.slideDark : styles.slidePaper
          } ${current.layout === 'visual' ? styles.slideVisualFirst : ''} ${
            current.layout === 'icon' ? styles.slideIconOnly : ''
          } ${current.layout === 'quote' ? styles.slideQuoteOnly : ''}`}
          aria-live='polite'
        >
          {(current.title || current.body) && (
            <div className={styles.copy}>
              {current.title && <h1>{current.title}</h1>}
              {current.body && <p>{current.body}</p>}
            </div>
          )}
          <VisualBlock slide={current} />
          <div className={styles.slideFooter}>
            <span>{String(index + 1).padStart(2, '0')}</span>
          </div>
        </section>

        <div className={styles.progress} aria-hidden='true'>
          <span
            style={{ transform: `scaleX(${(index + 1) / SLIDES.length})` }}
          />
        </div>
      </main>
    </>
  )
}

function VisualBlock({ slide }: { slide: Slide }) {
  switch (slide.visual.kind) {
    case 'section':
      return (
        <SectionVisual
          number={slide.visual.number}
          label={slide.visual.label}
        />
      )
    case 'promptDemo':
      return <PromptDemoVisual />
    case 'agenda':
      return <AgendaVisual />
    case 'pawn':
      return <PawnVisual />
    case 'elo':
      return <EloVisual />
    case 'fork':
      return <ForkVisual />
    case 'eloPractice':
      return <EloPracticeVisual />
    case 'quoteAvatar':
      return <QuoteAvatarVisual />
    case 'pygmalion':
      return <PygmalionVisual />
    case 'equationDemo':
      return <ArticleEquationVisual />
    case 'none':
      return null
    case 'toolLever':
      return <ToolLeverVisual />
    case 'modelLever':
      return <ModelLeverVisual />
    case 'promptLever':
      return <PromptLeverVisual />
    case 'contextLever':
      return <ContextLeverVisual />
    case 'moves':
      return <MovesVisual />
    case 'rules':
      return <RulesVisual />
    case 'audienceQ':
      return <AudienceQuestionVisual />
    case 'treeDemo':
      return <ArticleTreeVisual />
    case 'choice':
      return <ChoiceVisual />
    case 'colleagueDemo':
      return <ArticleColleagueVisual />
    case 'colleague':
      return <ColleagueVisual />
    case 'brief':
      return <BriefVisual />
    case 'timeline':
      return <TimelineVisual />
    case 'stagger':
      return <StaggerVisual />
    case 'fanout':
      return <FanoutVisual />
    case 'roles':
      return <RolesVisual />
    case 'contract':
      return <ContractVisual />
    case 'close':
      return <CloseVisual />
    case 'qa':
      return null
  }
}

function SectionVisual({ number, label }: { number: string; label: string }) {
  return (
    <div className={styles.sectionCard}>
      <span className={styles.sectionNumber}>{number}</span>
      <span className={styles.sectionLabel}>{label}</span>
    </div>
  )
}

function PromptDemoVisual() {
  return (
    <div className={styles.articlePromptDemo}>
      <PromptInputDemo start />
    </div>
  )
}

function AgendaVisual() {
  return (
    <ol className={styles.agenda}>
      {[
        ['01', 'beginner’s mindset'],
        ['02', 'the equation'],
        ['03', 'techniques'],
        ['04', 'the tree'],
        ['05', 'the colleague'],
        ['06', 'orchestration'],
        ['07', 'recap']
      ].map(([n, text]) => (
        <li key={n}>
          <span>{n}</span>
          <strong>{text}</strong>
        </li>
      ))}
    </ol>
  )
}

function PawnVisual() {
  return (
    <div className={styles.pawnOnly} aria-label='Chess pawn'>
      <svg viewBox='0 0 220 260' role='img' aria-hidden='true'>
        <path d='M110 20c25 0 45 20 45 45 0 17-9 32-23 40 25 8 43 31 43 59v14h-28l16 48h29v14H28v-14h29l16-48H45v-14c0-28 18-51 43-59-14-8-23-23-23-40 0-25 20-45 45-45Z' />
      </svg>
    </div>
  )
}

function EloVisual() {
  return (
    <div className={styles.elo}>
      <div className={styles.eloCurveWrap}>
        <svg
          className={styles.eloCurve}
          viewBox='0 0 760 260'
          aria-label='Chess skill curve from beginner through 2800 plus.'
          role='img'
        >
          <path
            d='M36 216 C78 148 132 78 214 66 C288 55 346 126 414 174 C508 236 636 231 728 224'
            fill='none'
            pathLength={100}
          />
          <line x1='40' x2='720' y1='220' y2='220' />
          <circle cx='118' cy='150' r='6' />
          <circle cx='236' cy='72' r='7' />
          <circle cx='704' cy='220' r='6' />
        </svg>
        <div className={`${styles.eloPhoto} ${styles.eloPhotoBeth}`}>
          <img src='/images/prompting/beth-harmon-800.png' alt='' />
          <span>young Beth · 800</span>
        </div>
        <div className={`${styles.eloPhoto} ${styles.eloPhotoMagnus}`}>
          <img src='/images/prompting/magnus-carlsen-2800.png' alt='' />
          <span>Magnus · 2800+</span>
        </div>
        <div className={styles.eloYou}>
          <b>you</b>
          <span>1200</span>
        </div>
        <div className={styles.eloTicks}>
          {['600', '800', '1200', '2000', '2800+'].map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <p>the meta has barely been uncovered</p>
      </div>
    </div>
  )
}

function ForkVisual() {
  return (
    <div className={styles.fork}>
      <div className={styles.forkRoad} aria-hidden='true'>
        <span className={styles.forkRoadBase} />
        <span className={styles.forkRoadLeft} />
        <span className={styles.forkRoadRight} />
        <span className={styles.forkRoadDot} />
      </div>
      <section className={styles.forkClosed}>
        <span>closed-minded</span>
        <strong>“the model is bad”</strong>
        <p>comforting, easy, final</p>
      </section>
      <section className={styles.forkOpen}>
        <span>open-minded</span>
        <strong>“what did I miss?”</strong>
        <p>the failure becomes a rep</p>
      </section>
    </div>
  )
}

function EloPracticeVisual() {
  return (
    <div className={styles.eloPractice}>
      <section>
        <span>open loop</span>
        <div className={styles.eloLadder}>
          {[1200, 1204, 1211, 1218, 1227].map((elo) => (
            <b key={elo}>{elo}</b>
          ))}
        </div>
        <strong>try → notice → update</strong>
        <p>like doing one chess puzzle every day</p>
      </section>
      <section>
        <span>closed loop</span>
        <div className={styles.eloSlideBack}>
          {[1200, 1198, 1192, 1186].map((elo) => (
            <b key={elo}>{elo}</b>
          ))}
        </div>
        <strong>blame → stop → regress</strong>
        <p>some problems were fixable in theory</p>
      </section>
    </div>
  )
}

function QuoteAvatarVisual() {
  return (
    <div className={styles.quoteAvatar}>
      <img src='/images/prompting/ambitious-avatar.jpeg' alt='' />
    </div>
  )
}

function PygmalionVisual() {
  return (
    <div className={styles.pygmalion}>
      <div className={styles.pygmalionCaption}>self-fulfilling prophecy</div>
      <section className={styles.pygmalionGood}>
        <AiFace mood='happy' />
        <span>Pygmalion</span>
        <strong>expect capability</strong>
        <p>better setup → stronger response → happier thoughts</p>
        <ol>
          <li>you ask for harder work</li>
          <li>the agent gets clearer context</li>
          <li>success makes the next ask more ambitious</li>
        </ol>
      </section>
      <section className={styles.pygmalionBad}>
        <AiFace mood='sad' />
        <span>Golem</span>
        <strong>expect failure</strong>
        <p>thin setup → weaker response → sad feedback</p>
        <ol>
          <li>you ask for smaller work</li>
          <li>the agent sees less of the problem</li>
          <li>failure confirms the low expectation</li>
        </ol>
      </section>
    </div>
  )
}

function AiFace({ mood }: { mood: 'happy' | 'sad' }) {
  const happy = mood === 'happy'

  return (
    <div
      className={`${styles.aiFace} ${happy ? styles.aiHappy : styles.aiSad}`}
    >
      <svg viewBox='0 0 120 96' aria-hidden='true'>
        <rect x='18' y='24' width='84' height='58' rx='18' />
        <path d='M60 24V10' />
        <circle cx='60' cy='9' r='5' />
        <circle cx='45' cy='50' r='5' />
        <circle cx='75' cy='50' r='5' />
        <path d={happy ? 'M43 62c9 12 25 12 34 0' : 'M43 70c9-10 25-10 34 0'} />
        <path d='M18 52H7M102 52h11' />
      </svg>
    </div>
  )
}

function ArticleEquationVisual() {
  return (
    <div className={styles.articleEquationDemo}>
      <EquationDemo showFooter={false} interactive={false} />
    </div>
  )
}

function ToolLeverVisual() {
  return (
    <EquationLeverVisual
      active='tool'
      kicker='same model, different ceiling'
      details={[
        'smarter context slicing',
        'persistent long tasks',
        'project-aware system prompts'
      ]}
      chips={['Cursor', 'Claude Code', 'Codex']}
    />
  )
}

function ModelLeverVisual() {
  return (
    <EquationLeverVisual
      active='model'
      kicker='calibrate to the work'
      details={[
        'fast edits → Composer/Sonnet',
        'taste → Opus',
        'hard technical problems → GPT5.5',
        'ambiguous work → higher effort'
      ]}
    />
  )
}

function PromptLeverVisual() {
  return (
    <EquationLeverVisual
      active='prompt'
      kicker='concrete beats vibes'
      details={[
        'weak: “Make this faster.”',
        'strong: “First paint is 2.4s. Target under 1s.”',
        'examples beat taste words'
      ]}
    />
  )
}

function ContextLeverVisual() {
  return (
    <EquationLeverVisual
      active='context'
      kicker='context is the noun'
      details={[
        'CLAUDE.md / AGENTS.md',
        'the related PR',
        'the failing trace',
        'screenshots and real systems'
      ]}
    />
  )
}

type EquationLever = 'tool' | 'model' | 'prompt' | 'context'

function EquationLeverVisual({
  active,
  kicker,
  details,
  chips
}: {
  active: EquationLever
  kicker: string
  details: string[]
  chips?: string[]
}) {
  const tokens: Array<{ id: EquationLever; label: string; side: string }> = [
    { id: 'tool', label: 'TOOL', side: 'AGENT' },
    { id: 'model', label: 'MODEL', side: 'AGENT' },
    { id: 'prompt', label: 'HUMAN_PROMPT', side: 'INPUT' },
    { id: 'context', label: 'CONTEXT', side: 'INPUT' }
  ]
  const current = tokens.find((token) => token.id === active) ?? tokens[0]!

  return (
    <div className={styles.equationLever}>
      <div className={styles.equationLeverFormula}>
        <span>AGENT</span>
        <b>×</b>
        <span>INPUT</span>
        <b>→</b>
        <span>OUTPUT</span>
      </div>
      <div className={styles.equationLeverBadge}>
        <small>{current.side}</small>
        <strong>{current.label}</strong>
      </div>
      <div className={styles.equationLeverCallout}>
        <span>{current.label}</span>
        <strong>{kicker}</strong>
        <ul>
          {details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
        {chips && (
          <div>
            {chips.map((chip) => (
              <b key={chip}>{chip}</b>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MovesVisual() {
  return (
    <div className={styles.moves}>
      {[
        'What questions should you ask me before starting?',
        'What’s the smallest version of this that ships?',
        'Give me 3 options, rank them, name the trade-offs.',
        'Argue against your last suggestion.',
        'What did you skip?',
        'How would a senior engineer review this?',
        'Match the style of components/PostCard.tsx.',
        'Update AGENTS.md with what you just learned.'
      ].map((move, i) => (
        <span key={move}>
          <b>{String(i + 1).padStart(2, '0')}</b>
          {move}
        </span>
      ))}
    </div>
  )
}

function RulesVisual() {
  return (
    <div className={styles.rulesFile}>
      <div className={styles.fileTab}>AGENTS.md</div>
      <pre>{`- Before non-trivial work, ask what is unclear.
- When asked to plan, give 3 options and trade-offs.
- After delegating, list what was skipped.
- Match components/PostCard.tsx for new card UIs.`}</pre>
    </div>
  )
}

function AudienceQuestionVisual() {
  return (
    <div className={styles.audienceQuestion}>
      <strong>Q</strong>
      <span aria-hidden='true' />
    </div>
  )
}

function ArticleTreeVisual() {
  const areas = ['UX', 'Performance', 'Debugging', 'Architecture']
  const depths = ['High', 'Mid', 'Low']
  const actions = [
    ['ask', 'Ask'],
    ['plan', 'Plan'],
    ['delegate', 'Delegate']
  ] as const
  type TreeAction = (typeof actions)[number][0]
  const [selected, setSelected] = React.useState({
    area: 'UX',
    depth: 'Mid',
    action: 'ask' as TreeAction
  })
  const articlePrompts: Record<
    string,
    Record<string, Record<TreeAction, string>>
  > = {
    UX: {
      High: {
        ask: 'What feels off about this whole page?',
        plan: 'How would you make this flow feel more polished — what should I do first?',
        delegate: 'Make this page prettier.'
      },
      Mid: {
        ask: 'Why does the card hierarchy feel cluttered?',
        plan: 'Plan a redesign of the card component for better scannability.',
        delegate: 'Tighten the card spacing and visual weight.'
      },
      Low: {
        ask: 'Why does the radius on these buttons look off?',
        plan: 'Walk me through a sensible radius and shadow for these buttons.',
        delegate: 'Set the buttons to border-radius 16px.'
      }
    },
    Performance: {
      High: {
        ask: 'Where is time being spent on first paint?',
        plan: 'Plan an attack on first-paint, biggest wins first.',
        delegate: 'Cut first-paint time. Start with the heaviest hitters.'
      },
      Mid: {
        ask: 'Why is this list re-rendering on every keystroke?',
        plan: 'Plan how to memoize this list without breaking selection.',
        delegate: 'Memoize this list. Verify selection still works.'
      },
      Low: {
        ask: 'Why is this useEffect firing twice?',
        plan: 'How should I fix this useEffect double-fire safely?',
        delegate: 'Fix the dependency array on this useEffect.'
      }
    },
    Debugging: {
      High: {
        ask: 'What is most likely breaking in this checkout flow?',
        plan: 'Plan a triage approach for the failing checkout flow.',
        delegate: 'Get checkout green again.'
      },
      Mid: {
        ask: 'Why is this auth middleware sometimes returning 401?',
        plan: 'Plan how to reproduce this auth flake locally.',
        delegate: 'Find and fix the intermittent 401 in auth.'
      },
      Low: {
        ask: 'Why is this regex not matching trailing newlines?',
        plan: 'How should I update this regex to match trailing newlines safely?',
        delegate: 'Fix this regex to match trailing newlines.'
      }
    },
    Architecture: {
      High: {
        ask: "Where is this codebase heading that it isn't yet?",
        plan: 'Plan how to split this into clear modules.',
        delegate: 'Restructure this into clear modules. Propose, then do.'
      },
      Mid: {
        ask: 'Should this state live in context or be lifted?',
        plan: 'Plan the migration of this slice from local state to a store.',
        delegate: 'Move this state into the store and update consumers.'
      },
      Low: {
        ask: "Why does this file import three things from utils.ts that aren't used?",
        plan: 'Plan the cleanup of unused imports across this file.',
        delegate: 'Remove unused imports in this file.'
      }
    }
  }
  const prompt =
    articlePrompts[selected.area]?.[selected.depth]?.[selected.action] ?? ''

  return (
    <div className={styles.treeStage}>
      <div className={styles.mapDemo}>
        <div className={styles.mapHeader}>
          <span>breadth</span>
          <b>what part of the system?</b>
        </div>
        <div className={styles.mapGrid}>
          {areas.map((area) => (
            <span key={`col-${area}`} className={styles.mapCol}>
              {area}
            </span>
          ))}
          {depths.map((depth) =>
            areas.map((area) => {
              const active = area === selected.area && depth === selected.depth
              return (
                <button
                  type='button'
                  key={`${area}-${depth}`}
                  className={`${styles.mapCell} ${
                    active ? styles.mapCellActive : ''
                  }`}
                  onClick={() =>
                    setSelected((current) => ({ ...current, area, depth }))
                  }
                >
                  <span>{depth}</span>
                  {active && (
                    <b>{actions.find(([id]) => id === selected.action)?.[1]}</b>
                  )}
                </button>
              )
            })
          )}
        </div>
        <div className={styles.mapActions}>
          {actions.map(([id, label]) => (
            <button
              key={id}
              type='button'
              className={id === selected.action ? styles.mapActionActive : ''}
              onClick={() =>
                setSelected((current) => ({ ...current, action: id }))
              }
            >
              {label}
            </button>
          ))}
        </div>
        <div className={styles.mapAxis}>
          <span>high: overall feel</span>
          <span>mid: component or flow</span>
          <span>low: one specific line</span>
        </div>
      </div>
      <div className={styles.treePromptBadge}>
        <span>Generated prompt</span>
        <strong>{prompt}</strong>
      </div>
    </div>
  )
}

function ChoiceVisual() {
  return (
    <div className={styles.choice}>
      {[
        ['ASK', 'when you need to understand'],
        ['PLAN', 'when the approach is still soft'],
        ['DELEGATE', 'when the path is clear and gradeable']
      ].map(([title, body]) => (
        <section key={title}>
          <strong>{title}</strong>
          <span>{body}</span>
        </section>
      ))}
    </div>
  )
}

function ArticleColleagueVisual() {
  return (
    <div className={styles.articleColleagueDemo}>
      <ColleagueDemo />
    </div>
  )
}

function ColleagueVisual() {
  return (
    <div className={styles.colleague}>
      <strong>
        You
        <small>what you already know</small>
      </strong>
      <div>
        <span>
          <b>onboard</b>
          <small>rules, files, history</small>
        </span>
        <span>
          <b>explain</b>
          <small>goal, constraints, taste</small>
        </span>
        <span>
          <b>review</b>
          <small>grade against intent</small>
        </span>
      </div>
      <strong>
        Agent
        <small>what it can act on</small>
      </strong>
    </div>
  )
}

function BriefVisual() {
  return (
    <div className={styles.briefPair}>
      <section>
        <span>Pinging</span>
        <pre>{`> Read the auth module.

> Now find the session bug.

> Now write a test.

> Now open a PR.`}</pre>
      </section>
      <section>
        <span>Full task</span>
        <pre>{`> Read the auth module, find
  the session bug on refresh,
  write a regression test,
  and open a PR.

  If you hit a fork, pick
  the smaller change.`}</pre>
      </section>
    </div>
  )
}

function TimelineVisual() {
  return (
    <div className={styles.timeline}>
      <div>
        <b>ping</b>
        {Array.from({ length: 6 }).map((_, i) => (
          <React.Fragment key={i}>
            <span className={styles.you} />
            <span className={styles.agent} />
            <span className={styles.idle} />
          </React.Fragment>
        ))}
      </div>
      <div>
        <b>task</b>
        <span className={styles.youWide} />
        <span className={styles.agentWide} />
        <span className={styles.done} />
      </div>
    </div>
  )
}

function StaggerVisual() {
  const tracks = [
    ['you', 'agent', 'idle', 'you', 'agent'],
    ['gap', 'you', 'agent', 'idle', 'you', 'agent'],
    ['gap', 'gap', 'you', 'agent', 'idle', 'you', 'agent']
  ]

  return (
    <div className={styles.stagger}>
      {tracks.map((track, i) => (
        <div key={i}>
          <b>thread {i + 1}</b>
          {track.map((kind, j) => (
            <span
              key={`${kind}-${j}`}
              className={
                kind === 'you'
                  ? styles.staggerYou
                  : kind === 'agent'
                    ? styles.staggerAgent
                    : kind === 'idle'
                      ? styles.staggerIdle
                      : styles.staggerGap
              }
            />
          ))}
        </div>
      ))}
    </div>
  )
}

function FanoutVisual() {
  return (
    <div className={styles.fanout}>
      <strong>You</strong>
      <span>tests</span>
      <span>bug A</span>
      <span>library spike</span>
      <em>review queue</em>
    </div>
  )
}

function RolesVisual() {
  return (
    <div className={styles.roles}>
      {['researcher', 'implementer', 'reviewer'].map((role) => (
        <span key={role}>{role}</span>
      ))}
    </div>
  )
}

function ContractVisual() {
  const parts = [
    ['goal', 'what outcome should exist at the end'],
    ['clarity', 'enough context to operate without asking you for more'],
    ['success criterion', 'how the agent knows the work is done'],
    ['judgment boundary', 'where it should choose versus stop and ask'],
    ['fallback', 'what to do if the first path fails']
  ]

  return (
    <div className={styles.contract}>
      {parts.map(([title, detail]) => (
        <section key={title}>
          <b>{title}</b>
          <span>{detail}</span>
        </section>
      ))}
    </div>
  )
}

function CloseVisual() {
  return (
    <div className={styles.closeList}>
      {[
        'beginner’s mindset',
        'the equation',
        'technique repertoire',
        'the tree',
        'the colleague',
        'orchestration'
      ].map((line, i) => (
        <span key={line}>
          <b>{String(i + 1).padStart(2, '0')}</b>
          {line}
        </span>
      ))}
    </div>
  )
}
