#!/bin/bash

BASE_URL="http://217.65.144.232:5000"

echo "=== ТЕСТИРОВАНИЕ АКТИВОВ ==="
echo ""

# Тестируем jon пользователя
echo "🔍 Тестирование активов для jon..."
LOGIN_RESPONSE_JON=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "jon", "password": "jon123"}')

JON_TOKEN=$(echo "$LOGIN_RESPONSE_JON" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))")

if [ -n "$JON_TOKEN" ]; then
    echo "🔍 Запрос активов для jon..."
    ASSETS_RESPONSE=$(curl -s -H "Authorization: Bearer $JON_TOKEN" "$BASE_URL/api/assets")
    echo "Assets Response:"
    echo "$ASSETS_RESPONSE" | python3 -m json.tool
    
    # Проверяем количество активов
    ASSETS_COUNT=$(echo "$ASSETS_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('success') and 'data' in data:
        assets = data['data']
        print(f'Количество активов: {len(assets) if isinstance(assets, list) else 0}')
        if isinstance(assets, list) and len(assets) > 0:
            for i, asset in enumerate(assets[:3]):  # Показываем первые 3
                print(f'Asset {i+1}: {asset.get(\"name\", \"N/A\")} - {asset.get(\"organization\", \"N/A\")}')
    else:
        print(f'Ошибка: {data.get(\"message\", \"Unknown error\")}')
except Exception as e:
    print(f'Ошибка парсинга: {e}')
")
    
    echo "$ASSETS_COUNT"
fi

echo ""
echo "----------------------------------------"

# Тестируем admin пользователя
echo "🔍 Тестирование активов для admin..."
LOGIN_RESPONSE_ADMIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "admin"}')

ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE_ADMIN" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))")

if [ -n "$ADMIN_TOKEN" ]; then
    echo "🔍 Запрос активов для admin..."
    ASSETS_RESPONSE=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/api/assets")
    echo "Assets Response:"
    echo "$ASSETS_RESPONSE" | python3 -m json.tool
    
    # Проверяем количество активов
    ASSETS_COUNT=$(echo "$ASSETS_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('success') and 'data' in data:
        assets = data['data']
        print(f'Количество активов: {len(assets) if isinstance(assets, list) else 0}')
        if isinstance(assets, list) and len(assets) > 0:
            for i, asset in enumerate(assets[:3]):  # Показываем первые 3
                print(f'Asset {i+1}: {asset.get(\"name\", \"N/A\")} - {asset.get(\"organization\", \"N/A\")}')
    else:
        print(f'Ошибка: {data.get(\"message\", \"Unknown error\")}')
except Exception as e:
    print(f'Ошибка парсинга: {e}')
")
    
    echo "$ASSETS_COUNT"
fi

echo ""
echo "=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ==="