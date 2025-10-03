import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Analytics from './pages/Analytics'
import Customers from './pages/Customers'
import Menu from './pages/Menu'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

/**
 * Main App Component
 * Defines application routes wrapped in the Layout component
 * 
 * Routes:
 * - / : Dashboard (home)
 * - /orders : Order management
 * - /analytics : Business analytics
 * - /customers : Customer management
 * - /menu : Menu management
 * - /notifications : System notifications
 * - /settings : Application settings
 */
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="customers" element={<Customers />} />
        <Route path="menu" element={<Menu />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App

