import { test, expect } from '@playwright/test'

test.describe('Navigation and Access Control Tests', () => {
  test.describe('Admin User Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Login as admin
      await page.goto('/login')
      await page.fill('input[name="username"]', 'admin')
      await page.fill('input[name="password"]', 'admin')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')
    })

    test('should have access to all navigation items', async ({ page }) => {
      // Check that all navigation items are visible for admin
      const navItems = [
        'Home',
        'Assets',
        'Compliance',
        'Customer Trust',
        'Suppliers',
        'Reports',
        'Starter Guide',
        'Integrations',
        'Settings'
      ]

      for (const item of navItems) {
        await expect(page.locator(`text=${item}`)).toBeVisible()
      }

      // Check admin panel link
      await expect(page.locator('text=Admin Panel')).toBeVisible()
    })

    test('should navigate to all sections successfully', async ({ page }) => {
      const sections = [
        { link: 'Assets', title: 'Assets' },
        { link: 'Compliance', title: 'Compliance' },
        { link: 'Customer Trust', title: 'Customer Trust' },
        { link: 'Suppliers', title: 'Suppliers' },
        { link: 'Reports', title: 'Reports' },
        { link: 'Starter Guide', title: 'Starter Guide' },
        { link: 'Integrations', title: 'Integrations' },
        { link: 'Settings', title: 'Settings' }
      ]

      for (const section of sections) {
        await page.click(`text=${section.link}`)
        await expect(page.locator('h1')).toContainText(section.title)
      }
    })

    test('should access admin panel', async ({ page }) => {
      await page.click('text=Admin Panel')
      await expect(page).toHaveURL('/admin')
      await expect(page.locator('h1')).toContainText('Admin Panel')
    })
  })

  test.describe('User1 Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Login as user1
      await page.goto('/login')
      await page.fill('input[name="username"]', 'user1')
      await page.fill('input[name="password"]', 'user1')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')
    })

    test('should have access to allowed sections only', async ({ page }) => {
      // Check visible navigation items for user1
      const allowedItems = [
        'Home',
        'Assets',
        'Starter Guide',
        'Settings'
      ]

      for (const item of allowedItems) {
        await expect(page.locator(`text=${item}`)).toBeVisible()
      }

      // Check that restricted items are not visible
      const restrictedItems = [
        'Compliance',
        'Customer Trust',
        'Suppliers',
        'Reports',
        'Integrations'
      ]

      for (const item of restrictedItems) {
        await expect(page.locator(`text=${item}`)).not.toBeVisible()
      }

      // Admin panel should not be visible
      await expect(page.locator('text=Admin Panel')).not.toBeVisible()
    })

    test('should navigate to allowed sections', async ({ page }) => {
      const allowedSections = [
        { link: 'Assets', title: 'Assets' },
        { link: 'Incidents', title: 'Incidents' },
        { link: 'Alerts', title: 'Alerts' },
        { link: 'Starter Guide', title: 'Starter Guide' },
        { link: 'Settings', title: 'Settings' }
      ]

      for (const section of allowedSections) {
        await page.click(`text=${section.link}`)
        await expect(page.locator('h1')).toContainText(section.title)
      }
    })
  })

  test.describe('User2 Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Login as user2
      await page.goto('/login')
      await page.fill('input[name="username"]', 'user2')
      await page.fill('input[name="password"]', 'user2')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')
    })

    test('should have access to allowed sections only', async ({ page }) => {
      // Check visible navigation items for user2
      const allowedItems = [
        'Home',
        'Reports',
        'Assets',
        'Suppliers',
        'Starter Guide',
        'Settings'
      ]

      for (const item of allowedItems) {
        await expect(page.locator(`text=${item}`)).toBeVisible()
      }

      // Check that restricted items are not visible
      const restrictedItems = [
        'Compliance',
        'Customer Trust',
        'Integrations'
      ]

      for (const item of restrictedItems) {
        await expect(page.locator(`text=${item}`)).not.toBeVisible()
      }

      // Admin panel should not be visible
      await expect(page.locator('text=Admin Panel')).not.toBeVisible()
    })

    test('should navigate to allowed sections', async ({ page }) => {
      const allowedSections = [
        { link: 'Reports', title: 'Reports' },
        { link: 'Assets', title: 'Assets' },
        { link: 'Suppliers', title: 'Suppliers' },
        { link: 'Starter Guide', title: 'Starter Guide' },
        { link: 'Settings', title: 'Settings' }
      ]

      for (const section of allowedSections) {
        await page.click(`text=${section.link}`)
        await expect(page.locator('h1')).toContainText(section.title)
      }
    })
  })

  test.describe('Direct URL Access Control', () => {
    test('should redirect non-admin users from admin panel', async ({ page }) => {
      // Login as user1
      await page.goto('/login')
      await page.fill('input[name="username"]', 'user1')
      await page.fill('input[name="password"]', 'user1')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Try to access admin panel directly
      await page.goto('/admin')
      
      // Should show access denied message
      await expect(page.locator('text=Access Denied')).toBeVisible()
      await expect(page.locator('text=You need admin privileges')).toBeVisible()
    })

    test('should allow admin access to admin panel', async ({ page }) => {
      // Login as admin
      await page.goto('/login')
      await page.fill('input[name="username"]', 'admin')
      await page.fill('input[name="password"]', 'admin')
      await page.click('button[type="submit"]')
      await page.waitForURL('/dashboard')

      // Access admin panel directly
      await page.goto('/admin')
      
      // Should show admin panel
      await expect(page.locator('h1')).toContainText('Admin Panel')
      await expect(page.locator('text=User Management')).toBeVisible()
    })
  })
})