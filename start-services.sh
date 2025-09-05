#!/bin/bash

echo "🚀 Starting DefendSphere Services..."

# Kill any existing processes
echo "🛑 Stopping existing processes..."
pkill -f vite 2>/dev/null || true
pkill -f "node.*index" 2>/dev/null || true

# Wait a moment for processes to stop
sleep 2

# Start backend
echo "🔧 Starting backend on port 5000..."
cd backend
node index-mock.js &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend started successfully"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start frontend
echo "🎨 Starting frontend on port 5173..."
cd frontend
npx vite --port 5173 --host 0.0.0.0 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
sleep 5

# Check if frontend is running
if curl -s http://localhost:5173/ > /dev/null; then
    echo "✅ Frontend started successfully"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

echo ""
echo "🎉 DefendSphere is ready!"
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend: http://localhost:5000"
echo "🧪 Test page: http://localhost:5173/test-login.html"
echo ""
echo "👤 Default users:"
echo "   admin/admin - Administrator"
echo "   user1/user1 - Regular user"
echo "   user2/user2 - Regular user"
echo ""
echo "🛑 To stop services, run: pkill -f vite && pkill -f 'node.*index'"
echo ""

# Keep script running
wait