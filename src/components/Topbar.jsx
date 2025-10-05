import { Menu, Bell, User, DollarSign, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'
import useStore from '../store/useStore'

/**
 * Topbar Component
 * Top navigation bar with logo, restaurant name, KPIs, and user actions
 * Includes quick metrics: live orders count and revenue today
 */
function Topbar() {
  const { toggleSidebar, user } = useStore()
  
  // TODO: Fetch real-time KPIs from API
  const kpis = {
    liveOrders: 12,
    revenueToday: 2458.50,
  }

  return (
    <header className="bg-white border-b border-stone-200 shadow-elevation-sm sticky top-0 z-fixed">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Left section: Menu toggle + Logo + Restaurant name */}
        <div className="flex items-center gap-4">
          {/* Mobile menu toggle - visible on tablet and below */}
          <button
            onClick={toggleSidebar}
            className="btn-icon lg:hidden"
            aria-label="Toggle menu"
            aria-expanded="false"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo and Restaurant Name */}
          <div className="flex items-center gap-3">
            {/* Logo placeholder - TODO: Replace with actual logo */}
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">OP</span>
            </div>
            
            {/* Restaurant name - hidden on mobile */}
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-stone-900">
                {/* TODO: Replace with dynamic restaurant name from store/API */}
                Owner Portal
              </h1>
              <p className="text-xs text-stone-500 -mt-0.5">Dashboard</p>
            </div>
          </div>
        </div>

        {/* Center section: Quick KPIs - hidden on mobile */}
        <div className="hidden md:flex items-center gap-6">
          {/* Live Orders Count */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2.5 px-4 py-2 bg-accent-50 border border-accent-200 rounded-lg"
          >
            <div className="p-2 bg-accent-500 rounded-md">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-600">Live Orders</p>
              <p className="text-lg font-bold text-accent-600">
                {kpis.liveOrders}
              </p>
            </div>
          </motion.div>

          {/* Revenue Today */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2.5 px-4 py-2 bg-success-50 border border-success-200 rounded-lg"
          >
            <div className="p-2 bg-success-500 rounded-md">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-xs font-medium text-stone-600">Today's Revenue</p>
              <p className="text-lg font-bold text-success-600">
                ${kpis.revenueToday.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right section: Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button
            className="btn-icon relative"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-stone-600" />
            {/* Notification badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white" />
          </button>

          {/* User Profile */}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-100 active:bg-stone-200 transition-colors min-h-11"
            aria-label="User profile menu"
          >
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary-600" />
            </div>
            {/* User name - hidden on mobile */}
            <span className="hidden lg:block text-sm font-medium text-stone-700">
              {user?.name || 'Owner'}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Topbar



