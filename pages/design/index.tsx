import {
  ArrowLeft,
  Blocks,
  ChevronRight,
  Palette,
  Share2,
  Turtle,
  Type
} from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'

import styles from './index.module.css'

const tools = [
  {
    href: '/design/fonts',
    title: 'Font pairer',
    description: 'Compare type combinations on the home page and articles.',
    icon: Type
  },
  {
    href: '/design/blocks',
    title: 'Blocks',
    description: 'Test the content system with deterministic local fixtures.',
    icon: Blocks
  },
  {
    href: '/design/social',
    title: 'Social',
    description: 'Load page metadata and preview editable social cards.',
    icon: Share2
  },
  {
    href: '/design/theme',
    title: 'Theme',
    description: 'Tune color tokens, verify contrast, and export CSS.',
    icon: Palette
  }
]

const pages = [
  {
    href: '/design/favicons',
    title: 'Favicons',
    description: 'Compare original turtle marks at real browser sizes.',
    icon: Turtle
  }
]

const sections = [
  { id: 'tools', label: 'Tools', items: tools },
  { id: 'pages', label: 'Pages', items: pages }
]

export default function DesignIndexPage() {
  return (
    <>
      <Head>
        <title>Design playground · Stephen Wu</title>
        <meta
          name='description'
          content='A workspace for testing design decisions on wustep.me.'
        />
        <meta name='robots' content='noindex,nofollow' />
      </Head>

      <main className={styles.page}>
        <header className={styles.header}>
          <Link href='/' className={styles.backLink}>
            <ArrowLeft aria-hidden='true' />
            wustep.me
          </Link>
        </header>

        <section className={styles.intro}>
          <h1>Design playground</h1>
        </section>

        <div className={styles.directory}>
          {sections.map((section) => (
            <section
              key={section.id}
              className={styles.studies}
              aria-labelledby={`${section.id}-heading`}
            >
              <h2 id={`${section.id}-heading`}>{section.label}</h2>
              <div className={styles.studyList}>
                {section.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={styles.studyCard}
                    >
                      <div className={styles.studyIcon} aria-hidden='true'>
                        <Icon strokeWidth={1.7} />
                      </div>
                      <div className={styles.studyCopy}>
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                      <ChevronRight
                        className={styles.openIcon}
                        aria-hidden='true'
                      />
                    </Link>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  )
}
