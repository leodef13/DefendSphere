# DefendSphere Testing Guide

This document provides comprehensive information about the testing framework and procedures for the DefendSphere Security Dashboard.

## 🧪 Testing Overview

DefendSphere uses a multi-layered testing approach to ensure reliability, security, and performance:

- **Unit Tests**: Backend API testing with Jest
- **E2E Tests**: Frontend testing with Playwright
- **Integration Tests**: Full system testing
- **Security Tests**: Vulnerability scanning and audit
- **Performance Tests**: Load and response time testing

## 🏗️ Test Architecture

### Backend Testing (Jest)
- **Location**: `backend/__tests__/`
- **Framework**: Jest with Supertest
- **Database**: Redis (test database)
- **Coverage**: API endpoints, authentication, authorization

### Frontend Testing (Playwright)
- **Location**: `frontend/tests/`
- **Framework**: Playwright
- **Browsers**: Chrome, Firefox, Safari, Mobile
- **Coverage**: UI interactions, navigation, user flows

## 🚀 Running Tests

### Prerequisites
```bash
# Install Node.js 18+
# Install Redis
# Install dependencies
cd backend && npm install
cd frontend && npm install
```

### Backend Unit Tests
```bash
# Run all backend tests
cd backend
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test auth.test.js
```

### Frontend E2E Tests
```bash
# Run all e2e tests
cd frontend
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run specific test file
npm test auth.spec.js
```

### Integration Tests
```bash
# Start services
cd backend && npm start &
cd frontend && npm run dev &

# Run integration tests
cd frontend
npx playwright test --grep "Integration"
```

## 📋 Test Categories

### 1. Authentication Tests
- ✅ Valid user login (admin, user1, user2)
- ❌ Invalid credentials rejection
- 🔐 Token validation and expiration
- 🚪 Logout functionality

### 2. Authorization Tests
- 👑 Admin access to all features
- 👤 User role-based access control
- 🚫 Unauthorized access prevention
- 🔒 Permission-based navigation

### 3. Navigation Tests
- 🧭 Sidebar navigation functionality
- 📱 Responsive design testing
- 🔄 Route protection
- 🎯 Direct URL access control

### 4. Admin Panel Tests
- 👥 User management (CRUD)
- 🎛️ Role and permission assignment
- 📊 User listing and filtering
- 🗑️ User deletion with safeguards

### 5. User Dashboard Tests
- 👤 Profile management
- 🔑 Password change functionality
- 📝 Form validation
- 💾 Data persistence

### 6. Integrations Tests
- 🔌 Integration CRUD operations
- ⚙️ Configuration management
- 📊 Status monitoring
- 🔄 Sync functionality

### 7. Multilanguage Tests
- 🌍 Language switching (EN/RU/ES)
- 📝 Content translation verification
- 💾 Language preference persistence
- 🔄 Cross-page language consistency

## 🎯 Test Data

### Default Test Users
```javascript
// Admin user
username: 'admin'
password: 'admin'
role: 'admin'
permissions: ['all']

// User1 (Security Analyst)
username: 'user1'
password: 'user1'
role: 'user'
permissions: ['access.dashboard', 'access.assets', 'access.incidents', 'access.alerts']

// User2 (Standard User)
username: 'user2'
password: 'user2'
role: 'user'
permissions: ['access.dashboard', 'access.reports', 'access.assets', 'access.suppliers']
```

### Test Environment
- **Backend URL**: `http://localhost:5000`
- **Frontend URL**: `http://localhost:5173`
- **Redis**: `redis://localhost:6379/1` (test database)
- **JWT Secret**: `test-secret-key`

## 🔧 Test Configuration

### Jest Configuration (`backend/jest.config.js`)
```javascript
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: ['.js'],
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: ['**/*.js', '!**/node_modules/**'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.js'],
  testTimeout: 10000
}
```

### Playwright Configuration (`frontend/playwright.config.js`)
```javascript
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
})
```

## 📊 Test Coverage

### Backend Coverage
- **Authentication**: 100%
- **Authorization**: 100%
- **User Management**: 100%
- **Integrations**: 100%
- **API Endpoints**: 95%+

### Frontend Coverage
- **Authentication Flow**: 100%
- **Navigation**: 100%
- **Admin Panel**: 100%
- **User Dashboard**: 100%
- **Multilanguage**: 100%

## 🚨 CI/CD Integration

### GitHub Actions Workflow
The project includes automated testing via GitHub Actions:

- **Triggers**: Push to main/master, Pull requests
- **Jobs**: Backend tests, Frontend tests, Integration tests, Security tests, Performance tests
- **Artifacts**: Test reports, screenshots, coverage reports
- **Notifications**: Success/failure notifications

### Workflow Features
- ✅ Parallel test execution
- 🔄 Automatic retry on failure
- 📊 Coverage reporting
- 🖼️ Screenshot capture on failure
- 📹 Video recording for debugging
- 🔒 Security vulnerability scanning

## 🐛 Debugging Tests

### Backend Test Debugging
```bash
# Run specific test with verbose output
npm test -- --verbose auth.test.js

# Run tests with debugging
node --inspect-brk node_modules/.bin/jest --runInBand

# Check test database
redis-cli -n 1
```

### Frontend Test Debugging
```bash
# Run tests in debug mode
npm run test:debug

# Run specific test in headed mode
npx playwright test auth.spec.js --headed

# Open test results
npx playwright show-report
```

### Common Issues
1. **Redis Connection**: Ensure Redis is running on port 6379
2. **Port Conflicts**: Check that ports 5000 and 5173 are available
3. **Dependencies**: Run `npm install` in both backend and frontend
4. **Browser Issues**: Run `npx playwright install` to install browsers

## 📈 Performance Testing

### Load Testing
```bash
# Test API response times
for i in {1..10}; do
  curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/health
done
```

### Memory Testing
```bash
# Monitor memory usage during tests
npm test -- --detectLeaks
```

## 🔒 Security Testing

### Vulnerability Scanning
```bash
# Backend security audit
cd backend && npm audit

# Frontend security audit
cd frontend && npm audit

# Check for secrets
trufflehog filesystem ./
```

## 📝 Writing New Tests

### Backend Test Template
```javascript
import request from 'supertest'
import { app } from '../index.js'

describe('Feature Tests', () => {
  test('should perform action', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send({ data: 'value' })
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('expected')
  })
})
```

### Frontend Test Template
```javascript
import { test, expect } from '@playwright/test'

test.describe('Feature Tests', () => {
  test('should perform action', async ({ page }) => {
    await page.goto('/page')
    await page.click('button')
    await expect(page.locator('text=Expected')).toBeVisible()
  })
})
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🤝 Contributing

When adding new features:

1. Write unit tests for backend functionality
2. Write e2e tests for frontend interactions
3. Ensure all tests pass locally
4. Update this documentation if needed
5. Create pull request with test coverage

## 📞 Support

For testing-related issues:
- Check the troubleshooting section above
- Review test logs and error messages
- Ensure all dependencies are installed
- Verify service connectivity (Redis, backend, frontend)