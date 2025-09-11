# Defend: статус выполнения плана

- Ветка `Defend` от `main`: Done

## Инфраструктура (Docker)
- PostgreSQL (16-alpine, порт 5432, volume `pg_data`): Done
- MinIO (9000/9001, volume `minio_data`, `server /data --console-address :9001`): Done
- Сеть: backend → `postgres:5432`, `redis:6379` (внешний порт 6380 проброшен): Done

## Бэкенд — БД слой
- ORM Prisma подключён, `schema.prisma` добавлен: Done
- Схемы: `organizations`, `users`, `assets`, `suppliers`, `reports_files`, `reports`, `report_assets`, `report_vulnerabilities`: Done
- Схема Customer Trust: Todo
- Миграции и сиды (Watson Morris, Company LLD; admin, jon, user1; роли/права; базовые активы): Todo

## Файлы/отчёты
- Зависимости: `multer`, `@aws-sdk/client-s3`, `bullmq`: Done
- Загрузка (multer), валидация типов и лимиты: Todo
- Хранение в MinIO (инициализация бакета, загрузка): Todo
- Парсинг Excel (`xlsx`) / PDF (`pdf-parse`): Todo
- Очередь BullMQ (асинхронная обработка, статусы): Todo
- Запись результатов в БД: Todo

## API
- POST `/api/reports/upload`: Todo
- POST `/api/reports/:report_file_id/parse`: Todo
- GET `/api/reports/:id`: Todo
- GET `/api/assets` (из PostgreSQL, кэш в Redis): Todo
- GET `/api/reports/export/pdf|excel`: Todo

## Безопасность/операционка
- `helmet`, `express-rate-limit` — зависимости добавлены: Partial (не включены в код)
- JWT refresh + blacklist в Redis, TTL, ротация: Todo

## Кэш/аналитика (Redis)
- Быстрые графики, ключи `org:{id}:stats:*`, TTL‑кэш `reports:summary:{orgId}`, инвалидация: Todo

## Фронтенд
- Разделы присутствуют; ролевой доступ частично: Partial
- Связка с реальными API, экспорт с прогрессом, быстрые виджеты (Redis): Todo
- Стандартизация стилей на Tailwind (опционально): Todo

## Демо/данные
- Миграции/сиды в PostgreSQL (орг/пользователи/активы/отчёты): Todo

## Документация
- Обновлены `README.ru.md`, `INSTALLATION.md`, `docs/API_GUIDE.md`, `docs/USER_GUIDE.md`, `docs/ADMIN_GUIDE.md`: Done