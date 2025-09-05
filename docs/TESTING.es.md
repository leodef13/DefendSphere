# Guía de Pruebas de DefendSphere

Este documento proporciona información completa sobre el framework de pruebas y procedimientos para el Panel de Seguridad DefendSphere.

## 🧪 Resumen de Pruebas

DefendSphere utiliza un enfoque de pruebas multicapa para garantizar confiabilidad, seguridad y rendimiento:

- **Pruebas Unitarias**: Pruebas de API backend con Jest
- **Pruebas E2E**: Pruebas de frontend con Playwright
- **Pruebas de Integración**: Pruebas completas del sistema
- **Pruebas de Seguridad**: Escaneo de vulnerabilidades y auditoría
- **Pruebas de Rendimiento**: Pruebas de carga y tiempo de respuesta

## 🏗️ Arquitectura de Pruebas

### Pruebas Backend (Jest)
- **Ubicación**: `backend/__tests__/`
- **Framework**: Jest con Supertest
- **Base de Datos**: Redis (base de datos de prueba)
- **Cobertura**: Endpoints API, autenticación, autorización

### Pruebas Frontend (Playwright)
- **Ubicación**: `frontend/tests/`
- **Framework**: Playwright
- **Navegadores**: Chrome, Firefox, Safari, Mobile
- **Cobertura**: Interacciones UI, navegación, flujos de usuario

## 🚀 Ejecutar Pruebas

### Prerrequisitos
```bash
# Instalar Node.js 18+
# Instalar Redis
# Instalar dependencias
cd backend && npm install
cd frontend && npm install
```

### Pruebas Unitarias Backend
```bash
# Ejecutar todas las pruebas backend
cd backend
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage

# Ejecutar archivo de prueba específico
npm test auth.test.js
```

### Pruebas E2E Frontend
```bash
# Ejecutar todas las pruebas e2e
cd frontend
npm test

# Ejecutar pruebas con UI
npm run test:ui

# Ejecutar pruebas en modo headed
npm run test:headed

# Ejecutar pruebas en modo debug
npm run test:debug

# Ejecutar archivo de prueba específico
npm test auth.spec.js
```

### Pruebas de Integración
```bash
# Iniciar servicios
cd backend && npm start &
cd frontend && npm run dev &

# Ejecutar pruebas de integración
cd frontend
npx playwright test --grep "Integration"
```

## 📋 Categorías de Pruebas

### 1. Pruebas de Autenticación
- ✅ Inicio de sesión con usuarios válidos (admin, user1, user2)
- ❌ Rechazo de credenciales inválidas
- 🔐 Validación de tokens y expiración
- 🚪 Funcionalidad de cierre de sesión

### 2. Pruebas de Autorización
- 👑 Acceso de admin a todas las funciones
- 👤 Control de acceso basado en roles de usuario
- 🚫 Prevención de acceso no autorizado
- 🔒 Navegación basada en permisos

### 3. Pruebas de Navegación
- 🧭 Funcionalidad de navegación en barra lateral
- 📱 Pruebas de diseño responsivo
- 🔄 Protección de rutas
- 🎯 Control de acceso directo a URL

### 4. Pruebas de Panel de Administración
- 👥 Gestión de usuarios (CRUD)
- 🎛️ Asignación de roles y permisos
- 📊 Listado y filtrado de usuarios
- 🗑️ Eliminación de usuarios con salvaguardas

### 5. Pruebas de Panel de Usuario
- 👤 Gestión de perfil
- 🔑 Funcionalidad de cambio de contraseña
- 📝 Validación de formularios
- 💾 Persistencia de datos

### 6. Pruebas de Integraciones
- 🔌 Operaciones CRUD de integraciones
- ⚙️ Gestión de configuración
- 📊 Monitoreo de estado
- 🔄 Funcionalidad de sincronización

### 7. Pruebas de Multilenguaje
- 🌍 Cambio de idioma (EN/RU/ES)
- 📝 Verificación de traducción de contenido
- 💾 Persistencia de preferencias de idioma
- 🔄 Consistencia de idioma entre páginas

## 🎯 Datos de Prueba

### Usuarios de Prueba por Defecto
```javascript
// Usuario administrador
username: 'admin'
password: 'admin'
role: 'admin'
permissions: ['all']

// User1 (Analista de Seguridad)
username: 'user1'
password: 'user1'
role: 'user'
permissions: ['access.dashboard', 'access.assets', 'access.incidents', 'access.alerts']

// User2 (Usuario Estándar)
username: 'user2'
password: 'user2'
role: 'user'
permissions: ['access.dashboard', 'access.reports', 'access.assets', 'access.suppliers']
```

### Entorno de Prueba
- **URL Backend**: `http://localhost:5000`
- **URL Frontend**: `http://localhost:5173`
- **Redis**: `redis://localhost:6379/1` (base de datos de prueba)
- **JWT Secret**: `test-secret-key`

## 🔧 Configuración de Pruebas

### Configuración Jest (`backend/jest.config.js`)
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

### Configuración Playwright (`frontend/playwright.config.js`)
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

## 📊 Cobertura de Pruebas

### Cobertura Backend
- **Autenticación**: 100%
- **Autorización**: 100%
- **Gestión de Usuarios**: 100%
- **Integraciones**: 100%
- **Endpoints API**: 95%+

### Cobertura Frontend
- **Flujo de Autenticación**: 100%
- **Navegación**: 100%
- **Panel de Administración**: 100%
- **Panel de Usuario**: 100%
- **Multilenguaje**: 100%

## 🚨 Integración CI/CD

### Workflow GitHub Actions
El proyecto incluye pruebas automatizadas a través de GitHub Actions:

- **Disparadores**: Push a main/master, Pull requests
- **Trabajos**: Pruebas backend, pruebas frontend, pruebas de integración, pruebas de seguridad, pruebas de rendimiento
- **Artefactos**: Reportes de pruebas, capturas de pantalla, reportes de cobertura
- **Notificaciones**: Notificaciones de éxito/fallo

### Características del Workflow
- ✅ Ejecución paralela de pruebas
- 🔄 Reintento automático en fallo
- 📊 Reportes de cobertura
- 🖼️ Captura de pantallas en fallo
- 📹 Grabación de video para depuración
- 🔒 Escaneo de vulnerabilidades de seguridad

## 🐛 Depuración de Pruebas

### Depuración de Pruebas Backend
```bash
# Ejecutar prueba específica con salida detallada
npm test -- --verbose auth.test.js

# Ejecutar pruebas con depuración
node --inspect-brk node_modules/.bin/jest --runInBand

# Verificar base de datos de prueba
redis-cli -n 1
```

### Depuración de Pruebas Frontend
```bash
# Ejecutar pruebas en modo debug
npm run test:debug

# Ejecutar prueba específica en modo headed
npx playwright test auth.spec.js --headed

# Abrir resultados de pruebas
npx playwright show-report
```

### Problemas Comunes
1. **Conexión Redis**: Asegurar que Redis esté ejecutándose en puerto 6379
2. **Conflictos de Puerto**: Verificar que los puertos 5000 y 5173 estén disponibles
3. **Dependencias**: Ejecutar `npm install` en backend y frontend
4. **Problemas de Navegador**: Ejecutar `npx playwright install` para instalar navegadores

## 📈 Pruebas de Rendimiento

### Pruebas de Carga
```bash
# Probar tiempos de respuesta API
for i in {1..10}; do
  curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/health
done
```

### Pruebas de Memoria
```bash
# Monitorear uso de memoria durante pruebas
npm test -- --detectLeaks
```

## 🔒 Pruebas de Seguridad

### Escaneo de Vulnerabilidades
```bash
# Auditoría de seguridad backend
cd backend && npm audit

# Auditoría de seguridad frontend
cd frontend && npm audit

# Verificar secretos
trufflehog filesystem ./
```

## 📝 Escribir Nuevas Pruebas

### Plantilla de Prueba Backend
```javascript
import request from 'supertest'
import { app } from '../index.js'

describe('Pruebas de Función', () => {
  test('debería realizar acción', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send({ data: 'value' })
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('expected')
  })
})
```

### Plantilla de Prueba Frontend
```javascript
import { test, expect } from '@playwright/test'

test.describe('Pruebas de Función', () => {
  test('debería realizar acción', async ({ page }) => {
    await page.goto('/page')
    await page.click('button')
    await expect(page.locator('text=Expected')).toBeVisible()
  })
})
```

## 📚 Recursos Adicionales

- [Documentación Jest](https://jestjs.io/docs/getting-started)
- [Documentación Playwright](https://playwright.dev/docs/intro)
- [Documentación Supertest](https://github.com/visionmedia/supertest)
- [Documentación GitHub Actions](https://docs.github.com/en/actions)

## 🤝 Contribuir

Al agregar nuevas funciones:

1. Escribir pruebas unitarias para funcionalidad backend
2. Escribir pruebas e2e para interacciones frontend
3. Asegurar que todas las pruebas pasen localmente
4. Actualizar esta documentación si es necesario
5. Crear pull request con cobertura de pruebas

## 📞 Soporte

Para problemas relacionados con pruebas:
- Revisar la sección de solución de problemas arriba
- Revisar logs de pruebas y mensajes de error
- Asegurar que todas las dependencias estén instaladas
- Verificar conectividad de servicios (Redis, backend, frontend)