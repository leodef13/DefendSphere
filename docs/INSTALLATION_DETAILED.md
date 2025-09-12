# Подробная установка DefendSphere (ветка Defend)

## Предварительные требования
- Docker / Docker Compose
- Node.js 18+

## Сервисы и порты
- Redis: 6380 (в контейнере и на хосте)
- PostgreSQL: 5432
- MinIO: 9000 (S3), 9001 (консоль)
- Backend API: 5000
- Frontend: 3000

## Шаги установки
1. Клонировать репозиторий и перейти в ветку `Defend`.
2. Заполнить переменные окружения (пример `.env` в `backend/.env`):
```
REDIS_URL=redis://redis:6380
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/defendsphere?schema=public
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=reports
JWT_SECRET=change-me
```
3. Запустить docker-compose:
```
docker compose up -d
```
4. Проверить:
- Backend: `curl http://localhost:5000/api/health` (поле `redis` → `PONG`)
- MinIO Console: `http://localhost:9001` (minioadmin/minioadmin)
- Frontend: `http://localhost:3000`

## Инициализация БД
- Установить зависимости backend и сгенерировать Prisma Client:
```
cd backend
npm i
npx prisma generate
```
- Применить миграции (при запущенном PostgreSQL):
```
npx prisma migrate deploy
```
- Засеять демо-данные:
```
npm run db:seed
```

## Очередь парсинга
- Воркер:
```
npm run worker:parse
```

## Локальный Redis без compose
```
docker run -d -p 6380:6380 redis:alpine redis-server --port 6380
```
И укажите `REDIS_URL=redis://localhost:6380`.

## Загрузка отчётов
- `POST /api/reports/upload` — multipart/form-data: `file`, `organizationId`
- `POST /api/reports/{reportFileId}/parse` — постановка в очередь
- `GET /api/reports/{id}` — метаданные и данные отчёта

## Экспорт
- `GET /api/reports/export/pdf|excel` — заглушки (очередь генерации)

## Обновление токенов
- `POST /api/auth/token/refresh` — получить новую пару токенов
- `POST /api/auth/token/revoke` — добавить refresh‑токен в blacklist