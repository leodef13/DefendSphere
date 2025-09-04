# 🆕 Новые возможности DefendSphere Dashboard

## 📋 Обзор обновлений

В этой версии добавлены шесть новых разделов с расширенной функциональностью:

1. **Starter Guide** - Интерактивная анкета для оценки инфраструктуры
2. **Suppliers** - Управление поставщиками и их соответствием
3. **Reports** - Система отчетов с интерактивными таблицами
4. **Customer Trust** - Управление клиентами и партнерами
5. **Assets** - Управление активами и их безопасностью
6. **Compliance** - Управление соответствием стандартам

## 🎯 Starter Guide - Интерактивная анкета

### Описание
Раздел Starter Guide предоставляет пользователям возможность заполнить комплексную анкету для быстрой оценки их цифровой инфраструктуры и получения рекомендаций по безопасности.

### Основные функции

#### 📝 Заполнение анкеты
- **Сектор организации**: Banking, Chemical industry, Digital infrastructure, Healthcare, Transport
- **Информационные системы**: Наличие, расположение (On-premise/Cloud/Rented)
- **Обработка данных ЕС**: GDPR compliance, типы обрабатываемых данных
- **Стратегия безопасности**: Наличие, ответственные лица, команда
- **Планы восстановления**: Disaster recovery, incident response
- **Тестирование уязвимостей**: Регулярность, желание получить отчет
- **Стандарты соответствия**: ISO 27001, GDPR, DORA, NIS2, SOC2, PCI DSS
- **Планы аудита**: Сертифицированный аудит, предварительная проверка
- **Контактная информация**: Имя, компания, email, телефон

#### 🔍 Просмотр результатов
После заполнения анкеты пользователь получает:
- **Сводку по компании**: Название, контакт, сектор
- **Оценку инфраструктуры**: Количество систем, инциденты
- **Статус соответствия**: Выбранные стандарты, уровень готовности
- **Рекомендации**: Следующие шаги для улучшения

#### 📊 Экспорт данных
- **PDF экспорт**: Структурированный отчет в PDF формате
- **Excel экспорт**: Данные в табличном формате для анализа

#### ✏️ Редактирование
- Возможность изменения любой информации
- Сохранение истории изменений
- Валидация данных при обновлении

### API Endpoints

```bash
# Получение данных анкеты
GET /api/starter-guide

# Создание новой анкеты
POST /api/starter-guide

# Обновление анкеты
PUT /api/starter-guide/:id

# Экспорт данных
GET /api/starter-guide/:id/export?format=pdf|excel

# Удаление анкеты
DELETE /api/starter-guide/:id

# Логи изменений
GET /api/starter-guide/logs/:userId

# Статистика (только для админов)
GET /api/starter-guide/stats
```

## 🏢 Suppliers - Управление поставщиками

### Описание
Раздел Suppliers предоставляет комплексное управление поставщиками с оценкой их соответствия стандартам безопасности и возможностью мониторинга рисков.

### Основные функции

#### 🔍 Фильтрация и поиск
- **Access Level**: With Access to Infrastructure/Data, No Access (Basic Services)
- **Supplier Type**: Software, Hardware, Services, Administrative
- **Standards**: NIS2, SOC2, GDPR, DORA
- **Compliance Level**: High (>85%), Medium (40-85%), Low (<40%)
- **Поиск**: По названию, категории, ответственному лицу

#### 📊 Таблица поставщиков
- **Supplier Name**: Название и тип поставщика
- **Category**: Основная категория услуг
- **Sub-Gradation**: Уровень доступа к инфраструктуре
- **Assigned Standards**: Применяемые стандарты
- **Compliance %**: Процент соответствия с цветовой индикацией
- **Last Assessment**: Дата последней оценки
- **Actions**: Просмотр, редактирование, удаление

#### ➕ Управление поставщиками
- **Add Supplier**: Форма добавления нового поставщика
- **Edit Supplier**: Редактирование существующей информации
- **Remove Supplier**: Удаление с подтверждением

#### 📈 Экспорт данных
- **Excel Export**: Экспорт с текущими фильтрами
- **PDF Export**: Отчет в PDF формате
- **Back to Dashboard**: Возврат на главную страницу

### Примеры данных

| Supplier Name | Category | Standards | Compliance % | Last Assessment |
|---------------|----------|-----------|--------------|-----------------|
| Alfa SL | Cloud Infrastructure | NIS2, GDPR | 92% | 2 weeks ago |
| Gamma Systems | Hardware Infrastructure | NIS2, DORA | 34% | 3 weeks ago |
| Delta Analytics | Business Intelligence | GDPR, SOC2 | 89% | 1 week ago |

## 📊 Reports - Система отчетов

### Описание
Раздел Reports предоставляет интерактивную систему для создания, управления и анализа отчетов по безопасности с возможностью фильтрации и экспорта.

### Основные функции

#### 📈 Краткая сводка (Summary)
- **Systems Checked**: Общее количество проверенных систем
- **Incidents Found**: Выявленные инциденты
- **Avg Compliance**: Средний процент соответствия
- **Total Reports**: Общее количество отчетов
- **Risk Level Distribution**: Распределение по уровням риска

#### 🔍 Фильтры
- **Report Type**: Security Assessment, Compliance Audit, Vulnerability Scan, Incident Report
- **Date Range**: Last 30/90 days, This Year, All Time
- **Department**: IT Security, Legal & Compliance, Quality Assurance
- **Risk Level**: High, Medium, Low, Not Assessed
- **Search**: По названию, владельцу, типу отчета

#### 📋 Таблица отчетов
- **Report Name**: Название и краткая информация
- **Type**: Тип отчета
- **Owner**: Ответственное лицо
- **Department**: Подразделение
- **Created Date**: Дата создания (сортировка)
- **Status**: Статус выполнения
- **Risk Level**: Уровень риска с цветовой индикацией
- **Actions**: Просмотр, редактирование, удаление

#### ➕ Управление отчетами
- **Add Report**: Создание нового отчета
- **Edit Report**: Редактирование существующего
- **Delete Report**: Удаление с подтверждением
- **View Summary**: Просмотр краткой сводки

#### 📤 Экспорт
- **Export PDF**: Полный отчет в PDF
- **Export Excel**: Данные в Excel формате
- **Back to Dashboard**: Возврат на главную страницу

### Примеры отчетов

| Report Name | Type | Owner | Department | Status | Risk Level |
|-------------|------|-------|------------|--------|------------|
| Q4 Security Assessment | Security Assessment | John Smith | IT Security | Completed | Low |
| GDPR Compliance Audit | Compliance Audit | Sarah Johnson | Legal & Compliance | In Progress | Medium |
| Vulnerability Scan Results | Vulnerability Scan | Mike Brown | IT Security | Completed | High |

## 🛠️ Техническая реализация

### Frontend компоненты

#### Starter Guide
```typescript
// Основные интерфейсы
interface StarterGuideForm {
  sector: string;
  hasInformationSystems: boolean;
  systemLocation?: string;
  processesEUCitizenData: boolean;
  dataTypes?: string[];
  // ... остальные поля
}

// Состояния компонента
const [isFormMode, setIsFormMode] = useState(true);
const [formData, setFormData] = useState<StarterGuideForm>({...});
const [savedData, setSavedData] = useState<StarterGuideData | null>(null);
```

#### Suppliers
```typescript
// Интерфейс поставщика
interface Supplier {
  id: string;
  name: string;
  category: string;
  subGradation: string;
  assignedStandards: string[];
  complianceLevel: number;
  lastAssessment: string;
  // ... остальные поля
}

// Фильтры
interface SupplierFilters {
  accessLevel: string;
  supplierType: string;
  standards: string;
  complianceLevel: string;
}
```

#### Reports
```typescript
// Интерфейс отчета
interface Report {
  id: string;
  name: string;
  type: string;
  owner: string;
  department: string;
  createdDate: string;
  status: string;
  riskLevel: 'high' | 'medium' | 'low' | 'not-assessed';
  // ... остальные поля
}

// Фильтры
interface ReportFilters {
  reportType: string;
  dateRange: string;
  department: string;
  riskLevel: string;
}
```

### Backend API

#### Starter Guide Routes
```javascript
// Основные endpoints
router.get('/', authenticateToken, async (req, res) => { ... });
router.post('/', authenticateToken, async (req, res) => { ... });
router.put('/:id', authenticateToken, async (req, res) => { ... });
router.delete('/:id', authenticateToken, async (req, res) => { ... });

// Специальные endpoints
router.get('/:id/export', authenticateToken, async (req, res) => { ... });
router.get('/logs/:userId', authenticateToken, async (req, res) => { ... });
router.get('/stats', authenticateToken, async (req, res) => { ... });
```

### База данных (Redis)

#### Структура данных
```redis
# Основные данные пользователя
starter-guide:{userId} -> { id, sector, hasInformationSystems, ... }

# Детали по ID
starter-guide:details:{id} -> { полные данные }

# Список всех анкет
starter-guide:all -> [id1, id2, ...]

# Логи изменений
starter-guide:logs:{userId} -> [log1, log2, ...]
```

## 🚀 Использование

### 1. Starter Guide
```bash
# Переход в раздел
Navigate to /starter-guide

# Заполнение анкеты
1. Выберите сектор организации
2. Ответьте на вопросы о системах
3. Укажите стандарты соответствия
4. Заполните контактную информацию
5. Примите Privacy Policy
6. Нажмите "Check My Systems"

# Просмотр результатов
После отправки отображается сводка с возможностью:
- Экспорта в PDF/Excel
- Редактирования информации
- Заполнения новой анкеты
```

### 2. Suppliers
```bash
# Переход в раздел
Navigate to /suppliers

# Добавление поставщика
1. Нажмите "Add Supplier"
2. Заполните форму
3. Укажите стандарты соответствия
4. Нажмите "Add Supplier"

# Фильтрация
1. Выберите Access Level
2. Укажите Supplier Type
3. Выберите Standards
4. Установите Compliance Level
5. Используйте поиск для быстрого нахождения

# Управление
- Просмотр: Eye icon
- Редактирование: Edit icon
- Удаление: Trash icon
```

### 3. Reports
```bash
# Переход в раздел
Navigate to /reports

# Создание отчета
1. Нажмите "Add Report"
2. Заполните форму
3. Укажите тип и владельца
4. Установите уровень риска
5. Нажмите "Add Report"

# Фильтрация и поиск
1. Выберите Report Type
2. Установите Date Range
3. Выберите Department
4. Укажите Risk Level
5. Используйте поиск

# Экспорт
- PDF: Export PDF button
- Excel: Export Excel button
```

## 🔒 Безопасность

### Аутентификация
- Все endpoints требуют JWT токен
- Проверка принадлежности данных пользователю
- Административные функции только для admin роли

### Валидация данных
- Проверка обязательных полей
- Валидация email формата
- Проверка типов данных

### Логирование
- Все изменения логируются
- Аудит действий пользователей
- История изменений для compliance

## 📱 Адаптивность

### Responsive Design
- Mobile-first подход
- Адаптивные таблицы
- Touch-friendly интерфейс

### Производительность
- Ленивая загрузка данных
- Оптимизированные запросы
- Кэширование в Redis

## 🧪 Тестирование

### Frontend тесты
```bash
# Запуск тестов
npm test

# Тестирование компонентов
npm run test:components

# E2E тесты
npm run test:e2e
```

### Backend тесты
```bash
# Тестирование API
cd backend && npm test

# Тестирование маршрутов
npm run test:routes

# Тестирование middleware
npm run test:middleware
```

## 🔧 Конфигурация

### Environment Variables
```bash
# Backend
PORT=5000
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6380

# Frontend
VITE_API_URL=http://localhost:5000/api
```

### Redis настройки
```bash
# Установка Redis
sudo apt-get install redis-server

# Запуск
sudo systemctl start redis-server

# Проверка
redis-cli ping
```

## 📚 Дополнительные ресурсы

### Документация
- [Основной README](./README.md)
- [API документация](./API_README.md)
- [Административная панель](./ADMIN_README.md)
- [AI Assistant](./ASSISTANT_README.md)

### Примеры использования
- [Demo скрипты](./scripts/)
- [Тестовые данные](./scripts/init-redis.js)
- [Docker конфигурация](./docker-compose.yml)

## 🏢 Customer Trust - Управление клиентами и партнерами

### Описание
Раздел Customer Trust предназначен для управления клиентами и партнерами организации, отслеживания их соответствия стандартам безопасности и оценки уровня доверия.

### Основные функции

#### 📊 Управление записями
- **Добавление клиентов/партнеров**: Полная информация о контрагентах
- **Категоризация**: Разделение на клиентов и партнеров
- **Сектора деятельности**: Healthcare, Financial services, Oil industry, Construction, Engineering
- **Стандарты соответствия**: NIS2, SOCv2, GDPR, DORA
- **Уровень соответствия**: Процентное соотношение с цветовой индикацией

#### 🔍 Фильтрация и поиск
- **По типу**: Client, Partner, All Customer Trust
- **По сектору**: Все отрасли или конкретная отрасль
- **По стандартам**: Фильтрация по применяемым стандартам
- **По уровню соответствия**: High (>85%), Medium (40-85%), Low (<40%)
- **Поиск**: По названию или ответственному лицу

#### 📈 Аналитика
- **Цветовая индикация**: Зеленый (>85%), желтый (40-85%), красный (<40%)
- **Сортировка**: По любому полю таблицы
- **Экспорт**: Excel и PDF с сохранением фильтров

### API Endpoints

```bash
# Получение всех записей Customer Trust
GET /api/customer-trust

# Создание новой записи
POST /api/customer-trust

# Обновление записи
PUT /api/customer-trust/:id

# Удаление записи
DELETE /api/customer-trust/:id

# Экспорт записи
GET /api/customer-trust/:id/export?format=pdf|excel

# Логи действий
GET /api/customer-trust/logs/:userId

# Статистика (только админы)
GET /api/customer-trust/stats
```

## 🖥️ Assets - Управление активами

### Описание
Раздел Assets обеспечивает комплексное управление IT-активами организации, включая серверы, облачные ресурсы, сетевые устройства, приложения, базы данных и IoT-устройства.

### Основные функции

#### 🏗️ Управление активами
- **Типы активов**: Servers, Cloud Resources, Network Devices, Applications, Databases, IoT
- **Окружения**: Production, Staging, Development, Test
- **Стандарты соответствия**: GDPR, NIS2, ISO 27001, SOC2, PCI DSS
- **Уровни риска**: High (красный), Medium (желтый), Low (зеленый), Not Assessed (серый)
- **Ответственные**: Назначение владельцев активов

#### 🔍 Фильтрация и поиск
- **По типу актива**: Все типы или конкретный тип
- **По окружению**: Фильтрация по среде развертывания
- **По стандартам**: Соответствие конкретным стандартам
- **По уровню риска**: Приоритизация по критичности
- **По владельцу**: Фильтрация по ответственному лицу
- **Поиск**: По названию или IP/URL

#### 🛡️ Сканирование и оценка
- **Автоматическое сканирование**: Симуляция проверки уязвимостей
- **Оценка соответствия**: Обновление процента соответствия
- **История сканирований**: Отслеживание всех проверок
- **Уведомления**: О необходимости повторного сканирования

#### 📊 Аналитика
- **Цветовая индикация**: Визуальное отображение статуса
- **Сортировка**: По любому полю таблицы
- **Экспорт**: Excel и PDF с сохранением фильтров
- **Статистика**: Общая информация по активам

### API Endpoints

```bash
# Получение всех активов
GET /api/assets

# Создание нового актива
POST /api/assets

# Обновление актива
PUT /api/assets/:id

# Удаление актива
DELETE /api/assets/:id

# Сканирование актива
POST /api/assets/:id/scan

# Экспорт актива
GET /api/assets/:id/export?format=pdf|excel

# История сканирований
GET /api/assets/:id/scans

# Логи действий
GET /api/assets/logs/:userId

# Статистика (только админы)
GET /api/assets/stats
```

## 📋 Compliance - Управление соответствием

### Описание
Раздел Compliance обеспечивает управление соответствием организации различным стандартам и регулятивным требованиям, включая GDPR, NIS2, ISO 27001, SOC2, PCI DSS и DORA.

### Основные функции

#### 📊 Управление записями соответствия
- **Стандарты**: GDPR, NIS2, ISO 27001, SOC2, PCI DSS, DORA
- **Статусы**: Compliant (зеленый), Partial (желтый), Non-Compliant (красный), Not Assessed (серый)
- **Подразделения**: IT Department, Security Team, Operations, Finance, Risk Management
- **Процент соответствия**: Точная оценка уровня соответствия
- **Даты оценок**: Последняя и следующая запланированная оценка

#### 🔍 Фильтрация и поиск
- **По стандарту**: Фильтрация по конкретному стандарту
- **По статусу**: Соответствие, частичное, несоответствие, не оценено
- **По подразделению**: Фильтрация по ответственному отделу
- **По дате**: Диапазон дат последней оценки
- **Поиск**: По стандарту, подразделению или статусу

#### 📈 Сводка и аналитика
- **Количество проверенных систем**: Общее количество активов
- **Количество инцидентов**: Несоответствующие записи
- **Средний процент соответствия**: Общая оценка
- **Распределение по уровням риска**: High/Medium/Low/Not Assessed
- **Графики и диаграммы**: Визуализация данных

#### 🎯 Оценка и аудит
- **Проведение оценок**: Симуляция аудита соответствия
- **История оценок**: Отслеживание всех проверок
- **Рекомендации**: Предложения по улучшению
- **Планирование**: Запланированные аудиты

#### 📊 Экспорт и отчетность
- **PDF экспорт**: Структурированные отчеты
- **Excel экспорт**: Данные для анализа
- **Сохранение фильтров**: Экспорт с учетом текущих настроек

### API Endpoints

```bash
# Получение всех записей соответствия
GET /api/compliance

# Создание новой записи
POST /api/compliance

# Обновление записи
PUT /api/compliance/:id

# Удаление записи
DELETE /api/compliance/:id

# Экспорт записи
GET /api/compliance/:id/export?format=pdf|excel

# Сводка по соответствию
GET /api/compliance/summary

# Проведение оценки
POST /api/compliance/:id/assess

# История оценок
GET /api/compliance/:id/assessments

# Логи действий
GET /api/compliance/logs/:userId

# Статистика (только админы)
GET /api/compliance/stats
```

## 🛠️ Техническая реализация

### Frontend компоненты

#### Customer Trust
```typescript
interface CustomerTrust {
  id: string
  name: string
  category: 'Client' | 'Partner'
  sector: string
  assignedStandards: string[]
  compliancePercentage: number
  lastAssessment: string
  responsiblePerson: string
  email: string
  website: string
}
```

#### Assets
```typescript
interface Asset {
  id: string
  name: string
  type: string
  environment: string
  assignedStandards: string[]
  compliancePercentage: number
  riskLevel: 'High' | 'Medium' | 'Low' | 'Not Assessed'
  lastAssessment: string
  owner: string
  description: string
  ipUrl: string
}
```

#### Compliance
```typescript
interface ComplianceRecord {
  id: string
  standard: string
  department: string
  status: 'Compliant' | 'Partial' | 'Non-Compliant' | 'Not Assessed'
  compliancePercentage: number
  lastAssessmentDate: string
  nextScheduledAssessment: string
  recommendations: string
}
```

### Backend API

#### Customer Trust Routes
- Полный CRUD для записей Customer Trust
- Валидация email и обязательных полей
- Логирование всех действий
- Экспорт в PDF/Excel форматах
- Статистика для администраторов

#### Assets Routes
- Управление активами с поддержкой сканирования
- Симуляция проверки уязвимостей
- История сканирований
- Назначение ответственных
- Отслеживание уровней риска

#### Compliance Routes
- Управление записями соответствия
- Проведение оценок соответствия
- История аудитов
- Сводная аналитика
- Планирование следующих проверок

### База данных (Redis)

#### Структура данных
```bash
# Customer Trust
customer-trust:{userId} -> Hash с записями
customer-trust:logs:{userId} -> List с логами действий

# Assets
assets:{userId} -> Hash с активами
assets:logs:{userId} -> List с логами действий
assets:scans:{userId}:{assetId} -> List с результатами сканирований

# Compliance
compliance:{userId} -> Hash с записями соответствия
compliance:logs:{userId} -> List с логами действий
compliance:assessments:{userId}:{recordId} -> List с результатами оценок
```

## 🚀 Использование

### Customer Trust
1. Перейдите в раздел "Customer Trust"
2. Используйте фильтры для поиска нужных записей
3. Добавьте нового клиента/партнера через кнопку "Add Customer Trust"
4. Просматривайте и редактируйте существующие записи
5. Экспортируйте данные в нужном формате

### Assets
1. Откройте раздел "Assets"
2. Примените фильтры по типу, окружению, стандартам
3. Добавьте новый актив через "Add Asset"
4. Запустите сканирование актива для обновления статуса
5. Отслеживайте историю сканирований и изменений

### Compliance
1. Перейдите в раздел "Compliance"
2. Просмотрите сводку по соответствию
3. Используйте фильтры для анализа конкретных стандартов
4. Добавьте новую запись соответствия
5. Проведите оценку соответствия для обновления статуса

## 🔒 Безопасность

### Аутентификация
- Все API endpoints требуют JWT токен
- Проверка прав доступа для каждой операции
- Логирование всех действий пользователей

### Валидация данных
- Проверка обязательных полей
- Валидация email адресов
- Санитизация входных данных
- Ограничения на размер данных

### Права доступа
- Пользователи видят только свои данные
- Администраторы имеют доступ к статистике
- Логи доступны только владельцу или админу

## 📱 Адаптивность

### Responsive Design
- Мобильная версия для всех разделов
- Адаптивные таблицы с горизонтальной прокруткой
- Оптимизированные модальные окна
- Touch-friendly интерфейс

### Производительность
- Ленивая загрузка данных
- Кэширование результатов фильтрации
- Оптимизированные запросы к API
- Минимальное количество перерендеров

## 🧪 Тестирование

### Функциональное тестирование
- Тестирование всех CRUD операций
- Проверка валидации данных
- Тестирование фильтрации и поиска
- Проверка экспорта данных

### Интеграционное тестирование
- Тестирование API endpoints
- Проверка работы с Redis
- Тестирование аутентификации
- Проверка прав доступа

## 🔧 Конфигурация

### Переменные окружения
```bash
# API настройки
VITE_API_URL=http://localhost:5000/api

# Redis настройки
REDIS_URL=redis://localhost:6380

# JWT настройки
JWT_SECRET=your-secret-key
```

### Настройка Redis
```bash
# Установка Redis
sudo apt-get install redis-server

# Запуск
sudo systemctl start redis-server

# Проверка
redis-cli ping
```

---

**Версия**: 1.0.0  
**Последнее обновление**: Сентябрь 2025  
**Автор**: DefendSphere Team "DefendSphere — Secure Smarter, Comply Faster"