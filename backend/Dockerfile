FROM node:18-alpine

# Установка рабочей директории
WORKDIR /app

# System deps for Prisma (OpenSSL)
RUN apk add --no-cache openssl1.1-compat openssl

# Копирование package.json и package-lock.json
COPY package*.json ./

# Установка зависимостей (включая dev для генерации Prisma Client)
RUN npm ci

# Копирование исходного кода
COPY . .

# Генерация Prisma Client
RUN npx prisma generate

# Создание непривилегированного пользователя
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Изменение владельца файлов
RUN chown -R nodejs:nodejs /app
USER nodejs

# Открытие порта
EXPOSE 5000

# Проверка здоровья
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Запуск приложения
CMD ["npm", "start"]
