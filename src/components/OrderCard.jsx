import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  User, 
  DollarSign, 
  ChevronDown, 
  ChevronUp,
  Phone,
  Package
} from 'lucide-react'
import { useTimer, getTimerColor } from '../hooks/useTimer'

/**
 * OrderCard Component
 * Displays order summary with expandable items and action buttons
 * Implements micro-interactions and accessibility features
 */
function OrderCard({ order, onStatusChange, onClick, isNew }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const orderTime = order.timestamp || order.createdAt
  const elapsed = useTimer(orderTime)
  const timerColor = getTimerColor(orderTime)
  
  // Extract fields with fallbacks
  const orderId = order.order_id || order.id
  const customerName = order.customer?.name || order.customerName || 'Unknown Customer'
  const customerMobile = order.customer?.mobile || order.customerPhone || ''
  const orderTotal = order.total || 0
  const orderStatus = (order.status || 'NEW').toLowerCase()
  const orderItems = order.items || []

  // Status configuration
  const statusConfig = {
    new: { 
      label: 'New', 
      color: 'bg-warning-100 text-warning-700 border-warning-200',
      actions: ['accept', 'cancel']
    },
    pending: { 
      label: 'Pending', 
      color: 'bg-warning-100 text-warning-700 border-warning-200',
      actions: ['accept', 'cancel']
    },
    accepted: { 
      label: 'Accepted', 
      color: 'bg-primary-100 text-primary-700 border-primary-200',
      actions: ['preparing', 'cancel']
    },
    preparing: { 
      label: 'Preparing', 
      color: 'bg-accent-100 text-accent-700 border-accent-200',
      actions: ['ready', 'cancel']
    },
    ready: { 
      label: 'Ready', 
      color: 'bg-teal-100 text-teal-700 border-teal-200',
      actions: ['served']
    },
    served: { 
      label: 'Served', 
      color: 'bg-success-100 text-success-700 border-success-200',
      actions: []
    },
    cancelled: { 
      label: 'Cancelled', 
      color: 'bg-danger-100 text-danger-700 border-danger-200',
      actions: []
    },
  }

  const currentStatus = statusConfig[orderStatus] || statusConfig.pending

  const handleStatusChange = (e, newStatus) => {
    e.stopPropagation() // Prevent card click
    onStatusChange(orderId, newStatus)
  }

  const handleCardClick = () => {
    onClick(order)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick()
    }
  }

  return (
    <motion.div
      layout
      initial={isNew ? { scale: 0.95, opacity: 0 } : false}
      animate={isNew ? { 
        scale: [0.95, 1.02, 1],
        opacity: 1,
      } : { scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="card-elevated hover:shadow-elevation-xl transition-shadow cursor-pointer focus-within:ring-2 focus-within:ring-primary-500 rounded-lg"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="article"
      aria-label={`Order ${orderId} for ${customerName}`}
      data-testid="order-card"
    >
      {/* New order pulse indicator */}
      {isNew && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full"
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: 3,
            ease: "easeInOut"
          }}
        />
      )}

      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {/* Order ID and Table */}
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-bold text-stone-900">
                #{orderId}
              </h3>
              {order.table && (
                <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs font-semibold rounded-md">
                  Table {order.table}
                </span>
              )}
            </div>

            {/* Customer Name */}
            <div className="flex items-center gap-2 text-stone-600">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium" data-testid="customer-name">
                {customerName}
              </span>
            </div>
            {customerMobile && (
              <div className="flex items-center gap-2 text-stone-600 mt-1">
                <Phone className="w-3.5 h-3.5" />
                <span className="text-xs">{customerMobile}</span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <span 
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${currentStatus.color}`}
            data-testid="status-chip"
          >
            {currentStatus.label}
          </span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 mb-4" data-testid="live-timer">
          <Clock className={`w-4 h-4 ${timerColor}`} />
          <span className={`text-sm font-semibold ${timerColor}`}>
            {elapsed}
          </span>
        </div>

        {/* Items Summary */}
        <div className="mb-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900 transition-colors w-full"
            aria-expanded={isExpanded}
            aria-controls={`order-items-${orderId}`}
          >
            <Package className="w-4 h-4" />
            <span className="font-medium">
              {orderItems.length} item{orderItems.length !== 1 ? 's' : ''}
            </span>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 ml-auto" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-auto" />
            )}
          </button>

          {/* Expandable Items List */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                id={`order-items-${orderId}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <ul className="mt-3 space-y-2 pl-6">
                  {orderItems.map((item, index) => {
                    const qty = item.quantity || item.qty || 1
                    return (
                      <li key={index} className="text-sm text-stone-600">
                        <span className="font-medium">{qty}x</span> {item.name || 'Item'}
                        {item.notes && (
                          <span className="text-xs text-stone-500 ml-1">
                            ({item.notes})
                          </span>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Amount / Total */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-stone-200">
          <div className="flex flex-col">
            <span className="text-xs text-stone-500 mb-0.5">Order Amount</span>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-stone-600" />
              <span className="text-lg font-bold text-stone-900" data-testid="total-amount">
                ${Number(orderTotal).toFixed(2)}
              </span>
            </div>
          </div>
          {order.margin && (
            <span className="text-xs text-success-600 font-semibold">
              Margin: ${Number(order.margin).toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        {currentStatus.actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {currentStatus.actions.includes('accept') && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleStatusChange(e, 'accepted')}
                className="btn-primary flex-1 text-sm"
                data-testid="accept-button"
              >
                Accept
              </motion.button>
            )}
            {currentStatus.actions.includes('preparing') && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleStatusChange(e, 'preparing')}
                className="btn-accent flex-1 text-sm"
              >
                Start Preparing
              </motion.button>
            )}
            {currentStatus.actions.includes('ready') && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleStatusChange(e, 'ready')}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium flex-1 text-sm transition-colors"
              >
                Mark Ready
              </motion.button>
            )}
            {currentStatus.actions.includes('served') && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleStatusChange(e, 'served')}
                className="bg-success-500 hover:bg-success-600 text-white px-4 py-2 rounded-lg font-medium flex-1 text-sm transition-colors"
              >
                Mark Served
              </motion.button>
            )}
            {currentStatus.actions.includes('cancel') && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleStatusChange(e, 'cancelled')}
                className="btn-ghost text-danger-600 hover:bg-danger-50 text-sm px-3"
              >
                Cancel
              </motion.button>
            )}
          </div>
        )}

        {/* Contact Button - Always visible */}
        {customerMobile && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `tel:${customerMobile}`
            }}
            className="mt-3 w-full btn-ghost text-sm flex items-center justify-center gap-2"
            aria-label={`Call ${customerName}`}
          >
            <Phone className="w-4 h-4" />
            <span>Call Customer</span>
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default OrderCard

