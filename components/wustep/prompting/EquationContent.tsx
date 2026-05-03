import { ChapterBody } from './ChapterBody'
import { DebugChecklist, EquationDemo } from './EquationDemo'
import { Lever } from './parts'

import styles from './PromptingPage.module.css'

export function EquationContent() {
  return (
    <ChapterBody>
      <p>
        The simplest frame is an equation. Whatever a coding agent gives you
        falls out of two things multiplied together: the agent itself, and
        what you hand it.
      </p>

      <EquationDemo />

      <p>
        That gives you four levers. The point of view this frame nudges you
        toward is that{' '}
        <em>there exist inputs that produce really good outputs</em> &mdash;
        the job is finding them. So how do you actually pull each lever?
      </p>

      <Lever name='TOOL' tagline='Use a tool that was built for this.'>
        <p>
          Most people are still defaulting to whatever editor they had before
          agents were a thing, and bolting AI on. That&apos;s leaving the
          biggest, easiest win on the table.
        </p>
        <p>
          The frontier here isn&apos;t subtle: <strong>Cursor</strong>,{' '}
          <strong>Claude Code</strong>, and <strong>Codex</strong> are
          meaningfully better at this than VSCode (with stock Copilot) or
          Antigravity. They&apos;re not magic &mdash; they&apos;re just
          designed for the shape of agent work. They slice files into context
          smarter, manage long-running tasks, persist conversation state, and
          inject project-aware system prompts. Same model, different tool,
          different ceiling.
        </p>
        <p>
          You don&apos;t have to commit to one forever. Try an agent-native
          tool for a week. If your day-to-day doesn&apos;t get noticeably
          easier, go back. It probably will.
        </p>
      </Lever>

      <Lever name='MODEL' tagline='Pick the smartest model the work warrants.'>
        <p>
          Calibrate to the stakes of the task, not your defaults. A rough
          guide:
        </p>

        <div className={styles.modelGuide}>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuideWhen}>
              Boilerplate, well-trodden patterns
            </span>
            <span className={styles.modelGuidePick}>Sonnet · Haiku</span>
          </div>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuideWhen}>
              Real engineering: design decisions, debugging, architecture
            </span>
            <span className={styles.modelGuidePick}>Opus · GPT-7</span>
          </div>
          <div className={styles.modelGuideRow}>
            <span className={styles.modelGuideWhen}>
              Anything tricky, ambiguous, or multi-step
            </span>
            <span className={styles.modelGuidePick}>+ Thinking on</span>
          </div>
        </div>

        <p>
          The biggest trap is <strong>&quot;Auto&quot;</strong> mode. Tools
          love offering it because it sounds helpful. In practice,
          &quot;Auto&quot; is usually optimized for the platform&apos;s
          margin, not your output &mdash; it quietly picks a cheaper model
          when it thinks it can get away with it. Override it whenever the
          work matters.
        </p>
        <p>
          Thinking effort is the cheap dial. When you&apos;re stuck, crank
          it. When you&apos;re iterating fast on something obvious, drop it.
          There&apos;s no purity to it; tune to the task in front of you.
        </p>
      </Lever>

      <Lever
        name='HUMAN_PROMPT'
        tagline='Be specific. Show the model what good looks like.'
      >
        <p>
          The prompt is the smallest of the four levers, but it&apos;s the
          one people obsess over. The patterns that consistently move the
          needle are unsexy:
        </p>
        <ul className={styles.axisList}>
          <li>
            <strong>Concrete over abstract.</strong> &quot;Make this
            faster&quot; gives the model nothing. &quot;First paint is 2.4s,
            target under 1s, profile and start with the biggest wins&quot;
            gives it a job.
          </li>
          <li>
            <strong>Anchor on examples.</strong> &quot;Match the style of{' '}
            <code>components/PostCard.tsx</code>&quot; beats &quot;make it
            look nice.&quot; Models are great at imitation, mediocre at
            taste.
          </li>
          <li>
            <strong>Say what good looks like.</strong> Constraints, success
            criteria, what to avoid. The agent will gravitate toward whatever
            you tell it to.
          </li>
        </ul>
        <p>What consistently doesn&apos;t:</p>
        <ul className={styles.axisList}>
          <li>
            <strong>&quot;Be careful.&quot;</strong> It&apos;s not careful.
            Constraints work; vibes don&apos;t.
          </li>
          <li>
            <strong>&quot;Think step by step.&quot;</strong> The model
            already does, and modern thinking modes do it better than any
            prompt incantation.
          </li>
          <li>
            <strong>Politeness padding.</strong> Doesn&apos;t hurt,
            doesn&apos;t help. Save the keystrokes.
          </li>
        </ul>
        <p>
          If you find yourself rewriting the same prompt for the fifth time,
          stop. The lever you actually need is the next one.
        </p>
      </Lever>

      <Lever
        name='CONTEXT'
        tagline='The biggest unlock. Load what the agent needs to see.'
      >
        <p>
          Most &quot;the model is dumb today&quot; moments are actually
          &quot;the model can&apos;t see the thing it needs.&quot; The prompt
          is the verb; context is the noun. Get the noun right and the verb
          almost takes care of itself.
        </p>
        <p>Things to load:</p>
        <ul className={styles.axisList}>
          <li>
            <strong>Skills and project rules.</strong> A{' '}
            <code>CLAUDE.md</code> or <code>.cursorrules</code> that captures
            your project&apos;s patterns, conventions, and the things
            you&apos;re tired of correcting.
          </li>
          <li>
            <strong>Reference material.</strong> The design doc, the API
            spec, the related PR. Drop them into the chat. Don&apos;t make
            the agent guess at what&apos;s already written down.
          </li>
          <li>
            <strong>Screenshots.</strong> For UI work, an image of the
            current state plus a sketch of the target is worth ten
            paragraphs.
          </li>
          <li>
            <strong>MCPs.</strong> Wire the agent into your actual systems
            &mdash; repo, dashboards, design tokens, internal docs. Same as
            giving a junior engineer access to the stack instead of
            describing it from memory.
          </li>
        </ul>
        <p>
          Time spent loading the right context is the highest-leverage move
          you can make. It&apos;s also the most boring one, which is why
          it&apos;s underused.
        </p>
      </Lever>

      <div className={styles.synthesis}>
        <h3 className={styles.synthesisHeading}>
          <span className={styles.synthesisSymbol} aria-hidden='true'>
            ✦
          </span>
          Putting it all together
        </h3>
        <p>
          Treat the output as something you partially authored. Whatever came
          back, you were part of why it came back that way. When something
          feels off, walk through the levers and find the one you didn&apos;t
          pull.
        </p>

        <DebugChecklist />

        <p>
          Prompting and context management aren&apos;t gimmicks. They&apos;re
          real skills with as much depth as anything else in the craft
          &mdash; closer to chess than to magic words.
        </p>
      </div>
    </ChapterBody>
  )
}
