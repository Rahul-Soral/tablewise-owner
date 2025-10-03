/**
 * Export Utility
 * Functions to export data as CSV files
 */

/**
 * Convert array of objects to CSV string
 */
function arrayToCSV(data, headers) {
  if (data.length === 0) return ''

  // Create header row
  const headerRow = headers.join(',')

  // Create data rows
  const dataRows = data.map(row => {
    return headers.map(header => {
      let value = row[header]
      
      // Handle nested objects or arrays
      if (typeof value === 'object' && value !== null) {
        value = JSON.stringify(value).replace(/"/g, '""')
      }
      
      // Escape quotes and wrap in quotes if contains comma
      if (value && (value.toString().includes(',') || value.toString().includes('"'))) {
        value = `"${value.toString().replace(/"/g, '""')}"`
      }
      
      return value || ''
    }).join(',')
  })

  return [headerRow, ...dataRows].join('\n')
}

/**
 * Download CSV file
 */
function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (navigator.msSaveBlob) {
    // IE 10+
    navigator.msSaveBlob(blob, filename)
  } else {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Export orders to CSV
 */
export function exportOrdersToCSV(orders) {
  const exportData = orders.map(order => ({
    'Order ID': order.id,
    'Table': order.table || 'N/A',
    'Customer Name': order.customerName,
    'Customer Phone': order.customerPhone || 'N/A',
    'Status': order.status,
    'Created At': new Date(order.createdAt).toLocaleString(),
    'Items Count': order.items.length,
    'Items': order.items.map(item => `${item.quantity}x ${item.name}`).join('; '),
    'Subtotal': order.subtotal.toFixed(2),
    'Tax': order.tax.toFixed(2),
    'Delivery Fee': order.deliveryFee.toFixed(2),
    'Total': order.total.toFixed(2),
    'Margin': order.margin ? order.margin.toFixed(2) : 'N/A',
    'Notes': order.notes || 'N/A'
  }))

  const headers = [
    'Order ID',
    'Table',
    'Customer Name',
    'Customer Phone',
    'Status',
    'Created At',
    'Items Count',
    'Items',
    'Subtotal',
    'Tax',
    'Delivery Fee',
    'Total',
    'Margin',
    'Notes'
  ]

  const csv = arrayToCSV(exportData, headers)
  const filename = `orders_${new Date().toISOString().split('T')[0]}.csv`
  
  downloadCSV(csv, filename)
}

/**
 * Export customers to CSV
 */
export function exportCustomersToCSV(orders) {
  // Extract unique customers
  const customersMap = new Map()

  orders.forEach(order => {
    const key = order.customerPhone || order.customerName
    if (!customersMap.has(key)) {
      customersMap.set(key, {
        name: order.customerName,
        phone: order.customerPhone || 'N/A',
        address: order.customerAddress || 'N/A',
        orderCount: 0,
        totalSpent: 0,
        firstOrder: order.createdAt,
        lastOrder: order.createdAt
      })
    }

    const customer = customersMap.get(key)
    customer.orderCount++
    customer.totalSpent += order.total
    
    // Update first and last order dates
    if (new Date(order.createdAt) < new Date(customer.firstOrder)) {
      customer.firstOrder = order.createdAt
    }
    if (new Date(order.createdAt) > new Date(customer.lastOrder)) {
      customer.lastOrder = order.createdAt
    }
  })

  const exportData = Array.from(customersMap.values()).map(customer => ({
    'Name': customer.name,
    'Phone': customer.phone,
    'Address': customer.address,
    'Total Orders': customer.orderCount,
    'Total Spent': customer.totalSpent.toFixed(2),
    'Average Order Value': (customer.totalSpent / customer.orderCount).toFixed(2),
    'First Order': new Date(customer.firstOrder).toLocaleString(),
    'Last Order': new Date(customer.lastOrder).toLocaleString(),
    'Customer Type': customer.orderCount > 1 ? 'Repeat' : 'New'
  }))

  const headers = [
    'Name',
    'Phone',
    'Address',
    'Total Orders',
    'Total Spent',
    'Average Order Value',
    'First Order',
    'Last Order',
    'Customer Type'
  ]

  const csv = arrayToCSV(exportData, headers)
  const filename = `customers_${new Date().toISOString().split('T')[0]}.csv`
  
  downloadCSV(csv, filename)
}

/**
 * Export analytics summary to CSV
 */
export function exportAnalyticsToCSV(summary) {
  const exportData = [
    { Metric: 'Total Revenue', Value: `$${summary.revenue.toFixed(2)}` },
    { Metric: 'Total Orders', Value: summary.ordersCount },
    { Metric: 'Average Ticket', Value: `$${summary.averageTicket.toFixed(2)}` },
    { Metric: 'Repeat Customer Rate', Value: `${summary.repeatCustomerRate.toFixed(1)}%` },
    { Metric: '', Value: '' }, // Empty row
    { Metric: 'Top Selling Items', Value: '' },
    ...summary.topItems.map((item, i) => ({
      Metric: `${i + 1}. ${item.name}`,
      Value: `${item.quantity} sold • $${item.revenue.toFixed(2)}`
    }))
  ]

  const headers = ['Metric', 'Value']
  const csv = arrayToCSV(exportData, headers)
  const filename = `analytics_${new Date().toISOString().split('T')[0]}.csv`
  
  downloadCSV(csv, filename)
}


