#!/bin/bash

BASE_URL="http://217.65.144.232:5000"

echo "=== ПРОВЕРКА ПОЛЬЗОВАТЕЛЕЙ И ОРГАНИЗАЦИЙ ==="
echo ""

# Список пользователей для проверки
USERS=("user1:user1" "user2:user2" "user3:user3" "jon:jon123")

for user_pass in "${USERS[@]}"; do
    IFS=':' read -r username password <<< "$user_pass"
    
    echo "🔍 Проверка пользователя: $username"
    echo "----------------------------------------"
    
    # Логин
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
        -H "Content-Type: application/json" \
        -d "{\"username\": \"$username\", \"password\": \"$password\"}")
    
    # Извлечение токена
    TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))" 2>/dev/null)
    
    if [ -z "$TOKEN" ]; then
        echo "❌ Ошибка логина для $username"
        echo "$LOGIN_RESPONSE"
        echo ""
        continue
    fi
    
    # Информация о пользователе
    USER_INFO=$(echo "$LOGIN_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    user = data.get('user', {})
    print(f\"Email: {user.get('email', 'N/A')}\")
    print(f\"Full Name: {user.get('fullName', 'N/A')}\")
    print(f\"Role: {user.get('role', 'N/A')}\")
    print(f\"Organization: {user.get('organization', 'N/A')}\")
    print(f\"Organizations: {user.get('organizations', [])}\")
    print(f\"Has Organizations: {bool(user.get('organizations', []))}\")
except:
    print('Error parsing user data')
")
    
    echo "$USER_INFO"
    
    # Проверка активов
    ASSETS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/assets")
    ASSETS_COUNT=$(echo "$ASSETS_RESPONSE" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('success') and 'data' in data:
        assets = data['data']
        print(f\"Assets Count: {len(assets) if isinstance(assets, list) else 0}\")
        if isinstance(assets, list) and len(assets) > 0:
            print(f\"First Asset: {assets[0].get('name', 'N/A') if assets else 'N/A'}\")
    else:
        print(f\"Assets Error: {data.get('message', 'Unknown error')}\")
except:
    print('Error parsing assets data')
")
    
    echo "$ASSETS_COUNT"
    echo ""
done

echo "=== ПРОВЕРКА ЗАВЕРШЕНА ==="