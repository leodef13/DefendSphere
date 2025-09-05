import { test, expect } from '@playwright/test'

test.describe('Admin Panel Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login')
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'admin')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
    
    // Navigate to admin panel
    await page.click('text=Admin Panel')
    await page.waitForURL('/admin')
  })

  test('should display admin panel correctly', async ({ page }) => {
    // Check main elements
    await expect(page.locator('h1')).toContainText('Admin Panel')
    await expect(page.locator('text=User Management')).toBeVisible()
    await expect(page.locator('text=Add User')).toBeVisible()
  })

  test('should display existing users', async ({ page }) => {
    // Check that default users are displayed
    await expect(page.locator('text=admin')).toBeVisible()
    await expect(page.locator('text=user1')).toBeVisible()
    await expect(page.locator('text=user2')).toBeVisible()
    
    // Check user roles
    await expect(page.locator('text=admin').locator('..').locator('text=admin')).toBeVisible()
    await expect(page.locator('text=user1').locator('..').locator('text=user')).toBeVisible()
    await expect(page.locator('text=user2').locator('..').locator('text=user')).toBeVisible()
  })

  test('should create new user', async ({ page }) => {
    // Click add user button
    await page.click('text=Add User')
    
    // Fill in new user form
    await page.fill('input[name="username"]', 'newuser')
    await page.fill('input[name="email"]', 'newuser@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.selectOption('select[name="role"]', 'user')
    
    // Select some permissions
    await page.check('input[value="access.dashboard"]')
    await page.check('input[value="access.assets"]')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Check success message
    await expect(page.locator('text=User created successfully')).toBeVisible()
    
    // Check that new user appears in the list
    await expect(page.locator('text=newuser')).toBeVisible()
  })

  test('should edit existing user', async ({ page }) => {
    // Click edit button for user1
    await page.locator('text=user1').locator('..').locator('button:has-text("Edit")').click()
    
    // Update email
    await page.fill('input[name="email"]', 'updated@example.com')
    
    // Add new permission
    await page.check('input[value="access.reports"]')
    
    // Submit form
    await page.click('button[type="submit"]')
    
    // Check success message
    await expect(page.locator('text=User updated successfully')).toBeVisible()
    
    // Check that changes are reflected
    await expect(page.locator('text=updated@example.com')).toBeVisible()
  })

  test('should delete user', async ({ page }) => {
    // Click delete button for user2
    await page.locator('text=user2').locator('..').locator('button:has-text("Delete")').click()
    
    // Confirm deletion in dialog
    await page.click('button:has-text("Confirm")')
    
    // Check success message
    await expect(page.locator('text=User deleted successfully')).toBeVisible()
    
    // Check that user2 is no longer in the list
    await expect(page.locator('text=user2')).not.toBeVisible()
  })

  test('should prevent admin user deletion', async ({ page }) => {
    // Try to delete admin user
    await page.locator('text=admin').locator('..').locator('button:has-text("Delete")').click()
    
    // Should show error message
    await expect(page.locator('text=Cannot delete admin user')).toBeVisible()
  })

  test('should validate required fields when creating user', async ({ page }) => {
    // Click add user button
    await page.click('text=Add User')
    
    // Try to submit without filling required fields
    await page.click('button[type="submit"]')
    
    // Check HTML5 validation
    const usernameInput = page.locator('input[name="username"]')
    const emailInput = page.locator('input[name="email"]')
    const passwordInput = page.locator('input[name="password"]')
    
    await expect(usernameInput).toHaveAttribute('required')
    await expect(emailInput).toHaveAttribute('required')
    await expect(passwordInput).toHaveAttribute('required')
  })

  test('should show user permissions correctly', async ({ page }) => {
    // Check that admin has all permissions
    const adminRow = page.locator('text=admin').locator('..')
    await expect(adminRow.locator('text=All Permissions')).toBeVisible()
    
    // Check that user1 has specific permissions
    const user1Row = page.locator('text=user1').locator('..')
    await expect(user1Row.locator('text=Access Dashboard')).toBeVisible()
    await expect(user1Row.locator('text=Access Assets')).toBeVisible()
  })

  test('should handle form cancellation', async ({ page }) => {
    // Click add user button
    await page.click('text=Add User')
    
    // Fill in some data
    await page.fill('input[name="username"]', 'testuser')
    await page.fill('input[name="email"]', 'test@example.com')
    
    // Click cancel
    await page.click('button:has-text("Cancel")')
    
    // Check that form is closed
    await expect(page.locator('input[name="username"]')).not.toBeVisible()
    
    // Check that testuser is not in the list
    await expect(page.locator('text=testuser')).not.toBeVisible()
  })

  test('should filter users by role', async ({ page }) => {
    // Check that all users are visible initially
    await expect(page.locator('text=admin')).toBeVisible()
    await expect(page.locator('text=user1')).toBeVisible()
    await expect(page.locator('text=user2')).toBeVisible()
    
    // If there's a role filter, test it
    const roleFilter = page.locator('select[name="roleFilter"]')
    if (await roleFilter.isVisible()) {
      await roleFilter.selectOption('admin')
      
      // Only admin should be visible
      await expect(page.locator('text=admin')).toBeVisible()
      await expect(page.locator('text=user1')).not.toBeVisible()
      await expect(page.locator('text=user2')).not.toBeVisible()
    }
  })
})