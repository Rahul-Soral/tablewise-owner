# Security Best Practices - Owner Portal

## 🔒 Security Implementation

### Current Implementation

✅ **Environment Variables** - All URLs in env vars
✅ **No Hardcoded Secrets** - No API keys in code
✅ **HTTPS Only** - Apps Script uses HTTPS
✅ **Token Authentication** - Headers support
✅ **Error Handling** - Global interceptors
✅ **Input Validation** - Client-side validation
✅ **CORS Handling** - JSONP fallback
✅ **Offline Protection** - Cached data only

---

## 🛡️ Apps Script Server-Side Security

### 1. Secret Token Validation

**In Apps Script (`Code.gs`):**

```javascript
/**
 * Validate secret token on all requests
 */
function validateSecretToken(request) {
  try {
    // Get secret from request
    const requestData = JSON.parse(request.postData.contents)
    const clientSecret = requestData.secret || request.parameter.secret
    
    // Get expected secret from Script Properties
    const expectedSecret = PropertiesService
      .getScriptProperties()
      .getProperty('API_SECRET')
    
    return clientSecret === expectedSecret
  } catch (error) {
    Logger.log('Token validation error: ' + error)
    return false
  }
}

/**
 * Main POST handler with authentication
 */
function doPost(e) {
  // Validate token
  if (!validateSecretToken(e)) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Unauthorized - Invalid or missing API secret'
      }))
      .setMimeType(ContentService.MimeType.JSON)
  }
  
  // Process authenticated request
  const data = JSON.parse(e.postData.contents)
  
  if (data.action === 'update_status') {
    return updateOrderStatus(data.order_id, data.status)
  }
  
  // Handle other actions...
}

/**
 * GET handler (read-only operations)
 */
function doGet(e) {
  const action = e.parameter.action
  
  // Optional: Validate token for GET requests too
  // if (!validateSecretToken(e)) {
  //   return unauthorized()
  // }
  
  switch (action) {
    case 'getOrders':
      const limit = parseInt(e.parameter.limit) || 50
      return getOrders(limit)
    
    case 'getAnalytics':
      return getAnalytics()
    
    default:
      return ContentService
        .createTextOutput(JSON.stringify({
          error: 'Invalid action'
        }))
        .setMimeType(ContentService.MimeType.JSON)
  }
}
```

### 2. Set Up Secret Token

**In Apps Script:**

1. File → Project properties → Script properties
2. Add property:
   - **Key:** `API_SECRET`
   - **Value:** Generate random token (32+ characters)

```bash
# Generate secure token (run in terminal)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Example output: 4f3d2e1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c
```

### 3. Send Token from Client

**After user authentication:**

```javascript
// In your login handler
async function handleLogin(username, password) {
  // Authenticate user (your logic here)
  const token = await authenticateUser(username, password)
  
  // Store API secret
  localStorage.setItem('apiSecret', 'YOUR_SECRET_TOKEN_HERE')
  localStorage.setItem('authToken', token)
}
```

**Token is automatically sent:**

The axios interceptor in `src/config/api.js` adds it to all requests:

```javascript
// Request interceptor (already implemented)
apiClient.interceptors.request.use((config) => {
  const apiSecret = localStorage.getItem('apiSecret')
  if (apiSecret) {
    config.headers['X-API-Secret'] = apiSecret
  }
  return config
})
```

---

## 🔐 Additional Security Measures

### 1. Rate Limiting (Apps Script)

```javascript
// In Apps Script
const RATE_LIMIT_CACHE = CacheService.getScriptCache()
const MAX_REQUESTS_PER_MINUTE = 60

function isRateLimited(identifier) {
  const key = `rate_limit_${identifier}`
  const current = RATE_LIMIT_CACHE.get(key)
  
  if (current && parseInt(current) >= MAX_REQUESTS_PER_MINUTE) {
    return true
  }
  
  const newCount = current ? parseInt(current) + 1 : 1
  RATE_LIMIT_CACHE.put(key, newCount.toString(), 60)
  
  return false
}

function doPost(e) {
  // Get identifier (IP or user ID)
  const identifier = e.parameter.user_id || 'anonymous'
  
  if (isRateLimited(identifier)) {
    return ContentService
      .createTextOutput(JSON.stringify({
        error: 'Rate limit exceeded'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setStatus(429)
  }
  
  // Process request...
}
```

### 2. Input Validation (Apps Script)

```javascript
function validateOrderStatus(status) {
  const validStatuses = [
    'pending',
    'accepted', 
    'preparing',
    'ready',
    'served',
    'cancelled'
  ]
  
  if (!validStatuses.includes(status.toLowerCase())) {
    throw new Error('Invalid status value')
  }
  
  return status
}

function updateOrderStatus(orderId, status) {
  // Validate inputs
  if (!orderId || typeof orderId !== 'string') {
    throw new Error('Invalid order ID')
  }
  
  const validatedStatus = validateOrderStatus(status)
  
  // Sanitize order ID (prevent injection)
  const sanitizedOrderId = orderId.replace(/[^A-Z0-9-]/gi, '')
  
  // Update sheet...
}
```

### 3. CORS Configuration (Apps Script)

Apps Script handles CORS automatically, but you can restrict origins:

```javascript
function doGet(e) {
  // Optional: Check origin
  const origin = e.parameter.origin
  const allowedOrigins = [
    'https://owner-portal.vercel.app',
    'https://owner-portal.netlify.app',
    'http://localhost:3000'
  ]
  
  // Process request and add CORS headers if needed
  const response = processRequest(e)
  
  return response
    .setHeader('Access-Control-Allow-Origin', origin)
    .setHeader('Access-Control-Allow-Methods', 'GET, POST')
}
```

### 4. SQL Injection Prevention

When querying sheets:

```javascript
function findOrder(orderId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Orders')
  const data = sheet.getDataRange().getValues()
  
  // Never use eval() or direct string concatenation
  // Use strict comparison
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === orderId) {  // Exact match only
      return data[i]
    }
  }
  
  return null
}
```

### 5. XSS Prevention (Client-Side)

React automatically escapes HTML, but be careful with:

```javascript
// DANGEROUS - Never do this
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// SAFE - React escapes automatically
<div>{userInput}</div>

// SAFE - Sanitize if needed
import DOMPurify from 'dompurify'
<div>{DOMPurify.sanitize(userInput)}</div>
```

---

## 🔑 Authentication (Future Enhancement)

### Recommended Flow

1. **User Login** → POST to auth endpoint
2. **Receive JWT token** → Store in localStorage
3. **Include in requests** → Authorization header
4. **Validate server-side** → Check token signature
5. **Refresh token** → Before expiry

### Example Implementation

**Client-side (`src/utils/auth.js`):**

```javascript
export async function login(username, password) {
  const response = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  
  const { token, apiSecret } = await response.json()
  
  localStorage.setItem('authToken', token)
  localStorage.setItem('apiSecret', apiSecret)
  
  return token
}

export function logout() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('apiSecret')
  window.location.href = '/login'
}

export function isAuthenticated() {
  return !!localStorage.getItem('authToken')
}
```

**Apps Script:**

```javascript
function validateJWT(token) {
  // Verify JWT signature and expiry
  // Use a library like jwt-simple
  try {
    const decoded = decodeJWT(token)
    return decoded.exp > Date.now() / 1000
  } catch (error) {
    return false
  }
}
```

---

## 🛡️ Production Security Checklist

### Before Go-Live

- [ ] All API URLs use HTTPS
- [ ] Secret token configured and tested
- [ ] Environment variables set in hosting platform
- [ ] `.env` file excluded from git (.gitignore)
- [ ] No console.log with sensitive data
- [ ] Error messages don't expose internals
- [ ] CORS properly configured
- [ ] Rate limiting active
- [ ] Input validation on all endpoints
- [ ] XSS protection enabled
- [ ] SQL injection prevented (if using database)

### Ongoing

- [ ] Rotate API secrets quarterly
- [ ] Monitor Apps Script logs
- [ ] Review access logs monthly
- [ ] Update dependencies regularly
- [ ] Security audit quarterly
- [ ] Penetration testing (if high-value)

---

## 📞 Incident Response

### If API Secret is Compromised

1. **Immediately:** Generate new secret in Apps Script
2. **Update** environment variables in hosting platform
3. **Notify** all users to re-login
4. **Review** access logs for unauthorized requests
5. **Document** incident

### If User Data Exposed

1. **Immediately:** Disable affected endpoints
2. **Investigate** scope of breach
3. **Notify** affected customers (if required by law)
4. **Fix** vulnerability
5. **Audit** entire codebase
6. **Re-deploy** with fixes

---

## 🔍 Security Audit Tools

### Client-Side

```bash
# Dependency vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check for secrets in code
git secrets --scan

# OWASP dependency check
npm install -g npm-check
npm-check -u
```

### Apps Script

- Review execution logs regularly
- Monitor quota usage
- Check for unusual patterns
- Review script permissions

---

## ✅ Security Summary

**Implemented:**
- ✅ Environment variables
- ✅ Token authentication support
- ✅ Global error handling
- ✅ Client-side validation
- ✅ HTTPS endpoints
- ✅ CORS fallbacks

**TODO (Server-Side):**
- [ ] Secret token validation
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] JWT authentication
- [ ] Logging and monitoring

**Recommended:**
- Add Sentry for error tracking
- Implement user authentication
- Enable 2FA for admin access
- Regular security audits
- Dependency updates

---

**Security is a continuous process!** Review and update regularly. 🔒


