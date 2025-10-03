/**
 * Vitest Setup File
 * Global test configuration and mocks
 */

import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock environment variables
vi.mock('import.meta', () => ({
  env: {
    VITE_GET_ORDERS_URL: 'https://test.example.com/orders',
    VITE_UPDATE_STATUS_URL: 'https://test.example.com/update',
    VITE_ANALYTICS_URL: 'https://test.example.com/analytics',
    VITE_POLLING_INTERVAL: '3000',
    DEV: true,
  }
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock


