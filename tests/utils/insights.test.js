import { describe, it, expect } from 'vitest'
import { 
  calculateRevenue, 
  countOrders,
  calculateAverageTicket,
  getTopSellingItems,
  calculateRepeatCustomerRate,
  generateActionCard
} from '../../src/utils/insights'

describe('Insights Utilities', () => {
  const mockOrders = [
    {
      id: 'ORD-001',
      createdAt: new Date().toISOString(),
      status: 'served',
      total: 100,
      customerPhone: '+1234567890',
      items: [
        { name: 'Pizza', quantity: 2, price: 15 },
        { name: 'Salad', quantity: 1, price: 10 }
      ]
    },
    {
      id: 'ORD-002',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      status: 'served',
      total: 50,
      customerPhone: '+1234567890', // Same customer
      items: [
        { name: 'Pizza', quantity: 1, price: 15 }
      ]
    },
    {
      id: 'ORD-003',
      createdAt: new Date().toISOString(),
      status: 'cancelled',
      total: 75,
      customerPhone: '+0987654321',
      items: [
        { name: 'Burger', quantity: 1, price: 12 }
      ]
    }
  ]

  describe('calculateRevenue', () => {
    it('calculates total revenue for day', () => {
      const revenue = calculateRevenue(mockOrders, 'day')
      expect(revenue).toBe(150) // 100 + 50, excludes cancelled
    })

    it('excludes cancelled orders', () => {
      const revenue = calculateRevenue(mockOrders, 'day')
      expect(revenue).not.toBe(225) // Should not include cancelled order
    })
  })

  describe('countOrders', () => {
    it('counts orders for day including cancelled', () => {
      const count = countOrders(mockOrders, 'day')
      expect(count).toBe(2) // 2 orders today (including cancelled)
    })
  })

  describe('calculateAverageTicket', () => {
    it('calculates average order value', () => {
      const avg = calculateAverageTicket(mockOrders)
      expect(avg).toBe(75) // (100 + 50) / 2, excludes cancelled
    })

    it('returns 0 for no orders', () => {
      const avg = calculateAverageTicket([])
      expect(avg).toBe(0)
    })
  })

  describe('getTopSellingItems', () => {
    it('returns top selling items by quantity', () => {
      const topItems = getTopSellingItems(mockOrders, 5)
      expect(topItems[0].name).toBe('Pizza')
      expect(topItems[0].quantity).toBe(3) // 2 + 1
    })

    it('excludes cancelled orders', () => {
      const topItems = getTopSellingItems(mockOrders, 5)
      const burger = topItems.find(item => item.name === 'Burger')
      expect(burger).toBeUndefined()
    })
  })

  describe('calculateRepeatCustomerRate', () => {
    it('calculates repeat customer percentage', () => {
      const rate = calculateRepeatCustomerRate(mockOrders)
      expect(rate).toBe(50) // 1 of 2 customers has multiple orders
    })
  })

  describe('generateActionCard', () => {
    it('generates recommendation for low sales items', () => {
      const orders = [
        {
          id: '1',
          status: 'served',
          createdAt: new Date().toISOString(),
          total: 20,
          customerPhone: '+1',
          items: [{ name: 'Rare Item', quantity: 1, price: 20 }]
        }
      ]
      const card = generateActionCard(orders)
      expect(card.type).toBe('warning')
      expect(card.title).toContain('Boost Sales')
    })

    it('returns info card for no orders', () => {
      const card = generateActionCard([])
      expect(card.type).toBe('info')
      expect(card.title).toBe('Getting Started')
    })
  })
})


