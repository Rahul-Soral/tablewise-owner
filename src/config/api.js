import axios from 'axios'

/**
 * API Configuration
 * Centralized API setup with axios instance
 * Uses environment variables for all endpoint URLs
 * 
 * Security Best Practices:
 * 1. All API URLs stored in environment variables
 * 2. Secret token should be added to requests (set in localStorage after login)
 * 3. Implement CORS on server-side to only allow your domain
 * 4. Use HTTPS in production
 * 5. Implement rate limiting on server-side
 * 6. Validate and sanitize all inputs server-side
 * 7. Never expose API keys/secrets in client code
 */

// Get environment variables
const USE_PROXY = import.meta.env.VITE_USE_PROXY === 'true'
const PROXY_URL = import.meta.env.VITE_PROXY_URL

const API_CONFIG = {
  GET_ORDERS_URL: import.meta.env.VITE_GET_ORDERS_URL,
  UPDATE_STATUS_URL: import.meta.env.VITE_UPDATE_STATUS_URL,
  WEBHOOK_URL: import.meta.env.VITE_WEBHOOK_URL,
  ANALYTICS_URL: import.meta.env.VITE_ANALYTICS_URL,
  POLLING_INTERVAL: parseInt(import.meta.env.VITE_POLLING_INTERVAL) || 3000,
  USE_PROXY,
  PROXY_URL,
}

// Proxy wrapper for requests
function getProxiedUrl(url) {
  if (!USE_PROXY || !PROXY_URL) return url
  return `${PROXY_URL}?target=${encodeURIComponent(url)}`
}

// Export config for use in settings
export { API_CONFIG }

// Create axios instance with default config
const apiClient = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - adds auth token and secret
apiClient.interceptors.request.use(
  (config) => {
    // Add authentication token
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Add secret token for Apps Script endpoints
    // TODO: Set this after user authentication
    const apiSecret = localStorage.getItem('apiSecret')
    if (apiSecret) {
      config.headers['X-API-Secret'] = apiSecret
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handles errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common error cases
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          localStorage.removeItem('authToken')
          localStorage.removeItem('apiSecret')
          console.error('Unauthorized - please login again')
          // TODO: Redirect to login page
          // window.location.href = '/login'
          break
        case 403:
          // Forbidden
          console.error('Access forbidden')
          break
        case 404:
          console.error('Resource not found')
          break
        case 429:
          // Rate limited
          console.error('Too many requests - please try again later')
          break
        case 500:
        case 502:
        case 503:
          // Server errors
          console.error('Server error - please try again later')
          break
        default:
          console.error(`API error: ${error.response.status}`)
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - please check your connection')
    } else {
      console.error('Request error:', error.message)
    }

    return Promise.reject(error)
  }
)

/**
 * API Methods
 */

/**
 * Cache management for offline support
 */
const CACHE_KEY = 'cached_orders'
const CACHE_TIMESTAMP_KEY = 'cached_orders_timestamp'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCachedOrders() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
    
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp)
      if (age < CACHE_DURATION) {
        return JSON.parse(cached)
      }
    }
  } catch (error) {
    console.error('Error reading cache:', error)
  }
  return null
}

function setCachedOrders(orders) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(orders))
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
  } catch (error) {
    console.error('Error writing cache:', error)
  }
}

/**
 * Fetch orders from API with offline support and JSONP fallback
 * @returns {Promise<Array>} Array of orders
 */
export const fetchOrders = async () => {
  try {
    const url = getProxiedUrl(API_CONFIG.GET_ORDERS_URL)
    
    // Try standard fetch first
    try {
      const response = await apiClient.get(url)
      const orders = response.data?.orders || response.data || []
      
      // Cache successful response
      setCachedOrders(orders)
      
      return orders
    } catch (fetchError) {
      // If CORS error, try JSONP fallback
      if (fetchError.message?.includes('CORS') || fetchError.code === 'ERR_NETWORK') {
        console.warn('CORS error detected, attempting JSONP fallback...')
        return await fetchOrdersWithJSONP()
      }
      throw fetchError
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    
    // Try to return cached data on error
    const cached = getCachedOrders()
    if (cached) {
      console.warn('Using cached orders data (offline mode)')
      return { orders: cached, offline: true }
    }
    
    // Fallback to mock data in development
    if (import.meta.env.DEV) {
      console.warn('Using mock data (development mode)')
      const { mockOrders } = await import('./mockData')
      return mockOrders
    }
    
    throw error
  }
}

/**
 * JSONP fallback for Apps Script GET requests
 */
function fetchOrdersWithJSONP() {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const script = document.createElement('script')
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('JSONP request timeout'))
    }, 10000)

    function cleanup() {
      clearTimeout(timeout)
      delete window[callbackName]
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }

    window[callbackName] = (data) => {
      cleanup()
      const orders = data?.orders || data || []
      setCachedOrders(orders)
      resolve(orders)
    }

    const url = API_CONFIG.GET_ORDERS_URL + 
                (API_CONFIG.GET_ORDERS_URL.includes('?') ? '&' : '?') + 
                `callback=${callbackName}`
    
    script.src = url
    script.onerror = () => {
      cleanup()
      reject(new Error('JSONP request failed'))
    }

    document.head.appendChild(script)
  })
}

/**
 * Update order status with retry logic
 * Apps Script expects: { action: "update_status", order_id: "...", status: "..." }
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @param {number} retries - Number of retries - default: 2
 * @returns {Promise<Object>} API response
 */
export const updateOrderStatus = async (orderId, status, retries = 2) => {
  try {
    const url = getProxiedUrl(API_CONFIG.UPDATE_STATUS_URL)
    
    const response = await apiClient.post(url, {
      action: 'update_status',
      order_id: orderId,
      status: status,
      timestamp: new Date().toISOString()
    })
    
    return response.data
  } catch (error) {
    console.error(`Error updating order status (retries left: ${retries}):`, error)
    
    // Retry on network errors or 5xx errors
    if (retries > 0 && (!error.response || error.response.status >= 500)) {
      // Wait before retry (exponential backoff)
      const delay = (3 - retries) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
      return updateOrderStatus(orderId, status, retries - 1)
    }
    
    throw error
  }
}

/**
 * Get analytics data from Apps Script endpoint
 * Falls back to client-side computation if endpoint fails
 * @param {Array} orders - Orders array for fallback
 * @returns {Object} Analytics summary
 */
export const getAnalytics = async (orders) => {
  try {
    // Try to fetch from Apps Script endpoint
    if (API_CONFIG.ANALYTICS_URL) {
      const url = getProxiedUrl(API_CONFIG.ANALYTICS_URL)
      
      try {
        const response = await apiClient.get(url)
        return response.data?.analytics || response.data
      } catch (fetchError) {
        // If CORS error, try JSONP fallback
        if (fetchError.message?.includes('CORS') || fetchError.code === 'ERR_NETWORK') {
          console.warn('CORS error on analytics, attempting JSONP...')
          return await fetchAnalyticsWithJSONP()
        }
        throw fetchError
      }
    }
    
    // Fallback to client-side computation
    console.log('Computing analytics client-side...')
    const { getAnalyticsSummary } = await import('../utils/insights')
    return getAnalyticsSummary(orders, 'day')
  } catch (error) {
    console.error('Error fetching analytics, using client-side computation:', error)
    
    // Always fallback to client-side as last resort
    const { getAnalyticsSummary } = await import('../utils/insights')
    return getAnalyticsSummary(orders, 'day')
  }
}

/**
 * JSONP fallback for analytics
 */
function fetchAnalyticsWithJSONP() {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_analytics_${Date.now()}`
    const script = document.createElement('script')
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('JSONP analytics request timeout'))
    }, 10000)

    function cleanup() {
      clearTimeout(timeout)
      delete window[callbackName]
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }

    window[callbackName] = (data) => {
      cleanup()
      resolve(data?.analytics || data)
    }

    const url = API_CONFIG.ANALYTICS_URL + 
                (API_CONFIG.ANALYTICS_URL.includes('?') ? '&' : '?') + 
                `callback=${callbackName}`
    
    script.src = url
    script.onerror = () => {
      cleanup()
      reject(new Error('JSONP analytics request failed'))
    }

    document.head.appendChild(script)
  })
}

/**
 * Check if user is online
 */
export function isOnline() {
  return navigator.onLine
}

/**
 * Get offline status message
 */
export function getOfflineMessage() {
  return 'You are currently offline. Showing cached data.'
}

export default apiClient

