# Testing Guide - Owner Portal

## 🧪 Testing Stack

- **Unit Tests:** Vitest
- **E2E Tests:** Cypress
- **Accessibility:** axe-core
- **Linting:** ESLint with jsx-a11y plugin

## 📦 Installation

```bash
# Install all test dependencies
npm install
```

Dependencies installed:
- `vitest` - Unit testing
- `@vitest/ui` - Test UI
- `cypress` - E2E testing
- `@axe-core/react` - Accessibility testing
- `eslint-plugin-jsx-a11y` - Accessibility linting

## 🎯 Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test

# Run with coverage report
npm run test:coverage

# Watch mode (re-run on file changes)
npm run test:watch

# Run specific test file
npm run test tests/utils/insights.test.js
```

### E2E Tests (Cypress)

```bash
# Open Cypress Test Runner (interactive)
npm run cypress:open

# Run all tests headless
npm run cypress:run

# Run specific test file
npm run cypress:run --spec "cypress/e2e/order-flow.cy.js"
```

### Linting & Accessibility

```bash
# Run ESLint
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## 📋 Manual Acceptance Tests

### Test 1: Order Display (< 3 seconds)

**Steps:**
1. Open Owner Portal: `http://localhost:3000/orders`
2. Add a test order to Google Sheet manually OR via webhook
3. Start timer

**Expected:**
- ✅ Order appears within 3 seconds
- ✅ Shows: Order ID, Customer, Table, Timer, Items, Total
- ✅ Live timer starts counting
- ✅ Status chip shows correct color

**Pass Criteria:** Order visible in ≤ 3 seconds

---

### Test 2: Status Update (< 2 seconds)

**Steps:**
1. Open orders page
2. Find a "Pending" order
3. Click "Accept" button
4. Note time

**Expected:**
- ✅ UI updates immediately (optimistic)
- ✅ Button changes to "Start Preparing"
- ✅ Status chip changes to "Accepted"
- ✅ Toast notification appears
- ✅ Google Sheet updated within 2 seconds

**Verification:**
```bash
# Check Google Sheet
# Status column should show "Accepted"
```

**Pass Criteria:** Sheet updated in ≤ 2 seconds

---

### Test 3: Real-Time Polling

**Steps:**
1. Open orders page
2. Leave browser tab open
3. In another window, add new order to Sheet
4. Switch back to Owner Portal tab

**Expected:**
- ✅ New order appears within 3 seconds
- ✅ Pulse animation on new order (5 seconds)
- ✅ No manual refresh needed

**Pass Criteria:** Auto-update within 3 seconds

---

### Test 4: Tab Visibility (Pause Polling)

**Steps:**
1. Open orders page
2. Open browser DevTools → Console
3. Switch to another tab for 10 seconds
4. Switch back to orders tab

**Expected in Console:**
- ✅ "Tab hidden - pausing polling"
- ✅ No polling requests while hidden
- ✅ "Tab visible - resuming polling"
- ✅ Polling resumes immediately

**Pass Criteria:** Polling pauses when hidden

---

### Test 5: Analytics Refresh

**Steps:**
1. Navigate to Analytics page
2. Note current metrics
3. Add 2-3 orders via Sheet
4. Click "Refresh" or wait for auto-update
5. Check metrics

**Expected:**
- ✅ Metrics update within 2 seconds
- ✅ Charts redraw with new data
- ✅ Top items list updates
- ✅ Action card may change

**Pass Criteria:** Charts update in ≤ 2 seconds

---

### Test 6: Offline Mode

**Steps:**
1. Load orders page (orders cache)
2. Open DevTools → Network tab
3. Set to "Offline" mode
4. Try to update order status

**Expected:**
- ✅ "Offline" indicator appears
- ✅ Cached orders still visible
- ✅ Status update shows error toast
- ✅ No API calls made

**Steps (Recovery):**
5. Set back to "Online"
6. Wait 3 seconds

**Expected:**
- ✅ Offline indicator disappears
- ✅ Polling resumes automatically
- ✅ Fresh data loads

**Pass Criteria:** Graceful offline handling

---

### Test 7: Export CSV

**Steps:**
1. Go to Analytics page
2. Click "Export Orders" button

**Expected:**
- ✅ CSV file downloads
- ✅ Filename: `orders_YYYY-MM-DD.csv`
- ✅ Contains all order data
- ✅ Opens in Excel/Sheets correctly

**Verify CSV contains:**
- Order ID, Customer, Phone, Status
- Items, Totals, Timestamps

**Pass Criteria:** Valid CSV downloads

---

### Test 8: Responsive Design

**Test on 3 screen sizes:**

#### Desktop (1920×1080)
- ✅ Sidebar expanded (256px)
- ✅ 3-column order grid
- ✅ All KPIs visible in topbar
- ✅ No bottom nav

#### Tablet (768×1024)
- ✅ Sidebar icon-only (80px)
- ✅ 2-column order grid
- ✅ KPIs visible
- ✅ Bottom nav visible

#### Mobile (375×667)
- ✅ Sidebar hidden (overlay when opened)
- ✅ Single-column layout
- ✅ Bottom nav primary navigation
- ✅ Tables switch to card layout
- ✅ All buttons ≥ 44px

**Pass Criteria:** All layouts work correctly

---

## ♿ Accessibility Tests

### Keyboard Navigation

**Test:**
1. Use only keyboard (no mouse)
2. Tab through all interactive elements
3. Enter/Space to activate
4. Escape to close modals

**Checklist:**
- [ ] Can reach all interactive elements
- [ ] Tab order is logical
- [ ] Focus is always visible
- [ ] No keyboard traps
- [ ] Modals can be closed with Escape
- [ ] Enter activates buttons/links

---

### Screen Reader (NVDA/JAWS)

**Test:**
1. Enable screen reader
2. Navigate through app
3. Verify announcements

**Checklist:**
- [ ] All images have alt text
- [ ] Form labels announced
- [ ] Button purposes clear
- [ ] Status changes announced
- [ ] Error messages announced
- [ ] Loading states announced

---

### Color Contrast

**Tool:** Chrome DevTools Lighthouse or axe DevTools

**Checklist:**
- [ ] All text ≥ 4.5:1 contrast
- [ ] Large text ≥ 3:1 contrast
- [ ] UI components ≥ 3:1 contrast
- [ ] Focus indicators ≥ 3:1 contrast
- [ ] No color-only indicators

**Pass Criteria:** All WCAG AA requirements met

---

### Focus Management

**Test:**
1. Open modal
2. Tab through modal elements
3. Tab should not leave modal

**Checklist:**
- [ ] Focus trapped in modal
- [ ] First element focused on open
- [ ] Focus returns on close
- [ ] Skip links available (optional)

---

## ⚡ Performance Tests

### Initial Load Time

**Tool:** Chrome DevTools Lighthouse

**Target Metrics:**
- First Contentful Paint: < 1.0s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Speed Index: < 3.0s
- Cumulative Layout Shift: < 0.1

**Test:**
```bash
npm run build
npm run preview

# Open http://localhost:4173
# Run Lighthouse in Chrome DevTools
# Use "Mobile" and "Desktop" profiles
```

**Pass Criteria:**
- Mobile: Performance score ≥ 85
- Desktop: Performance score ≥ 90

---

### Bundle Size

**Test:**
```bash
npm run build

# Check dist/ folder size
du -sh dist/

# Should be < 1MB total
```

**Expected:**
- JavaScript: < 300KB (gzipped)
- CSS: < 50KB (gzipped)
- Assets: < 200KB

---

### Runtime Performance

**Test with React DevTools Profiler:**

1. Enable profiler
2. Navigate to orders page
3. Change status on multiple orders
4. Check render times

**Checklist:**
- [ ] No unnecessary re-renders
- [ ] Status updates < 16ms
- [ ] Smooth 60fps animations
- [ ] No memory leaks

---

## 🔄 Integration Test Scenarios

### Scenario 1: Complete Order Flow

```
1. Customer places order (webhook)
   ↓
2. Order appears in Google Sheet
   ↓
3. Owner Portal polls and shows order (< 3s)
   ↓
4. Owner clicks "Accept"
   ↓
5. UI updates immediately (optimistic)
   ↓
6. API call updates Sheet (< 2s)
   ↓
7. Toast shows "Update successful"
```

**Run with Cypress:**
```bash
npm run cypress:run --spec "cypress/e2e/order-flow.cy.js"
```

---

### Scenario 2: Error Handling

```
1. Load orders page
   ↓
2. Disconnect internet
   ↓
3. Verify offline indicator
   ↓
4. Try to update status
   ↓
5. Error toast appears
   ↓
6. Reconnect internet
   ↓
7. Polling resumes
   ↓
8. Retry status update
   ↓
9. Success
```

---

### Scenario 3: Concurrent Updates

```
1. Two users open same order
   ↓
2. User A changes status to "Preparing"
   ↓
3. User B sees update within 3s (polling)
   ↓
4. User B tries to change to "Ready"
   ↓
5. Both changes reflected correctly
```

---

## 📊 Coverage Goals

### Unit Test Coverage

**Target:** > 80% coverage

```bash
npm run test:coverage
```

**Priority files:**
- `src/utils/insights.js` - 100%
- `src/utils/export.js` - 90%
- `src/config/api.js` - 80%
- `src/hooks/*.js` - 80%

### E2E Test Coverage

**Critical paths:**
- [ ] Order display
- [ ] Status updates
- [ ] Polling
- [ ] Offline mode
- [ ] Analytics
- [ ] Export
- [ ] Search/Filter

---

## 🐛 Debugging Tests

### Vitest

```bash
# Run with UI
npm run test -- --ui

# Debug specific test
npm run test -- --reporter=verbose tests/utils/insights.test.js
```

### Cypress

```bash
# Open interactive runner
npm run cypress:open

# Click on test file
# Use time-travel debugging
# Inspect each step
```

---

## ✅ Pre-Deployment Checklist

### Functionality
- [ ] All manual acceptance tests pass
- [ ] Unit tests pass (> 80% coverage)
- [ ] E2E tests pass
- [ ] No console errors
- [ ] All features work in production build

### Performance
- [ ] Lighthouse score > 85 (mobile)
- [ ] Lighthouse score > 90 (desktop)
- [ ] Bundle size < 1MB
- [ ] Initial paint < 1s
- [ ] No memory leaks

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast WCAG AA
- [ ] 44px tap targets
- [ ] Focus indicators visible

### Security
- [ ] No hardcoded secrets
- [ ] Environment variables configured
- [ ] HTTPS in production
- [ ] CORS configured
- [ ] Input validation

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

**All tests configured and ready to run!** 🎯


