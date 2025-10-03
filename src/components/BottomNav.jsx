import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Menu
} from 'lucide-react'
import useStore from '../store/useStore'

/**
 * BottomNav Component
 * Mobile bottom navigation bar (tab-like)
 * Only visible on mobile devices (< 1024px)
 */
function BottomNav() {
  const { toggleSidebar } = useStore()

  // Main navigation items for mobile
  const navItems = [
    { path: '/', label: 'Home', icon: LayoutDashboard, end: true },
    { path: '/orders', label: 'Orders', icon: ShoppingCart, badge: 5 },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <nav 
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-elevation-lg z-fixed"
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors min-w-16 min-h-11 relative ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-stone-600 active:bg-stone-100'
              }`
            }
          >
            {/* Icon */}
            <div className="relative">
              <item.icon className="w-5 h-5" />
              {/* Badge indicator */}
              {item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </div>
            {/* Label */}
            <span className="text-xs font-medium">
              {item.label}
            </span>
          </NavLink>
        ))}

        {/* More/Menu button to open sidebar */}
        <button
          onClick={toggleSidebar}
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg text-stone-600 active:bg-stone-100 transition-colors min-w-16 min-h-11"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs font-medium">More</span>
        </button>
      </div>
    </nav>
  )
}

export default BottomNav


