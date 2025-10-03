# Owner Portal - Example Usage

This document provides practical examples of using the Layout component and design system.

## 📋 Layout Component - Complete Example

### App.jsx - Route Setup

```jsx
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
 * All routes are wrapped in the Layout component
 * Layout provides Topbar, Sidebar, and BottomNav
 */
function App() {
  return (
    <Routes>
      {/* All authenticated routes use Layout */}
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
```

### With Authentication

```jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
// ... other imports

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const isAuthenticated = useAuth() // Your auth logic
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes with Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        {/* More routes */}
      </Route>
    </Routes>
  )
}

export default App
```

## 🎨 Design System Examples

### 1. Creating a New Page with Design System

```jsx
import { motion } from 'framer-motion'
import { ShoppingBag, Plus, Search } from 'lucide-react'

function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-stone-900">Products</h1>
          <p className="text-stone-600 mt-1">Manage your product catalog</p>
        </div>
        
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card-elevated p-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            type="search"
            placeholder="Search products..."
            className="input pl-10"
          />
        </div>
      </motion.div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((item, index) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="card-elevated p-6 hover:shadow-elevation-xl transition-shadow"
          >
            <div className="aspect-square bg-stone-100 rounded-lg mb-4"></div>
            <h3 className="text-lg font-semibold text-stone-900">Product {item}</h3>
            <p className="text-stone-600 text-sm mt-1">Product description</p>
            <div className="flex items-center justify-between mt-4">
              <span className="text-xl font-bold text-primary-600">$29.99</span>
              <button className="btn-accent text-sm">
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default ProductsPage
```

### 2. Using All Button Variants

```jsx
function ButtonExamples() {
  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <button className="btn-primary">
        Primary Button
      </button>

      {/* Secondary Actions */}
      <button className="btn-secondary">
        Secondary Button
      </button>

      {/* Accent/CTA */}
      <button className="btn-accent">
        Call to Action
      </button>

      {/* Ghost/Subtle */}
      <button className="btn-ghost">
        Ghost Button
      </button>

      {/* Icon Button */}
      <button className="btn-icon" aria-label="Settings">
        <Settings className="w-5 h-5" />
      </button>

      {/* With Icon and Text */}
      <button className="btn-primary flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Add Item
      </button>

      {/* Disabled State */}
      <button className="btn-primary" disabled>
        Disabled Button
      </button>
    </div>
  )
}
```

### 3. Using Cards

```jsx
function CardExamples() {
  return (
    <div className="space-y-6">
      {/* Basic Card */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-stone-900">Basic Card</h2>
        <p className="text-stone-600 mt-2">
          This is a basic card with subtle shadow.
        </p>
      </div>

      {/* Elevated Card */}
      <div className="card-elevated p-6">
        <h2 className="text-xl font-semibold text-stone-900">Elevated Card</h2>
        <p className="text-stone-600 mt-2">
          This card has more prominent shadow for emphasis.
        </p>
      </div>

      {/* Interactive Card */}
      <div className="card-elevated p-6 hover:shadow-elevation-xl transition-shadow cursor-pointer">
        <h2 className="text-xl font-semibold text-stone-900">Clickable Card</h2>
        <p className="text-stone-600 mt-2">
          This card changes shadow on hover.
        </p>
      </div>

      {/* Card with Header and Footer */}
      <div className="card-elevated overflow-hidden">
        <div className="p-6 border-b border-stone-200">
          <h2 className="text-xl font-semibold text-stone-900">Card Header</h2>
        </div>
        <div className="p-6">
          <p className="text-stone-600">Card content goes here</p>
        </div>
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end gap-2">
          <button className="btn-ghost">Cancel</button>
          <button className="btn-primary">Save</button>
        </div>
      </div>
    </div>
  )
}
```

### 4. Using Badges

```jsx
import { Check, X, Clock, AlertTriangle } from 'lucide-react'

function BadgeExamples() {
  return (
    <div className="flex flex-wrap gap-3">
      {/* Status Badges */}
      <span className="badge-success flex items-center gap-1">
        <Check className="w-3 h-3" />
        Completed
      </span>

      <span className="badge-danger flex items-center gap-1">
        <X className="w-3 h-3" />
        Failed
      </span>

      <span className="badge-warning flex items-center gap-1">
        <Clock className="w-3 h-3" />
        Pending
      </span>

      <span className="badge-primary flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        Info
      </span>

      <span className="badge-accent">
        New
      </span>

      {/* Count Badge */}
      <span className="badge-danger">
        5
      </span>
    </div>
  )
}
```

### 5. Using Form Inputs

```jsx
function FormExample() {
  return (
    <form className="space-y-6 max-w-lg">
      {/* Text Input */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Business Name
        </label>
        <input
          type="text"
          className="input"
          placeholder="Enter business name"
        />
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          className="input"
          placeholder="email@example.com"
        />
      </div>

      {/* Textarea */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Description
        </label>
        <textarea
          className="input"
          rows="4"
          placeholder="Enter description"
        />
      </div>

      {/* Select */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Category
        </label>
        <select className="input">
          <option>Select category</option>
          <option>Food</option>
          <option>Beverages</option>
          <option>Desserts</option>
        </select>
      </div>

      {/* Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="terms"
          className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
        />
        <label htmlFor="terms" className="text-sm text-stone-700">
          I agree to the terms and conditions
        </label>
      </div>

      {/* Submit Button */}
      <button type="submit" className="btn-primary w-full">
        Submit Form
      </button>
    </form>
  )
}
```

### 6. Using Color Classes

```jsx
function ColorExamples() {
  return (
    <div className="space-y-4">
      {/* Background Colors */}
      <div className="p-4 bg-primary-100 text-primary-700 rounded-lg">
        Primary background
      </div>
      
      <div className="p-4 bg-success-100 text-success-700 rounded-lg">
        Success background
      </div>
      
      <div className="p-4 bg-warning-100 text-warning-700 rounded-lg">
        Warning background
      </div>
      
      <div className="p-4 bg-danger-100 text-danger-700 rounded-lg">
        Danger background
      </div>
      
      <div className="p-4 bg-accent-100 text-accent-700 rounded-lg">
        Accent background
      </div>

      {/* Text Colors */}
      <div className="space-y-2">
        <p className="text-stone-900">Primary text (almost black)</p>
        <p className="text-stone-600">Secondary text (medium gray)</p>
        <p className="text-stone-500">Tertiary text (light gray)</p>
        <p className="text-stone-400">Disabled text (very light)</p>
      </div>

      {/* Border Colors */}
      <div className="space-y-2">
        <div className="p-4 border border-stone-200 rounded-lg">
          Light border
        </div>
        <div className="p-4 border-2 border-primary-500 rounded-lg">
          Primary border
        </div>
      </div>
    </div>
  )
}
```

### 7. Responsive Grid Layout

```jsx
function ResponsiveGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <div key={item} className="card-elevated p-6">
          <h3 className="text-lg font-semibold text-stone-900">Item {item}</h3>
          <p className="text-stone-600 mt-2">Description</p>
        </div>
      ))}
    </div>
  )
}
```

### 8. Loading States

```jsx
function LoadingExamples() {
  return (
    <div className="space-y-6">
      {/* Spinner */}
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
      </div>

      {/* Skeleton Card */}
      <div className="card-elevated p-6 animate-pulse">
        <div className="h-4 bg-stone-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-stone-200 rounded w-1/2"></div>
      </div>

      {/* Loading Button */}
      <button className="btn-primary flex items-center gap-2" disabled>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
        Loading...
      </button>
    </div>
  )
}
```

### 9. Notification/Toast Component

```jsx
import { Check, X, AlertTriangle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function NotificationToast({ type, message, onClose }) {
  const styles = {
    success: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-danger-50 border-danger-200 text-danger-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-primary-50 border-primary-200 text-primary-800',
  }

  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center gap-3 p-4 border rounded-lg ${styles[type]}`}
    >
      {icons[type]}
      <p className="flex-1 font-medium">{message}</p>
      <button onClick={onClose} className="btn-icon">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  )
}
```

### 10. Modal Component

```jsx
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-overlay"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-modal p-4"
          >
            <div className="card-elevated max-w-lg w-full max-h-[90vh] overflow-auto">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-stone-200">
                <h2 className="text-2xl font-bold text-stone-900">{title}</h2>
                <button onClick={onClose} className="btn-icon">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {children}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-stone-200 bg-stone-50">
                <button onClick={onClose} className="btn-ghost">
                  Cancel
                </button>
                <button className="btn-primary">
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

## 🚀 Quick Reference

### Common Patterns

```jsx
// Page header
<div className="flex justify-between items-center">
  <div>
    <h1 className="text-3xl font-bold text-stone-900">Page Title</h1>
    <p className="text-stone-600 mt-1">Description</p>
  </div>
  <button className="btn-primary">Action</button>
</div>

// Section
<div className="space-y-6">
  <h2 className="text-2xl font-bold text-stone-900">Section Title</h2>
  {/* content */}
</div>

// Stat Grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* stat cards */}
</div>

// Two Column Layout
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* columns */}
</div>
```

---

**All examples use the design system tokens and follow accessibility best practices!** 🎨✨


