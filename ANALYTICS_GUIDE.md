# Analytics Page - Implementation Guide

## 📊 Overview

The Analytics page provides comprehensive business insights with:
- Key metrics (Revenue, Orders, Average Ticket, Repeat Customer Rate)
- Time period selection (Day/Week/Month)
- Top 5 selling items bar chart
- Hourly orders distribution heatmap
- AI-powered action card with recommendations
- CSV export functionality for Orders, Customers, and Analytics

## 🏗️ Architecture

### Files Created

1. **`src/pages/Analytics.jsx`** - Main analytics page
2. **`src/utils/insights.js`** - Analytics computation engine
3. **`src/utils/export.js`** - CSV export utilities
4. **`src/components/ActionCard.jsx`** - Recommendation card
5. **`src/components/MetricCard.jsx`** - Metric display card
6. **`src/components/TopItemsChart.jsx`** - Top items bar chart
7. **`src/components/HourlyChart.jsx`** - Hourly distribution chart

## 📈 Features

### Key Metrics

1. **Revenue** - Total revenue for selected period (day/week/month)
2. **Orders Count** - Number of orders in period
3. **Average Ticket** - Average order value
4. **Repeat Customer Rate** - Percentage of returning customers

### Charts

#### Top 5 Selling Items (Bar Chart)
- Shows quantity sold for top 5 items
- Color-coded bars
- Hover tooltip with sales and revenue
- Responsive design

#### Hourly Orders Distribution (Area Chart)
- 24-hour view of order activity
- Identifies peak hours
- Sparkline visualization
- Shows total active hours

### Action Card - AI Recommendations

Client-side rules engine that analyzes data and generates prioritized recommendations:

#### Rule 1: Low Sales Items (Warning)
```javascript
if (salesCount < 5 && salesCount > 0)
  → "Promote [item] - only X sales"
```

#### Rule 2: Low Margin Items (Danger)
```javascript
if (estimatedMargin < $5 && salesCount > 10)
  → "Increase price on [item] - low margin"
```

#### Rule 3: Low Average Ticket (Info)
```javascript
if (averageTicket < $30)
  → "Upsell opportunity - train staff"
```

#### Rule 4: Low Repeat Rate (Warning)
```javascript
if (repeatCustomerRate < 30%)
  → "Launch loyalty program"
```

#### Rule 5: Star Performer (Success)
```javascript
if (salesCount > 20)
  → "Create variations of [top item]"
```

### Export Functionality

#### Export Orders CSV
Contains:
- Order ID, Table, Customer Name, Phone
- Status, Created Date, Items Count
- Items detail, Subtotal, Tax, Delivery
- Total, Margin, Notes

#### Export Customers CSV
Contains:
- Name, Phone, Address
- Total Orders, Total Spent
- Average Order Value
- First Order, Last Order
- Customer Type (New/Repeat)

#### Export Analytics CSV
Contains:
- All key metrics
- Top selling items with sales data
- Ready for import into Excel/Sheets

## 🎨 UI Components

### MetricCard
```jsx
<MetricCard
  title="Revenue (day)"
  value="$1,234.56"
  icon={DollarSign}
  color="success"
/>
```

### ActionCard
```jsx
<ActionCard 
  recommendation={{
    type: 'warning',
    title: 'Boost Sales',
    message: 'Item X needs attention',
    action: {
      label: 'View Details',
      metric: '5 sales • $50 revenue'
    }
  }}
/>
```

### Charts
```jsx
<TopItemsChart data={topItems} />
<HourlyChart data={hourlyDistribution} />
```

## 🔧 Insights Utility

### Functions Available

```javascript
import { 
  calculateRevenue,
  countOrders,
  calculateAverageTicket,
  getTopSellingItems,
  getHourlyOrdersDistribution,
  calculateRepeatCustomerRate,
  generateActionCard,
  getAnalyticsSummary
} from '../utils/insights'
```

### Usage Example

```javascript
// Get complete analytics summary
const summary = getAnalyticsSummary(orders, 'day')

// Returns:
{
  revenue: 1234.56,
  ordersCount: 45,
  averageTicket: 27.43,
  repeatCustomerRate: 35.5,
  topItems: [...],
  hourlyDistribution: [...],
  actionCard: {...}
}
```

### Calculate Specific Metrics

```javascript
// Revenue for specific period
const dailyRevenue = calculateRevenue(orders, 'day')
const weeklyRevenue = calculateRevenue(orders, 'week')
const monthlyRevenue = calculateRevenue(orders, 'month')

// Top selling items
const top5 = getTopSellingItems(orders, 5)
// Returns: [{ name, quantity, revenue, orderCount }, ...]

// Hourly distribution
const hourlyData = getHourlyOrdersDistribution(orders)
// Returns: [{ hour: 0-23, count }, ...]

// Repeat customer rate
const repeatRate = calculateRepeatCustomerRate(orders)
// Returns: percentage (0-100)
```

## 📤 Export Utility

### Export Orders

```javascript
import { exportOrdersToCSV } from '../utils/export'

exportOrdersToCSV(orders)
// Downloads: orders_2024-01-01.csv
```

### Export Customers

```javascript
import { exportCustomersToCSV } from '../utils/export'

exportCustomersToCSV(orders)
// Downloads: customers_2024-01-01.csv
```

### Export Analytics

```javascript
import { exportAnalyticsToCSV } from '../utils/export'

exportAnalyticsToCSV(summary)
// Downloads: analytics_2024-01-01.csv
```

## 🎯 Time Period Filtering

Toggle between Day/Week/Month:

```javascript
const [timePeriod, setTimePeriod] = useState('day')

// Recalculate when period changes
const summary = useMemo(() => {
  return getAnalyticsSummary(orders, timePeriod)
}, [orders, timePeriod])
```

## 📊 Chart Configuration

### Top Items Chart (Recharts BarChart)

```javascript
<BarChart data={data}>
  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
  <XAxis dataKey="name" />
  <YAxis label="Sales" />
  <Tooltip />
  <Bar dataKey="quantity" radius={[8, 8, 0, 0]}>
    {/* Multi-color bars */}
    <Cell fill={colors[index]} />
  </Bar>
</BarChart>
```

### Hourly Chart (Recharts AreaChart)

```javascript
<AreaChart data={data}>
  <defs>
    <linearGradient id="colorCount">
      {/* Gradient fill */}
    </linearGradient>
  </defs>
  <XAxis dataKey="hour" tickFormatter={formatXAxis} />
  <YAxis />
  <Tooltip />
  <Area 
    type="monotone" 
    dataKey="count" 
    stroke="#3B82F6"
    fill="url(#colorCount)" 
  />
</AreaChart>
```

## 🎨 Design System Integration

All components use design system tokens:

```css
Colors:
- Primary: #3B82F6
- Success: #22C55E
- Warning: #F59E0B
- Danger: #EF4444
- Accent: #F97316
- Teal: #14B8A6

Shadows:
- card-elevated
- shadow-elevation-lg
- shadow-elevation-md

Spacing:
- gap-2, gap-4, gap-6
- p-4, p-6
- mb-2, mb-4, mb-6
```

## 🚀 Performance Optimization

### Memoization

```javascript
// Recalculate only when orders or period changes
const summary = useMemo(() => {
  return getAnalyticsSummary(orders, timePeriod)
}, [orders, timePeriod])
```

### Lightweight Charts

- Recharts uses SVG (lightweight)
- Responsive containers
- Custom tooltips for better UX
- Minimal re-renders

## ♿ Accessibility

✅ Semantic HTML structure  
✅ Color contrast meets WCAG AA  
✅ Keyboard navigation  
✅ ARIA labels on interactive elements  
✅ Screen reader friendly  

## 📝 Customization

### Adjust Recommendation Rules

Edit `src/utils/insights.js`:

```javascript
// Change thresholds
const lowSalesItems = itemMetrics
  .filter(item => item.salesCount < 10) // Change from 5 to 10

// Change margin threshold
const lowMarginItems = itemMetrics
  .filter(item => item.estimatedMargin < 8) // Change from 5 to 8
```

### Add New Metrics

```javascript
// In insights.js
export function calculateNewMetric(orders) {
  // Your calculation
  return value
}

// In Analytics.jsx
const newMetric = calculateNewMetric(orders)
```

### Customize Chart Colors

```javascript
// In TopItemsChart.jsx
const colors = [
  '#3B82F6',  // Primary
  '#14B8A6',  // Teal
  '#F97316',  // Accent
  '#22C55E',  // Success
  '#F59E0B'   // Warning
]
```

## 🧪 Testing

### Test with Mock Data

```javascript
import { mockOrders } from '../config/mockData'
const summary = getAnalyticsSummary(mockOrders, 'day')
```

### Verify Calculations

```javascript
console.log('Revenue:', summary.revenue)
console.log('Orders:', summary.ordersCount)
console.log('Avg Ticket:', summary.averageTicket)
console.log('Repeat Rate:', summary.repeatCustomerRate)
console.log('Top Items:', summary.topItems)
console.log('Action Card:', summary.actionCard)
```

## 📱 Responsive Design

- **Desktop**: 4-column metric grid, 2-column charts
- **Tablet**: 2-column metrics, stacked charts
- **Mobile**: Single column layout

## 🎯 Usage

### Navigate to Analytics

```
http://localhost:3000/analytics
```

### Test Features

1. **Toggle time periods** - Day/Week/Month
2. **View metrics** - Revenue, Orders, etc.
3. **Check action card** - See recommendations
4. **Hover charts** - View tooltips
5. **Export data** - Try all 3 export buttons

## 🔌 Integration with Real API

The analytics work with existing orders from the store:

```javascript
const { orders } = useStore()
```

No additional API calls needed - all calculations are client-side for performance.

## 💡 Best Practices

1. **Client-side computation** - Fast, no API latency
2. **Memoization** - Prevents unnecessary recalculations
3. **Responsive charts** - Adapts to screen size
4. **Lightweight** - Uses Recharts (SVG-based)
5. **Accessible** - Full keyboard and screen reader support

## 🐛 Troubleshooting

### Charts Not Showing

Check:
1. Data is not empty
2. ResponsiveContainer has valid parent width
3. Data format matches chart requirements

### Export Not Working

Check:
1. Browser allows downloads
2. Data array is not empty
3. No popup blocker interfering

### Wrong Calculations

Verify:
1. Orders have correct date format
2. Status filtering is working
3. Time period math is correct

## 📚 Related Documentation

- **Insights Utility**: `src/utils/insights.js`
- **Export Utility**: `src/utils/export.js`
- **Recharts Docs**: https://recharts.org/
- **Design System**: `DESIGN_SYSTEM.md`

## ✅ Features Summary

✅ Revenue tracking (day/week/month)  
✅ Orders count with time filters  
✅ Average ticket calculation  
✅ Repeat customer rate  
✅ Top 5 selling items bar chart  
✅ Hourly orders heatmap  
✅ AI-powered action cards  
✅ Export Orders CSV  
✅ Export Customers CSV  
✅ Export Analytics CSV  
✅ Responsive charts  
✅ Client-side computation  
✅ Design system integration  
✅ Full accessibility  

---

**Analytics page is production-ready!** All metrics, charts, and export features fully implemented. 📊


