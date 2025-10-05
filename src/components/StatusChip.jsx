import { motion } from 'framer-motion'

/**
 * StatusChip Component
 * Displays order status with color coding
 * 
 * @param {string} status - Order status (pending, accepted, preparing, ready, served, cancelled)
 * @param {string} size - Size variant (sm, md, lg) - default: md
 * @param {function} onChange - Optional callback when status is clicked (for editable chips)
 * @param {boolean} editable - Whether the chip is editable
 * 
 * @example
 * <StatusChip status="pending" />
 * <StatusChip status="preparing" size="lg" />
 * <StatusChip status="ready" editable onChange={(newStatus) => handleChange(newStatus)} />
 */
function StatusChip({ status, size = 'md', onChange, editable = false }) {
  const statusConfig = {
    pending: { 
      label: 'Pending', 
      color: 'bg-warning-100 text-warning-700 border-warning-200',
    },
    accepted: { 
      label: 'Accepted', 
      color: 'bg-primary-100 text-primary-700 border-primary-200',
    },
    preparing: { 
      label: 'Preparing', 
      color: 'bg-accent-100 text-accent-700 border-accent-200',
    },
    ready: { 
      label: 'Ready', 
      color: 'bg-teal-100 text-teal-700 border-teal-200',
    },
    served: { 
      label: 'Served', 
      color: 'bg-success-100 text-success-700 border-success-200',
    },
    cancelled: { 
      label: 'Cancelled', 
      color: 'bg-danger-100 text-danger-700 border-danger-200',
    },
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  }

  const config = statusConfig[status] || statusConfig.pending
  const sizeClass = sizeClasses[size] || sizeClasses.md

  const chipContent = (
    <span 
      className={`inline-flex items-center justify-center rounded-lg font-semibold border ${config.color} ${sizeClass} ${
        editable ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      }`}
      role={editable ? 'button' : 'status'}
      aria-label={`Status: ${config.label}`}
      onClick={editable ? onChange : undefined}
      tabIndex={editable ? 0 : undefined}
    >
      {config.label}
    </span>
  )

  if (editable) {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {chipContent}
      </motion.div>
    )
  }

  return chipContent
}

export default StatusChip



