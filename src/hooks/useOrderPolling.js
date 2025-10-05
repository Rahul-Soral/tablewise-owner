import { useEffect, useRef, useCallback, useState } from 'react'
import { fetchOrders, isOnline } from '../config/api'

/**
 * useOrderPolling Hook
 * Implements efficient polling for orders with:
 * - Configurable interval (default: 10 seconds)
 * - Pauses when tab/window is not visible (Page Visibility API)
 * - Exponential backoff on server errors
 * - Offline detection
 * - Manual refresh capability
 * - AbortController for fetch cancellation
 * 
 * @param {function} onUpdate - Callback when orders are updated
 * @param {number} interval - Polling interval in ms - default: 10000
 * @param {boolean} enabled - Whether polling is enabled - default: true
 * @returns {Object} { refresh, startPolling, stopPolling, isPolling, isOffline, error }
 * 
 * @example
 * const { refresh, isOffline, error } = useOrderPolling(
 *   (orders) => setOrders(orders),
 *   10000,
 *   true
 * )
 */
export function useOrderPolling(onUpdate, interval = 10000, enabled = true) {
  const intervalRef = useRef(null)
  const isPollingRef = useRef(false)
  const errorCountRef = useRef(0)
  const currentIntervalRef = useRef(interval)
  const abortControllerRef = useRef(null)
  
  const [isPolling, setIsPolling] = useState(false)
  const [isOffline, setIsOffline] = useState(!isOnline())
  const [error, setError] = useState(null)

  // Calculate backoff interval based on error count
  const getBackoffInterval = useCallback(() => {
    const maxBackoff = 30000 // Max 30 seconds
    const backoff = Math.min(
      interval * Math.pow(2, errorCountRef.current),
      maxBackoff
    )
    return backoff
  }, [interval])

  const poll = useCallback(async () => {
    if (isPollingRef.current) return // Prevent concurrent polls
    
    // Don't poll if document is hidden
    if (document.hidden) {
      return
    }

    // Check online status
    if (!isOnline()) {
      setIsOffline(true)
      return
    } else {
      setIsOffline(false)
    }
    
    // Cancel previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController()
    
    isPollingRef.current = true
    setIsPolling(true)
    
    try {
      const result = await fetchOrders(abortControllerRef.current.signal)
      
      // Check if offline mode (cached data)
      if (result.offline) {
        setIsOffline(true)
        onUpdate(result.orders)
      } else {
        onUpdate(result)
        setError(null)
        errorCountRef.current = 0 // Reset error count on success
        currentIntervalRef.current = interval // Reset interval
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was cancelled, ignore
        return
      }
      
      console.error('Polling error:', err)
      setError(err)
      errorCountRef.current++
      
      // Implement exponential backoff
      const newInterval = getBackoffInterval()
      currentIntervalRef.current = newInterval
      
      console.warn(`Polling failed. Retrying in ${newInterval / 1000}s...`)
    } finally {
      isPollingRef.current = false
      setIsPolling(false)
      abortControllerRef.current = null
    }
  }, [onUpdate, interval, getBackoffInterval])

  const startPolling = useCallback(() => {
    if (intervalRef.current) return

    // Initial fetch
    poll()

    // Set up interval
    intervalRef.current = setInterval(() => {
      poll()
    }, currentIntervalRef.current)
  }, [poll])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    // Cancel any pending fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
  }, [])

  const refresh = useCallback(() => {
    // Reset error count on manual refresh
    errorCountRef.current = 0
    currentIntervalRef.current = interval
    poll()
  }, [poll, interval])

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!enabled) return

      if (document.hidden) {
        // Pause polling when tab is hidden
        console.log('Tab hidden - pausing polling')
        stopPolling()
      } else {
        // Resume polling when tab becomes visible
        console.log('Tab visible - resuming polling')
        errorCountRef.current = 0 // Reset errors when tab becomes visible
        currentIntervalRef.current = interval
        startPolling()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled, startPolling, stopPolling, interval])

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('Network back online')
      setIsOffline(false)
      errorCountRef.current = 0
      if (enabled && !document.hidden) {
        refresh()
      }
    }

    const handleOffline = () => {
      console.log('Network offline')
      setIsOffline(true)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [enabled, refresh])

  // Main polling effect
  useEffect(() => {
    if (enabled && !document.hidden) {
      startPolling()
    } else {
      stopPolling()
    }

    return () => stopPolling()
  }, [enabled, startPolling, stopPolling])

  // Update interval when it changes
  useEffect(() => {
    if (intervalRef.current) {
      stopPolling()
      startPolling()
    }
  }, [interval, startPolling, stopPolling])

  return { refresh, startPolling, stopPolling, isPolling, isOffline, error }
}

