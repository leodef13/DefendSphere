#!/bin/bash

BASE_URL="http://217.65.144.232:5000"

echo "=== ОТЛАДКА ПРОБЛЕМЫ С ТОКЕНАМИ ==="
echo ""

# Тестируем user1
echo "🔍 Тестирование user1..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "user1", "password": "user1"}')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | python3 -m json.tool

TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))")

if [ -n "$TOKEN" ]; then
    echo ""
    echo "Token: ${TOKEN:0:50}..."
    
    echo ""
    echo "🔍 Тестирование /api/auth/me..."
    ME_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/auth/me")
    echo "ME Response:"
    echo "$ME_RESPONSE" | python3 -m json.tool
    
    echo ""
    echo "🔍 Тестирование /api/assets..."
    ASSETS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/assets")
    echo "Assets Response:"
    echo "$ASSETS_RESPONSE" | python3 -m json.tool
    
    echo ""
    echo "🔍 Тестирование /api/reports/summary..."
    REPORTS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/reports/summary")
    echo "Reports Response:"
    echo "$REPORTS_RESPONSE" | python3 -m json.tool
fi

echo ""
echo "=== ОТЛАДКА ЗАВЕРШЕНА ==="