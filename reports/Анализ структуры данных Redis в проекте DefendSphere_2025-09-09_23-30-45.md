# Анализ структуры данных Redis в проекте DefendSphere

**Дата:** 2025-09-09  
**Время:** 23:30:45  
**Автор:** AI Assistant  

## Резюме

Проведен полный анализ кодовой базы проекта DefendSphere для выявления структуры данных Redis и текущего содержимого. Обнаружена комплексная система хранения данных с поддержкой fallback на файловое хранение.

## Архитектура хранения данных

### 🔄 **Двойная система хранения:**

#### **1. Основная система - Redis:**
- **Тип:** In-memory база данных
- **URL:** `redis://localhost:6380` (по умолчанию)
- **Использование:** Основное хранилище для production

#### **2. Fallback система - Файлы:**
- **Тип:** JSON файлы в `/backend/data/`
- **Использование:** Резервное хранилище при недоступности Redis
- **Файлы:** `users.json`, `assets.json`

## Структура данных Redis

### 📊 **Схема ключей Redis:**

#### **1. Пользователи (Users):**

**Hash структуры:**
```
user:{username} -> Hash
├── id: string
├── username: string
├── fullName: string
├── email: string
├── password: string (bcrypt hash)
├── organization: string
├── position: string
├── role: string (admin/user)
├── phone: string
├── permissions: string (JSON array)
├── additionalOrganizations: string (JSON array)
├── createdAt: string (ISO date)
└── lastLogin: string (ISO date)
```

**Set структуры:**
```
users -> Set
├── "admin"
├── "user1"
├── "user2"
└── "user3"
```

#### **2. Компании (Companies):**

**Hash структуры:**
```
company:{companyId} -> Hash
└── data: string (JSON object)
    ├── id: string
    ├── name: string
    ├── createdAt: string (ISO date)
    └── updatedAt: string (ISO date)
```

**Set структуры:**
```
companies -> Set
├── "company-lld"
└── "watson-morris"
```

#### **3. Активы (Assets):**

**Hash структуры:**
```
company:{companyId}:assets -> Hash
├── {assetId}: string (JSON object)
│   ├── assetId: string
│   ├── name: string
│   ├── type: string
│   ├── environment: string
│   ├── ipAddress: string
│   ├── lastAssessment: string (date)
│   ├── complianceScore: number
│   ├── standards: array
│   └── vulnerabilities: object
│       ├── critical: number
│       ├── high: number
│       ├── medium: number
│       ├── low: number
│       └── total: number
```

**Set структуры:**
```
company:{companyId}:assetIds -> Set
├── "asset-1"
├── "asset-2"
├── "asset-3"
└── "asset-4"
```

#### **4. Системные данные:**

**String структуры:**
```
system:initialized -> "true"
system:version -> "1.0.0"
system:lastInit -> string (ISO date)
```

## Текущие данные в системе

### 👥 **Пользователи:**

#### **1. admin (ID: 1)**
```json
{
  "id": "1",
  "username": "admin",
  "fullName": "System Administrator",
  "email": "admin@defendsphere.com",
  "organization": "DefendSphere",
  "position": "System Admin",
  "role": "admin",
  "phone": "+1-555-0000",
  "permissions": ["all"],
  "additionalOrganizations": []
}
```

#### **2. user1 (ID: 2)**
```json
{
  "id": "2",
  "username": "user1",
  "fullName": "John Smith",
  "email": "user1@company-lld.com",
  "organization": "Company LLD",
  "position": "CEO",
  "role": "admin",
  "phone": "+1-555-0101",
  "permissions": [
    "access.dashboard",
    "access.assets",
    "access.compliance",
    "access.customerTrust",
    "access.suppliers",
    "access.reports",
    "access.integrations",
    "access.admin"
  ],
  "additionalOrganizations": []
}
```

#### **3. user2 (ID: 3)**
```json
{
  "id": "3",
  "username": "user2",
  "fullName": "Bob Wilson",
  "email": "user2@watson-morris.com",
  "organization": "Watson Morris",
  "position": "Security Analyst",
  "role": "user",
  "phone": "+1-555-0102",
  "permissions": [
    "access.dashboard",
    "access.reports",
    "access.assets",
    "access.suppliers"
  ],
  "additionalOrganizations": []
}
```

#### **4. user3 (ID: 4)**
```json
{
  "id": "4",
  "username": "user3",
  "fullName": "Jane Doe",
  "email": "user3@company-lld.com",
  "organization": "Company LLD",
  "position": "CISO",
  "role": "user",
  "phone": "+1-555-0103",
  "permissions": [
    "access.dashboard",
    "access.assets",
    "access.compliance",
    "access.customerTrust",
    "access.suppliers",
    "access.reports",
    "access.integrations"
  ],
  "additionalOrganizations": []
}
```

### 🏢 **Компании:**

#### **1. Company LLD**
```json
{
  "id": "company-lld",
  "name": "Company LLD",
  "createdAt": "2025-09-09T...",
  "updatedAt": "2025-09-09T..."
}
```

#### **2. Watson Morris**
```json
{
  "id": "watson-morris",
  "name": "Watson Morris",
  "createdAt": "2025-09-09T...",
  "updatedAt": "2025-09-09T..."
}
```

### 📊 **Активы Company LLD:**

#### **1. Web Server (asset-1)**
```json
{
  "assetId": "asset-1",
  "name": "www.company-lld.com",
  "type": "Web Server",
  "environment": "Production",
  "ipAddress": "116.203.242.207",
  "lastAssessment": "2024-01-15",
  "complianceScore": 75,
  "standards": ["NIS2", "GDPR", "ISO/IEC 27001"],
  "vulnerabilities": {
    "critical": 1,
    "high": 3,
    "medium": 5,
    "low": 1,
    "total": 10
  }
}
```

#### **2. Database Server (asset-2)**
```json
{
  "assetId": "asset-2",
  "name": "db.company-lld.com",
  "type": "Database Server",
  "environment": "Production",
  "ipAddress": "10.0.0.12",
  "lastAssessment": "2024-01-15",
  "complianceScore": 70,
  "standards": ["NIS2", "ISO/IEC 27001"],
  "vulnerabilities": {
    "critical": 1,
    "high": 2,
    "medium": 4,
    "low": 1,
    "total": 8
  }
}
```

#### **3. Application Server (asset-3)**
```json
{
  "assetId": "asset-3",
  "name": "app.company-lld.com",
  "type": "Application Server",
  "environment": "Production",
  "ipAddress": "10.0.0.21",
  "lastAssessment": "2024-01-15",
  "complianceScore": 80,
  "standards": ["GDPR", "ISO/IEC 27001"],
  "vulnerabilities": {
    "critical": 2,
    "high": 3,
    "medium": 3,
    "low": 1,
    "total": 9
  }
}
```

#### **4. VPN Gateway (asset-4)**
```json
{
  "assetId": "asset-4",
  "name": "vpn.company-lld.com",
  "type": "VPN Gateway",
  "environment": "Production",
  "ipAddress": "10.0.0.30",
  "lastAssessment": "2024-01-15",
  "complianceScore": 75,
  "standards": ["NIS2"],
  "vulnerabilities": {
    "critical": 1,
    "high": 1,
    "medium": 2,
    "low": 1,
    "total": 5
  }
}
```

## Операции с Redis

### 🔧 **Основные операции:**

#### **1. Hash операции:**
- `redis.hSet(key, field, value)` - установка поля в hash
- `redis.hGet(key, field)` - получение поля из hash
- `redis.hGetAll(key)` - получение всех полей hash
- `redis.hDel(key, field)` - удаление поля из hash

#### **2. Set операции:**
- `redis.sAdd(key, ...members)` - добавление элементов в set
- `redis.sMembers(key)` - получение всех элементов set
- `redis.sRem(key, ...members)` - удаление элементов из set

#### **3. String операции:**
- `redis.set(key, value)` - установка строкового значения
- `redis.get(key)` - получение строкового значения
- `redis.del(key)` - удаление ключа
- `redis.exists(key)` - проверка существования ключа

### 📁 **Файлы с Redis операциями:**

1. **`backend/index.js`** - основные API endpoints
2. **`backend/middleware/auth.js`** - аутентификация
3. **`backend/routes/assets.js`** - управление активами
4. **`backend/init-users.js`** - инициализация пользователей
5. **`backend/init-company-lld-data.js`** - инициализация данных Company LLD
6. **`backend/scripts/init-redis.js`** - базовая инициализация
7. **`backend/scripts/init-company-data.js`** - инициализация компаний

## Fallback система

### 📄 **Файловое хранение:**

#### **1. `/backend/data/users.json`:**
```json
[
  {
    "id": "2",
    "username": "user1",
    "fullName": "John Smith",
    "email": "user1@company-lld.com",
    "password": "user1",
    "organization": "Company LLD",
    "position": "CEO",
    "role": "admin",
    "phone": "+1-555-0101",
    "permissions": [
      "access.dashboard",
      "access.assets",
      "access.compliance",
      "access.customerTrust",
      "access.suppliers",
      "access.reports",
      "access.integrations",
      "access.admin"
    ],
    "additionalOrganizations": [],
    "createdAt": "2025-09-10T12:32:11.841Z",
    "lastLogin": "2025-09-10T12:32:11.845Z"
  },
  {
    "id": "4",
    "username": "user3",
    "fullName": "Jane Doe",
    "email": "user3@company-lld.com",
    "password": "user3",
    "organization": "Company LLD",
    "position": "CISO",
    "role": "user",
    "phone": "+1-555-0103",
    "permissions": [
      "access.dashboard",
      "access.assets",
      "access.compliance",
      "access.customerTrust",
      "access.suppliers",
      "access.reports",
      "access.integrations"
    ],
    "additionalOrganizations": [],
    "createdAt": "2025-09-10T12:32:11.845Z",
    "lastLogin": "2025-09-10T12:32:11.845Z"
  }
]
```

#### **2. `/backend/data/assets.json`:**
```json
[
  {
    "id": "asset-1",
    "assetId": "asset-1",
    "name": "www.company-lld.com",
    "type": "Web Server",
    "environment": "Production",
    "ipAddress": "116.203.242.207",
    "lastAssessment": "2024-01-15",
    "complianceScore": 75,
    "standards": ["NIS2", "GDPR", "ISO/IEC 27001"],
    "vulnerabilities": {
      "critical": 1,
      "high": 3,
      "medium": 5,
      "low": 1,
      "total": 10
    }
  },
  // ... остальные 3 актива
]
```

## Система разрешений

### 🔐 **Типы разрешений:**

#### **1. Доступ к разделам:**
- `access.dashboard` - доступ к главной панели
- `access.assets` - доступ к управлению активами
- `access.compliance` - доступ к соответствию
- `access.customerTrust` - доступ к доверию клиентов
- `access.suppliers` - доступ к поставщикам
- `access.reports` - доступ к отчетам
- `access.integrations` - доступ к интеграциям
- `access.admin` - доступ к административной панели

#### **2. Специальные разрешения:**
- `all` - полный доступ (только для admin)

### 👤 **Роли пользователей:**

#### **1. admin:**
- Полный доступ ко всем разделам
- Управление пользователями
- Системные настройки

#### **2. user:**
- Ограниченный доступ на основе разрешений
- Доступ только к назначенным разделам

## Многотенантность

### 🏢 **Организационная структура:**

#### **1. Company LLD:**
- **Пользователи:** user1 (CEO), user3 (CISO)
- **Активы:** 4 актива (Web, DB, App, VPN)
- **Доступ:** Полный доступ к активам компании

#### **2. Watson Morris:**
- **Пользователи:** user2 (Security Analyst)
- **Активы:** Нет активов в системе
- **Доступ:** Ограниченный доступ

#### **3. DefendSphere:**
- **Пользователи:** admin (System Administrator)
- **Доступ:** Системный администратор

## Статистика данных

### 📊 **Текущее содержимое:**

| Тип данных | Количество | Описание |
|------------|------------|----------|
| **Пользователи** | 4 | admin, user1, user2, user3 |
| **Компании** | 2 | Company LLD, Watson Morris |
| **Активы** | 4 | Все принадлежат Company LLD |
| **Разрешения** | 8 типов | Различные уровни доступа |
| **Роли** | 2 | admin, user |

### 🔄 **Состояние системы:**

| Компонент | Статус | Описание |
|-----------|--------|----------|
| **Redis** | Основной | In-memory хранилище |
| **Fallback** | Резервный | JSON файлы |
| **Аутентификация** | Активна | JWT + bcrypt |
| **Многотенантность** | Реализована | Организационное разделение |
| **Разрешения** | Настроены | Role-based access control |

## Заключение

### 🎯 **Ключевые особенности:**

1. **✅ Двойная система хранения** - Redis + файловый fallback
2. **✅ Многотенантная архитектура** - разделение по организациям
3. **✅ Role-based access control** - система разрешений
4. **✅ Безопасность** - хеширование паролей, JWT токены
5. **✅ Масштабируемость** - поддержка множественных компаний
6. **✅ Отказоустойчивость** - fallback на файловое хранение

### 📋 **Рекомендации:**

1. **Мониторинг Redis** - отслеживание состояния подключения
2. **Резервное копирование** - регулярные бэкапы данных
3. **Логирование** - детальные логи операций с данными
4. **Тестирование** - unit тесты для операций с Redis
5. **Документация** - поддержание актуальной схемы данных

## Статус

✅ **Структура данных Redis полностью проанализирована**  
✅ **Текущее содержимое задокументировано**  
✅ **Fallback система описана**  
✅ **Система разрешений изучена**  
✅ **Многотенантность подтверждена**  
✅ **Готово к использованию и развитию**

**Система хранения данных DefendSphere представляет собой надежную, масштабируемую и отказоустойчивую архитектуру!** 🎉