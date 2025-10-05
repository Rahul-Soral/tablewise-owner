/**
 * Insights Utility
 * Computes analytics metrics and generates actionable recommendations
 * from orders data
 */

/**
 * Calculate revenue for different time periods
 */
export function calculateRevenue(orders, period = 'day') {
  const now = new Date()
  let startDate

  switch (period) {
    case 'day':
      startDate = new Date(now.setHours(0, 0, 0, 0))
      break
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7))
      break
    case 'month':
      startDate = new Date(now.setDate(now.getDate() - 30))
      break
    default:
      startDate = new Date(0)
  }

  return orders
    .filter(order => 
      new Date(order.createdAt) >= startDate && 
      order.status !== 'cancelled'
    )
    .reduce((sum, order) => sum + order.total, 0)
}

/**
 * Count orders for different time periods
 */
export function countOrders(orders, period = 'day') {
  const now = new Date()
  let startDate

  switch (period) {
    case 'day':
      startDate = new Date(now.setHours(0, 0, 0, 0))
      break
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7))
      break
    case 'month':
      startDate = new Date(now.setDate(now.getDate() - 30))
      break
    default:
      startDate = new Date(0)
  }

  return orders.filter(order => 
    new Date(order.createdAt) >= startDate
  ).length
}

/**
 * Calculate average ticket (order value)
 */
export function calculateAverageTicket(orders) {
  const completedOrders = orders.filter(order => 
    order.status !== 'cancelled'
  )

  if (completedOrders.length === 0) return 0

  const totalRevenue = completedOrders.reduce((sum, order) => 
    sum + order.total, 0
  )

  return totalRevenue / completedOrders.length
}

/**
 * Get top selling items with sales count and revenue
 */
export function getTopSellingItems(orders, limit = 5) {
  const itemStats = {}

  // Aggregate item data
  orders.forEach(order => {
    if (order.status === 'cancelled') return

    order.items.forEach(item => {
      if (!itemStats[item.name]) {
        itemStats[item.name] = {
          name: item.name,
          quantity: 0,
          revenue: 0,
          orderCount: 0
        }
      }

      itemStats[item.name].quantity += item.quantity
      itemStats[item.name].revenue += item.price * item.quantity
      itemStats[item.name].orderCount += 1
    })
  })

  // Convert to array and sort by quantity
  return Object.values(itemStats)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit)
}

/**
 * Generate hourly orders distribution
 * Returns array of { hour, count } for 24 hours
 */
export function getHourlyOrdersDistribution(orders) {
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    count: 0
  }))

  orders.forEach(order => {
    const hour = new Date(order.createdAt).getHours()
    hourlyData[hour].count++
  })

  return hourlyData
}

/**
 * Calculate repeat customer rate
 */
export function calculateRepeatCustomerRate(orders) {
  const customerOrders = {}

  orders.forEach(order => {
    const phone = order.customerPhone || order.customerName
    if (!customerOrders[phone]) {
      customerOrders[phone] = 0
    }
    customerOrders[phone]++
  })

  const totalCustomers = Object.keys(customerOrders).length
  const repeatCustomers = Object.values(customerOrders)
    .filter(count => count > 1).length

  if (totalCustomers === 0) return 0

  return (repeatCustomers / totalCustomers) * 100
}

/**
 * Calculate item-level metrics for recommendations
 */
export function getItemMetrics(orders) {
  const itemMetrics = {}

  orders.forEach(order => {
    if (order.status === 'cancelled') return

    order.items.forEach(item => {
      if (!itemMetrics[item.name]) {
        itemMetrics[item.name] = {
          name: item.name,
          salesCount: 0,
          revenue: 0,
          avgPrice: 0,
          // Estimate margin (simplified - in real app, would come from product data)
          estimatedMargin: 0
        }
      }

      itemMetrics[item.name].salesCount += item.quantity
      itemMetrics[item.name].revenue += item.price * item.quantity
      itemMetrics[item.name].avgPrice = item.price
      // Simplified margin calculation (40% assumed cost ratio)
      itemMetrics[item.name].estimatedMargin = item.price * 0.4
    })
  })

  return Object.values(itemMetrics)
}

/**
 * Generate actionable recommendations based on data analysis
 */
export function generateActionCard(orders) {
  if (orders.length === 0) {
    return {
      type: 'info',
      title: 'Getting Started',
      message: 'Start accepting orders to see personalized recommendations',
      action: null
    }
  }

  const itemMetrics = getItemMetrics(orders)
  const avgTicket = calculateAverageTicket(orders)
  const repeatRate = calculateRepeatCustomerRate(orders)

  // Rule 1: Low sales + exists (promote item)
  const lowSalesItems = itemMetrics
    .filter(item => item.salesCount < 5 && item.salesCount > 0)
    .sort((a, b) => a.salesCount - b.salesCount)

  if (lowSalesItems.length > 0) {
    const item = lowSalesItems[0]
    return {
      type: 'warning',
      title: 'Boost Sales Opportunity',
      message: `"${item.name}" has only ${item.salesCount} sales. Consider featuring it as a daily special or bundling with popular items.`,
      action: {
        label: 'View Item Details',
        metric: `${item.salesCount} sales • $${item.revenue.toFixed(2)} revenue`
      }
    }
  }

  // Rule 2: Low margin items with decent sales (increase price)
  const lowMarginItems = itemMetrics
    .filter(item => item.estimatedMargin < 5 && item.salesCount > 10)
    .sort((a, b) => a.estimatedMargin - b.estimatedMargin)

  if (lowMarginItems.length > 0) {
    const item = lowMarginItems[0]
    return {
      type: 'danger',
      title: 'Low Margin Alert',
      message: `"${item.name}" has low profit margin ($${item.estimatedMargin.toFixed(2)}). Consider a 10-15% price increase to improve profitability.`,
      action: {
        label: 'Adjust Pricing',
        metric: `${item.salesCount} sales • $${item.estimatedMargin.toFixed(2)} margin`
      }
    }
  }

  // Rule 3: Low average ticket (upsell opportunity)
  if (avgTicket < 30) {
    return {
      type: 'info',
      title: 'Upsell Opportunity',
      message: `Average order value is $${avgTicket.toFixed(2)}. Train staff to suggest appetizers, drinks, or desserts to increase ticket size.`,
      action: {
        label: 'View Sales Training',
        metric: `Target: $40+ per order`
      }
    }
  }

  // Rule 4: Low repeat customer rate
  if (repeatRate < 30) {
    return {
      type: 'warning',
      title: 'Customer Retention',
      message: `Only ${repeatRate.toFixed(1)}% of customers are returning. Consider launching a loyalty program or email marketing campaign.`,
      action: {
        label: 'Start Loyalty Program',
        metric: `Current rate: ${repeatRate.toFixed(1)}%`
      }
    }
  }

  // Rule 5: High sales item (capitalize on success)
  const topItem = itemMetrics.sort((a, b) => b.salesCount - a.salesCount)[0]
  if (topItem && topItem.salesCount > 20) {
    return {
      type: 'success',
      title: 'Star Performer',
      message: `"${topItem.name}" is your top seller with ${topItem.salesCount} orders! Consider creating variations or a premium version.`,
      action: {
        label: 'Expand Menu',
        metric: `$${topItem.revenue.toFixed(2)} revenue`
      }
    }
  }

  // Default: positive message
  return {
    type: 'success',
    title: 'Looking Good!',
    message: 'Your business metrics are healthy. Keep up the great work!',
    action: null
  }
}

/**
 * Get analytics summary for a time period
 */
export function getAnalyticsSummary(orders, period = 'day') {
  return {
    revenue: calculateRevenue(orders, period),
    ordersCount: countOrders(orders, period),
    averageTicket: calculateAverageTicket(orders),
    repeatCustomerRate: calculateRepeatCustomerRate(orders),
    topItems: getTopSellingItems(orders, 5),
    hourlyDistribution: getHourlyOrdersDistribution(orders),
    actionCard: generateActionCard(orders)
  }
}



