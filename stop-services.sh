#!/bin/bash

echo "🛑 Stopping DefendSphere Services..."

# Stop frontend
echo "🎨 Stopping frontend..."
pkill -f vite 2>/dev/null || true

# Stop backend
echo "🔧 Stopping backend..."
pkill -f "node.*index" 2>/dev/null || true

# Wait for processes to stop
sleep 2

echo "✅ All services stopped"