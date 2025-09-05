# DefendSphere API Documentation

## 🌐 Overview

The DefendSphere API provides RESTful endpoints for managing cybersecurity data, user authentication, and system administration.

## 🔐 Authentication

### JWT Token Authentication
All API endpoints (except login and health check) require JWT token authentication.

**Header Format:**
```
Authorization: Bearer <jwt_token>
```

### Getting a Token
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "username": "admin",
    "email": "admin@defendsphere.com",
    "role": "admin",
    "permissions": ["all"]
  }
}
```

## 📊 API Endpoints

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
```
**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

#### Register
```http
POST /api/auth/register
```
**Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Health Check
```http
GET /api/health
```
**Response:**
```json
{
  "ok": true,
  "redis": "PONG"
}
```

### Admin Endpoints

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <admin_token>
```

#### Create User
```http
POST /api/admin/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "role": "user",
  "permissions": ["access.dashboard", "access.reports"]
}
```

#### Update User
```http
PUT /api/admin/users/:username
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "role": "user",
  "permissions": ["access.dashboard", "access.assets"]
}
```

#### Delete User
```http
DELETE /api/admin/users/:username
Authorization: Bearer <admin_token>
```

### Dashboard Endpoints

#### Get Dashboard Data
```http
GET /api/dashboard
Authorization: Bearer <token>
```

### Assets Endpoints

#### Get Assets
```http
GET /api/assets
Authorization: Bearer <token>
```

#### Create Asset
```http
POST /api/assets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Server-01",
  "type": "server",
  "status": "active",
  "location": "Data Center A"
}
```

### Compliance Endpoints

#### Get Compliance Data
```http
GET /api/compliance
Authorization: Bearer <token>
```

### Customer Trust Endpoints

#### Get Customer Trust Data
```http
GET /api/customer-trust
Authorization: Bearer <token>
```

### Suppliers Endpoints

#### Get Suppliers Data
```http
GET /api/suppliers
Authorization: Bearer <token>
```

### Reports Endpoints

#### Get Reports
```http
GET /api/reports
Authorization: Bearer <token>
```

### Integrations Endpoints

#### Get All Integrations
```http
GET /api/integrations
Authorization: Bearer <token>
```

#### Get Integration by ID
```http
GET /api/integrations/:id
Authorization: Bearer <token>
```

#### Create Integration
```http
POST /api/integrations
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New SIEM",
  "description": "Security Information and Event Management",
  "type": "security",
  "configurable": true
}
```

#### Update Integration Status
```http
PUT /api/integrations/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "active"
}
```

#### Delete Integration
```http
DELETE /api/integrations/:id
Authorization: Bearer <token>
```

## 🔒 Permissions

### Permission Types
- `access.dashboard` - Access to main dashboard
- `access.assets` - Asset management access
- `access.compliance` - Compliance tracking access
- `access.customerTrust` - Customer trust management
- `access.suppliers` - Supplier management access
- `access.reports` - Reports and analytics access
- `access.integrations` - Integration management access
- `access.incidents` - Incident management access
- `access.alerts` - Alert management access
- `access.admin` - Administrative access
- `all` - Full system access (admin only)

### Role-based Access
- **Admin**: Full access to all endpoints
- **User**: Access based on assigned permissions

## 📝 Response Formats

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🔧 Rate Limiting

API requests are rate-limited to prevent abuse:
- **100 requests per minute** per IP address
- **1000 requests per hour** per user
- **Admin endpoints**: Higher limits for administrative operations

## 📊 Data Models

### User Model
```json
{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "admin|user",
  "permissions": ["string"],
  "createdAt": "ISO 8601 date",
  "lastLogin": "ISO 8601 date"
}
```

### Asset Model
```json
{
  "id": "string",
  "name": "string",
  "type": "server|workstation|network|cloud",
  "status": "active|inactive|maintenance",
  "location": "string",
  "ipAddress": "string",
  "lastSeen": "ISO 8601 date"
}
```

### Integration Model
```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "status": "active|inactive|error",
  "type": "security|monitoring|cloud|database",
  "lastSync": "ISO 8601 date",
  "configurable": "boolean"
}
```

## 🧪 Testing

### Using cURL

#### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

#### Get Users (Admin)
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Create User
```bash
curl -X POST http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","role":"user","permissions":["access.dashboard"]}'
```

### Using JavaScript/Fetch

```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username: 'admin',
    password: 'admin'
  })
});

const { token } = await loginResponse.json();

// Use token for authenticated requests
const usersResponse = await fetch('/api/admin/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const users = await usersResponse.json();
```

## 🔄 WebSocket Support

Real-time updates are available via WebSocket connections:

```javascript
const ws = new WebSocket('ws://localhost:5000/ws');

ws.onopen = function() {
  console.log('WebSocket connected');
};

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

## 🛡️ Security Considerations

### HTTPS
- Always use HTTPS in production
- Configure SSL certificates properly
- Use secure JWT secrets

### Input Validation
- All inputs are validated and sanitized
- SQL injection protection
- XSS prevention measures

### CORS
- Configured for specific origins
- Credentials support enabled
- Preflight request handling

## 📚 SDKs and Libraries

### JavaScript/Node.js
```bash
npm install defendsphere-client
```

### Python
```bash
pip install defendsphere-python
```

### Go
```bash
go get github.com/defendsphere/go-client
```

## 🆘 Support

### API Support
- **Documentation**: This guide and inline API docs
- **Status Page**: Check system status
- **Support Team**: Contact for API issues
- **GitHub Issues**: Report bugs and request features

### Rate Limits
- **Development**: 1000 requests/hour
- **Production**: 10000 requests/hour
- **Enterprise**: Custom limits available

---

**API Version**: 1.0.0  
**Last Updated**: January 2024  
**Base URL**: `https://your-domain.com/api`