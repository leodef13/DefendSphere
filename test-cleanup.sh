#!/bin/bash

BASE_URL="http://217.65.144.232:5000"

echo "=== ТЕСТИРОВАНИЕ ОЧИСТКИ ДАННЫХ ==="
echo ""

# Тестируем admin пользователя
echo "🔍 Тестирование admin пользователя..."
LOGIN_RESPONSE_ADMIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "admin"}')

echo "Admin Login Response:"
echo "$LOGIN_RESPONSE_ADMIN" | python3 -m json.tool

ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE_ADMIN" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))")

if [ -n "$ADMIN_TOKEN" ]; then
    echo "✅ Admin логин успешен"
    
    echo ""
    echo "🔍 Тестирование /api/auth/me для admin..."
    curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/api/auth/me" | python3 -m json.tool
    
    echo ""
    echo "🔍 Тестирование /api/assets для admin..."
    curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/api/assets" | python3 -m json.tool
else
    echo "❌ Admin логин не удался"
fi

echo ""
echo "----------------------------------------"

# Тестируем jon пользователя
echo "🔍 Тестирование jon пользователя..."
LOGIN_RESPONSE_JON=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "jon", "password": "jon123"}')

echo "Jon Login Response:"
echo "$LOGIN_RESPONSE_JON" | python3 -m json.tool

JON_TOKEN=$(echo "$LOGIN_RESPONSE_JON" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))")

if [ -n "$JON_TOKEN" ]; then
    echo "✅ Jon логин успешен"
    
    echo ""
    echo "🔍 Тестирование /api/auth/me для jon..."
    curl -s -H "Authorization: Bearer $JON_TOKEN" "$BASE_URL/api/auth/me" | python3 -m json.tool
    
    echo ""
    echo "🔍 Тестирование /api/assets для jon..."
    curl -s -H "Authorization: Bearer $JON_TOKEN" "$BASE_URL/api/assets" | python3 -m json.tool
else
    echo "❌ Jon логин не удался"
fi

echo ""
echo "----------------------------------------"

# Тестируем удаленных пользователей
echo "🔍 Тестирование удаленных пользователей..."

USERS_TO_TEST=("user1:user1" "user2:user2" "user3:user3")

for user_pass in "${USERS_TO_TEST[@]}"; do
    IFS=':' read -r username password <<< "$user_pass"
    
    echo "Тестирование $username..."
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\": \"$username\", \"password\": \"$password\"}")
    
    if echo "$LOGIN_RESPONSE" | grep -q "Invalid credentials"; then
        echo "✅ $username успешно удален (Invalid credentials)"
    else
        echo "❌ $username все еще доступен!"
        echo "$LOGIN_RESPONSE" | python3 -m json.tool
    fi
done

echo ""
echo "=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ==="