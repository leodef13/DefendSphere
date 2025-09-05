# DefendSphere Troubleshooting Guide

## Login Issues

### Problem: "Connection error. Please try again."

### ✅ **Backend Status Check**
```bash
# Check if backend is running
ps aux | grep "node.*index" | grep -v grep

# Test backend health
curl -Is http://localhost:5000/api/health

# Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

### ✅ **Frontend Status Check**
```bash
# Check if frontend is running
ps aux | grep vite | grep -v grep

# Test frontend accessibility
curl -Is http://localhost:5173/
```

### ✅ **Quick Test Page**
Visit: http://localhost:5173/test-login.html

This page will test:
- Backend connectivity
- Login functionality
- All user accounts (admin, user1, user2)

### ✅ **Default Users**
- **admin/admin** - Administrator access
- **user1/user1** - Regular user access  
- **user2/user2** - Regular user access

### ✅ **Ports**
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173
- **Test Page**: http://localhost:5173/test-login.html

### ✅ **CORS Configuration**
Backend is configured to accept requests from: `http://localhost:5173`

### ✅ **Troubleshooting Steps**

1. **Clear Browser Cache**
   - Press Ctrl+F5 (Windows/Linux) or Cmd+Shift+R (Mac)
   - Or open Developer Tools → Network → Disable cache

2. **Check Console Errors**
   - Open Developer Tools (F12)
   - Check Console tab for JavaScript errors
   - Check Network tab for failed requests

3. **Test Backend Directly**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","password":"admin"}'
   ```

4. **Restart Services**
   ```bash
   # Stop all processes
   pkill -f vite
   pkill -f "node.*index"
   
   # Start backend
   cd backend && node index-mock.js &
   
   # Start frontend  
   cd frontend && npm run dev &
   ```

### ✅ **Common Solutions**

1. **If backend returns "Route not found"**
   - Use correct endpoint: `/api/auth/login` (not `/api/login`)

2. **If CORS errors**
   - Check `.env` file: `CORS_ORIGIN=http://localhost:5173`

3. **If "Connection error"**
   - Check if backend is running on port 5000
   - Check if frontend is running on port 5173
   - Use test page to verify connectivity

4. **If login fails**
   - Use exact credentials: admin/admin, user1/user1, user2/user2
   - Check browser console for detailed error messages

### ✅ **Service Status**
- ✅ Backend: Running on port 5000 with mock Redis
- ✅ Frontend: Running on port 5173 with Vite
- ✅ All users: Initialized and working
- ✅ CORS: Properly configured
- ✅ API endpoints: All functional

### ✅ **Next Steps**
If issues persist:
1. Use the test page: http://localhost:5173/test-login.html
2. Check browser console for errors
3. Verify both services are running
4. Try different browser or incognito mode