# Updated Files - Apps Script Integration

## 📝 Files Modified for Apps Script Integration

### Core Configuration Files

#### 1. `.env.example` ✅ UPDATED
**Changes:**
- Added actual Apps Script URLs (not placeholders)
- Added `VITE_WEBHOOK_URL`
- Added `VITE_ANALYTICS_URL`
- Added proxy configuration options
- Added polling interval setting
- Added security notes

**Location:** Root directory
**Lines:** Complete file rewritten

---

#### 2. `src/config/api.js` ✅ MAJOR UPDATE
**Changes:**
- Added proxy support (`getProxiedUrl()`)
- Added JSONP fallback for GET requests
- Updated `fetchOrders()` with Apps Script integration
- Updated `updateOrderStatus()` with correct payload format
- Added `getAnalytics()` with fallback
- Added offline caching (`getCachedOrders()`, `setCachedOrders()`)
- Enhanced error handling (401/403/429/5xx)
- Added retry logic with exponential backoff
- Added `isOnline()` and `getOfflineMessage()` helpers

**Key Functions:**
- Line 159-199: `fetchOrders()` with JSONP fallback
- Line 204-240: `fetchOrdersWithJSONP()`
- Line 250-275: `updateOrderStatus()` with retry
- Line 283-313: `getAnalytics()` with fallback
- Line 318-352: `fetchAnalyticsWithJSONP()`

---

#### 3. `src/hooks/useOrderPolling.js` ✅ ENHANCED
**Changes:**
- Changed default interval to 3000ms (3 seconds)
- Added Page Visibility API support
- Added exponential backoff on errors
- Added online/offline detection
- Added state tracking (`isPolling`, `isOffline`, `error`)
- Pauses polling when tab is hidden
- Resumes polling when tab becomes visible
- Auto-refreshes when network comes back online

**Key Features:**
- Line 49: Checks `document.hidden` before polling
- Line 120-141: Visibility change handler
- Line 144-166: Online/offline event handlers

---

#### 4. `src/pages/Settings.jsx` ✅ COMPLETE REWRITE
**Changes:**
- Added API configuration section
- Displays active endpoint URLs
- Added proxy mode toggle
- Added polling interval adjuster
- Added endpoint verification
- Added CORS information
- Integrated with Toast system

**New Features:**
- View all 4 Apps Script URLs
- Toggle proxy mode
- Adjust polling interval (1-30 seconds)
- Save API settings to localStorage

---

#### 5. `src/main.jsx` ✅ UPDATED
**Changes:**
- Wrapped app with `ToastProvider`
- Changed CSS import to `styles/globals.css`

**Before:**
```javascript
import './index.css'
<App />
```

**After:**
```javascript
import './styles/globals.css'
<ToastProvider>
  <App />
</ToastProvider>
```

---

#### 6. `README.md` ✅ COMPLETE REWRITE
**Changes:**
- Added Apps Script integration section
- Listed all 4 endpoint URLs with usage
- Added acceptance test checklist
- Added deployment guides (Vercel & Netlify)
- Added accessibility checklist
- Added performance checklist
- Added testing instructions
- Added troubleshooting section

---

### New Files Created

#### Configuration

1. **`vitest.config.js`** - Vitest configuration
2. **`cypress.config.js`** - Cypress E2E config
3. **`netlify.toml`** - Netlify deployment settings
4. **`vercel.json`** - Vercel deployment settings

#### Tests

5. **`tests/setup.js`** - Vitest setup
6. **`tests/utils/insights.test.js`** - Unit tests for insights
7. **`tests/config/api.test.js`** - Unit tests for API
8. **`cypress/e2e/order-flow.cy.js`** - E2E test scenarios
9. **`cypress/support/commands.js`** - Custom Cypress commands
10. **`cypress/support/e2e.js`** - Cypress support file

#### Reusable Components (12 new)

11. **`src/components/StatusChip.jsx`**
12. **`src/components/Badge.jsx`**
13. **`src/components/IconButton.jsx`**
14. **`src/components/Modal.jsx`**
15. **`src/components/SlideOver.jsx`**
16. **`src/components/DataTable.jsx`**
17. **`src/components/Pagination.jsx`**
18. **`src/components/SearchBar.jsx`**
19. **`src/components/DateRangePicker.jsx`**
20. **`src/components/SmallSparkline.jsx`**
21. **`src/components/LoadingSkeleton.jsx`**
22. **`src/components/Toast.jsx`**

#### Hooks

23. **`src/hooks/useOptimisticUpdate.js`** - Optimistic UI with rollback

#### Documentation

24. **`API_URLS_REFERENCE.md`** - Complete URL documentation
25. **`TESTING_GUIDE.md`** - Testing instructions
26. **`DEPLOYMENT_GUIDE.md`** - Deployment steps
27. **`SECURITY_GUIDE.md`** - Security best practices
28. **`COMPONENTS_API_GUIDE.md`** - Components & API guide
29. **`UPDATED_FILES.md`** - This file

---

## 📍 Where Apps Script URLs Are Used

### Environment Variables

**File:** `.env.example` (template) & `.env` (active)

```env
VITE_GET_ORDERS_URL=https://script.google.com/.../exec?action=getOrders&limit=100
VITE_UPDATE_STATUS_URL=https://script.google.com/.../exec
VITE_WEBHOOK_URL=https://script.google.com/.../exec
VITE_ANALYTICS_URL=https://script.google.com/.../exec?action=getAnalytics
```

### API Configuration

**File:** `src/config/api.js`

**Lines 19-30:** Import from environment variables
```javascript
const API_CONFIG = {
  GET_ORDERS_URL: import.meta.env.VITE_GET_ORDERS_URL,
  UPDATE_STATUS_URL: import.meta.env.VITE_UPDATE_STATUS_URL,
  WEBHOOK_URL: import.meta.env.VITE_WEBHOOK_URL,
  ANALYTICS_URL: import.meta.env.VITE_ANALYTICS_URL,
}
```

**Line 161:** Used in `fetchOrders()`
```javascript
const response = await apiClient.get(API_CONFIG.GET_ORDERS_URL)
```

**Line 252:** Used in `updateOrderStatus()`
```javascript
const response = await apiClient.post(API_CONFIG.UPDATE_STATUS_URL, {
  action: 'update_status',
  order_id: orderId,
  status: status
})
```

**Line 290:** Used in `getAnalytics()`
```javascript
const response = await apiClient.get(API_CONFIG.ANALYTICS_URL)
```

### Polling Hook

**File:** `src/hooks/useOrderPolling.js`

**Line 65:** Calls `fetchOrders()` which uses `GET_ORDERS_URL`
```javascript
const result = await fetchOrders()
```

### Settings Page

**File:** `src/pages/Settings.jsx`

**Lines 90-105:** Displays active URLs
```javascript
<div className="p-3 bg-stone-50 rounded-lg">
  <p>Get Orders: {API_CONFIG.GET_ORDERS_URL}</p>
</div>
```

### Test Configuration

**File:** `cypress.config.js`

**Lines 8-9:** Test environment URLs
```javascript
env: {
  WEBHOOK_URL: 'https://script.google.com/.../exec',
  GET_ORDERS_URL: 'https://script.google.com/.../exec?action=getOrders&limit=100',
}
```

---

## 🔄 Request/Response Flow

### GET Orders (Every 3 seconds)

```
Client (useOrderPolling)
    ↓
fetchOrders()
    ↓
axios.get(GET_ORDERS_URL)
    ↓ (if CORS error)
fetchOrdersWithJSONP()
    ↓
Apps Script doGet(action=getOrders)
    ↓
Return { orders: [...] }
    ↓
Update Zustand store
    ↓
UI re-renders
```

### POST Update Status

```
Client (OrderCard)
    ↓
handleStatusChange()
    ↓
Optimistic update (immediate UI change)
    ↓
updateOrderStatus(id, status)
    ↓
axios.post(UPDATE_STATUS_URL, {
  action: 'update_status',
  order_id: id,
  status: status
})
    ↓ (retry on failure)
Apps Script doPost()
    ↓
Update Google Sheet
    ↓
Return { success: true }
    ↓
Toast: "Update successful"
    ↓ (on error)
Rollback optimistic update
    ↓
Toast: "Update failed"
```

---

## 🔧 Configuration Summary

### Polling Behavior

| Condition | Action |
|-----------|--------|
| Tab visible | Poll every 3s |
| Tab hidden | Stop polling |
| Tab visible again | Resume polling |
| Network offline | Stop polling, show cached |
| Network online | Resume polling |
| API error 1x | Retry in 3s |
| API error 2x | Retry in 6s |
| API error 3x | Retry in 12s |
| Max backoff | 30s |

### Request Format

**Update Status POST Body:**
```json
{
  "action": "update_status",
  "order_id": "ORD-001",
  "status": "Preparing",
  "timestamp": "2024-01-01T10:00:00Z"
}
```

**Expected Response:**
```json
{
  "success": true,
  "order_id": "ORD-001",
  "status": "Preparing"
}
```

---

## ✅ Verification

### Test All Endpoints

```bash
# Test GET Orders
curl "https://script.google.com/macros/s/AKfycbz.../exec?action=getOrders&limit=10"

# Test Update Status
curl -X POST "https://script.google.com/macros/s/AKfycbz.../exec" \
  -H "Content-Type: application/json" \
  -d '{"action":"update_status","order_id":"ORD-001","status":"Preparing"}'

# Test Analytics
curl "https://script.google.com/macros/s/AKfycbz.../exec?action=getAnalytics"
```

### Verify in App

1. **Start dev server:** `npm run dev`
2. **Open Settings:** http://localhost:3000/settings
3. **Check endpoints:** Scroll to "API Configuration"
4. **Verify URLs:** Should match Apps Script URLs exactly

---

## 📦 Total Changes

- **Modified Files:** 6
- **New Components:** 12
- **New Hooks:** 1 (useOptimisticUpdate)
- **New Tests:** 6 files
- **New Config:** 4 files
- **New Docs:** 6 files

**Total New/Modified Files:** 35+

---

**All Apps Script URLs integrated and ready to use!** ✅



