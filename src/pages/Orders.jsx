import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  RefreshCw,
  SlidersHorizontal,
  Calendar,
  WifiOff
} from 'lucide-react'
import useStore from '../store/useStore'
import { updateOrderStatus } from '../config/api'
import { useOrderPolling } from '../hooks/useOrderPolling'
import { useToast } from '../components/Toast'
import OrderCard from '../components/OrderCard'
import OrderDetail from '../components/OrderDetail'
import ConfirmDialog from '../components/ConfirmDialog'

/**
 * Orders Page (Home/Primary Experience)
 * Displays active orders with real-time updates, filtering, and sorting
 * Implements optimistic UI updates and micro-interactions
 * Polls GET_ORDERS_URL every 3 seconds when tab is visible
 */
function Orders() {
  const { orders, setOrders, updateOrderStatus: updateStoreStatus } = useStore()
  const { showToast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [timeFilter, setTimeFilter] = useState('today')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, orderId: null, newStatus: null })
  const [newOrderIds, setNewOrderIds] = useState(new Set())

  // Real-time polling (every 3 seconds, pauses when tab hidden)
  const handleOrdersUpdate = useCallback((newOrders) => {
    // Handle offline mode response
    if (newOrders.offline) {
      showToast('You are offline. Showing cached data.', 'warning', 5000)
      setOrders(newOrders.orders)
      return
    }

    // Detect new orders for animation
    const currentIds = new Set(orders.map(o => o.id))
    const newIds = new Set()
    
    const ordersArray = Array.isArray(newOrders) ? newOrders : newOrders.orders || []
    
    ordersArray.forEach(order => {
      if (!currentIds.has(order.id)) {
        newIds.add(order.id)
      }
    })
    
    if (newIds.size > 0) {
      setNewOrderIds(newIds)
      // Clear new order indicators after 5 seconds
      setTimeout(() => setNewOrderIds(new Set()), 5000)
    }
    
    setOrders(ordersArray)
  }, [orders, setOrders, showToast])

  const { refresh, isOffline, error } = useOrderPolling(handleOrdersUpdate, 3000, true)

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.customerPhone?.includes(query)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Time filter
    const now = new Date()
    if (timeFilter === 'today') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0))
      filtered = filtered.filter(order => new Date(order.createdAt) >= startOfDay)
    } else if (timeFilter === '24h') {
      const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      filtered = filtered.filter(order => new Date(order.createdAt) >= last24h)
    }

    // Sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt)
      const dateB = new Date(b.createdAt)
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [orders, searchQuery, statusFilter, sortBy, timeFilter])

  // Handle status change with optimistic update
  const handleStatusChange = useCallback(async (orderId, newStatus) => {
    // Show confirmation dialog for cancel action
    if (newStatus === 'cancelled') {
      setConfirmDialog({ isOpen: true, orderId, newStatus })
      return
    }

    // Find order to get old status
    const order = orders.find(o => o.id === orderId)
    if (!order) return
    
    const oldStatus = order.status

    // Step 1: Optimistic update - UI changes immediately
    updateStoreStatus(orderId, newStatus)

    try {
      // Step 2: Call API
      await updateOrderStatus(orderId, newStatus)
      
      // Success toast
      showToast(`Order ${orderId} updated to ${newStatus}`, 'success', 3000)
    } catch (error) {
      console.error('Failed to update order status:', error)
      
      // Step 3: Rollback on error
      updateStoreStatus(orderId, oldStatus)
      
      // Error toast
      const errorMsg = error.response?.data?.message || error.message || 'Failed to update order'
      showToast(errorMsg, 'error', 5000)
    }
  }, [orders, updateStoreStatus, showToast])

  const handleConfirmCancel = async () => {
    const { orderId, newStatus } = confirmDialog
    
    const order = orders.find(o => o.id === orderId)
    if (!order) return
    
    const oldStatus = order.status

    // Optimistic update
    updateStoreStatus(orderId, newStatus)

    try {
      await updateOrderStatus(orderId, newStatus)
      showToast(`Order ${orderId} cancelled`, 'success', 3000)
    } catch (error) {
      console.error('Failed to cancel order:', error)
      updateStoreStatus(orderId, oldStatus)
      showToast('Failed to cancel order. Please try again.', 'error', 5000)
    }
  }

  const handleOrderClick = (order) => {
    setSelectedOrder(order)
  }

  const handleCloseDetail = () => {
    setSelectedOrder(null)
  }

  return (
    <div className="space-y-6">
      {/* Offline Indicator */}
      {isOffline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-warning-50 border border-warning-200 text-warning-800 px-4 py-3 rounded-lg flex items-center gap-2"
          data-testid="offline-indicator"
        >
          <WifiOff className="w-5 h-5" />
          <span className="font-medium">You are offline. Showing cached data.</span>
        </motion.div>
      )}

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Orders</h1>
          <p className="text-stone-600 mt-1">
            {filteredOrders.length} active order{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        </div>

        <button
          onClick={refresh}
          className="btn-ghost flex items-center gap-2"
          aria-label="Refresh orders"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated p-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="search"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10 w-full"
              aria-label="Search orders by ID, customer name, or phone"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input pl-10 w-full"
              aria-label="Filter by status"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="served">Served</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input pl-10 w-full"
              aria-label="Sort orders"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="input pl-10 w-full"
              aria-label="Filter by time range"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="24h">Last 24 Hours</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Orders Grid */}
      <AnimatePresence mode="popLayout">
        {filteredOrders.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredOrders.map((order, index) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusChange={handleStatusChange}
                onClick={handleOrderClick}
                isNew={newOrderIds.has(order.id)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card-elevated p-12 text-center"
          >
            <p className="text-stone-600 text-lg">No orders found</p>
            <p className="text-stone-500 text-sm mt-2">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Detail Slide-over */}
      <OrderDetail
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={handleCloseDetail}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ isOpen: false, orderId: null, newStatus: null })}
        onConfirm={handleConfirmCancel}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? This action cannot be undone."
        confirmText="Yes, Cancel Order"
        cancelText="No, Keep Order"
        isDanger={true}
      />
    </div>
  )
}

export default Orders
