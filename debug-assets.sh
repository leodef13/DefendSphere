#!/bin/bash

BASE_URL="http://217.65.144.232:5000"

echo "=== ОТЛАДКА АКТИВОВ ==="
echo ""

# Тестируем jon пользователя
echo "🔍 Отладка для jon пользователя..."
LOGIN_RESPONSE_JON=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "jon", "password": "jon123"}')

echo "Jon Login Response:"
echo "$LOGIN_RESPONSE_JON" | python3 -m json.tool

JON_TOKEN=$(echo "$LOGIN_RESPONSE_JON" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))")

if [ -n "$JON_TOKEN" ]; then
    echo ""
    echo "🔍 Запрос /api/auth/me для jon..."
    ME_RESPONSE=$(curl -s -H "Authorization: Bearer $JON_TOKEN" "$BASE_URL/api/auth/me")
    echo "ME Response:"
    echo "$ME_RESPONSE" | python3 -m json.tool
    
    # Извлекаем организации
    ORGS=$(echo "$ME_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    user = data.get('user', {})
    orgs = user.get('organizations', [])
    print(' '.join(orgs) if orgs else '[]')
except:
    print('[]')
")
    
    echo ""
    echo "Organizations for jon: $ORGS"
    
    echo ""
    echo "🔍 Запрос активов для jon..."
    ASSETS_RESPONSE=$(curl -s -H "Authorization: Bearer $JON_TOKEN" "$BASE_URL/api/assets")
    echo "Assets Response:"
    echo "$ASSETS_RESPONSE" | python3 -m json.tool
fi

echo ""
echo "----------------------------------------"

# Тестируем admin пользователя
echo "🔍 Отладка для admin пользователя..."
LOGIN_RESPONSE_ADMIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "admin"}')

echo "Admin Login Response:"
echo "$LOGIN_RESPONSE_ADMIN" | python3 -m json.tool

ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE_ADMIN" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))")

if [ -n "$ADMIN_TOKEN" ]; then
    echo ""
    echo "🔍 Запрос /api/auth/me для admin..."
    ME_RESPONSE=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/api/auth/me")
    echo "ME Response:"
    echo "$ME_RESPONSE" | python3 -m json.tool
    
    # Извлекаем организации
    ORGS=$(echo "$ME_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    user = data.get('user', {})
    orgs = user.get('organizations', [])
    print(' '.join(orgs) if orgs else '[]')
except:
    print('[]')
")
    
    echo ""
    echo "Organizations for admin: $ORGS"
    
    echo ""
    echo "🔍 Запрос активов для admin..."
    ASSETS_RESPONSE=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/api/assets")
    echo "Assets Response:"
    echo "$ASSETS_RESPONSE" | python3 -m json.tool
fi

echo ""
echo "=== ОТЛАДКА ЗАВЕРШЕНА ==="