#!/bin/bash

echo "🔍 DefendSphere Access Check"
echo "=========================="

# Get server IPs
echo "📡 Server IPs:"
hostname -I

echo ""
echo "🌐 Testing localhost access..."
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ localhost:5173 - OK"
else
    echo "❌ localhost:5173 - FAILED"
fi

echo ""
echo "🌐 Testing internal IP access..."
for ip in $(hostname -I); do
    if curl -s http://$ip:5173 > /dev/null; then
        echo "✅ $ip:5173 - OK"
    else
        echo "❌ $ip:5173 - FAILED"
    fi
done

echo ""
echo "🔧 Backend check..."
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend (localhost:5000) - OK"
else
    echo "❌ Backend (localhost:5000) - FAILED"
fi

echo ""
echo "📋 Access URLs:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo "   Test:     http://localhost:5173/test-login.html"
echo ""
echo "🌍 For external access, try:"
for ip in $(hostname -I); do
    echo "   http://$ip:5173"
done