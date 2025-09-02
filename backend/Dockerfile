FROM node:20-alpine
WORKDIR /app
# Установим prod-зависимости (если есть lock — используем ci)
COPY package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Копируем исходники
COPY . .

ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]
