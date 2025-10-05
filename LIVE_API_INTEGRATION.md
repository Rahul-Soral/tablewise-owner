# Live API Integration Guide

## Overview

The Owner Dashboard has been fully integrated with the Google Apps Script live API endpoint. All mock/sample data has been removed, and the application now fetches real-time data from your backend.

## API Endpoint

**Base URL:** `https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec`

### Available Actions

The API supports the following actions via query parameters:

1. **Get Orders**
   - URL: `?action=getOrders&limit=100`
   - Method: GET
   - Polling: Every 10 seconds
   - Returns: Array of order objects

2. **Update Order Status**
   - URL: `?action=update_status&order_id=<id>&status=<status>`
   - Method: POST (with GET fallback)
   - Body: `{ action: "update_status", order_id: "...", status: "..." }`
   - Returns: Success/error response

3. **Get Analytics**
   - URL: `?action=getAnalytics`
   - Method: GET
   - Polling: Every 30 seconds
   - Returns: Analytics summary object

4. **Get Customers**
   - URL: `?action=getCustomers`
   - Method: GET
   - Returns: Array of customer objects

5. **Get Single Order**
   - URL: `?action=getOrder&order_id=<id>`
   - Method: GET
   - Returns: Single order object

6. **Ping**
   - URL: `?action=ping`
   - Method: GET
   - Returns: API status

## Features Implemented

### 1. Live Orders (10-second polling)
- ✅ Fetches orders from `?action=getOrders&limit=100`
- ✅ Automatically polls every 10 seconds when tab is visible
- ✅ Pauses polling when tab is hidden (Page Visibility API)
- ✅ CORS handling with automatic JSONP fallback
- ✅ Shows "Last updated: HH:MM:SS" timestamp
- ✅ Displays spinner while loading
- ✅ Shows "No orders yet" when empty
- ✅ LocalStorage caching for offline mode
- ✅ Offline indicator when network fails

### 2. Order Status Updates
- ✅ Attempts POST request first
- ✅ Falls back to GET request if POST fails
- ✅ Falls back to JSONP if GET fails (CORS)
- ✅ Optimistic UI updates for instant feedback
- ✅ Automatic rollback on failure
- ✅ Success/error toast notifications
- ✅ Confirmation dialog for order cancellation

### 3. Analytics (30-second polling)
- ✅ Fetches from `?action=getAnalytics`
- ✅ Polls every 30 seconds
- ✅ Displays:
  - Total Orders
  - Total Revenue
  - Average Ticket
  - Top 5 Items (with bar chart)
  - Repeat Customer Rate
  - Hourly Distribution
- ✅ Manual refresh button
- ✅ "Last updated" timestamp
- ✅ Loading states

### 4. Customers
- ✅ Fetches from `?action=getCustomers`
- ✅ Displays customer cards with:
  - Name, phone, email, address
  - Total orders
  - Total spent
  - Last order date
  - Repeat customer badge
- ✅ Search functionality (name, email, phone)
- ✅ Sort by name, orders, or revenue
- ✅ Manual refresh button

### 5. Testing & Debugging
- ✅ "Test Fetch" button in Settings page
- ✅ Displays raw JSON response (first 5 orders)
- ✅ Shows request duration
- ✅ Error details display
- ✅ Success/failure indicators

### 6. Error Handling & UX
- ✅ Graceful error messages
- ✅ Toast notifications for all actions
- ✅ Loading spinners and skeletons
- ✅ Offline mode with cached data
- ✅ Network status detection
- ✅ Retry logic with exponential backoff

## CORS & JSONP Fallback

The application implements a robust CORS handling strategy:

1. **Primary Method**: Standard `fetch()` / `axios` request
2. **Fallback 1**: JSONP with dynamic script injection
3. **Fallback 2**: LocalStorage cached data (offline mode)

### How JSONP Works

When CORS blocks a request, the app automatically:
1. Creates a unique callback function on `window`
2. Injects a `<script>` tag with URL: `?action=...&callback=functionName`
3. Receives data through the callback
4. Cleans up script tag and callback function

## Configuration

### API Configuration Location
All API settings are in: `src/config/api.js`

```javascript
const API_CONFIG = {
  BASE_URL: APPS_SCRIPT_URL,
  GET_ORDERS_URL: `${APPS_SCRIPT_URL}?action=getOrders&limit=100`,
  UPDATE_STATUS_URL: APPS_SCRIPT_URL,
  ANALYTICS_URL: `${APPS_SCRIPT_URL}?action=getAnalytics`,
  CUSTOMERS_URL: `${APPS_SCRIPT_URL}?action=getCustomers`,
  ORDERS_POLLING_INTERVAL: 10000,  // 10 seconds
  ANALYTICS_POLLING_INTERVAL: 30000, // 30 seconds
}
```

### Polling Intervals

- **Orders**: 10 seconds (configurable in `API_CONFIG.ORDERS_POLLING_INTERVAL`)
- **Analytics**: 30 seconds (configurable in `API_CONFIG.ANALYTICS_POLLING_INTERVAL`)

### LocalStorage Caching

Orders are automatically cached in localStorage:
- Key: `cached_orders`
- Timestamp key: `cached_orders_timestamp`
- Cache duration: 5 minutes
- Used when offline or fetch fails

## Testing the Integration

### Method 1: Settings Page Test Button
1. Navigate to **Settings** page
2. Scroll to **API Testing** section
3. Click **"Test Fetch Orders"** button
4. View raw JSON response and request duration

### Method 2: Browser Console
```javascript
// Test orders fetch
fetch('https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec?action=getOrders&limit=5')
  .then(r => r.json())
  .then(console.log)

// Test analytics fetch
fetch('https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec?action=getAnalytics')
  .then(r => r.json())
  .then(console.log)

// Test customers fetch
fetch('https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec?action=getCustomers')
  .then(r => r.json())
  .then(console.log)
```

### Method 3: Network Tab
1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Filter by **Fetch/XHR**
4. Watch for requests to `script.google.com`
5. Inspect request/response data

## Expected Data Formats

### Orders Response
```json
{
  "orders": [
    {
      "id": "ORDER123",
      "customerName": "John Doe",
      "customerPhone": "+1234567890",
      "items": [
        {
          "name": "Pizza Margherita",
          "quantity": 2,
          "price": 12.99
        }
      ],
      "total": 25.98,
      "status": "pending",
      "createdAt": "2024-10-04T12:00:00Z"
    }
  ]
}
```

### Analytics Response
```json
{
  "total_orders": 150,
  "total_revenue": 3500.50,
  "avg_ticket": 23.34,
  "repeat_customer_rate": 45.5,
  "top_items": [
    {
      "name": "Pizza Margherita",
      "quantity": 85,
      "revenue": 1105.15
    }
  ],
  "hourly_distribution": [
    { "hour": 0, "count": 0 },
    { "hour": 1, "count": 0 },
    // ... 24 hours
  ]
}
```

### Customers Response
```json
{
  "customers": [
    {
      "id": "CUST123",
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com",
      "address": "123 Main St",
      "total_orders": 5,
      "total_spent": 125.50,
      "is_repeat": true,
      "last_order_date": "2024-10-04T12:00:00Z"
    }
  ]
}
```

## Troubleshooting

### Issue: Orders not loading
**Solution:**
1. Check Settings → API Testing
2. Click "Test Fetch Orders"
3. Verify raw response
4. Check browser console for errors
5. Verify API endpoint is accessible

### Issue: CORS errors
**Solution:**
- App automatically falls back to JSONP
- Check console for "attempting JSONP fallback" message
- Ensure Apps Script is deployed as "Anyone" access

### Issue: Stale data
**Solution:**
1. Click manual refresh button
2. Check "Last updated" timestamp
3. Clear localStorage: `localStorage.clear()`
4. Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

### Issue: Offline mode persists
**Solution:**
1. Check network connection
2. Click refresh button
3. Check browser DevTools → Network tab
4. Verify API is responding: `curl <api-url>?action=ping`

## File Changes Summary

### Modified Files:
1. **src/config/api.js** - Updated all API endpoints and methods
2. **src/pages/Orders.jsx** - Added 10s polling and last updated timestamp
3. **src/pages/Analytics.jsx** - Added live API fetching with 30s polling
4. **src/pages/Customers.jsx** - Implemented full customer display with live data
5. **src/pages/Settings.jsx** - Added Test Fetch debugging tool

### Key Changes:
- ❌ Removed all mock data fallbacks
- ✅ Added JSONP fallback for CORS
- ✅ Implemented proper error handling
- ✅ Added localStorage caching
- ✅ Updated polling intervals (10s/30s)
- ✅ Added "Last updated" timestamps
- ✅ Added test/debug tools

## Performance Considerations

- **Polling Optimization**: Automatically pauses when tab is hidden
- **Caching**: Orders cached in localStorage for offline access
- **Debouncing**: Search inputs debounced to reduce re-renders
- **Lazy Loading**: Components only fetch when mounted
- **Optimistic Updates**: Status changes update UI immediately

## Security Notes

⚠️ **Important**: The API endpoint URL is hardcoded in the client code. This is acceptable for:
- Public data that doesn't require authentication
- Apps Script endpoints with built-in access control
- Development/testing environments

For production with sensitive data:
- Implement authentication (JWT tokens)
- Use environment variables for API URLs
- Enable CORS restrictions on Apps Script
- Implement rate limiting
- Add request signing/validation

## Next Steps

### Recommended Enhancements:
1. Add authentication/authorization
2. Implement WebSocket for real-time updates
3. Add push notifications for new orders
4. Implement data pagination for large datasets
5. Add data export functionality (CSV, PDF)
6. Implement order search with advanced filters
7. Add order history and audit logs

### Backend Recommendations:
1. Add rate limiting to prevent abuse
2. Implement request validation
3. Add error logging and monitoring
4. Enable CORS with specific origins
5. Add response compression
6. Implement caching headers

## Support

For issues or questions:
1. Check browser console for errors
2. Use Settings → API Testing to debug
3. Verify API endpoint is accessible
4. Check network tab in DevTools
5. Review this documentation

---

**Last Updated**: October 4, 2025
**API Version**: 1.0
**Integration Status**: ✅ Complete
