import { useState, useEffect } from 'react'

/**
 * useTimer Hook
 * Calculates elapsed time from a given timestamp
 * Updates every second for live timer display
 */
export function useTimer(startTime) {
  const [elapsed, setElapsed] = useState('')

  useEffect(() => {
    const calculateElapsed = () => {
      const start = new Date(startTime)
      const now = new Date()
      const diff = Math.floor((now - start) / 1000) // seconds

      const hours = Math.floor(diff / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = diff % 60

      if (hours > 0) {
        return `${hours}h ${minutes}m`
      } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`
      } else {
        return `${seconds}s`
      }
    }

    setElapsed(calculateElapsed())
    const interval = setInterval(() => {
      setElapsed(calculateElapsed())
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime])

  return elapsed
}

/**
 * Get color class based on elapsed time
 */
export function getTimerColor(startTime) {
  const start = new Date(startTime)
  const now = new Date()
  const minutes = Math.floor((now - start) / 60000)

  if (minutes < 10) return 'text-success-600'
  if (minutes < 20) return 'text-warning-600'
  return 'text-danger-600'
}


