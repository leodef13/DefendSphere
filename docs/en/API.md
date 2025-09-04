# DefendSphere API Documentation

Complete API reference for the DefendSphere cybersecurity dashboard and compliance management platform.

## 🔗 Base URL

```
http://localhost:5000/api
```

## 🔐 Authentication

All API endpoints require authentication using JWT tokens.

### Login
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
    "role": "admin"
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}
```

## 📊 Dashboard API

### Get Dashboard Data
```http
GET /api/dashboard
Authorization: Bearer <token>
```

**Response:**
```json
{
  "securityHealth": 75,
  "status": "Need Attention",
  "lastScan": "2 days ago",
  "assets": {
    "total": 124,
    "critical": 5,
    "high": 12,
    "medium": 28,
    "low": 43
  },
  "healthTrends": [
    { "date": "2025-08-01", "health": 60 },
    { "date": "2025-08-10", "health": 40 },
    { "date": "2025-08-20", "health": 55 },
    { "date": "2025-08-30", "health": 15 }
  ]
}
```

## 💻 Assets API

### Get All Assets
```http
GET /api/assets
Authorization: Bearer <token>
```

### Create Asset
```http
POST /api/assets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Web Server 01",
  "type": "Servers",
  "environment": "Production",
  "assignedStandards": ["GDPR", "NIS2"],
  "compliancePercentage": 85,
  "riskLevel": "Medium",
  "lastAssessment": "2025-09-01",
  "owner": "IT Department",
  "description": "Main web server",
  "ipUrl": "192.168.1.100"
}
```

### Update Asset
```http
PUT /api/assets/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Web Server 01 Updated",
  "compliancePercentage": 90
}
```

### Delete Asset
```http
DELETE /api/assets/:id
Authorization: Bearer <token>
```

### Scan Asset
```http
POST /api/assets/:id/scan
Authorization: Bearer <token>
```

## ✅ Compliance API

### Get Compliance Records
```http
GET /api/compliance
Authorization: Bearer <token>
```

### Create Compliance Record
```http
POST /api/compliance
Authorization: Bearer <token>
Content-Type: application/json

{
  "standard": "GDPR",
  "department": "IT Department",
  "status": "Compliant",
  "compliancePercentage": 95,
  "lastAssessmentDate": "2025-09-01",
  "nextScheduledAssessment": "2025-12-01",
  "recommendations": "Continue current practices"
}
```

### Get Compliance Summary
```http
GET /api/compliance/summary
Authorization: Bearer <token>
```

**Response:**
```json
{
  "totalRecords": 25,
  "incidents": 3,
  "averageCompliance": 87,
  "riskDistribution": {
    "compliant": 15,
    "partial": 7,
    "nonCompliant": 2,
    "notAssessed": 1
  }
}
```

## 🤝 Customer Trust API

### Get Customer Trust Records
```http
GET /api/customer-trust
Authorization: Bearer <token>
```

### Create Customer Trust Record
```http
POST /api/customer-trust
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Acme Corporation",
  "category": "Client",
  "sector": "Healthcare",
  "assignedStandards": ["GDPR", "NIS2"],
  "compliancePercentage": 92,
  "lastAssessment": "2025-09-01",
  "responsiblePerson": "John Doe",
  "email": "john@acme.com",
  "website": "https://acme.com"
}
```

## 🏭 Suppliers API

### Get Suppliers
```http
GET /api/suppliers
Authorization: Bearer <token>
```

### Create Supplier
```http
POST /api/suppliers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Cloud Provider Inc",
  "category": "With Access",
  "subGradation": "Services Supplier",
  "assignedStandards": ["NIS2", "SOC v2"],
  "compliancePercentage": 88,
  "lastAssessment": "2025-09-01"
}
```

## 📈 Reports API

### Get Reports
```http
GET /api/reports
Authorization: Bearer <token>
```

### Create Report
```http
POST /api/reports
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Monthly Security Report",
  "type": "Security Assessment",
  "owner": "Security Team",
  "status": "Completed",
  "riskLevel": "Medium",
  "notes": "Monthly security assessment report"
}
```

### Export Report
```http
GET /api/reports/:id/export?format=pdf
Authorization: Bearer <token>
```

## 🤖 AI Assistant API

### Chat with Assistant
```http
POST /api/assistant
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How do I add a new asset?",
  "context": "assets"
}
```

**Response:**
```json
{
  "response": "To add a new asset, navigate to the Assets section and click the 'Add Asset' button...",
  "suggestions": [
    "View asset management guide",
    "Check compliance requirements"
  ]
}
```

## 📝 Starter Guide API

### Get Starter Guide Data
```http
GET /api/starter-guide
Authorization: Bearer <token>
```

### Save Starter Guide Data
```http
POST /api/starter-guide
Authorization: Bearer <token>
Content-Type: application/json

{
  "sector": "Healthcare",
  "hasInformationSystems": true,
  "systemLocation": "Cloud",
  "processesPersonalData": true,
  "dataTypes": ["Name", "Email", "Financial data"],
  "hasSecurityStrategy": true,
  "hasSecurityOfficer": true,
  "hasCybersecurityTeam": "External provider",
  "hasDisasterRecovery": true,
  "testsVulnerabilities": "Sometimes",
  "wantsVulnerabilityReport": true,
  "resources": "example.com, 192.168.1.1",
  "relevantStandards": ["GDPR", "NIS2"],
  "plansAudit": "Yes",
  "wantsPreAudit": true,
  "wantsSelfAssessment": true,
  "contactInfo": {
    "name": "John Doe",
    "company": "Acme Corp",
    "email": "john@acme.com",
    "phone": "+1234567890"
  }
}
```

## 👑 Admin API

### Get All Users
```http
GET /api/admin/users
Authorization: Bearer <token>
```

### Create User
```http
POST /api/admin/users
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

### Update User
```http
PUT /api/admin/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin"
}
```

### Delete User
```http
DELETE /api/admin/users/:id
Authorization: Bearer <token>
```

## 🔍 Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## 📊 Response Formats

### Pagination
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Filtering
```http
GET /api/assets?type=Servers&environment=Production&riskLevel=High
```

### Sorting
```http
GET /api/assets?sortBy=name&sortOrder=asc
```

### Search
```http
GET /api/assets?search=web server
```

## 🔒 Rate Limiting

API requests are rate limited to prevent abuse:

- **General endpoints**: 100 requests per minute
- **Authentication endpoints**: 10 requests per minute
- **Export endpoints**: 5 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## 📝 Request/Response Examples

### Complete Asset Creation Flow

1. **Create Asset**
```http
POST /api/assets
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Database Server",
  "type": "Databases",
  "environment": "Production",
  "assignedStandards": ["GDPR", "ISO 27001"],
  "compliancePercentage": 90,
  "riskLevel": "Low",
  "lastAssessment": "2025-09-01",
  "owner": "Database Team",
  "description": "Primary database server",
  "ipUrl": "192.168.1.50"
}
```

2. **Response**
```json
{
  "id": "asset_123",
  "name": "Database Server",
  "type": "Databases",
  "environment": "Production",
  "assignedStandards": ["GDPR", "ISO 27001"],
  "compliancePercentage": 90,
  "riskLevel": "Low",
  "lastAssessment": "2025-09-01",
  "owner": "Database Team",
  "description": "Primary database server",
  "ipUrl": "192.168.1.50",
  "createdAt": "2025-09-01T10:00:00Z",
  "updatedAt": "2025-09-01T10:00:00Z"
}
```

3. **Scan Asset**
```http
POST /api/assets/asset_123/scan
Authorization: Bearer <token>
```

4. **Scan Response**
```json
{
  "scanId": "scan_456",
  "status": "completed",
  "results": {
    "vulnerabilities": 2,
    "critical": 0,
    "high": 1,
    "medium": 1,
    "low": 0
  },
  "scanDate": "2025-09-01T10:05:00Z"
}
```

---

**Version**: 1.0.0  
**Last Updated**: September 2025  
**Author**: DefendSphere Team "DefendSphere — Secure Smarter, Comply Faster"