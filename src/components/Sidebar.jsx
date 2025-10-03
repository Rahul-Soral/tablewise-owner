import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  BarChart3, 
  Users,
  UtensilsCrossed,
  Bell,
  Settings,
  ChevronLeft,
  X
} from 'lucide-react'
import useStore from '../store/useStore'

/**
 * Sidebar Navigation Component
 * Collapsible sidebar with organized sections
 * Responsive: Full width on desktop, icon-only on tablet, hidden on mobile (uses bottom nav)
 */
function Sidebar() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useStore()

  // Navigation sections with grouped items
  const navSections = [
    {
      title: 'Main',
      items: [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
        { path: '/orders', label: 'Orders', icon: ShoppingCart, badge: 5 },
      ],
    },
    {
      title: 'Business',
      items: [
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/customers', label: 'Customers', icon: Users },
        { path: '/menu', label: 'Menu', icon: UtensilsCrossed },
      ],
    },
    {
      title: 'System',
      items: [
        { path: '/notifications', label: 'Notifications', icon: Bell, badge: 3 },
        { path: '/settings', label: 'Settings', icon: Settings },
      ],
    },
  ]

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile Overlay - only visible on mobile when sidebar is open */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/50 z-overlay lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - responsive behavior */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -320,
        }}
        className={`
          fixed top-0 left-0 h-full bg-white border-r border-stone-200 z-overlay
          shadow-elevation-lg
          lg:translate-x-0 lg:shadow-none lg:z-sticky
          ${sidebarOpen ? 'w-64' : 'w-64 md:w-20'}
          transition-all duration-300 ease-in-out
        `}
        aria-label="Main navigation"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-stone-200">
          {/* Logo and Title */}
          <AnimatePresence mode="wait">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">OP</span>
                </div>
                <div className="hidden lg:block">
                  <h2 className="text-sm font-semibold text-stone-900">Owner Portal</h2>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close/Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="btn-icon ml-auto"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 lg:hidden" />
            ) : (
              <ChevronLeft className="w-5 h-5 hidden lg:block" />
            )}
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto scrollbar-custom p-4 space-y-6">
          {navSections.map((section, sectionIndex) => (
            <div key={section.title}>
              {/* Section Title - only show when expanded */}
              <AnimatePresence mode="wait">
                {sidebarOpen && (
                  <motion.h3
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="px-3 mb-2 text-xs font-semibold text-stone-500 uppercase tracking-wider"
                  >
                    {section.title}
                  </motion.h3>
                )}
              </AnimatePresence>

              {/* Navigation Items */}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `nav-link group relative ${
                        isActive
                          ? 'nav-link-active'
                          : 'nav-link-inactive'
                      }`
                    }
                  >
                    {/* Icon */}
                    <item.icon className="w-5 h-5 flex-shrink-0" />

                    {/* Label - show when expanded */}
                    <AnimatePresence mode="wait">
                      {sidebarOpen && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-sm"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {/* Badge - show when expanded */}
                    {item.badge && sidebarOpen && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto px-2 py-0.5 bg-accent-500 text-white text-xs font-semibold rounded-full"
                      >
                        {item.badge}
                      </motion.span>
                    )}

                    {/* Tooltip for collapsed state - only show on tablet/desktop when collapsed */}
                    {!sidebarOpen && (
                      <div className="hidden md:block absolute left-full ml-2 px-3 py-2 bg-stone-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-tooltip">
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 px-2 py-0.5 bg-accent-500 text-white text-xs font-semibold rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer - User info when expanded */}
        <AnimatePresence mode="wait">
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 border-t border-stone-200"
            >
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-600 font-semibold text-sm">JD</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">
                    John Doe
                  </p>
                  <p className="text-xs text-stone-500 truncate">
                    Restaurant Owner
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  )
}

export default Sidebar
