# Owner Portal - Restaurant Order Management System

A production-ready React web application for restaurant owners to manage orders in real-time, built with Vite, React 18, Tailwind CSS, and integrated with Google Apps Script backend.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser at http://localhost:3000
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

## 📡 Live API Integration

✅ **FULLY INTEGRATED** - This app now connects to live Google Apps Script endpoints for all data operations.

### API Endpoint

**Base URL:** `https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec`

All actions use this single endpoint with different query parameters:

```bash
# GET orders (polls every 10 seconds)
?action=getOrders&limit=100

# POST/GET update status (with JSONP fallback)
?action=update_status&order_id=...&status=...

# GET analytics (polls every 30 seconds)
?action=getAnalytics

# GET customers
?action=getCustomers

# GET single order
?action=getOrder&order_id=...

# Ping API status
?action=ping
```

**📖 See [LIVE_API_INTEGRATION.md](./LIVE_API_INTEGRATION.md) for complete documentation.**

### Key Features

✅ **No Mock Data** - All sample/hardcoded data removed  
✅ **Real-Time Polling** - Orders: 10s, Analytics: 30s  
✅ **CORS/JSONP Fallback** - Automatic fallback for blocked requests  
✅ **Offline Mode** - LocalStorage caching with offline indicators  
✅ **Optimistic UI** - Instant updates with automatic rollback  
✅ **Last Updated Timestamp** - Shows HH:MM:SS for all data  
✅ **Test/Debug Tools** - Built-in API testing in Settings page  
✅ **Error Handling** - Graceful degradation and toast notifications

### Quick Testing

**Test the API connection:**
1. Start the development server: `npm run dev`
2. Navigate to **Settings** page
3. Click **"Test Fetch Orders"** button
4. View raw JSON response and request duration

**Or use browser console:**
```javascript
fetch('https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec?action=getOrders&limit=5')
  .then(r => r.json())
  .then(console.log)
```

## ✅ Acceptance Tests / Manual Checklist

### Critical Path Tests

#### 1. Order Display (< 10 seconds)
- [ ] Place test order in Google Sheet
- [ ] Within 10 seconds, order appears in Owner Portal
- [ ] Order shows correct: ID, customer, items, total, status, timestamp
- [ ] "Last updated: HH:MM:SS" displays near top
- [ ] Empty state shows "No orders yet" with spinner when loading

#### 2. Status Update (< 2 seconds)
- [ ] Click "Accept" on pending order
- [ ] UI updates immediately (optimistic update)
- [ ] Within 2 seconds, Google Sheet reflects new status
- [ ] If API fails, UI rolls back to previous status
- [ ] Toast notification shows success/error
- [ ] POST → GET → JSONP fallback chain works

#### 3. Real-Time Polling
- [ ] Add new order while app is open
- [ ] Order appears within 10 seconds without refresh
- [ ] Switch to another tab, add order
- [ ] Switch back, order appears within 10 seconds
- [ ] No polling occurs while tab is hidden
- [ ] "Last updated" timestamp updates with each poll

#### 4. Analytics (30-second polling)
- [ ] Navigate to Analytics page
- [ ] Data fetches from API (not client-side computation)
- [ ] Shows: total_orders, total_revenue, avg_ticket, top_items
- [ ] Top 5 items chart displays with Recharts
- [ ] Click refresh, data updates within 2 seconds
- [ ] "Last updated" timestamp displays
- [ ] Auto-refreshes every 30 seconds

#### 5. Offline Mode
- [ ] Disconnect from internet
- [ ] App shows "Offline" indicator
- [ ] Previously loaded orders still visible
- [ ] Status update attempts show error
- [ ] Reconnect - polling resumes automatically

### Feature Tests

#### Orders Page
- [ ] Filter by status works
- [ ] Search by order ID/customer works
- [ ] Sort by newest/oldest works
- [ ] Time filter (today/24h) works
- [ ] Click order opens detail panel
- [ ] Expandable items list works
- [ ] All action buttons functional

#### Analytics Page
- [ ] Day/Week/Month toggle works
- [ ] Top 5 items chart displays
- [ ] Hourly distribution shows data
- [ ] Action card shows recommendation
- [ ] Export CSV downloads file
- [ ] KPIs calculate correctly

#### Settings Page
- [ ] View active API endpoints (shows hardcoded URLs)
- [ ] Toggle proxy mode
- [ ] Adjust polling interval
- [ ] Save settings persists on reload
- [ ] **Test Fetch** button works
- [ ] Raw JSON response displays (first 5 orders)
- [ ] Shows request duration in milliseconds
- [ ] Success/error indicators display correctly

#### Customers Page
- [ ] Fetches from ?action=getCustomers
- [ ] Displays customer cards with name, phone, email, address
- [ ] Shows total orders and total spent
- [ ] Search by name/email/phone works
- [ ] Sort by name/orders/revenue works
- [ ] "Repeat Customer" badge shows for repeat customers
- [ ] Empty state shows "No customers found"
- [ ] Refresh button works

## 🚢 Deployment

### Recommended: Vercel

#### Option 1: GitHub Integration (Recommended)

1. Push code to GitHub
2. Import in Vercel dashboard
3. Configure environment variables
4. Deploy

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add VITE_GET_ORDERS_URL
vercel env add VITE_UPDATE_STATUS_URL
vercel env add VITE_WEBHOOK_URL
vercel env add VITE_ANALYTICS_URL

# Deploy to production
vercel --prod
```

#### Build Settings for Vercel

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x
```

#### Environment Variables

Add in Vercel dashboard:
- `VITE_GET_ORDERS_URL`
- `VITE_UPDATE_STATUS_URL`
- `VITE_WEBHOOK_URL`
- `VITE_ANALYTICS_URL`
- `VITE_POLLING_INTERVAL` (optional, default: 3000)
- `VITE_USE_PROXY` (optional, default: false)

### Alternative: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### Build Settings for Netlify

```
Build command: npm run build
Publish directory: dist
```

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## ♿ Accessibility Checklist

### Keyboard Navigation
- [ ] Tab through all interactive elements in logical order
- [ ] Enter/Space activates buttons and links
- [ ] Escape closes modals and slide-overs
- [ ] Arrow keys navigate within lists (optional)
- [ ] Focus visible on all interactive elements
- [ ] No keyboard traps

### Screen Readers
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] ARIA labels on icon buttons
- [ ] ARIA roles on dialogs (role="dialog", aria-modal="true")
- [ ] ARIA live regions for dynamic updates
- [ ] Semantic HTML (header, nav, main, article)

### Visual Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Interactive elements minimum 44×44px tap target
- [ ] Focus indicators have 3:1 contrast
- [ ] Text resizable to 200% without loss of functionality
- [ ] No reliance on color alone for information
- [ ] Animations respect prefers-reduced-motion

### Testing Tools
```bash
# Install accessibility testing tools
npm install -D @axe-core/react eslint-plugin-jsx-a11y

# Run accessibility linter
npm run lint
```

## ⚡ Performance Checklist

### Initial Load (Target: < 1s on mobile)
- [ ] First Contentful Paint < 1.0s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1

### Optimizations Implemented
✅ Code splitting (React.lazy for charts)
✅ Tree shaking (Vite default)
✅ Minification and compression
✅ CSS purging (Tailwind)
✅ Image optimization (lazy loading)
✅ Memoization (React.useMemo)
✅ Efficient re-renders (useCallback)

### Testing Performance

```bash
# Build production
npm run build

# Analyze bundle
npm run build -- --analyze

# Preview production locally
npm run preview

# Use Lighthouse in Chrome DevTools
# Target: 90+ performance score
```

### Lazy Loading Heavy Charts

Charts are loaded dynamically:

```javascript
// Already implemented in Analytics.jsx
const TopItemsChart = lazy(() => import('../components/TopItemsChart'))
const HourlyChart = lazy(() => import('../components/HourlyChart'))
```

### Caching Strategy
- Orders cached in localStorage (5-minute TTL)
- Polling pauses when tab hidden
- Optimistic UI updates (no wait for API)
- JSONP fallback for CORS issues

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

#### Test Stubs Created

**`src/utils/insights.test.js`**
```javascript
import { describe, it, expect } from 'vitest'
import { calculateRevenue, getTopSellingItems } from './insights'

describe('Insights Utilities', () => {
  it('calculates revenue for day', () => {
    const orders = [
      { total: 100, createdAt: new Date().toISOString(), status: 'served' }
    ]
    const revenue = calculateRevenue(orders, 'day')
    expect(revenue).toBe(100)
  })

  it('returns top selling items', () => {
    const orders = [
      { 
        items: [{ name: 'Pizza', quantity: 5, price: 10 }],
        status: 'served' 
      }
    ]
    const topItems = getTopSellingItems(orders, 5)
    expect(topItems[0].name).toBe('Pizza')
    expect(topItems[0].quantity).toBe(5)
  })
})
```

**`src/config/api.test.js`**
```javascript
import { describe, it, expect, vi } from 'vitest'
import { fetchOrders, updateOrderStatus } from './api'

describe('API Functions', () => {
  it('fetches orders successfully', async () => {
    // Mock axios
    const mockOrders = [{ id: '1', status: 'pending' }]
    vi.mock('axios')
    
    const orders = await fetchOrders()
    expect(Array.isArray(orders)).toBe(true)
  })

  it('handles fetch errors with cache fallback', async () => {
    // Test offline fallback
  })

  it('updates order status with correct payload', async () => {
    const result = await updateOrderStatus('ORD-001', 'accepted')
    expect(result).toBeDefined()
  })
})
```

### Integration Tests (Cypress)

```bash
# Install Cypress
npm install -D cypress

# Open Cypress
npm run cypress:open

# Run Cypress tests
npm run cypress:run
```

#### E2E Test Plan

**`cypress/e2e/order-flow.cy.js`**

```javascript
describe('Complete Order Flow', () => {
  it('places order → appears in owner app → status changes', () => {
    // 1. Place order via webhook
    cy.request('POST', Cypress.env('WEBHOOK_URL'), {
      customer_name: 'Test Customer',
      items: [{ name: 'Test Item', quantity: 1, price: 10 }],
      total: 10
    })

    // 2. Visit owner app
    cy.visit('/')

    // 3. Verify order appears within 3 seconds
    cy.get('[data-testid="order-card"]', { timeout: 3000 })
      .should('contain', 'Test Customer')

    // 4. Click Accept button
    cy.get('[data-testid="accept-button"]').first().click()

    // 5. Verify optimistic update
    cy.get('[data-testid="status-chip"]')
      .should('contain', 'Accepted')

    // 6. Verify toast notification
    cy.get('[role="alert"]')
      .should('contain', 'Update successful')

    // 7. Check Google Sheet (via API)
    cy.request('GET', Cypress.env('GET_ORDERS_URL'))
      .its('body.orders')
      .should('deep.include', {
        status: 'accepted'
      })
  })

  it('handles offline mode gracefully', () => {
    // Load page
    cy.visit('/')

    // Go offline
    cy.window().then(win => {
      win.dispatchEvent(new Event('offline'))
    })

    // Verify offline indicator
    cy.get('[data-testid="offline-indicator"]')
      .should('be.visible')

    // Verify cached orders still visible
    cy.get('[data-testid="order-card"]')
      .should('have.length.greaterThan', 0)
  })

  it('polls for new orders automatically', () => {
    cy.visit('/')
    
    // Get initial order count
    cy.get('[data-testid="order-card"]').then($cards => {
      const initialCount = $cards.length

      // Add order via API
      cy.request('POST', Cypress.env('WEBHOOK_URL'), {
        customer_name: 'New Order',
        items: [],
        total: 50
      })

      // Wait 4 seconds (polling interval + buffer)
      cy.wait(4000)

      // Verify new order appears
      cy.get('[data-testid="order-card"]')
        .should('have.length', initialCount + 1)
    })
  })
})
```

## 📁 Project Structure

```
owner-portal/
├── src/
│   ├── components/          # 20+ reusable components
│   │   ├── Toast.jsx        # Notification system
│   │   ├── Modal.jsx        # Accessible modals
│   │   ├── OrderCard.jsx    # Order display
│   │   └── ...
│   ├── pages/              # 8 page components
│   │   ├── Orders.jsx      # Primary order management
│   │   ├── Analytics.jsx   # Business insights
│   │   ├── Settings.jsx    # App configuration
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useOrderPolling.js     # Smart polling
│   │   ├── useOptimisticUpdate.js # Optimistic UI
│   │   └── useTimer.js            # Live timers
│   ├── utils/              # Utility functions
│   │   ├── insights.js     # Analytics computations
│   │   └── export.js       # CSV export
│   ├── config/             # Configuration
│   │   ├── api.js          # ⭐ API endpoints & requests
│   │   └── mockData.js     # Development data
│   ├── store/              # State management
│   │   └── useStore.js     # Zustand store
│   └── styles/             # Design system
│       ├── designTokens.js
│       └── globals.css
├── public/                 # Static assets
├── cypress/                # E2E tests
├── tests/                  # Unit tests
├── .env                    # ⭐ Environment variables
├── .env.example            # Environment template
└── README.md               # This file
```

## 🔑 Environment Variables

Create `.env` file:

```env
# Apps Script Endpoints (REQUIRED)
VITE_GET_ORDERS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getOrders&limit=100
VITE_UPDATE_STATUS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
VITE_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
VITE_ANALYTICS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=getAnalytics

# Optional Configuration
VITE_POLLING_INTERVAL=3000
VITE_USE_PROXY=false
VITE_PROXY_URL=
VITE_ENV=production
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run unit tests
npm run test:coverage # Run tests with coverage
npm run cypress:open  # Open Cypress UI
npm run cypress:run   # Run Cypress tests
```

## 🐛 Troubleshooting

### Orders not appearing
1. Check `.env` file has correct URLs
2. Verify Apps Script is deployed and public
3. Check browser console for CORS errors
4. Try JSONP fallback (automatic)

### Status updates not saving
1. Verify UPDATE_STATUS_URL is correct
2. Check payload format: `{ action: "update_status", order_id: "...", status: "..." }`
3. Review Apps Script logs
4. Check for toast error messages

### Performance issues
1. Increase polling interval in Settings
2. Reduce number of orders with `limit` parameter
3. Enable proxy mode to cache requests
4. Check Network tab for slow requests

## 📞 Support

For issues or questions:
1. Check TODO comments in code
2. Review documentation files
3. Check Apps Script execution logs
4. Verify environment variables

## 📄 License

Proprietary - All rights reserved

---

**Built with React + Vite + Tailwind CSS + Apps Script** 🚀
