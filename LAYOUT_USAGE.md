# Layout Component - Usage Guide

## Overview

The Layout component provides a responsive, accessible navigation structure for the Owner Portal with:
- **Topbar**: Logo, restaurant name, KPIs, and user actions
- **Sidebar**: Collapsible navigation with organized sections
- **Bottom Navigation**: Mobile-friendly tab bar
- **Responsive behavior**: Adapts to mobile, tablet, and desktop

## 🏗️ Architecture

```
Layout
├── Topbar (always visible)
├── Sidebar (responsive)
│   ├── Desktop: Full width with labels
│   ├── Tablet: Icon-only (collapsible)
│   └── Mobile: Hidden (accessible via menu)
└── BottomNav (mobile only, < 1024px)
```

## 📱 Responsive Behavior

### Desktop (>= 1024px)
- Topbar: Full width with KPIs
- Sidebar: Collapsible (256px expanded, 80px collapsed)
- Bottom Nav: Hidden
- Content: Adjusts based on sidebar state

### Tablet (768px - 1023px)
- Topbar: Full width with KPIs
- Sidebar: Icon-only by default (80px)
- Bottom Nav: Visible
- Content: Adjusts based on sidebar state

### Mobile (< 768px)
- Topbar: Simplified (no KPIs)
- Sidebar: Hidden (overlay when opened)
- Bottom Nav: Visible
- Content: Full width with bottom padding

## 🎯 Component Usage

### Basic Setup

```jsx
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        {/* Add more routes */}
      </Route>
    </Routes>
  )
}
```

### Creating New Pages

1. **Create the page component:**

```jsx
// src/pages/MyNewPage.jsx
import { motion } from 'framer-motion'

function MyNewPage() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-stone-900">Page Title</h1>
        <p className="text-stone-600 mt-1">Page description</p>
      </motion.div>

      {/* Page content */}
      <div className="card p-6">
        <p>Your content here</p>
      </div>
    </div>
  )
}

export default MyNewPage
```

2. **Add route to App.jsx:**

```jsx
import MyNewPage from './pages/MyNewPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Existing routes */}
        <Route path="my-new-page" element={<MyNewPage />} />
      </Route>
    </Routes>
  )
}
```

3. **Add navigation link to Sidebar.jsx:**

```jsx
import { MyIcon } from 'lucide-react'

const navSections = [
  {
    title: 'Main',
    items: [
      // Existing items
      { path: '/my-new-page', label: 'My Page', icon: MyIcon },
    ],
  },
]
```

4. **Add to Bottom Nav (if needed):**

```jsx
// src/components/BottomNav.jsx
const navItems = [
  // Existing items
  { path: '/my-new-page', label: 'My Page', icon: MyIcon },
]
```

## 🎨 Topbar Features

### Quick KPIs
The Topbar displays real-time business metrics:

```jsx
const kpis = {
  liveOrders: 12,        // Number of active orders
  revenueToday: 2458.50, // Today's revenue
}
```

**To customize KPIs:**

Edit `src/components/Topbar.jsx`:

```jsx
// Add new KPI
<motion.div className="flex items-center gap-2.5 px-4 py-2 bg-teal-50 border border-teal-200 rounded-lg">
  <div className="p-2 bg-teal-500 rounded-md">
    <MyIcon className="w-4 h-4 text-white" />
  </div>
  <div>
    <p className="text-xs font-medium text-stone-600">My Metric</p>
    <p className="text-lg font-bold text-teal-600">{value}</p>
  </div>
</motion.div>
```

### Restaurant Name/Logo
Update in `src/components/Topbar.jsx`:

```jsx
{/* Replace placeholder logo */}
<img src="/logo.png" alt="Logo" className="w-10 h-10" />

{/* Update restaurant name */}
<h1 className="text-lg font-semibold text-stone-900">
  Your Restaurant Name
</h1>
```

## 🗂️ Sidebar Sections

The sidebar is organized into sections:

```jsx
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
```

### Navigation Item Properties

- `path`: Route path (string)
- `label`: Display text (string)
- `icon`: Lucide React icon component
- `end`: Exact route match (boolean, optional)
- `badge`: Notification count (number, optional)

## ♿ Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate links and buttons
- Escape to close sidebar (mobile)

### Screen Readers
- Proper ARIA labels on all interactive elements
- Semantic HTML structure
- Skip to content link (if needed)

### Focus Management
- Visible focus indicators on all interactive elements
- Focus trap in mobile sidebar overlay
- Logical tab order

### Color Contrast
All text meets WCAG AA standards:
- Primary text: 4.5:1 minimum contrast
- UI elements: 3:1 minimum contrast

### Touch Targets
All interactive elements meet 44px × 44px minimum:

```css
/* In globals.css */
.btn-icon {
  min-height: var(--min-tap-target);
  min-width: var(--min-tap-target);
}
```

## 🎛️ State Management

The Layout uses Zustand for sidebar state:

```jsx
// src/store/useStore.js
const useStore = create((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ 
    sidebarOpen: !state.sidebarOpen 
  })),
  setSidebarOpen: (isOpen) => set({ sidebarOpen: isOpen }),
}))
```

**Usage in components:**

```jsx
import useStore from '../store/useStore'

function MyComponent() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen } = useStore()
  
  return (
    <button onClick={toggleSidebar}>
      Toggle Sidebar
    </button>
  )
}
```

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: {
    500: '#YOUR_COLOR',
    600: '#YOUR_DARKER_COLOR',
  }
}
```

### Change Sidebar Width

Edit CSS variables in `src/styles/globals.css`:

```css
:root {
  --sidebar-width: 256px;           /* Expanded width */
  --sidebar-collapsed-width: 80px;  /* Collapsed width */
}
```

### Change Topbar Height

```css
:root {
  --topbar-height: 64px;
}
```

### Change Bottom Nav Height

```css
:root {
  --bottom-nav-height: 64px;
}
```

## 🔧 Advanced Usage

### Nested Layouts

For authenticated vs. public layouts:

```jsx
function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes with Layout */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* More routes */}
        </Route>
      </Route>
    </Routes>
  )
}
```

### Custom Content Width

```jsx
function MyPage() {
  return (
    {/* Override default container */}
    <div className="max-w-full px-0">
      <div className="w-full">
        Full width content
      </div>
    </div>
  )
}
```

### Fixed Sidebar State

To disable sidebar collapsing:

```jsx
// In Layout.jsx
<main className="flex-1 overflow-y-auto lg:ml-64">
  {/* Content always assumes expanded sidebar */}
</main>
```

## 🐛 Troubleshooting

### Sidebar Not Toggling

Check Zustand store is imported correctly:
```jsx
import useStore from '../store/useStore'
```

### Bottom Nav Overlapping Content

Ensure main content has bottom padding:
```jsx
<main className="pb-20 lg:pb-0">
  {/* Content */}
</main>
```

### Layout Shifts

Use fixed heights and transitions:
```css
.sidebar {
  transition: width 300ms ease-in-out;
}
```

## 📚 Related Files

- `src/components/Layout.jsx` - Main layout wrapper
- `src/components/Topbar.jsx` - Top navigation bar
- `src/components/Sidebar.jsx` - Side navigation
- `src/components/BottomNav.jsx` - Mobile bottom navigation
- `src/store/useStore.js` - Zustand state management
- `src/styles/globals.css` - Global styles and CSS variables
- `src/styles/designTokens.js` - Design system tokens

---

**Need help?** Check TODO comments in component files for implementation guidance.


