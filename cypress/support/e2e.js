/**
 * Cypress E2E Support File
 * Loaded before test files
 */

import './commands'

// Prevent Cypress from failing on uncaught exceptions
// (some are expected during error testing)
Cypress.on('uncaught:exception', (err, runnable) => {
  // Return false to prevent Cypress from failing the test
  if (err.message.includes('CORS') || err.message.includes('Network')) {
    return false
  }
  return true
})



