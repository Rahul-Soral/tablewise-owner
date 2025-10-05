
# Reusable Components & API Integration Guide

## 📦 Reusable Components

All components are fully accessible, documented, and include usage examples.

### Component List

1. **StatusChip** - Color-coded order status
2. **Badge** - General-purpose badge
3. **IconButton** - Icon-only button with animations
4. **Modal** - Accessible modal dialog
5. **SlideOver** - Right-side panel
6. **DataTable** - Responsive table (switches to cards on mobile)
7. **Pagination** - Page navigation
8. **SearchBar** - Search input with clear button
9. **DateRangePicker** - Date range selector
10. **SmallSparkline** - Inline trend chart
11. **LoadingSkeleton** - Loading placeholder
12. **Toast System** - Global notifications

### OrderCard (Already Created)
Located in `src/components/OrderCard.jsx` - Fully featured order display card.

---

## 🎨 Component Usage Examples

### StatusChip
```jsx
import StatusChip from '../components/StatusChip'

<StatusChip status="pending" />
<StatusChip status="preparing" size="lg" />
<StatusChip 
  status="ready" 
  editable 
  onChange={(newStatus) => handleChange(newStatus)} 
/>
```

### Badge
```jsx
import Badge from '../components/Badge'
import { CheckIcon } from 'lucide-react'

<Badge variant="primary">New</Badge>
<Badge variant="success" icon={<CheckIcon />}>Verified</Badge>
<Badge variant="danger" pill>3</Badge>
```

### IconButton
```jsx
import IconButton from '../components/IconButton'
import { Trash } from 'lucide-react'

<IconButton 
  icon={<Trash />} 
  onClick={handleDelete}
  ariaLabel="Delete item"
  variant="danger"
/>
```

### Modal
```jsx
import Modal from '../components/Modal'

<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Action"
  footer={
    <>
      <button onClick={handleClose} className="btn-secondary">
        Cancel
      </button>
      <button onClick={handleConfirm} className="btn-primary">
        Confirm
      </button>
    </>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

### SlideOver
```jsx
import SlideOver from '../components/SlideOver'

<SlideOver
  isOpen={isOpen}
  onClose={handleClose}
  title="Order Details"
  size="lg"
>
  <OrderDetailContent order={selectedOrder} />
</SlideOver>
```

### DataTable
```jsx
import DataTable from '../components/DataTable'

const columns = [
  { key: 'id', label: 'ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { 
    key: 'status', 
    label: 'Status',
    render: (row) => <StatusChip status={row.status} />
  }
]

<DataTable
  data={orders}
  columns={columns}
  onRowClick={(row) => handleSelect(row)}
  loading={isLoading}
  emptyMessage="No orders found"
/>
```

### Pagination
```jsx
import Pagination from '../components/Pagination'

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
  maxVisible={5}
/>
```

### SearchBar
```jsx
import SearchBar from '../components/SearchBar'

<SearchBar
  value={searchQuery}
  onChange={(value) => setSearchQuery(value)}
  placeholder="Search orders..."
  onClear={() => console.log('Cleared')}
/>
```

### DateRangePicker
```jsx
import DateRangePicker from '../components/DateRangePicker'

<DateRangePicker
  startDate={startDate}
  endDate={endDate}
  onChange={({ startDate, endDate }) => {
    setStartDate(startDate)
    setEndDate(endDate)
  }}
/>
```

### SmallSparkline
```jsx
import SmallSparkline from '../components/SmallSparkline'

<SmallSparkline 
  data={[10, 20, 15, 25, 30]} 
  color="#3B82F6" 
  width={100}
  height={30}
/>
```

### LoadingSkeleton
```jsx
import LoadingSkeleton from '../components/LoadingSkeleton'

<LoadingSkeleton variant="text" count={3} />
<LoadingSkeleton variant="card" />
<LoadingSkeleton variant="circle" width="48px" height="48px" />
```

### Toast System
```jsx
// Wrap app with ToastProvider
import { ToastProvider } from '../components/Toast'

function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  )
}

// Use in any component
import { useToast } from '../components/Toast'

function MyComponent() {
  const { showToast } = useToast()
  
  const handleSuccess = () => {
    showToast('Order updated successfully!', 'success')
  }
  
  const handleError = () => {
    showToast('Failed to update order', 'error', 5000)
  }
  
  return <button onClick={handleSuccess}>Update</button>
}
```

---

## 🔌 API Integration

### API Client Configuration

Located in `src/config/api.js`:

```javascript
import { fetchOrders, updateOrderStatus, getAnalytics } from '../config/api'
```

### Environment Variables

Add to `.env`:
```env
VITE_GET_ORDERS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
VITE_UPDATE_STATUS_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
VITE_ANALYTICS_URL=https://your-api.com/analytics  # Optional
```

### API Functions

#### 1. Fetch Orders
```javascript
import { fetchOrders } from '../config/api'

const orders = await fetchOrders()
// Returns: Array of orders or { orders, offline: true } if using cache
```

#### 2. Update Order Status (with retry)
```javascript
import { updateOrderStatus } from '../config/api'

await updateOrderStatus('ORD-001', 'accepted')
// Auto-retries on failure with exponential backoff
```

#### 3. Get Analytics
```javascript
import { getAnalytics } from '../config/api'

const analytics = await getAnalytics(orders)
// Computed client-side or fetches from server if URL provided
```

---

## 🔄 Optimistic UI Updates

### useOptimisticUpdate Hook

```javascript
import { useOptimisticUpdate } from '../hooks/useOptimisticUpdate'
import { updateOrderStatus } from '../config/api'
import useStore from '../store/useStore'

function OrderCard({ order }) {
  const { updateOrderStatus: updateStoreStatus } = useStore()
  
  const { execute, isLoading } = useOptimisticUpdate(
    updateOrderStatus,
    () => console.log('Success!'),
    (error) => console.error('Failed:', error)
  )
  
  const handleStatusChange = (newStatus) => {
    const oldStatus = order.status
    
    // 1. Optimistic update - UI updates immediately
    updateStoreStatus(order.id, newStatus)
    
    // 2. Call API with rollback function
    execute(
      () => updateStoreStatus(order.id, oldStatus), // Rollback
      order.id,
      newStatus
    )
  }
  
  return (
    <button 
      onClick={() => handleStatusChange('accepted')}
      disabled={isLoading}
    >
      Accept Order
    </button>
  )
}
```

---

## 📡 Enhanced Polling

### useOrderPolling Hook

Features:
- ✅ Polls every 3 seconds (configurable)
- ✅ Pauses when tab is hidden (Page Visibility API)
- ✅ Exponential backoff on errors
- ✅ Offline detection
- ✅ Cached fallback

```javascript
import { useOrderPolling } from '../hooks/useOrderPolling'

function Orders() {
  const { orders, setOrders } = useStore()
  
  const { refresh, isOffline, error, isPolling } = useOrderPolling(
    (newOrders) => setOrders(newOrders),
    3000,  // Poll every 3 seconds
    true   // Enabled
  )
  
  return (
    <div>
      {isOffline && (
        <div className="bg-warning-50 p-4">
          You are offline. Showing cached data.
        </div>
      )}
      
      <button onClick={refresh}>
        Refresh Now
      </button>
      
      {/* Your orders UI */}
    </div>
  )
}
```

### How Polling Works

1. **Polls every 3 seconds** by default
2. **Pauses when tab is hidden** - saves bandwidth
3. **Resumes when tab becomes visible**
4. **Backs off on errors**:
   - 1st error: Wait 3s
   - 2nd error: Wait 6s
   - 3rd error: Wait 12s
   - Max wait: 30s
5. **Resets on success** or manual refresh
6. **Detects online/offline** status

---

## 💾 Offline Support

### How It Works

1. **Successful API responses** are cached in localStorage
2. **On API failure**, cached data is returned with `offline: true` flag
3. **Cache expires** after 5 minutes
4. **Online/offline events** trigger UI updates

### Checking Online Status

```javascript
import { isOnline, getOfflineMessage } from '../config/api'

if (!isOnline()) {
  console.log(getOfflineMessage())
}
```

### Cache Management

Automatic caching happens in `fetchOrders()`:
```javascript
// Cache key: 'cached_orders'
// Timestamp key: 'cached_orders_timestamp'
// Duration: 5 minutes
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
```env
# Never commit .env file
# Add to .gitignore

VITE_GET_ORDERS_URL=your_api_url
VITE_UPDATE_STATUS_URL=your_api_url
```

### 2. API Secret Token

```javascript
// After user login, set secret token
localStorage.setItem('apiSecret', 'your-secret-token')

// Token is automatically added to all requests in interceptor
config.headers['X-API-Secret'] = apiSecret
```

### 3. Apps Script Endpoint Security

**Server-side (Apps Script):**
```javascript
function doPost(e) {
  // Validate secret token
  const secret = e.parameter.secret || e.postData?.headers?.['X-API-Secret']
  const expectedSecret = PropertiesService.getScriptProperties().getProperty('API_SECRET')
  
  if (secret !== expectedSecret) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Unauthorized'
    })).setMimeType(ContentService.MimeType.JSON)
  }
  
  // Process request...
}
```

### 4. CORS Configuration

Apps Script automatically handles CORS, but ensure:
```javascript
// Allow specific origins only
const allowedOrigins = ['https://your-domain.com']
```

### 5. Rate Limiting

Implement on server-side:
```javascript
// Track requests per user/IP
// Reject if > X requests per minute
```

### 6. Input Validation

Always validate server-side:
```javascript
function validateOrderId(orderId) {
  if (!orderId || typeof orderId !== 'string') {
    throw new Error('Invalid order ID')
  }
  return orderId.trim()
}
```

### 7. HTTPS Only

- ✅ Use HTTPS in production
- ✅ Apps Script endpoints are HTTPS by default
- ✅ Set secure cookies
- ✅ Enable HSTS

---

## 🚨 Error Handling

### Global Error Interceptor

In `api.js`, errors are handled globally:

```javascript
// 401: Unauthorized - clears tokens, redirects to login
// 403: Forbidden - logs error
// 404: Not found - logs error
// 429: Rate limited - logs error
// 5xx: Server error - logs error, triggers retry
```

### Retry Logic

`updateOrderStatus` automatically retries:
```javascript
await updateOrderStatus(orderId, status, 2) // 2 retries
```

### Toast Notifications

Errors show automatically via Toast system:
```javascript
// Success
showToast('Update successful', 'success')

// Error
showToast('Failed to update. Please try again.', 'error')
```

---

## 📊 Example: Complete Order Update Flow

```javascript
import { useOptimisticUpdate } from '../hooks/useOptimisticUpdate'
import { updateOrderStatus } from '../config/api'
import { useToast } from '../components/Toast'
import useStore from '../store/useStore'

function OrderActions({ order }) {
  const { updateOrderStatus: updateStoreStatus } = useStore()
  const { showToast } = useToast()
  
  const { execute, isLoading } = useOptimisticUpdate(
    updateOrderStatus,
    () => {
      showToast('Order status updated!', 'success')
    },
    (error) => {
      showToast(`Failed: ${error.message}`, 'error')
    }
  )
  
  const handleAccept = async () => {
    const oldStatus = order.status
    
    // Step 1: Optimistic update (UI changes immediately)
    updateStoreStatus(order.id, 'accepted')
    
    // Step 2: Call API
    try {
      await execute(
        () => updateStoreStatus(order.id, oldStatus), // Rollback
        order.id,
        'accepted'
      )
    } catch (error) {
      // Error is handled by useOptimisticUpdate
      // Rollback already executed
      // Toast notification already shown
    }
  }
  
  return (
    <button 
      onClick={handleAccept}
      disabled={isLoading}
      className="btn-primary"
    >
      {isLoading ? 'Updating...' : 'Accept Order'}
    </button>
  )
}
```

---

## ✅ Integration Checklist

### Setup
- [ ] Install dependencies: `npm install`
- [ ] Copy `.env.example` to `.env`
- [ ] Add API URLs to `.env`
- [ ] Wrap app with `ToastProvider`

### API Configuration
- [ ] Set up Apps Script endpoints
- [ ] Generate and store API secret
- [ ] Configure CORS
- [ ] Implement rate limiting
- [ ] Add input validation

### Testing
- [ ] Test with mock data
- [ ] Test with real API
- [ ] Test offline mode
- [ ] Test error scenarios
- [ ] Test optimistic updates
- [ ] Test polling pause/resume

### Security
- [ ] Never commit `.env`
- [ ] Use HTTPS in production
- [ ] Validate inputs server-side
- [ ] Implement token authentication
- [ ] Set up CORS properly
- [ ] Add rate limiting

---

## 🎉 You're All Set!

All reusable components and API integration are production-ready with:
- ✅ Full accessibility
- ✅ Responsive design
- ✅ Animations
- ✅ Optimistic updates
- ✅ Offline support
- ✅ Error handling
- ✅ Security best practices
- ✅ Complete documentation

Start building your features with these components! 🚀



