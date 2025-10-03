import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import useStore from '../store/useStore'
import { updateOrderStatus } from '../config/api'

/**
 * OrdersTable Component
 * Displays orders in a responsive table with status management
 */
function OrdersTable({ orders, isLoading }) {
  const { updateOrderStatus: updateStoreStatus } = useStore()
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // TODO: Uncomment when API is ready
      // await updateOrderStatus(orderId, newStatus)
      
      // Update local state
      updateStoreStatus(orderId, newStatus)
      
      console.log(`Order ${orderId} status updated to ${newStatus}`)
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Failed to update order status')
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="card-elevated p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="card-elevated p-6">
        <p className="text-center text-stone-600 py-12">No orders found</p>
      </div>
    )
  }

  return (
    <div className="card-elevated overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="text-left py-3 px-4 font-semibold text-sm text-stone-700">
              <button
                onClick={() => handleSort('id')}
                className="flex items-center gap-1 hover:text-primary-600"
              >
                Order ID
                {sortBy === 'id' && (
                  sortOrder === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                )}
              </button>
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-stone-700">
              Customer
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-stone-700">
              Items
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-stone-700">
              Total
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm stone-700">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-sm text-stone-700">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <motion.tr
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-stone-100 hover:bg-stone-50"
            >
              <td className="py-3 px-4 text-sm font-medium text-stone-900">
                #{order.id}
              </td>
              <td className="py-3 px-4 text-sm text-stone-700">
                {order.customer}
              </td>
              <td className="py-3 px-4 text-sm text-stone-700">
                {order.items}
              </td>
              <td className="py-3 px-4 text-sm font-medium text-stone-900">
                ${order.total.toFixed(2)}
              </td>
              <td className="py-3 px-4">
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer ${getStatusColor(order.status)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="py-3 px-4 text-sm text-stone-600">
                {order.date}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrdersTable

