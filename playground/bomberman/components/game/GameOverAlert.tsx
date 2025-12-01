// @ts-nocheck
import { useEffect } from 'react'

import { cn } from '../../lib/utils'
import { Alert, AlertDescription } from '../ui/alert'
import { Button } from '../ui/button'
import { PLAYER_1, PLAYER_2 } from './constants'

type GameOverAlertProps = {
  showAlert: boolean
  p1Alive: boolean
  p2Alive: boolean
  onReset: () => void
}

export default function GameOverAlert({
  showAlert,
  p1Alive,
  p2Alive,
  onReset
}: GameOverAlertProps) {
  // Add key handler for enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && showAlert) {
        onReset()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showAlert, onReset])

  return (
    <div
      className={cn(
        'absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-500',
        showAlert ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div className='max-w-md w-full mx-4'>
        <Alert className='border-2'>
          <AlertDescription className='flex flex-col items-center gap-4 py-4'>
            <span className='text-2xl font-semibold'>
              <WinnerText p1Alive={p1Alive} p2Alive={p2Alive} />
            </span>
            <Button size='lg' onClick={onReset}>
              Play Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

function WinnerText({
  p1Alive,
  p2Alive
}: Omit<GameOverAlertProps, 'showAlert' | 'onReset'>) {
  if (!p1Alive && !p2Alive) return "It's a draw!"
  if (!p1Alive) return `${PLAYER_2} wins! 🎉`
  if (!p2Alive) return `${PLAYER_1} wins! 🎉`
  return ''
}
