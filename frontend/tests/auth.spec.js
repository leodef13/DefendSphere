import { test, expect } from '@playwright/test'

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should login admin user with correct credentials', async ({ page }) => {
    // Fill in admin credentials
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'admin')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')
    
    // Verify we're on the dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Security Dashboard')
    
    // Verify admin user info is displayed
    await expect(page.locator('text=Welcome, admin')).toBeVisible()
  })

  test('should login user1 with correct credentials', async ({ page }) => {
    // Fill in user1 credentials
    await page.fill('input[name="username"]', 'user1')
    await page.fill('input[name="password"]', 'user1')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')
    
    // Verify we're on the dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Security Dashboard')
    
    // Verify user1 info is displayed
    await expect(page.locator('text=Welcome, user1')).toBeVisible()
  })

  test('should login user2 with correct credentials', async ({ page }) => {
    // Fill in user2 credentials
    await page.fill('input[name="username"]', 'user2')
    await page.fill('input[name="password"]', 'user2')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard')
    
    // Verify we're on the dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.locator('h1')).toContainText('Security Dashboard')
    
    // Verify user2 info is displayed
    await expect(page.locator('text=Welcome, user2')).toBeVisible()
  })

  test('should reject login with incorrect password', async ({ page }) => {
    // Fill in admin username but wrong password
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'wrongpassword')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Wait for error message
    await expect(page.locator('text=Login failed')).toBeVisible()
    
    // Verify we're still on login page
    await expect(page).toHaveURL('/login')
  })

  test('should reject login with non-existent user', async ({ page }) => {
    // Fill in non-existent user credentials
    await page.fill('input[name="username"]', 'nonexistent')
    await page.fill('input[name="password"]', 'password')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Wait for error message
    await expect(page.locator('text=Login failed')).toBeVisible()
    
    // Verify we're still on login page
    await expect(page).toHaveURL('/login')
  })

  test('should show connection error when backend is down', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/auth/login', route => route.abort())
    
    // Fill in valid credentials
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'admin')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Wait for connection error
    await expect(page.locator('text=Connection error')).toBeVisible()
    
    // Verify we're still on login page
    await expect(page).toHaveURL('/login')
  })

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling fields
    await page.click('button[type="submit"]')
    
    // Check HTML5 validation
    const usernameInput = page.locator('input[name="username"]')
    const passwordInput = page.locator('input[name="password"]')
    
    await expect(usernameInput).toHaveAttribute('required')
    await expect(passwordInput).toHaveAttribute('required')
  })

  test('should show default users information', async ({ page }) => {
    // Check that default users are displayed
    await expect(page.locator('text=Default users:')).toBeVisible()
    await expect(page.locator('text=admin/admin, user1/user1, user2/user2')).toBeVisible()
  })

  test('should logout successfully', async ({ page }) => {
    // Login first
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'admin')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    
    // Click logout button
    await page.click('button:has-text("Logout")')
    
    // Verify redirect to login page
    await page.waitForURL('/login')
    await expect(page).toHaveURL('/login')
  })
})