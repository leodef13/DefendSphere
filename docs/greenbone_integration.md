# DefendSphere Greenbone Integration

## Overview

DefendSphere integrates with Greenbone Vulnerability Manager (GVM) to provide automated security scanning capabilities. This integration allows users to scan their assets and receive detailed vulnerability reports directly within the DefendSphere dashboard.

## Module: Scan's_defendSphere_team

The integration module is implemented as a comprehensive service that handles:
- Connection to Greenbone GVM via SSH
- Asset scanning using OpenVAS scanner
- Report generation and parsing
- Real-time scan status monitoring
- Integration with DefendSphere's reporting system

## Architecture

### Backend Components

1. **GreenboneService** (`/backend/services/greenboneService.js`)
   - Handles GVM API communication
   - Manages scan lifecycle
   - Parses vulnerability reports
   - Stores scan status in Redis

2. **Scan Routes** (`/backend/routes/scan.js`)
   - REST API endpoints for scan management
   - User authentication and authorization
   - Scan status monitoring

3. **Redis Integration**
   - Stores scan status and progress
   - Caches scan results
   - Manages scan history

### Frontend Components

1. **Dashboard Integration**
   - Scan control panel on Home page
   - Real-time progress monitoring
   - Status indicators and notifications

2. **Reports Integration**
   - Automatic report loading after scan completion
   - PDF/Excel export functionality
   - Vulnerability data visualization

3. **Assets Integration**
   - Asset data updates from scan results
   - Risk level recalculation
   - Compliance score updates

## Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following configuration:

```bash
# Greenbone GVM Configuration
GREENBONE_HOST=217.65.144.232
GREENBONE_PORT=9392
GREENBONE_USERNAME=admin
GREENBONE_PASSWORD=admin

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Configuration
JWT_SECRET=your-secret-key
```

### Greenbone GVM Setup

1. **Enable GMP Access**
   - Access GOS administration menu
   - Enable remote GMP service
   - Configure SSH access

2. **User Permissions**
   - Ensure user has scan creation permissions
   - Verify target creation permissions
   - Check report access permissions

3. **Scanner Configuration**
   - Verify OpenVAS scanner is running
   - Check scan configurations are available
   - Ensure report formats are configured

## API Endpoints

### Scan Management

#### Get User Assets
```http
GET /api/scan/assets
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "assets": [
    {
      "id": "asset-1",
      "name": "myrockshows.com",
      "type": "Web Server",
      "ip": "116.203.242.207",
      "environment": "Production"
    }
  ],
  "canScan": true
}
```

#### Start Scan
```http
POST /api/scan/start
Authorization: Bearer <token>
Content-Type: application/json
```

Response:
```json
{
  "success": true,
  "scanId": "scan_user1_1640995200000",
  "message": "Scan started successfully",
  "assets": 1
}
```

#### Get Scan Status
```http
GET /api/scan/status/{scanId}
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "scan": {
    "id": "scan_user1_1640995200000",
    "status": "running",
    "progress": 45,
    "message": "Scan in progress: 45%",
    "startTime": "2024-01-15T10:00:00Z",
    "lastUpdate": "2024-01-15T10:15:00Z"
  }
}
```

#### Get Scan Results
```http
GET /api/scan/results/{scanId}
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "results": {
    "vulnerabilities": [
      {
        "id": "vuln_123",
        "name": "SQL Injection Vulnerability",
        "cve": "CVE-2024-0001",
        "riskLevel": "High",
        "cvss": 8.5,
        "status": "Open",
        "description": "SQL injection vulnerability in login form",
        "recommendation": "Implement parameterized queries",
        "asset": "myrockshows.com",
        "discovered": "2024-01-15T10:30:00Z"
      }
    ],
    "assets": [
      {
        "id": "asset-1",
        "name": "myrockshows.com",
        "riskLevel": "High",
        "compliancePercentage": 75,
        "vulnerabilities": {
          "critical": 0,
          "high": 3,
          "medium": 3,
          "low": 1
        }
      }
    ],
    "summary": {
      "totalAssets": 1,
      "totalVulnerabilities": 7,
      "riskDistribution": {
        "critical": 0,
        "high": 3,
        "medium": 3,
        "low": 1
      },
      "securityHealth": 75,
      "complianceScore": 75
    }
  }
}
```

#### Get Scan History
```http
GET /api/scan/history
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "scans": [
    {
      "id": "scan_user1_1640995200000",
      "status": "completed",
      "progress": 100,
      "message": "Scan completed successfully",
      "startTime": "2024-01-15T10:00:00Z",
      "lastUpdate": "2024-01-15T10:30:00Z",
      "assets": 1
    }
  ]
}
```

#### Test Connection
```http
GET /api/scan/test-connection
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "message": "Greenbone GVM is available",
  "details": {
    "version": "22.4"
  }
}
```

#### Cancel Scan
```http
POST /api/scan/cancel/{scanId}
Authorization: Bearer <token>
```

Response:
```json
{
  "success": true,
  "message": "Scan cancelled successfully"
}
```

## Scan Process Flow

### 1. Scan Initiation
1. User clicks "Start Asset Scan" button
2. System checks if user has assets available
3. Tests connection to Greenbone GVM
4. Creates scan record in Redis
5. Returns scan ID to frontend

### 2. Target Creation
1. For each asset, creates a target in GVM
2. Configures target with asset IP/domain
3. Sets appropriate port list
4. Stores target IDs for task creation

### 3. Task Creation
1. Creates scan task in GVM
2. Associates targets with task
3. Sets scan configuration (Full and Fast)
4. Assigns OpenVAS scanner
5. Adds descriptive comments

### 4. Scan Execution
1. Starts the scan task
2. Monitors scan progress
3. Updates status in Redis
4. Provides real-time progress to frontend

### 5. Report Processing
1. Retrieves scan reports from GVM
2. Parses vulnerability data
3. Calculates risk levels and compliance scores
4. Updates asset information
5. Stores results in Redis

### 6. Integration
1. Updates Reports section with new data
2. Refreshes Assets section with updated information
3. Recalculates Security Health metrics
4. Notifies user of completion

## Security Considerations

### Authentication
- All API endpoints require valid JWT tokens
- User can only access their own scans
- Scan results are isolated by user

### Data Protection
- Scan credentials stored in environment variables
- Redis data encrypted in transit
- No sensitive data logged

### Access Control
- Users must have 'access.assets' permission
- Scan operations are user-scoped
- Admin users can view all scans

## Error Handling

### Connection Errors
- GVM unavailable: Returns 503 status
- Authentication failed: Returns 401 status
- Permission denied: Returns 403 status

### Scan Errors
- Target creation failed: Logs error, continues with other targets
- Task creation failed: Returns error to user
- Scan timeout: Automatically cancels after timeout

### Recovery
- Failed scans can be restarted
- Partial results are preserved
- Error messages are user-friendly

## Monitoring and Logging

### Logging
- All scan operations are logged
- Error conditions are captured
- Performance metrics are tracked

### Monitoring
- Scan status is tracked in Redis
- Progress updates are real-time
- Completion notifications are sent

## Troubleshooting

### Common Issues

1. **GVM Connection Failed**
   - Check GVM host and port configuration
   - Verify SSH access is enabled
   - Confirm credentials are correct

2. **Scan Not Starting**
   - Check user has assets available
   - Verify GVM scanner is running
   - Confirm scan configuration exists

3. **Scan Stuck**
   - Check GVM scanner status
   - Verify target accessibility
   - Review GVM logs for errors

4. **Results Not Appearing**
   - Check scan completion status
   - Verify report parsing logic
   - Review Redis data integrity

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

This will provide detailed logs of:
- GVM API calls
- Scan progress updates
- Error conditions
- Performance metrics

## Future Enhancements

### Planned Features
1. **Scheduled Scans**
   - Recurring scan schedules
   - Automated report generation
   - Email notifications

2. **Advanced Reporting**
   - Custom report templates
   - Trend analysis
   - Compliance dashboards

3. **Integration Improvements**
   - Multiple GVM instances
   - Load balancing
   - High availability

4. **User Experience**
   - Scan templates
   - Custom scan configurations
   - Advanced filtering

## Support

For technical support or questions about the Greenbone integration:

1. Check the troubleshooting section
2. Review GVM documentation
3. Contact the DefendSphere team
4. Submit issues via GitHub

## License

This integration module is part of DefendSphere and follows the same licensing terms.