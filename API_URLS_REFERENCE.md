# API URLs Reference - Apps Script Integration

## 🔗 Apps Script Endpoints

All endpoints use the same Google Apps Script deployment:

**Base Script ID:** `AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo`

### Endpoint URLs

#### 1. POST Order Webhook (Customer → Sheet)
```
https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec
```

**Used by:** Customer-facing order form
**Method:** POST
**Payload:**
```json
{
  "customer_name": "John Doe",
  "customer_phone": "+1234567890",
  "items": [...],
  "total": 45.99
}
```

---

#### 2. GET Latest Orders (Owner UI)
```
https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec?action=getOrders&limit=100
```

**Used by:** `src/config/api.js` → `fetchOrders()`
**Method:** GET
**Parameters:**
- `action=getOrders` (required)
- `limit=100` (optional, default: 50)

**Response:**
```json
{
  "orders": [
    {
      "id": "ORD-001",
      "table": "12",
      "customerName": "John Doe",
      "customerPhone": "+1234567890",
      "status": "pending",
      "createdAt": "2024-01-01T10:00:00Z",
      "items": [...],
      "total": 45.99
    }
  ]
}
```

**Polling:** Every 3 seconds (configurable via `VITE_POLLING_INTERVAL`)

---

#### 3. POST Update Order Status (Owner → Sheet)
```
https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec
```

**Used by:** `src/config/api.js` → `updateOrderStatus()`
**Method:** POST
**Payload:**
```json
{
  "action": "update_status",
  "order_id": "ORD-001",
  "status": "Preparing",
  "timestamp": "2024-01-01T10:05:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "order_id": "ORD-001",
  "status": "Preparing"
}
```

---

#### 4. GET Analytics
```
https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec?action=getAnalytics
```

**Used by:** `src/config/api.js` → `getAnalytics()`
**Method:** GET
**Parameters:**
- `action=getAnalytics` (required)

**Response:**
```json
{
  "analytics": {
    "revenue": 1234.56,
    "ordersCount": 45,
    "averageTicket": 27.43,
    "topItems": [...]
  }
}
```

**Fallback:** If endpoint fails, computes client-side from orders data

---

## 📍 Where URLs Are Used

### 1. Environment Variables (`.env`)
```env
VITE_GET_ORDERS_URL=https://script.google.com/.../exec?action=getOrders&limit=100
VITE_UPDATE_STATUS_URL=https://script.google.com/.../exec
VITE_WEBHOOK_URL=https://script.google.com/.../exec
VITE_ANALYTICS_URL=https://script.google.com/.../exec?action=getAnalytics
```

### 2. API Configuration (`src/config/api.js`)
```javascript
const API_CONFIG = {
  GET_ORDERS_URL: import.meta.env.VITE_GET_ORDERS_URL,
  UPDATE_STATUS_URL: import.meta.env.VITE_UPDATE_STATUS_URL,
  WEBHOOK_URL: import.meta.env.VITE_WEBHOOK_URL,
  ANALYTICS_URL: import.meta.env.VITE_ANALYTICS_URL,
}
```

### 3. API Functions
```javascript
// Line 159-199: fetchOrders()
export const fetchOrders = async () => {
  const response = await apiClient.get(API_CONFIG.GET_ORDERS_URL)
  // ...with JSONP fallback
}

// Line 250-275: updateOrderStatus()
export const updateOrderStatus = async (orderId, status) => {
  const response = await apiClient.post(API_CONFIG.UPDATE_STATUS_URL, {
    action: 'update_status',
    order_id: orderId,
    status: status
  })
}

// Line 283-313: getAnalytics()
export const getAnalytics = async (orders) => {
  const response = await apiClient.get(API_CONFIG.ANALYTICS_URL)
  // ...with fallback to client-side computation
}
```

### 4. Polling Hook (`src/hooks/useOrderPolling.js`)
```javascript
// Line 45-90: poll() function
const poll = async () => {
  const result = await fetchOrders() // Uses GET_ORDERS_URL
  onUpdate(result)
}

// Polls every 3 seconds when:
// - Tab is visible
// - User is online
// - No concurrent requests
```

### 5. Settings Page (`src/pages/Settings.jsx`)
```javascript
// Line 85-110: Display active endpoints
<div className="p-3 bg-stone-50 rounded-lg">
  <p>Get Orders: {API_CONFIG.GET_ORDERS_URL}</p>
</div>
```

---

## 🔧 Configuration Options

### Polling Interval
Default: 3000ms (3 seconds)

**Change in `.env`:**
```env
VITE_POLLING_INTERVAL=5000  # 5 seconds
```

**Change at runtime:**
Settings → API Configuration → Polling Interval

### Proxy Mode
Use proxy server to avoid CORS issues

**Enable in `.env`:**
```env
VITE_USE_PROXY=true
VITE_PROXY_URL=http://localhost:8080/api
```

**Enable at runtime:**
Settings → API Configuration → Use Proxy

### JSONP Fallback
Automatically attempts JSONP if CORS error detected on GET requests

**How it works:**
1. Try standard fetch
2. If CORS error, append `&callback=jsonp_...` to URL
3. Load as `<script>` tag
4. Parse response via callback

---

## 🔐 Security Implementation

### Client-Side (Current)
✅ Environment variables for all URLs
✅ Token authentication headers
✅ Secret token support (`X-API-Secret`)
✅ HTTPS enforcement
✅ Input validation

### Server-Side (Apps Script TODO)

**Add token validation:**
```javascript
function doPost(e) {
  const secret = e.postData?.contents ? 
    JSON.parse(e.postData.contents).secret : null
  
  const expectedSecret = PropertiesService
    .getScriptProperties()
    .getProperty('API_SECRET')
  
  if (secret !== expectedSecret) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Unauthorized'
      }))
      .setMimeType(ContentService.MimeType.JSON)
  }
  
  // Process request...
}
```

**Set secret in Apps Script:**
```javascript
// File > Project properties > Script properties
// Add: API_SECRET = your-random-secret-token
```

**Send from client:**
```javascript
// After user login:
localStorage.setItem('apiSecret', 'your-secret-token')

// Automatically added to all requests via interceptor
```

---

## 🚀 Testing Endpoints

### Test GET Orders
```bash
curl "https://script.google.com/macros/s/AKfycbz.../exec?action=getOrders&limit=10"
```

### Test Update Status
```bash
curl -X POST "https://script.google.com/macros/s/AKfycbz.../exec" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update_status",
    "order_id": "ORD-001",
    "status": "Preparing"
  }'
```

### Test Analytics
```bash
curl "https://script.google.com/macros/s/AKfycbz.../exec?action=getAnalytics"
```

---

## 📝 Quick Reference

| Endpoint | Method | Used In | Polling | JSONP |
|----------|--------|---------|---------|-------|
| GET_ORDERS_URL | GET | fetchOrders() | Yes (3s) | Yes |
| UPDATE_STATUS_URL | POST | updateOrderStatus() | No | No |
| WEBHOOK_URL | POST | (External) | No | No |
| ANALYTICS_URL | GET | getAnalytics() | No | Yes |

---

## ✅ Verification Checklist

- [ ] All 4 URLs added to `.env`
- [ ] URLs match Apps Script deployment
- [ ] Apps Script deployed as web app
- [ ] Apps Script set to "Anyone" access
- [ ] Test each endpoint with curl
- [ ] Verify responses match expected format
- [ ] Check CORS headers are present
- [ ] Monitor Apps Script execution logs

---

**All URLs are configured and integrated!** 🎉


