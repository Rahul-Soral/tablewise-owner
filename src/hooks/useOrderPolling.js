import { useEffect, useRef, useState } from 'react'

/**
 * Production-safe Order Polling Hook
 * 
 * Features:
 * - Polls API every 5 seconds (configurable)
 * - Prevents concurrent fetches
 * - Proper cleanup on unmount
 * - Single interval, no overlaps
 * - Handles errors gracefully
 * 
 * @param {number} interval - Polling interval in ms (default: 5000)
 * @returns {Object} { orders, isLoading, error, lastUpdated, refetch }
 */
export function useOrderPolling(interval = 5000) {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  
  const isFetchingRef = useRef(false)
  const intervalIdRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Fetch orders from API
  const fetchOrdersData = async () => {
    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.log('Fetch already in progress, skipping...')
      return
    }

    // Don't fetch if tab is hidden
    if (document.hidden) {
      return
    }

    isFetchingRef.current = true
    
    // Create abort controller for this request
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const cacheBust = Date.now()
      const url = `https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec?action=getOrders&limit=200&_=${cacheBust}`
      
      const response = await fetch(url, {
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const json = await response.json()
      
      // Handle API response format: {status, data} or raw array
      const ordersData = json.data || json || []
      
      setOrders(ordersData)
      setError(null)
      setLastUpdated(new Date())
      setIsLoading(false)
      
      // Cache in localStorage
      try {
        localStorage.setItem('orders_snapshot_v1', JSON.stringify(ordersData))
        localStorage.setItem('orders_snapshot_v1_timestamp', Date.now().toString())
      } catch (e) {
        console.warn('Failed to cache orders:', e)
      }
      
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted')
        return
      }
      
      console.error('Error fetching orders:', err)
      setError(err.message)
      setIsLoading(false)
      
      // Try to load from cache
      try {
        const cached = localStorage.getItem('orders_snapshot_v1')
        if (cached) {
          setOrders(JSON.parse(cached))
        }
      } catch (e) {
        console.warn('Failed to load cached orders:', e)
      }
    } finally {
      isFetchingRef.current = false
      abortControllerRef.current = null
    }
  }

  // Manual refetch function
  const refetch = () => {
    fetchOrdersData()
  }

  // Set up polling
  useEffect(() => {
    console.log(`Starting order polling (every ${interval / 1000}s)`)
    
    // Initial fetch
    fetchOrdersData()

    // Set up interval - only ONE interval
    intervalIdRef.current = setInterval(() => {
      fetchOrdersData()
    }, interval)

    // Cleanup function - CRITICAL
    return () => {
      console.log('Cleaning up order polling')
      
      // Clear interval
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current)
        intervalIdRef.current = null
      }
      
      // Abort any pending fetch
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
        abortControllerRef.current = null
      }
      
      isFetchingRef.current = false
    }
  }, [interval]) // Only re-run if interval changes

  // Handle visibility changes (pause when hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Tab hidden - pausing polling')
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current)
          intervalIdRef.current = null
        }
      } else {
        console.log('Tab visible - resuming polling')
        fetchOrdersData()
        if (!intervalIdRef.current) {
          intervalIdRef.current = setInterval(fetchOrdersData, interval)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [interval])

  return { orders, isLoading, error, lastUpdated, refetch }
}

