# Deployment Guide - Owner Portal

## 🚀 Recommended Deployment: Vercel

Vercel is recommended for React/Vite apps with excellent performance and zero config.

### Option 1: Deploy via GitHub (Recommended)

#### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/owner-portal.git
git push -u origin main
```

#### Step 2: Import in Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. Configure project:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

#### Step 3: Add Environment Variables

In Vercel dashboard → Settings → Environment Variables, add:

```
VITE_GET_ORDERS_URL = https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec?action=getOrders&limit=100

VITE_UPDATE_STATUS_URL = https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec

VITE_WEBHOOK_URL = https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec

VITE_ANALYTICS_URL = https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec?action=getAnalytics

VITE_POLLING_INTERVAL = 3000

VITE_USE_PROXY = false

VITE_ENV = production
```

**Apply to:** Production, Preview, and Development

#### Step 4: Deploy

Click "Deploy" - your app will be live in ~2 minutes!

**Your URL:** `https://owner-portal.vercel.app`

---

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (first time)
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Scope? Select your account
# - Link to existing project? No
# - Project name? owner-portal
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add VITE_GET_ORDERS_URL production
# Paste URL when prompted
# Repeat for all variables

# Deploy to production
vercel --prod
```

---

## 🌐 Alternative: Netlify

### Option 1: Deploy via GitHub

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select repository
5. Configure build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Add environment variables (same as Vercel)
7. Click "Deploy site"

**Your URL:** `https://owner-portal.netlify.app`

---

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

---

## ⚙️ Build Settings

### Vercel (`vercel.json`)

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Netlify (`netlify.toml`)

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
```

---

## 🔧 Environment Variables

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_GET_ORDERS_URL` | Apps Script URL | Fetch orders endpoint |
| `VITE_UPDATE_STATUS_URL` | Apps Script URL | Update status endpoint |
| `VITE_WEBHOOK_URL` | Apps Script URL | Customer webhook |
| `VITE_ANALYTICS_URL` | Apps Script URL | Analytics endpoint |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_POLLING_INTERVAL` | 3000 | Polling interval (ms) |
| `VITE_USE_PROXY` | false | Use proxy server |
| `VITE_PROXY_URL` | - | Proxy server URL |
| `VITE_ENV` | production | Environment name |

---

## 🧪 Pre-Deployment Testing

### 1. Test Production Build Locally

```bash
# Build
npm run build

# Preview
npm run preview

# Open http://localhost:4173
# Test all features
```

### 2. Run All Tests

```bash
# Unit tests
npm run test:coverage

# E2E tests (with dev server running)
npm run dev  # Terminal 1
npm run cypress:run  # Terminal 2

# Linting
npm run lint
```

### 3. Performance Check

```bash
# Build and preview
npm run build && npm run preview

# Run Lighthouse
# Target: 85+ mobile, 90+ desktop
```

---

## 🔍 Post-Deployment Verification

### 1. Smoke Tests

Visit your deployed URL and verify:

- [ ] App loads without errors
- [ ] Can navigate to all pages
- [ ] Orders page loads data
- [ ] Status updates work
- [ ] Analytics displays charts
- [ ] Export buttons work
- [ ] Responsive on mobile

### 2. Check Console

Open DevTools Console:
- [ ] No error messages
- [ ] Polling logs appear every 3s
- [ ] "Tab hidden/visible" logs work

### 3. Network Tab

Check requests:
- [ ] GET requests to Apps Script every 3s
- [ ] POST requests on status update
- [ ] Responses return 200 OK
- [ ] No CORS errors

### 4. Test Real Workflow

1. Add order to Google Sheet
2. Verify appears in Owner Portal within 3s
3. Change status in Owner Portal
4. Verify Sheet updates within 2s

---

## 📊 Monitoring

### Vercel Analytics

Enable in Vercel dashboard:
- Real user monitoring
- Core Web Vitals
- Page views
- Performance metrics

### Error Tracking (Optional)

Consider adding:
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **Google Analytics** - User analytics

Example Sentry setup:
```bash
npm install @sentry/react

# In src/main.jsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.VITE_ENV,
})
```

---

## 🔒 Security Checklist

### Pre-Deployment

- [ ] All URLs in environment variables (not hardcoded)
- [ ] `.env` file NOT committed to git
- [ ] No API secrets in client code
- [ ] HTTPS endpoints only
- [ ] CORS configured on Apps Script
- [ ] Rate limiting implemented (server-side)

### Post-Deployment

- [ ] Apps Script secret token configured
- [ ] Environment variables set in hosting platform
- [ ] SSL certificate active (automatic on Vercel/Netlify)
- [ ] Security headers configured
- [ ] Test unauthorized access

---

## 🐛 Troubleshooting Deployment

### Build Fails

**Error:** `Module not found`
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Error:** `Environment variable undefined`
- Verify all VITE_* variables are set in hosting platform
- Check spelling and values

### CORS Errors in Production

1. Verify Apps Script is deployed as "Anyone"
2. Enable JSONP fallback (automatic)
3. Or use proxy mode:
   ```env
   VITE_USE_PROXY=true
   VITE_PROXY_URL=https://your-proxy.com/api
   ```

### Polling Not Working

1. Check browser console for errors
2. Verify GET_ORDERS_URL is accessible
3. Test endpoint with curl
4. Check Network tab for requests

### Orders Not Updating

1. Verify UPDATE_STATUS_URL is correct
2. Check payload format matches Apps Script
3. Review Apps Script execution logs
4. Test with curl

---

## 📈 Optimization Tips

### 1. Enable CDN Caching

Both Vercel and Netlify provide global CDN by default.

### 2. Optimize Images

```bash
# Install image optimizer
npm install -D vite-plugin-image-optimizer

# Add to vite.config.js
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

plugins: [
  react(),
  ViteImageOptimizer()
]
```

### 3. Code Splitting

Already implemented for charts:
```javascript
const TopItemsChart = lazy(() => import('./components/TopItemsChart'))
```

### 4. Enable Compression

Vercel and Netlify automatically compress with Brotli and gzip.

---

## 🔄 Continuous Deployment

### Automatic Deployments

**Vercel/Netlify with GitHub:**
- Push to `main` → auto-deploy to production
- Push to other branches → deploy preview

### Preview Deployments

Every PR gets a preview URL:
- Test changes before merging
- Share with team for review
- Automatic cleanup on PR close

---

## 📞 Support

### Vercel Support
- Documentation: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions

### Netlify Support
- Documentation: https://docs.netlify.com
- Community: https://answers.netlify.com

---

## ✅ Deployment Complete!

Your Owner Portal is now live and accessible globally with:
- ✅ Fast global CDN
- ✅ Automatic HTTPS
- ✅ Continuous deployment
- ✅ Preview deployments
- ✅ Analytics and monitoring
- ✅ Automatic scaling

**Production URL:** `https://owner-portal.vercel.app`

---

**Congratulations! Your app is deployed!** 🎉



