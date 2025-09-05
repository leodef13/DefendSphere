# Руководство по тестированию DefendSphere

Этот документ предоставляет полную информацию о фреймворке тестирования и процедурах для панели безопасности DefendSphere.

## 🧪 Обзор тестирования

DefendSphere использует многоуровневый подход к тестированию для обеспечения надежности, безопасности и производительности:

- **Модульные тесты**: Тестирование API бэкенда с Jest
- **E2E тесты**: Тестирование фронтенда с Playwright
- **Интеграционные тесты**: Полное системное тестирование
- **Тесты безопасности**: Сканирование уязвимостей и аудит
- **Тесты производительности**: Нагрузочное тестирование и время отклика

## 🏗️ Архитектура тестов

### Тестирование бэкенда (Jest)
- **Расположение**: `backend/__tests__/`
- **Фреймворк**: Jest с Supertest
- **База данных**: Redis (тестовая база)
- **Покрытие**: API эндпоинты, аутентификация, авторизация

### Тестирование фронтенда (Playwright)
- **Расположение**: `frontend/tests/`
- **Фреймворк**: Playwright
- **Браузеры**: Chrome, Firefox, Safari, Mobile
- **Покрытие**: UI взаимодействия, навигация, пользовательские потоки

## 🚀 Запуск тестов

### Предварительные требования
```bash
# Установить Node.js 18+
# Установить Redis
# Установить зависимости
cd backend && npm install
cd frontend && npm install
```

### Модульные тесты бэкенда
```bash
# Запустить все тесты бэкенда
cd backend
npm test

# Запустить тесты в режиме наблюдения
npm run test:watch

# Запустить тесты с покрытием
npm run test:coverage

# Запустить конкретный тестовый файл
npm test auth.test.js
```

### E2E тесты фронтенда
```bash
# Запустить все e2e тесты
cd frontend
npm test

# Запустить тесты с UI
npm run test:ui

# Запустить тесты в видимом режиме
npm run test:headed

# Запустить тесты в режиме отладки
npm run test:debug

# Запустить конкретный тестовый файл
npm test auth.spec.js
```

### Интеграционные тесты
```bash
# Запустить сервисы
cd backend && npm start &
cd frontend && npm run dev &

# Запустить интеграционные тесты
cd frontend
npx playwright test --grep "Integration"
```

## 📋 Категории тестов

### 1. Тесты аутентификации
- ✅ Вход с валидными пользователями (admin, user1, user2)
- ❌ Отклонение неверных учетных данных
- 🔐 Валидация токенов и истечение срока
- 🚪 Функциональность выхода

### 2. Тесты авторизации
- 👑 Доступ администратора ко всем функциям
- 👤 Контроль доступа на основе ролей пользователей
- 🚫 Предотвращение несанкционированного доступа
- 🔒 Навигация на основе разрешений

### 3. Тесты навигации
- 🧭 Функциональность навигации в боковой панели
- 📱 Тестирование адаптивного дизайна
- 🔄 Защита маршрутов
- 🎯 Контроль прямого доступа к URL

### 4. Тесты админской панели
- 👥 Управление пользователями (CRUD)
- 🎛️ Назначение ролей и разрешений
- 📊 Список и фильтрация пользователей
- 🗑️ Удаление пользователей с защитой

### 5. Тесты пользовательской панели
- 👤 Управление профилем
- 🔑 Функциональность смены пароля
- 📝 Валидация форм
- 💾 Сохранение данных

### 6. Тесты интеграций
- 🔌 CRUD операции с интеграциями
- ⚙️ Управление конфигурацией
- 📊 Мониторинг статуса
- 🔄 Функциональность синхронизации

### 7. Тесты мультиязычности
- 🌍 Переключение языков (EN/RU/ES)
- 📝 Проверка перевода контента
- 💾 Сохранение предпочтений языка
- 🔄 Консистентность языка между страницами

## 🎯 Тестовые данные

### Пользователи по умолчанию для тестов
```javascript
// Пользователь-администратор
username: 'admin'
password: 'admin'
role: 'admin'
permissions: ['all']

// User1 (Аналитик безопасности)
username: 'user1'
password: 'user1'
role: 'user'
permissions: ['access.dashboard', 'access.assets', 'access.incidents', 'access.alerts']

// User2 (Обычный пользователь)
username: 'user2'
password: 'user2'
role: 'user'
permissions: ['access.dashboard', 'access.reports', 'access.assets', 'access.suppliers']
```

### Тестовая среда
- **URL бэкенда**: `http://localhost:5000`
- **URL фронтенда**: `http://localhost:5173`
- **Redis**: `redis://localhost:6379/1` (тестовая база)
- **JWT Secret**: `test-secret-key`

## 🔧 Конфигурация тестов

### Конфигурация Jest (`backend/jest.config.js`)
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

### Конфигурация Playwright (`frontend/playwright.config.js`)
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

## 📊 Покрытие тестами

### Покрытие бэкенда
- **Аутентификация**: 100%
- **Авторизация**: 100%
- **Управление пользователями**: 100%
- **Интеграции**: 100%
- **API эндпоинты**: 95%+

### Покрытие фронтенда
- **Поток аутентификации**: 100%
- **Навигация**: 100%
- **Админская панель**: 100%
- **Пользовательская панель**: 100%
- **Мультиязычность**: 100%

## 🚨 Интеграция CI/CD

### Workflow GitHub Actions
Проект включает автоматизированное тестирование через GitHub Actions:

- **Триггеры**: Push в main/master, Pull requests
- **Задачи**: Тесты бэкенда, тесты фронтенда, интеграционные тесты, тесты безопасности, тесты производительности
- **Артефакты**: Отчеты тестов, скриншоты, отчеты покрытия
- **Уведомления**: Уведомления об успехе/неудаче

### Особенности Workflow
- ✅ Параллельное выполнение тестов
- 🔄 Автоматический повтор при неудаче
- 📊 Отчетность о покрытии
- 🖼️ Захват скриншотов при неудаче
- 📹 Запись видео для отладки
- 🔒 Сканирование уязвимостей безопасности

## 🐛 Отладка тестов

### Отладка тестов бэкенда
```bash
# Запустить конкретный тест с подробным выводом
npm test -- --verbose auth.test.js

# Запустить тесты с отладкой
node --inspect-brk node_modules/.bin/jest --runInBand

# Проверить тестовую базу данных
redis-cli -n 1
```

### Отладка тестов фронтенда
```bash
# Запустить тесты в режиме отладки
npm run test:debug

# Запустить конкретный тест в видимом режиме
npx playwright test auth.spec.js --headed

# Открыть результаты тестов
npx playwright show-report
```

### Частые проблемы
1. **Подключение к Redis**: Убедитесь, что Redis запущен на порту 6379
2. **Конфликты портов**: Проверьте, что порты 5000 и 5173 доступны
3. **Зависимости**: Запустите `npm install` в папках backend и frontend
4. **Проблемы с браузером**: Запустите `npx playwright install` для установки браузеров

## 📈 Тестирование производительности

### Нагрузочное тестирование
```bash
# Тестировать время отклика API
for i in {1..10}; do
  curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/health
done
```

### Тестирование памяти
```bash
# Мониторить использование памяти во время тестов
npm test -- --detectLeaks
```

## 🔒 Тестирование безопасности

### Сканирование уязвимостей
```bash
# Аудит безопасности бэкенда
cd backend && npm audit

# Аудит безопасности фронтенда
cd frontend && npm audit

# Проверить на секреты
trufflehog filesystem ./
```

## 📝 Написание новых тестов

### Шаблон теста бэкенда
```javascript
import request from 'supertest'
import { app } from '../index.js'

describe('Тесты функции', () => {
  test('должен выполнить действие', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send({ data: 'value' })
    
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('expected')
  })
})
```

### Шаблон теста фронтенда
```javascript
import { test, expect } from '@playwright/test'

test.describe('Тесты функции', () => {
  test('должен выполнить действие', async ({ page }) => {
    await page.goto('/page')
    await page.click('button')
    await expect(page.locator('text=Expected')).toBeVisible()
  })
})
```

## 📚 Дополнительные ресурсы

- [Документация Jest](https://jestjs.io/docs/getting-started)
- [Документация Playwright](https://playwright.dev/docs/intro)
- [Документация Supertest](https://github.com/visionmedia/supertest)
- [Документация GitHub Actions](https://docs.github.com/en/actions)

## 🤝 Вклад в проект

При добавлении новых функций:

1. Написать модульные тесты для функциональности бэкенда
2. Написать e2e тесты для взаимодействий фронтенда
3. Убедиться, что все тесты проходят локально
4. Обновить эту документацию при необходимости
5. Создать pull request с покрытием тестами

## 📞 Поддержка

По вопросам тестирования:
- Проверьте раздел устранения неполадок выше
- Просмотрите логи тестов и сообщения об ошибках
- Убедитесь, что все зависимости установлены
- Проверьте подключение к сервисам (Redis, backend, frontend)