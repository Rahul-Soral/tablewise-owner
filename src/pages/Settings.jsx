import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Globe, Zap, TestTube, CheckCircle, XCircle, Trash2, Copy } from 'lucide-react'
import { API_CONFIG, fetchOrders, clearSampleData } from '../config/api'
import { useToast } from '../components/Toast'

/**
 * Settings Page
 * Application and user settings management
 * Includes API endpoint configuration and proxy toggle
 */
function Settings() {
  const { showToast } = useToast()
  
  // TODO: Connect to actual settings state/API
  const [settings, setSettings] = useState({
    businessName: 'My Business',
    email: 'owner@business.com',
    phone: '',
    address: '',
    notifications: {
      emailNotifications: true,
      orderUpdates: true,
      weeklyReports: false,
    },
    api: {
      useProxy: API_CONFIG.USE_PROXY,
      proxyUrl: API_CONFIG.PROXY_URL || '',
      pollingInterval: API_CONFIG.ORDERS_POLLING_INTERVAL,
    }
  })

  const [testResult, setTestResult] = useState(null)
  const [isTesting, setIsTesting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [name]: checked,
      },
    }))
  }

  const handleApiChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      api: {
        ...prev.api,
        [name]: type === 'checkbox' ? checked : value,
      },
    }))
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving settings:', settings)
    showToast('Settings saved successfully! Reload page for API changes to take effect.', 'success')
  }

  const handleSaveApiSettings = () => {
    // Save to localStorage to persist across reloads
    localStorage.setItem('api_use_proxy', settings.api.useProxy)
    localStorage.setItem('api_proxy_url', settings.api.proxyUrl)
    localStorage.setItem('api_polling_interval', settings.api.pollingInterval)
    
    showToast('API settings saved! Please reload the page for changes to take effect.', 'success', 7000)
  }

  const handleTestFetch = async () => {
    setIsTesting(true)
    setTestResult(null)
    
    try {
      const startTime = Date.now()
      const response = await fetchOrders()
      const endTime = Date.now()
      const duration = endTime - startTime
      
      setTestResult({
        success: true,
        data: response,
        duration,
        message: `Successfully fetched ${Array.isArray(response) ? response.length : 0} orders in ${duration}ms`
      })
      showToast('Test fetch successful!', 'success')
    } catch (error) {
      setTestResult({
        success: false,
        error: error.message,
        message: `Test fetch failed: ${error.message}`
      })
      showToast('Test fetch failed', 'error')
    } finally {
      setIsTesting(false)
    }
  }

  const handleClearSampleData = async () => {
    if (!window.confirm('Are you sure you want to clear all sample data? This action cannot be undone.')) {
      return
    }
    
    setIsClearing(true)
    
    try {
      const response = await clearSampleData()
      
      if (response.status === 'ok') {
        showToast('Sample data cleared successfully!', 'success')
      } else {
        throw new Error(response.message || 'Failed to clear sample data')
      }
    } catch (error) {
      console.error('Error clearing sample data:', error)
      showToast(`Failed to clear sample data: ${error.message}`, 'error')
    } finally {
      setIsClearing(false)
    }
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(API_CONFIG.BASE_URL)
    showToast('API URL copied to clipboard!', 'success', 2000)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-stone-900">Settings</h1>
        <p className="text-stone-600 mt-1">Manage your account and application preferences</p>
      </motion.div>

      {/* Settings Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-stone-900">Business Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Business Name
              </label>
              <input
                type="text"
                name="businessName"
                value={settings.businessName}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={settings.phone}
                onChange={handleInputChange}
                className="input"
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Address
              </label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleInputChange}
                className="input"
                rows="3"
                placeholder="Business address"
              />
            </div>
          </div>
        </motion.div>

        {/* Notification Preferences */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-stone-900">Notification Preferences</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Email Notifications
                </label>
                <p className="text-xs text-stone-500">Receive email notifications</p>
              </div>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={settings.notifications.emailNotifications}
                onChange={handleNotificationChange}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Order Updates
                </label>
                <p className="text-xs text-stone-500">Get notified about new orders</p>
              </div>
              <input
                type="checkbox"
                name="orderUpdates"
                checked={settings.notifications.orderUpdates}
                onChange={handleNotificationChange}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Weekly Reports
                </label>
                <p className="text-xs text-stone-500">Receive weekly performance reports</p>
              </div>
              <input
                type="checkbox"
                name="weeklyReports"
                checked={settings.notifications.weeklyReports}
                onChange={handleNotificationChange}
                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* API Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="card-elevated p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-primary-600" />
          <h2 className="text-xl font-semibold text-stone-900">API Configuration</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Endpoints */}
          <div>
            <h3 className="text-sm font-semibold text-stone-700 mb-3">Active Endpoints</h3>
            
            {/* Base URL with Copy Button */}
            <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg mb-3">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-primary-700 text-sm">Apps Script Base URL:</p>
                <button
                  onClick={handleCopyUrl}
                  className="text-primary-600 hover:text-primary-700 transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-stone-600 break-all font-mono text-xs">{API_CONFIG.BASE_URL}</p>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="p-3 bg-stone-50 rounded-lg">
                <p className="font-medium text-stone-600 mb-1">Get Orders:</p>
                <p className="text-stone-500 break-all font-mono">?action=getOrders&limit=200</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg">
                <p className="font-medium text-stone-600 mb-1">Update Status:</p>
                <p className="text-stone-500 break-all font-mono">?action=update_status&order_id=...&status=...</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg">
                <p className="font-medium text-stone-600 mb-1">Analytics:</p>
                <p className="text-stone-500 break-all font-mono">?action=getAnalytics</p>
              </div>
              <div className="p-3 bg-stone-50 rounded-lg">
                <p className="font-medium text-stone-600 mb-1">Customers:</p>
                <p className="text-stone-500 break-all font-mono">?action=getCustomers</p>
              </div>
            </div>
          </div>

          {/* Proxy Settings */}
          <div>
            <h3 className="text-sm font-semibold text-stone-700 mb-3">Proxy Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary-600" />
                  <div>
                    <label className="text-sm font-medium text-stone-700">
                      Use Proxy
                    </label>
                    <p className="text-xs text-stone-500">Route requests through proxy server</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="useProxy"
                  checked={settings.api.useProxy}
                  onChange={handleApiChange}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
              </div>

              {settings.api.useProxy && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Proxy URL
                  </label>
                  <input
                    type="url"
                    name="proxyUrl"
                    value={settings.api.proxyUrl}
                    onChange={handleApiChange}
                    className="input"
                    placeholder="http://localhost:8080/api"
                  />
                  <p className="text-xs text-stone-500 mt-1">
                    Proxy should accept ?target= parameter
                  </p>
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Polling Interval (ms)
                </label>
                <input
                  type="number"
                  name="pollingInterval"
                  value={settings.api.pollingInterval}
                  onChange={handleApiChange}
                  className="input"
                  min="1000"
                  max="30000"
                  step="1000"
                />
                <p className="text-xs text-stone-500 mt-1">
                  Current: {settings.api.pollingInterval}ms ({(settings.api.pollingInterval / 1000).toFixed(1)}s)
                </p>
              </div>

              <button 
                onClick={handleSaveApiSettings}
                className="btn-primary w-full text-sm"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Save API Settings (Requires Reload)
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-stone-200">
          <h3 className="text-sm font-semibold text-stone-700 mb-2">
            Note on CORS
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Apps Script endpoints support CORS by default. If you encounter issues, the app will automatically 
            attempt a JSONP fallback for GET requests. For maximum compatibility, consider using a proxy server 
            or enabling the proxy toggle above.
          </p>
        </div>
      </motion.div>

      {/* API Testing & Data Management Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-elevated p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <TestTube className="w-5 h-5 text-accent-600" />
          <h2 className="text-xl font-semibold text-stone-900">API Testing & Data Management</h2>
        </div>

        <p className="text-sm text-stone-600 mb-4">
          Test your API connection, view raw response data for debugging, and manage sample data.
        </p>

        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={handleTestFetch}
            disabled={isTesting}
            className="btn-primary flex items-center gap-2"
          >
            <TestTube className={`w-4 h-4 ${isTesting ? 'animate-pulse' : ''}`} />
            {isTesting ? 'Testing...' : 'Test Fetch Orders (Limit 5)'}
          </button>
          
          <button
            onClick={handleClearSampleData}
            disabled={isClearing}
            className="btn-ghost border border-error-300 text-error-700 hover:bg-error-50 flex items-center gap-2"
          >
            <Trash2 className={`w-4 h-4 ${isClearing ? 'animate-pulse' : ''}`} />
            {isClearing ? 'Clearing...' : 'Clear Sample Data'}
          </button>
        </div>

        {/* Test Result Display */}
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg border ${
              testResult.success
                ? 'bg-success-50 border-success-200'
                : 'bg-error-50 border-error-200'
            }`}
          >
            <div className="flex items-start gap-2 mb-2">
              {testResult.success ? (
                <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-error-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`font-medium text-sm ${
                  testResult.success ? 'text-success-900' : 'text-error-900'
                }`}>
                  {testResult.message}
                </p>
                
                {testResult.success && testResult.data && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-stone-700 mb-2">
                      Raw Response Data (first 5 orders):
                    </p>
                    <pre className="bg-stone-900 text-green-400 p-3 rounded text-xs overflow-x-auto max-h-96 overflow-y-auto">
                      {JSON.stringify(
                        Array.isArray(testResult.data) 
                          ? testResult.data.slice(0, 5)
                          : testResult.data,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                )}

                {!testResult.success && testResult.error && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-error-700 mb-1">Error Details:</p>
                    <p className="text-xs text-error-600 font-mono bg-error-100 p-2 rounded">
                      {testResult.error}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Business Settings
        </button>
      </motion.div>
    </div>
  )
}

export default Settings
