import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    env: {
      WEBHOOK_URL: 'https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec',
      GET_ORDERS_URL: 'https://script.google.com/macros/s/AKfycbzgFdV0CRvZau4rTwxqITSoyV9WsI1I9P0ErYXg10B2ljrWHqAHXQ5SXGDJRVj8pZo/exec?action=getOrders&limit=100',
    },
    video: false,
    screenshotOnRunFailure: true,
  },
})


