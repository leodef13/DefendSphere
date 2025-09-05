import { createClient } from 'redis'

// Test Redis client setup
const testRedis = createClient({ 
  url: process.env.TEST_REDIS_URL || 'redis://localhost:6379/1' // Use database 1 for tests
})

beforeAll(async () => {
  try {
    await testRedis.connect()
    // Clear test database
    await testRedis.flushDb()
    console.log('✅ Test Redis connected and cleared')
  } catch (error) {
    console.error('❌ Test Redis connection failed:', error)
    throw error
  }
})

afterAll(async () => {
  try {
    await testRedis.flushDb()
    await testRedis.disconnect()
    console.log('✅ Test Redis disconnected')
  } catch (error) {
    console.error('❌ Test Redis disconnect failed:', error)
  }
})

// Global test utilities
global.testRedis = testRedis

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}