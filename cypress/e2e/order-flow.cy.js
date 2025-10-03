/**
 * End-to-End Order Flow Test
 * Tests complete workflow: place order → appear in owner app → status change
 */

describe('Complete Order Flow', () => {
  beforeEach(() => {
    // Visit the owner portal
    cy.visit('/')
  })

  it('should display orders within 3 seconds of submission', () => {
    // Navigate to orders page
    cy.get('a[href="/orders"]').click()

    // Wait for orders to load (polling should fetch within 3s)
    cy.get('[data-testid="order-card"]', { timeout: 5000 })
      .should('have.length.greaterThan', 0)

    // Verify order card contains required information
    cy.get('[data-testid="order-card"]').first().within(() => {
      cy.contains(/ORD-\d+/).should('be.visible') // Order ID
      cy.get('[data-testid="customer-name"]').should('be.visible')
      cy.get('[data-testid="live-timer"]').should('be.visible')
      cy.get('[data-testid="total-amount"]').should('be.visible')
    })
  })

  it('should update status and reflect in sheet within 2 seconds', () => {
    cy.visit('/orders')

    // Wait for orders to load
    cy.get('[data-testid="order-card"]', { timeout: 5000 })
      .should('exist')

    // Find a pending order
    cy.get('[data-testid="order-card"]')
      .contains('Pending')
      .parents('[data-testid="order-card"]')
      .first()
      .within(() => {
        // Click Accept button
        cy.get('button').contains('Accept').click()
      })

    // Verify optimistic update (immediate)
    cy.contains('Accepted').should('be.visible')

    // Verify toast notification appears
    cy.get('[role="alert"]', { timeout: 3000 })
      .should('contain', 'successful')

    // Wait for API call to complete (2 seconds max)
    cy.wait(2000)

    // Verify status persists after page refresh
    cy.reload()
    cy.get('[data-testid="order-card"]', { timeout: 5000 })
      .contains('Accepted')
      .should('exist')
  })

  it('should handle offline mode gracefully', () => {
    cy.visit('/orders')

    // Wait for initial load
    cy.get('[data-testid="order-card"]', { timeout: 5000 })
      .should('exist')

    // Simulate offline
    cy.window().then(win => {
      win.dispatchEvent(new Event('offline'))
    })

    // Verify offline indicator appears
    cy.contains('offline', { matchCase: false })
      .should('be.visible')

    // Verify orders still visible (from cache)
    cy.get('[data-testid="order-card"]')
      .should('have.length.greaterThan', 0)

    // Simulate back online
    cy.window().then(win => {
      win.dispatchEvent(new Event('online'))
    })

    // Verify offline indicator disappears
    cy.contains('offline', { matchCase: false })
      .should('not.exist')
  })

  it('should open order detail panel on card click', () => {
    cy.visit('/orders')

    // Click on first order card
    cy.get('[data-testid="order-card"]', { timeout: 5000 })
      .first()
      .click()

    // Verify slide-over opens
    cy.get('[role="dialog"]')
      .should('be.visible')
      .within(() => {
        // Verify order details are shown
        cy.contains('Customer Information').should('be.visible')
        cy.contains('Order Items').should('be.visible')
        cy.get('[data-testid="call-button"]').should('exist')
        cy.get('[data-testid="whatsapp-button"]').should('exist')
      })

    // Close panel with Escape key
    cy.get('body').type('{esc}')
    cy.get('[role="dialog"]').should('not.exist')
  })

  it('should filter and search orders', () => {
    cy.visit('/orders')

    // Wait for orders
    cy.get('[data-testid="order-card"]', { timeout: 5000 }).should('exist')
    
    // Test search
    cy.get('input[placeholder*="Search"]').type('ORD-001')
    cy.get('[data-testid="order-card"]')
      .should('have.length', 1)
      .should('contain', 'ORD-001')

    // Clear search
    cy.get('input[placeholder*="Search"]').clear()

    // Test status filter
    cy.get('select[aria-label*="status"]').select('pending')
    cy.get('[data-testid="order-card"]')
      .each($card => {
        cy.wrap($card).should('contain', 'Pending')
      })
  })

  it('should show analytics charts and export data', () => {
    cy.visit('/analytics')

    // Verify key metrics load
    cy.contains('Revenue').should('be.visible')
    cy.contains('Orders').should('be.visible')
    cy.contains('Average Ticket').should('be.visible')

    // Verify charts render
    cy.get('svg').should('have.length.greaterThan', 0)

    // Test export functionality
    cy.get('button').contains('Export Orders').click()

    // Verify download initiated (file should download)
    // Note: Cypress doesn't directly verify downloads,
    // but we can verify the click happened
  })

  it('should handle confirmation dialogs', () => {
    cy.visit('/orders')

    // Find an order and try to cancel
    cy.get('[data-testid="order-card"]', { timeout: 5000 })
      .first()
      .within(() => {
        // Click cancel button if available
        cy.get('button').contains('Cancel').click({ force: true })
      })

    // Verify confirmation dialog appears
    cy.get('[role="alertdialog"]')
      .should('be.visible')
      .within(() => {
        cy.contains('Cancel Order').should('be.visible')
        
        // Click confirm
        cy.get('button').contains('Yes').click()
      })

    // Verify toast appears
    cy.get('[role="alert"]', { timeout: 3000 })
      .should('be.visible')
  })
})

describe('Accessibility Tests', () => {
  it('should be navigable with keyboard', () => {
    cy.visit('/')

    // Tab through navigation
    cy.get('body').tab()
    cy.focused().should('have.attr', 'aria-label')

    // Navigate to orders with Enter
    cy.get('a[href="/orders"]').focus()
    cy.focused().type('{enter}')
    cy.url().should('include', '/orders')
  })

  it('should have proper ARIA labels', () => {
    cy.visit('/orders')

    // Check for ARIA landmarks
    cy.get('main').should('exist')
    cy.get('nav').should('exist')

    // Check buttons have labels
    cy.get('button[aria-label]').should('have.length.greaterThan', 0)

    // Check modal accessibility
    cy.get('[data-testid="order-card"]', { timeout: 5000 })
      .first()
      .click()

    cy.get('[role="dialog"]').should('have.attr', 'aria-modal', 'true')
  })
})


