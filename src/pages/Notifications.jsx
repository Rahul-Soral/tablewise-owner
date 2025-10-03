import { motion } from 'framer-motion'
import { Bell, CheckCheck } from 'lucide-react'

/**
 * Notifications Page
 * View and manage system notifications
 */
function Notifications() {
  // TODO: Fetch real notifications from API
  const notifications = [
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #1234 has been placed by John Doe',
      time: '5 minutes ago',
      read: false,
      type: 'order'
    },
    {
      id: 2,
      title: 'Payment Received',
      message: 'Payment of $125.50 received for Order #1233',
      time: '15 minutes ago',
      read: false,
      type: 'payment'
    },
    {
      id: 3,
      title: 'Order Completed',
      message: 'Order #1232 has been marked as completed',
      time: '1 hour ago',
      read: true,
      type: 'order'
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Notifications</h1>
          <p className="text-stone-600 mt-1">Stay updated with your business activities</p>
        </div>
        
        <button className="btn-secondary flex items-center gap-2">
          <CheckCheck className="w-4 h-4" />
          Mark All Read
        </button>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-3"
      >
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className={`card p-4 hover:shadow-elevation-md transition-shadow cursor-pointer ${
              !notification.read ? 'border-l-4 border-l-primary-500' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-lg ${
                notification.type === 'order' ? 'bg-accent-100' : 'bg-success-100'
              }`}>
                <Bell className={`w-5 h-5 ${
                  notification.type === 'order' ? 'text-accent-600' : 'text-success-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-stone-900">{notification.title}</h3>
                <p className="text-sm text-stone-600 mt-1">{notification.message}</p>
                <p className="text-xs text-stone-500 mt-2">{notification.time}</p>
              </div>
              {!notification.read && (
                <span className="w-2.5 h-2.5 bg-primary-500 rounded-full flex-shrink-0 mt-2" />
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default Notifications


