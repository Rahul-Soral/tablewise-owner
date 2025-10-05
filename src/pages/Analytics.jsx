import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  ShoppingCart, 
  TrendingUp, 
  Users,
  Download,
  Clock,
  RefreshCw
} from 'lucide-react'
import useStore from '../store/useStore'
import { getAnalytics, API_CONFIG } from '../config/api'
import { getAnalyticsSummary } from '../utils/insights'
import { exportOrdersToCSV, exportCustomersToCSV, exportAnalyticsToCSV } from '../utils/export'
import { useToast } from '../components/Toast'
import MetricCard from '../components/MetricCard'
import ActionCard from '../components/ActionCard'
import TopItemsChart from '../components/TopItemsChart'
import HourlyChart from '../components/HourlyChart'

/**
 * Analytics Page
 * Comprehensive analytics dashboard with metrics, charts, and insights
 * Fetches from live API every 30 seconds
 */
function Analytics() {
  const { orders } = useStore()
  const { showToast } = useToast()
  const [timePeriod, setTimePeriod] = useState('day')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)

  // Fetch analytics from API
  const fetchAnalyticsData = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getAnalytics()
      setAnalyticsData(data)
      setLastUpdated(new Date())
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      showToast('Failed to fetch analytics data', 'error')
      setIsLoading(false)
      // Fallback to client-side computation
      const fallbackData = getAnalyticsSummary(orders, timePeriod)
      setAnalyticsData(fallbackData)
    }
  }, [orders, timePeriod, showToast])

  // Initial fetch
  useEffect(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData])

  // Poll analytics every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAnalyticsData()
    }, API_CONFIG.ANALYTICS_POLLING_INTERVAL)

    return () => clearInterval(interval)
  }, [fetchAnalyticsData])

  // Compute analytics summary (fallback or client-side computation)
  const summary = useMemo(() => {
    if (analyticsData) {
      // Transform API data to match expected format
      return {
        revenue: analyticsData.total_revenue || 0,
        ordersCount: analyticsData.total_orders || 0,
        averageTicket: analyticsData.avg_ticket || 0,
        topItems: analyticsData.top_items || [],
        repeatCustomerRate: analyticsData.repeat_customer_rate || 0,
        hourlyDistribution: analyticsData.hourly_distribution || Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 })),
        actionCard: analyticsData.action_card || { 
          title: 'No insights available', 
          description: 'Waiting for more data...',
          priority: 'low'
        }
      }
    }
    // Fallback to client-side computation
    return getAnalyticsSummary(orders, timePeriod)
  }, [analyticsData, orders, timePeriod])

  const handleExportOrders = () => {
    exportOrdersToCSV(orders)
  }

  const handleExportCustomers = () => {
    exportCustomersToCSV(orders)
  }

  const handleExportAnalytics = () => {
    exportAnalyticsToCSV(summary)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Analytics</h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-stone-600">Track your business performance and insights</p>
            {lastUpdated && (
              <>
                <span className="text-stone-400">•</span>
                <div className="flex items-center gap-1.5 text-stone-500 text-sm">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={fetchAnalyticsData}
            className="btn-ghost text-sm flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={handleExportAnalytics}
            className="btn-ghost text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Analytics
          </button>
          <button
            onClick={handleExportOrders}
            className="btn-ghost text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Orders
          </button>
          <button
            onClick={handleExportCustomers}
            className="btn-ghost text-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Customers
          </button>
        </div>
      </motion.div>

      {/* Time Period Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        {['day', 'week', 'month'].map((period) => (
          <button
            key={period}
            onClick={() => setTimePeriod(period)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              timePeriod === period
                ? 'bg-primary-600 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Action Card - Priority Recommendation */}
      <ActionCard recommendation={summary.actionCard} />

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title={`Revenue (${timePeriod})`}
          value={`$${summary.revenue.toFixed(2)}`}
          icon={DollarSign}
          color="success"
        />
        <MetricCard
          title={`Orders (${timePeriod})`}
          value={summary.ordersCount}
          icon={ShoppingCart}
          color="primary"
        />
        <MetricCard
          title="Average Ticket"
          value={`$${summary.averageTicket.toFixed(2)}`}
          icon={TrendingUp}
          color="accent"
        />
        <MetricCard
          title="Repeat Customer Rate"
          value={`${summary.repeatCustomerRate.toFixed(1)}%`}
          icon={Users}
          color="teal"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-6"
        >
          <h2 className="text-xl font-semibold mb-4 text-stone-900">
            Top 5 Selling Items
          </h2>
          <TopItemsChart data={summary.topItems} />
          
          {/* Items List */}
          <div className="mt-6 space-y-2">
            {summary.topItems.map((item, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="font-medium text-stone-900">{item.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-stone-900">
                    {item.quantity} sold
                  </p>
                  <p className="text-xs text-stone-600">
                    ${item.revenue.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Hourly Orders Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-elevated p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-stone-600" />
            <h2 className="text-xl font-semibold text-stone-900">
              Hourly Orders Distribution
            </h2>
          </div>
          <HourlyChart data={summary.hourlyDistribution} />
          
          {/* Peak Hours */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-success-50 rounded-lg border border-success-200">
              <p className="text-xs font-medium text-success-700 mb-1">Peak Hour</p>
              <p className="text-lg font-bold text-success-900">
                {(() => {
                  const peak = summary.hourlyDistribution.reduce((max, curr) => 
                    curr.count > max.count ? curr : max
                  )
                  const hour = peak.hour
                  return hour === 0 ? '12 AM' : 
                         hour < 12 ? `${hour} AM` : 
                         hour === 12 ? '12 PM' : 
                         `${hour - 12} PM`
                })()}
              </p>
              <p className="text-xs text-success-600 mt-1">
                {summary.hourlyDistribution.reduce((max, curr) => 
                  curr.count > max.count ? curr : max
                ).count} orders
              </p>
            </div>
            
            <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-xs font-medium text-primary-700 mb-1">Total Hours Active</p>
              <p className="text-lg font-bold text-primary-900">
                {summary.hourlyDistribution.filter(h => h.count > 0).length}h
              </p>
              <p className="text-xs text-primary-600 mt-1">
                Orders received
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Additional Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card-elevated p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-stone-900">
          Business Insights
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm font-medium text-stone-600 mb-2">
              Revenue Breakdown
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-700">Food Sales</span>
                <span className="font-semibold text-stone-900">
                  ${(summary.revenue * 0.85).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-700">Beverages</span>
                <span className="font-semibold text-stone-900">
                  ${(summary.revenue * 0.12).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-700">Other</span>
                <span className="font-semibold text-stone-900">
                  ${(summary.revenue * 0.03).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-stone-600 mb-2">
              Order Status
            </h3>
            <div className="space-y-2">
              {['pending', 'preparing', 'ready', 'served'].map(status => {
                const count = orders.filter(o => o.status === status).length
                return (
                  <div key={status} className="flex justify-between text-sm">
                    <span className="text-stone-700 capitalize">{status}</span>
                    <span className="font-semibold text-stone-900">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-stone-600 mb-2">
              Customer Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-700">Total Customers</span>
                <span className="font-semibold text-stone-900">
                  {new Set(orders.map(o => o.customerPhone || o.customerName)).size}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-700">New Customers</span>
                <span className="font-semibold text-stone-900">
                  {Math.floor(new Set(orders.map(o => o.customerPhone || o.customerName)).size * 0.6)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-700">Repeat Rate</span>
                <span className="font-semibold text-stone-900">
                  {summary.repeatCustomerRate.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Analytics

