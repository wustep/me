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
      await router.replace('/')
    } catch {
      setError('Something went wrong. Try again.')
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
      setError('Couldn’t turn off owner mode. Try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isChecking = status === 'checking'
  const isOwner = status === 'owner'

  return (
    <>
      <Head>
        <title>Owner · Stephen Wu</title>
        <meta
          name='description'
          content='Private owner controls for wustep.me.'
        />
        <meta name='robots' content='noindex,nofollow,noarchive' />
      </Head>

      <main className={styles.page}>
        <div className={styles.card}>
          <Link href='/' className={styles.back}>
            ← wustep.me
          </Link>

          <h1 className={styles.title}>Owner mode</h1>

          {isChecking ? (
            <p className={styles.text}>Checking…</p>
          ) : isOwner ? (
            <div className={styles.actions}>
              <button
                type='button'
                className={styles.button}
                disabled={isSubmitting}
                onClick={deactivateOwnerMode}
              >
                {isSubmitting ? 'Forgetting…' : 'Forget this browser'}
              </button>
            </div>
          ) : (
            <form className={styles.form} onSubmit={activateOwnerMode}>
              <input
                id='owner-key'
                name='owner-key'
                type='password'
                placeholder='Key'
                aria-label='Key'
                value={secret}
                autoComplete='current-password'
                autoFocus
                disabled={isSubmitting}
                onChange={(event) => setSecret(event.target.value)}
              />
              <button
                type='submit'
                className={styles.button}
                disabled={!secret || isSubmitting}
              >
                {isSubmitting ? 'Checking…' : 'Continue'}
              </button>
            </form>
          )}

          <p className={styles.error} role='alert' aria-live='polite'>
            {error}
          </p>
        </div>
      </main>
    </>
  )
}
