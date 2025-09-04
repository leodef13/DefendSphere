#!/bin/bash

echo "🔍 DefendSphere Access Test"
echo "=========================="

# Get all IP addresses
IPS=$(hostname -I)
echo "📡 Server IPs: $IPS"
echo ""

# Test localhost
echo "🌐 Testing localhost..."
if curl -s --connect-timeout 5 http://localhost:2525 > /dev/null; then
    echo "✅ localhost:2525 - OK"
else
    echo "❌ localhost:2525 - FAILED"
fi

# Test each IP
echo ""
echo "🌐 Testing internal IPs..."
for ip in $IPS; do
    if curl -s --connect-timeout 5 http://$ip:2525 > /dev/null; then
        echo "✅ $ip:2525 - OK"
    else
        echo "❌ $ip:2525 - FAILED"
    fi
done

# Test backend
echo ""
echo "🔧 Testing backend..."
if curl -s --connect-timeout 5 http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend (localhost:5000) - OK"
else
    echo "❌ Backend (localhost:5000) - FAILED"
fi

echo ""
echo "📋 Working URLs:"
echo "   Frontend: http://localhost:2525"
for ip in $IPS; do
    if curl -s --connect-timeout 5 http://$ip:2525 > /dev/null; then
        echo "   Frontend: http://$ip:2525"
    fi
done
echo "   Backend:  http://localhost:5000"
echo "   Test:     http://localhost:2525/test-login.html"