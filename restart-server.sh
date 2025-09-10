#!/bin/bash

echo "=== ПЕРЕЗАПУСК СЕРВЕРА DEFENDSPHERE ==="
echo ""

# Проверяем, запущен ли сервер
echo "🔍 Проверка статуса сервера..."
if curl -s http://217.65.144.232:5000/api/health > /dev/null; then
    echo "✅ Сервер запущен и отвечает"
else
    echo "❌ Сервер не отвечает"
    exit 1
fi

echo ""
echo "🔄 Попытка перезапуска сервера..."

# Попробуем разные способы перезапуска
echo "1. Попытка через PM2..."
if command -v pm2 > /dev/null; then
    echo "   PM2 найден, перезапускаем..."
    pm2 restart defendsphere-backend 2>/dev/null || echo "   PM2 restart не удался"
    sleep 5
else
    echo "   PM2 не найден"
fi

echo "2. Попытка через systemctl..."
if command -v systemctl > /dev/null; then
    echo "   systemctl найден, перезапускаем..."
    sudo systemctl restart defendsphere 2>/dev/null || echo "   systemctl restart не удался"
    sleep 5
else
    echo "   systemctl не найден"
fi

echo "3. Попытка через Docker..."
if command -v docker > /dev/null; then
    echo "   Docker найден, перезапускаем контейнер..."
    docker restart defendsphere-backend 2>/dev/null || echo "   Docker restart не удался"
    sleep 5
else
    echo "   Docker не найден"
fi

echo ""
echo "⏳ Ожидание запуска сервера (30 секунд)..."
sleep 30

echo ""
echo "🔍 Проверка статуса после перезапуска..."
if curl -s http://217.65.144.232:5000/api/health > /dev/null; then
    echo "✅ Сервер успешно перезапущен и отвечает"
else
    echo "❌ Сервер не отвечает после перезапуска"
    echo "   Возможно, требуется ручной перезапуск"
fi

echo ""
echo "=== ПЕРЕЗАПУСК ЗАВЕРШЕН ==="