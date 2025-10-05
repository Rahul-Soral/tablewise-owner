/**
 * Custom Cypress Commands
 */

// Tab command for keyboard navigation testing
Cypress.Commands.add('tab', { prevSubject: 'optional' }, (subject) => {
  cy.wrap(subject).trigger('keydown', { keyCode: 9, which: 9, key: 'Tab' })
  return cy.focused()
})

// Login command (if authentication is added)
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('not.include', '/login')
})

// Check accessibility
Cypress.Commands.add('checkA11y', () => {
  cy.injectAxe()
  cy.checkA11y()
})



