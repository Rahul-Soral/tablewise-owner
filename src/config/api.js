import axios from 'axios'

/**
 * API Configuration
 * Centralized API setup with axios instance
 * Google Apps Script Web App Endpoint
 * 
 * Live API Endpoint:
 * https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec
 * 
 * Available Actions:
 * - getOrders: ?action=getOrders&limit=100
 * - getAnalytics: ?action=getAnalytics
 * - getCustomers: ?action=getCustomers
 * - update_status: ?action=update_status&order_id=...&status=...
 * - getOrder: ?action=getOrder&order_id=...
 * - ping: ?action=ping
 */

// Google Apps Script endpoint (single endpoint for all actions)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec'

// Get environment variables (fallback to Apps Script URL if not set)
const USE_PROXY = import.meta.env.VITE_USE_PROXY === 'true'
const PROXY_URL = import.meta.env.VITE_PROXY_URL

const API_CONFIG = {
  // All actions use the same base URL with different query parameters
  BASE_URL: APPS_SCRIPT_URL,
  GET_ORDERS_URL: `${APPS_SCRIPT_URL}?action=getOrders&limit=100`,
  UPDATE_STATUS_URL: APPS_SCRIPT_URL, // POST or GET with query params
  ANALYTICS_URL: `${APPS_SCRIPT_URL}?action=getAnalytics`,
  CUSTOMERS_URL: `${APPS_SCRIPT_URL}?action=getCustomers`,
  ORDERS_POLLING_INTERVAL: 10000, // 10 seconds for orders
  ANALYTICS_POLLING_INTERVAL: 30000, // 30 seconds for analytics
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
    
    // Return empty array if no cached data available
    console.warn('No cached data available, returning empty array')
    return []
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
 * Update order status with POST first, then GET/JSONP fallback
 * Apps Script expects: { action: "update_status", order_id: "...", status: "..." }
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} API response
 */
export const updateOrderStatus = async (orderId, status) => {
  // Try POST first
  try {
    const url = getProxiedUrl(API_CONFIG.UPDATE_STATUS_URL)
    
    const response = await apiClient.post(url, {
      action: 'update_status',
      order_id: orderId,
      status: status,
      timestamp: new Date().toISOString()
    })
    
    return response.data
  } catch (postError) {
    console.warn('POST request failed, attempting GET/JSONP fallback...', postError)
    
    // Fallback to GET with query parameters
    try {
      const getUrl = `${API_CONFIG.UPDATE_STATUS_URL}?action=update_status&order_id=${encodeURIComponent(orderId)}&status=${encodeURIComponent(status)}`
      const proxiedUrl = getProxiedUrl(getUrl)
      
      const response = await apiClient.get(proxiedUrl)
      return response.data
    } catch (getError) {
      console.warn('GET request failed, attempting JSONP fallback...', getError)
      
      // Final fallback to JSONP
      return await updateOrderStatusWithJSONP(orderId, status)
    }
  }
}

/**
 * JSONP fallback for order status update
 */
function updateOrderStatusWithJSONP(orderId, status) {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const script = document.createElement('script')
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('JSONP update request timeout'))
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
      resolve(data)
    }

    const url = `${API_CONFIG.UPDATE_STATUS_URL}?action=update_status&order_id=${encodeURIComponent(orderId)}&status=${encodeURIComponent(status)}&callback=${callbackName}`
    
    script.src = url
    script.onerror = () => {
      cleanup()
      reject(new Error('JSONP update request failed'))
    }

    document.head.appendChild(script)
  })
}

/**
 * Get analytics data from Apps Script endpoint
 * @returns {Object} Analytics summary
 */
export const getAnalytics = async () => {
  try {
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
  } catch (error) {
    console.error('Error fetching analytics:', error)
    // Return empty analytics object if fetch fails
    return {
      total_orders: 0,
      total_revenue: 0,
      avg_ticket: 0,
      top_items: []
    }
  }
}

/**
 * Get customers data from Apps Script endpoint
 * @returns {Array} Customers array
 */
export const getCustomers = async () => {
  try {
    const url = getProxiedUrl(API_CONFIG.CUSTOMERS_URL)
    
    try {
      const response = await apiClient.get(url)
      const customers = response.data?.customers || response.data || []
      return customers
    } catch (fetchError) {
      // If CORS error, try JSONP fallback
      if (fetchError.message?.includes('CORS') || fetchError.code === 'ERR_NETWORK') {
        console.warn('CORS error on customers, attempting JSONP...')
        return await fetchCustomersWithJSONP()
      }
      throw fetchError
    }
  } catch (error) {
    console.error('Error fetching customers:', error)
    return []
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

    const url = API_CONFIG.ANALYTICS_URL + '&callback=' + callbackName
    
    script.src = url
    script.onerror = () => {
      cleanup()
      reject(new Error('JSONP analytics request failed'))
    }

    document.head.appendChild(script)
  })
}

/**
 * JSONP fallback for customers
 */
function fetchCustomersWithJSONP() {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_customers_${Date.now()}`
    const script = document.createElement('script')
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('JSONP customers request timeout'))
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
      const customers = data?.customers || data || []
      resolve(customers)
    }

    const url = API_CONFIG.CUSTOMERS_URL + '&callback=' + callbackName
    
    script.src = url
    script.onerror = () => {
      cleanup()
      reject(new Error('JSONP customers request failed'))
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

