import { test, expect } from '@playwright/test'

test.describe('Multilanguage Support Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login')
    await page.fill('input[name="username"]', 'admin')
    await page.fill('input[name="password"]', 'admin')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should switch to Russian language', async ({ page }) => {
    // Find and click language switcher
    const languageSwitcher = page.locator('select')
    await languageSwitcher.selectOption('ru')
    
    // Wait for language change
    await page.waitForTimeout(1000)
    
    // Check that navigation items are in Russian
    await expect(page.locator('text=Главная')).toBeVisible()
    await expect(page.locator('text=Активы')).toBeVisible()
    await expect(page.locator('text=Соответствие')).toBeVisible()
    await expect(page.locator('text=Доверие клиентов')).toBeVisible()
    await expect(page.locator('text=Поставщики')).toBeVisible()
    await expect(page.locator('text=Отчеты')).toBeVisible()
    await expect(page.locator('text=Руководство для начинающих')).toBeVisible()
    await expect(page.locator('text=Интеграции')).toBeVisible()
    // Incidents/Alerts removed
    await expect(page.locator('text=Настройки')).toBeVisible()
    await expect(page.locator('text=Панель администратора')).toBeVisible()
  })

  test('should switch to Spanish language', async ({ page }) => {
    // Find and click language switcher
    const languageSwitcher = page.locator('select')
    await languageSwitcher.selectOption('es')
    
    // Wait for language change
    await page.waitForTimeout(1000)
    
    // Check that navigation items are in Spanish
    await expect(page.locator('text=Inicio')).toBeVisible()
    await expect(page.locator('text=Activos')).toBeVisible()
    await expect(page.locator('text=Cumplimiento')).toBeVisible()
    await expect(page.locator('text=Confianza del cliente')).toBeVisible()
    await expect(page.locator('text=Proveedores')).toBeVisible()
    await expect(page.locator('text=Informes')).toBeVisible()
    await expect(page.locator('text=Guía de inicio')).toBeVisible()
    await expect(page.locator('text=Integraciones')).toBeVisible()
    // Incidents/Alerts removed
    await expect(page.locator('text=Configuración')).toBeVisible()
    await expect(page.locator('text=Panel de administración')).toBeVisible()
  })

  test('should switch back to English language', async ({ page }) => {
    // First switch to Russian
    const languageSwitcher = page.locator('select')
    await languageSwitcher.selectOption('ru')
    await page.waitForTimeout(1000)
    
    // Then switch back to English
    await languageSwitcher.selectOption('en')
    await page.waitForTimeout(1000)
    
    // Check that navigation items are back in English
    await expect(page.locator('text=Home')).toBeVisible()
    await expect(page.locator('text=Assets')).toBeVisible()
    await expect(page.locator('text=Compliance')).toBeVisible()
    await expect(page.locator('text=Customer Trust')).toBeVisible()
    await expect(page.locator('text=Suppliers')).toBeVisible()
    await expect(page.locator('text=Reports')).toBeVisible()
    await expect(page.locator('text=Starter Guide')).toBeVisible()
    await expect(page.locator('text=Integrations')).toBeVisible()
    // Incidents/Alerts removed
    await expect(page.locator('text=Settings')).toBeVisible()
    await expect(page.locator('text=Admin Panel')).toBeVisible()
  })

  test('should translate dashboard content', async ({ page }) => {
    // Switch to Russian
    const languageSwitcher = page.locator('select')
    await languageSwitcher.selectOption('ru')
    await page.waitForTimeout(1000)
    
    // Check dashboard title
    await expect(page.locator('h1')).toContainText('Панель безопасности')
    
    // Check dashboard sections
    await expect(page.locator('text=Угрозы со временем')).toBeVisible()
    await expect(page.locator('text=Типы угроз')).toBeVisible()
    await expect(page.locator('text=Последние инциденты')).toBeVisible()
  })

  test('should translate admin panel content', async ({ page }) => {
    // Navigate to admin panel
    await page.click('text=Admin Panel')
    await page.waitForURL('/admin')
    
    // Switch to Spanish
    const languageSwitcher = page.locator('select')
    await languageSwitcher.selectOption('es')
    await page.waitForTimeout(1000)
    
    // Check admin panel translations
    await expect(page.locator('h1')).toContainText('Panel de administración')
    await expect(page.locator('text=Usuarios')).toBeVisible()
    await expect(page.locator('text=Crear usuario')).toBeVisible()
    await expect(page.locator('text=Nombre de usuario')).toBeVisible()
    await expect(page.locator('text=Correo electrónico')).toBeVisible()
    await expect(page.locator('text=Rol')).toBeVisible()
    await expect(page.locator('text=Permisos')).toBeVisible()
    await expect(page.locator('text=Acciones')).toBeVisible()
  })

  test('should translate user dashboard content', async ({ page }) => {
    // Navigate to user dashboard
    await page.click('text=User Dashboard')
    await page.waitForURL('/user-dashboard')
    
    // Switch to Russian
    const languageSwitcher = page.locator('select')
    await languageSwitcher.selectOption('ru')
    await page.waitForTimeout(1000)
    
    // Check user dashboard translations
    await expect(page.locator('h1')).toContainText('Пользовательская панель')
    await expect(page.locator('text=Профиль')).toBeVisible()
    await expect(page.locator('text=Имя')).toBeVisible()
    await expect(page.locator('text=Email')).toBeVisible()
    await expect(page.locator('text=Текущий пароль')).toBeVisible()
    await expect(page.locator('text=Новый пароль')).toBeVisible()
    await expect(page.locator('text=Подтвердите новый пароль')).toBeVisible()
    await expect(page.locator('text=Сохранить изменения')).toBeVisible()
  })

  test('should translate integrations page content', async ({ page }) => {
    // Navigate to integrations
    await page.click('text=Integrations')
    await page.waitForURL('/integrations')
    
    // Switch to Spanish
    const languageSwitcher = page.locator('select')
    await languageSwitcher.selectOption('es')
    await page.waitForTimeout(1000)
    
    // Check integrations translations
    await expect(page.locator('h1')).toContainText('Integraciones')
    await expect(page.locator('text=Añadir integración')).toBeVisible()
    await expect(page.locator('text=Nombre de la integración')).toBeVisible()
    await expect(page.locator('text=Tipo de integración')).toBeVisible()
    await expect(page.locator('text=Clave API')).toBeVisible()
    await expect(page.locator('text=URL del endpoint')).toBeVisible()
    await expect(page.locator('text=Estado')).toBeVisible()
  })

  test('should persist language selection', async ({ page }) => {
    // Switch to Russian
    const languageSwitcher = page.locator('select')
    await languageSwitcher.selectOption('ru')
    await page.waitForTimeout(1000)
    
    // Refresh the page
    await page.reload()
    
    // Check that language is still Russian
    await expect(page.locator('text=Главная')).toBeVisible()
    await expect(page.locator('text=Активы')).toBeVisible()
  })

  test('should translate login page', async ({ page }) => {
    // Logout first
    await page.click('button:has-text("Logout")')
    await page.waitForURL('/login')
    
    // Switch to Spanish
    const languageSwitcher = page.locator('select')
    await languageSwitcher.selectOption('es')
    await page.waitForTimeout(1000)
    
    // Check login page translations
    await expect(page.locator('text=Inicia sesión en tu panel de seguridad')).toBeVisible()
    await expect(page.locator('text=Nombre de usuario')).toBeVisible()
    await expect(page.locator('text=Contraseña')).toBeVisible()
    await expect(page.locator('text=Iniciar sesión')).toBeVisible()
    await expect(page.locator('text=Usuarios predeterminados:')).toBeVisible()
  })

  test('should handle language switching on different pages', async ({ page }) => {
    const pages = [
      { name: 'Assets', url: '/assets' },
      { name: 'Compliance', url: '/compliance' },
      { name: 'Customer Trust', url: '/customer-trust' },
      { name: 'Suppliers', url: '/suppliers' },
      { name: 'Reports', url: '/reports' },
      { name: 'Starter Guide', url: '/starter-guide' },
      { name: 'Integrations', url: '/integrations' }
    ]

    for (const pageInfo of pages) {
      // Navigate to page
      await page.goto(pageInfo.url)
      
      // Switch to Russian
      const languageSwitcher = page.locator('select')
      await languageSwitcher.selectOption('ru')
      await page.waitForTimeout(1000)
      
      // Check that page title is translated
      await expect(page.locator('h1')).toBeVisible()
      
      // Switch back to English
      await languageSwitcher.selectOption('en')
      await page.waitForTimeout(1000)
    }
  })
})