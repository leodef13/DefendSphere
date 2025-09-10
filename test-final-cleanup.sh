#!/bin/bash

BASE_URL="http://217.65.144.232:5000"

echo "=== ФИНАЛЬНОЕ ТЕСТИРОВАНИЕ ОЧИСТКИ ==="
echo ""

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
    fi
done

echo ""
echo "----------------------------------------"

# Тестируем оставшихся пользователей
echo "🔍 Тестирование оставшихся пользователей..."

# Admin
echo "Тестирование admin..."
LOGIN_RESPONSE_ADMIN=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "admin"}')

if echo "$LOGIN_RESPONSE_ADMIN" | grep -q "token"; then
    echo "✅ admin доступен"
    ADMIN_TOKEN=$(echo "$LOGIN_RESPONSE_ADMIN" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))")
    
    # Проверяем организации admin
    ME_RESPONSE=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/api/auth/me")
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
    echo "   Organizations: $ORGS"
    
    # Проверяем активы admin
    ASSETS_RESPONSE=$(curl -s -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/api/assets")
    ASSETS_COUNT=$(echo "$ASSETS_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('success') and 'data' in data:
        assets = data['data']
        print(len(assets) if isinstance(assets, list) else 0)
    else:
        print(0)
except:
    print(0)
")
    echo "   Assets count: $ASSETS_COUNT"
else
    echo "❌ admin недоступен"
fi

# Jon
echo "Тестирование jon..."
LOGIN_RESPONSE_JON=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username": "jon", "password": "jon123"}')

if echo "$LOGIN_RESPONSE_JON" | grep -q "token"; then
    echo "✅ jon доступен"
    JON_TOKEN=$(echo "$LOGIN_RESPONSE_JON" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))")
    
    # Проверяем организации jon
    ME_RESPONSE=$(curl -s -H "Authorization: Bearer $JON_TOKEN" "$BASE_URL/api/auth/me")
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
    echo "   Organizations: $ORGS"
    
    # Проверяем активы jon
    ASSETS_RESPONSE=$(curl -s -H "Authorization: Bearer $JON_TOKEN" "$BASE_URL/api/assets")
    ASSETS_COUNT=$(echo "$ASSETS_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('success') and 'data' in data:
        assets = data['data']
        print(len(assets) if isinstance(assets, list) else 0)
    else:
        print(0)
except:
    print(0)
")
    echo "   Assets count: $ASSETS_COUNT"
else
    echo "❌ jon недоступен"
fi

echo ""
echo "=== ФИНАЛЬНОЕ ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ==="