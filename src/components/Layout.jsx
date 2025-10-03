import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import useStore from '../store/useStore'

/**
 * Main Layout Component
 * Provides consistent layout structure with topbar, sidebar, and bottom nav
 * 
 * Responsive Behavior:
 * - Desktop (>= 1024px): Topbar + Sidebar (collapsible)
 * - Tablet (768px - 1023px): Topbar + Sidebar (icon-only by default)
 * - Mobile (< 768px): Topbar + Bottom Nav (sidebar hidden, accessible via menu)
 */
function Layout() {
  const sidebarOpen = useStore((state) => state.sidebarOpen)

  return (
    <div className="flex flex-col h-screen bg-stone-50 overflow-hidden">
      {/* Topbar - Fixed at top */}
      <Topbar />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Hidden on mobile, icon-only on tablet, full on desktop */}
        <Sidebar />
        
        {/* Main Content Area */}
        <main 
          className={`
            flex-1 overflow-y-auto scrollbar-custom
            transition-all duration-300 ease-in-out
            pb-20 lg:pb-0
            ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
          `}
        >
          {/* Content wrapper with padding */}
          <div className="container mx-auto p-4 md:p-6 lg:p-8 max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Bottom Navigation - Only visible on mobile */}
      <BottomNav />
    </div>
  )
}

export default Layout
