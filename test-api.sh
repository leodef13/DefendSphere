#!/bin/bash

# API Testing Script for DefendSphere
# Usage: ./test-api.sh

BASE_URL="http://217.65.144.232:5000"

echo "=== DefendSphere API Testing ==="
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -s "$BASE_URL/api/health" | python3 -m json.tool
echo ""

# Test 2: Login with user1
echo "2. Testing Login with user1..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "user1", "password": "user1"}')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | python3 -m json.tool

# Extract token from response
TOKEN=$(echo "$LOGIN_RESPONSE" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))")

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed - no token received"
  exit 1
fi

echo ""
echo "✅ Login successful! Token: ${TOKEN:0:20}..."
echo ""

# Test 3: Get current user info
echo "3. Testing Get Current User..."
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/auth/me" | python3 -m json.tool
echo ""

# Test 4: Get user assets
echo "4. Testing Get User Assets..."
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/assets" | python3 -m json.tool
echo ""

# Test 5: Get reports summary
echo "5. Testing Get Reports Summary..."
curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/reports/summary" | python3 -m json.tool
echo ""

# Test 6: Login with user3
echo "6. Testing Login with user3..."
LOGIN_RESPONSE_USER3=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "user3", "password": "user3"}')

echo "User3 Login Response:"
echo "$LOGIN_RESPONSE_USER3" | python3 -m json.tool

# Extract token for user3
TOKEN_USER3=$(echo "$LOGIN_RESPONSE_USER3" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))")

if [ -n "$TOKEN_USER3" ]; then
  echo ""
  echo "7. Testing Get User3 Assets..."
  curl -s -H "Authorization: Bearer $TOKEN_USER3" "$BASE_URL/api/assets" | python3 -m json.tool
  echo ""
fi

# Test 8: Login with jon
echo "8. Testing Login with jon..."
LOGIN_RESPONSE_JON=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username": "jon", "password": "jon123"}')

echo "Jon Login Response:"
echo "$LOGIN_RESPONSE_JON" | python3 -m json.tool

# Extract token for jon
TOKEN_JON=$(echo "$LOGIN_RESPONSE_JON" | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('token', ''))")

if [ -n "$TOKEN_JON" ]; then
  echo ""
  echo "9. Testing Get Jon Assets..."
  curl -s -H "Authorization: Bearer $TOKEN_JON" "$BASE_URL/api/assets" | python3 -m json.tool
  echo ""
fi

echo "=== API Testing Complete ==="