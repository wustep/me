import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  LoaderCircle,
  LogOut,
  ShieldCheck
} from 'lucide-react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import * as React from 'react'

import { useOwnerMode } from '@/components/wustep/OwnerModeProvider'

import styles from './owner.module.css'

type OwnerModeApiResponse = {
  error?: string
  isOwner: boolean
}

export default function OwnerPage() {
  const router = useRouter()
  const { setOwnerAccess, setOwnerMode, status } = useOwnerMode()
  const [secret, setSecret] = React.useState('')
  const [error, setError] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function activateOwnerMode(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!secret || isSubmitting) return

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/owner-mode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret })
      })
      const result = (await response.json()) as OwnerModeApiResponse

      if (!response.ok || !result.isOwner) {
        setError(result.error ?? 'Owner mode could not be activated.')
        return
      }

      setOwnerAccess(true)
      setOwnerMode(true)
      await router.replace('/playground')
    } catch {
      setError('Owner mode could not be activated. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function deactivateOwnerMode() {
    if (isSubmitting) return

    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/owner-mode', { method: 'DELETE' })
      if (!response.ok) throw new Error('Could not clear owner session')

      setOwnerAccess(false)
      setOwnerMode(false)
    } catch {
      setError('Owner mode could not be turned off. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isChecking = status === 'checking'
  const isOwner = status === 'owner'

  return (
    <>
      <Head>
        <title>Owner mode · Stephen Wu</title>
        <meta
          name='description'
          content='Private owner controls for wustep.me.'
        />
        <meta name='robots' content='noindex,nofollow,noarchive' />
      </Head>

      <main className={styles.page}>
        <div className={styles.grid} aria-hidden='true' />
        <header className={styles.header}>
          <Link href='/' className={styles.backLink}>
            <ArrowLeft aria-hidden='true' />
            wustep.me
          </Link>
          <span className={styles.classification}>Private access</span>
        </header>

        <section className={styles.accessPanel} aria-labelledby='owner-title'>
          <div className={styles.panelHeader}>
            <div className={styles.keyMark} aria-hidden='true'>
              {isOwner ? <ShieldCheck /> : <KeyRound />}
            </div>
            <div className={styles.statusLine}>
              <span
                className={`${styles.statusDot} ${isOwner ? styles.statusDotActive : ''}`}
              />
              {isChecking
                ? 'Checking session'
                : isOwner
                  ? 'Owner session active'
                  : 'Visitor session'}
            </div>
          </div>

          <div className={styles.panelBody}>
            <p className={styles.eyebrow}>Backstage</p>
            <h1 id='owner-title'>
              {isOwner ? 'You’re in owner mode.' : 'A little more of the site.'}
            </h1>
            <p className={styles.description}>
              {isOwner
                ? 'Private interface details are visible on this browser, and your visits are excluded from site analytics.'
                : 'Activate owner mode to reveal private interface details and keep this browser out of site analytics.'}
            </p>

            {isChecking ? (
              <div className={styles.checking} aria-live='polite'>
                <LoaderCircle aria-hidden='true' />
                Verifying this browser…
              </div>
            ) : isOwner ? (
              <div className={styles.activeActions}>
                <Link href='/playground' className={styles.primaryAction}>
                  Open playground
                  <ArrowRight aria-hidden='true' />
                </Link>
                <button
                  type='button'
                  className={styles.secondaryAction}
                  disabled={isSubmitting}
                  onClick={deactivateOwnerMode}
                >
                  {isSubmitting ? (
                    <LoaderCircle
                      className={styles.spinner}
                      aria-hidden='true'
                    />
                  ) : (
                    <LogOut aria-hidden='true' />
                  )}
                  Forget this browser
                </button>
              </div>
            ) : (
              <form className={styles.form} onSubmit={activateOwnerMode}>
                <label htmlFor='owner-key'>Owner key</label>
                <div className={styles.fieldRow}>
                  <input
                    id='owner-key'
                    name='owner-key'
                    type='password'
                    value={secret}
                    autoComplete='current-password'
                    autoFocus
                    disabled={isSubmitting}
                    onChange={(event) => setSecret(event.target.value)}
                  />
                  <button
                    type='submit'
                    aria-label='Activate owner mode'
                    disabled={!secret || isSubmitting}
                  >
                    {isSubmitting ? (
                      <LoaderCircle
                        className={styles.spinner}
                        aria-hidden='true'
                      />
                    ) : (
                      <ArrowRight aria-hidden='true' />
                    )}
                  </button>
                </div>
                <p className={styles.fieldHint}>
                  Stored only as a signed session on this browser.
                </p>
              </form>
            )}

            {error ? (
              <p className={styles.error} role='alert'>
                {error}
              </p>
            ) : null}
          </div>

          <div className={styles.panelFooter}>
            <span>Analytics</span>
            <span>{isOwner ? 'Excluded' : 'Standard'}</span>
            <span>Session</span>
            <span>{isOwner ? '1 year' : 'None'}</span>
          </div>
        </section>
      </main>
    </>
  )
}
