/**
 * Mock Data for Development
 * Example order structure with all required fields
 */

export const mockOrders = [
  {
    id: 'ORD-001',
    table: '12',
    customerName: 'John Smith',
    customerPhone: '+1234567890',
    customerAddress: '123 Main St, Apt 4B, New York, NY 10001',
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 60000).toISOString(), // 2 minutes ago
    acceptedAt: null,
    preparingAt: null,
    readyAt: null,
    servedAt: null,
    items: [
      { 
        name: 'Margherita Pizza', 
        quantity: 2, 
        price: 15.99,
        modifiers: ['Extra Cheese', 'Thin Crust'],
        specialInstructions: 'Well done, please'
      },
      { 
        name: 'Caesar Salad', 
        quantity: 1, 
        price: 8.99,
        modifiers: ['No Croutons', 'Extra Dressing']
      },
      { 
        name: 'Garlic Bread', 
        quantity: 1, 
        price: 5.99,
        modifiers: []
      },
    ],
    subtotal: 46.96,
    tax: 3.76,
    deliveryFee: 0,
    total: 50.72,
    margin: 21.30,
    notes: 'Customer requested contactless delivery. Leave at door.'
  },
  {
    id: 'ORD-002',
    table: '7',
    customerName: 'Sarah Johnson',
    customerPhone: '+1987654321',
    customerAddress: '456 Oak Avenue, Brooklyn, NY 11201',
    status: 'preparing',
    createdAt: new Date(Date.now() - 8 * 60000).toISOString(), // 8 minutes ago
    acceptedAt: new Date(Date.now() - 7 * 60000).toISOString(),
    preparingAt: new Date(Date.now() - 5 * 60000).toISOString(),
    readyAt: null,
    servedAt: null,
    items: [
      { 
        name: 'Classic Cheeseburger', 
        quantity: 1, 
        price: 12.99,
        modifiers: ['No Onions', 'Extra Pickles', 'Medium Well']
      },
      { 
        name: 'French Fries (Large)', 
        quantity: 2, 
        price: 4.99,
        modifiers: ['Extra Crispy']
      },
      { 
        name: 'Coca Cola', 
        quantity: 2, 
        price: 2.99,
        modifiers: ['No Ice']
      },
      { 
        name: 'Onion Rings', 
        quantity: 1, 
        price: 6.99,
        modifiers: []
      },
    ],
    subtotal: 35.94,
    tax: 2.88,
    deliveryFee: 3.50,
    total: 42.32,
    margin: 18.50
  },
  {
    id: 'ORD-003',
    table: '5',
    customerName: 'Mike Davis',
    customerPhone: '+1122334455',
    status: 'ready',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    acceptedAt: new Date(Date.now() - 14 * 60000).toISOString(),
    preparingAt: new Date(Date.now() - 12 * 60000).toISOString(),
    readyAt: new Date(Date.now() - 2 * 60000).toISOString(),
    servedAt: null,
    items: [
      { 
        name: 'Spaghetti Carbonara', 
        quantity: 1, 
        price: 16.99,
        modifiers: ['Extra Parmesan']
      },
      { 
        name: 'Tiramisu', 
        quantity: 1, 
        price: 7.99,
        modifiers: []
      },
      { 
        name: 'House Red Wine', 
        quantity: 1, 
        price: 9.99,
        modifiers: []
      },
    ],
    subtotal: 34.97,
    tax: 2.80,
    deliveryFee: 0,
    total: 37.77,
    margin: 15.80,
    notes: 'Table 5 - Birthday celebration. Please add candle to dessert.'
  },
  {
    id: 'ORD-004',
    table: '3',
    customerName: 'Emily Chen',
    customerPhone: '+1555666777',
    customerAddress: '789 Park Lane, Queens, NY 11375',
    status: 'accepted',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    acceptedAt: new Date(Date.now() - 4 * 60000).toISOString(),
    preparingAt: null,
    readyAt: null,
    servedAt: null,
    items: [
      { 
        name: 'Chicken Tikka Masala', 
        quantity: 1, 
        price: 14.99,
        modifiers: ['Mild Spice', 'Extra Rice']
      },
      { 
        name: 'Garlic Naan', 
        quantity: 3, 
        price: 3.99,
        modifiers: []
      },
      { 
        name: 'Mango Lassi', 
        quantity: 1, 
        price: 4.99,
        modifiers: []
      },
      { 
        name: 'Vegetable Samosa', 
        quantity: 2, 
        price: 5.99,
        modifiers: []
      },
    ],
    subtotal: 39.94,
    tax: 3.20,
    deliveryFee: 0,
    total: 43.14,
    margin: 19.20
  },
  {
    id: 'ORD-005',
    table: '8',
    customerName: 'Robert Williams',
    customerPhone: '+1999888777',
    status: 'pending',
    createdAt: new Date(Date.now() - 1 * 60000).toISOString(), // 1 minute ago
    acceptedAt: null,
    preparingAt: null,
    readyAt: null,
    servedAt: null,
    items: [
      { 
        name: 'BBQ Chicken Pizza', 
        quantity: 1, 
        price: 17.99,
        modifiers: ['Thick Crust', 'Extra BBQ Sauce']
      },
      { 
        name: 'Buffalo Wings (12pc)', 
        quantity: 1, 
        price: 13.99,
        modifiers: ['Hot Sauce', 'Ranch Dressing']
      },
      { 
        name: 'Pepsi', 
        quantity: 3, 
        price: 2.99,
        modifiers: []
      },
    ],
    subtotal: 40.95,
    tax: 3.28,
    deliveryFee: 0,
    total: 44.23,
    margin: 18.90,
    notes: 'Please deliver ASAP - customer waiting'
  },
  {
    id: 'ORD-006',
    table: null,
    customerName: 'Lisa Anderson',
    customerPhone: '+1444555666',
    customerAddress: '321 Elm Street, Manhattan, NY 10002',
    status: 'served',
    createdAt: new Date(Date.now() - 35 * 60000).toISOString(), // 35 minutes ago
    acceptedAt: new Date(Date.now() - 34 * 60000).toISOString(),
    preparingAt: new Date(Date.now() - 30 * 60000).toISOString(),
    readyAt: new Date(Date.now() - 15 * 60000).toISOString(),
    servedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    items: [
      { 
        name: 'Salmon Teriyaki', 
        quantity: 1, 
        price: 19.99,
        modifiers: ['Steamed Vegetables', 'Brown Rice']
      },
      { 
        name: 'Miso Soup', 
        quantity: 1, 
        price: 3.99,
        modifiers: []
      },
      { 
        name: 'Green Tea', 
        quantity: 1, 
        price: 2.99,
        modifiers: ['Hot']
      },
    ],
    subtotal: 26.97,
    tax: 2.16,
    deliveryFee: 4.00,
    total: 33.13,
    margin: 13.50
  },
]

/**
 * Order Status Flow
 * pending -> accepted -> preparing -> ready -> served
 * Any status can go to -> cancelled
 */

/**
 * Example API Response Structure
 */
export const exampleApiResponse = {
  success: true,
  data: mockOrders,
  timestamp: new Date().toISOString()
}

/**
 * Example Status Update Request
 */
export const exampleStatusUpdate = {
  orderId: 'ORD-001',
  status: 'accepted',
  timestamp: new Date().toISOString()
}


