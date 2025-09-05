# Greenbone (GVM) Integration Module

## Overview

The DefendSphere Dashboard includes a comprehensive integration module with Greenbone Vulnerability Manager (GVM) for automated security scanning of user assets. This module, named `Scan's_defendSphere_team`, provides seamless integration between the DefendSphere platform and Greenbone's vulnerability scanning capabilities.

## Features

- **Automated Asset Scanning**: Scan user assets (websites, IP addresses) using Greenbone GVM
- **Real-time Scan Monitoring**: Track scan progress and status in real-time
- **Report Integration**: Automatically import and display scan results in the Reports section
- **Asset Risk Assessment**: Update asset risk levels based on scan findings
- **Secure Connection**: Encrypted communication with Greenbone GVM instance

## Architecture

### Backend Components

#### 1. Greenbone Service (`/backend/services/greenboneService.js`)

The core service that handles all Greenbone GVM interactions:

- **Connection Management**: Establishes and maintains connection to GVM API
- **Scan Orchestration**: Creates targets, tasks, and manages scan execution
- **Progress Monitoring**: Tracks scan progress and status updates
- **Report Processing**: Retrieves and parses scan results
- **Data Storage**: Saves scan data and results in Redis

#### 2. Scan API Routes (`/backend/routes/scan.js`)

RESTful API endpoints for scan management:

- `POST /api/scan/start` - Start asset scan
- `GET /api/scan/status/:scanId` - Get scan status
- `GET /api/scan/active` - Get user's active scan
- `GET /api/scan/report/:scanId` - Get scan report
- `GET /api/scan/test-connection` - Test Greenbone connection

### Frontend Components

#### 1. Scan Service (`/frontend/src/services/scanService.ts`)

TypeScript service for frontend-backend communication:

- Asset management
- Scan initiation and monitoring
- Report retrieval
- Connection testing

#### 2. Dashboard Integration

- **Home Page**: "Запустить скан активов" button with scan status
- **Reports Page**: Greenbone scan reports section
- **Assets Page**: Updated asset information based on scan results

## Configuration

### Environment Variables

Add the following variables to your `.env` file:

```env
# Greenbone GVM Configuration
GREENBONE_HOST=217.65.144.232
GREENBONE_PORT=9392
GREENBONE_USERNAME=admin
GREENBONE_PASSWORD=admin
GREENBONE_PROTOCOL=http

# Redis Configuration
REDIS_URL=redis://localhost:6379
```

### Dependencies

The integration requires the following npm packages:

```json
{
  "gvm-tools": "^23.4.0"
}
```

Install with:
```bash
npm install gvm-tools
```

## Usage

### Starting a Scan

1. **Prerequisites**: User must have at least one asset configured
2. **Access**: Navigate to the Home page (Dashboard)
3. **Initiation**: Click "Запустить скан активов" button
4. **Monitoring**: Track scan progress in real-time

### Scan Process Flow

1. **Asset Validation**: Verify user has assets to scan
2. **GVM Connection**: Establish connection to Greenbone GVM
3. **Target Creation**: Create scan target with user's assets
4. **Task Creation**: Create scan task with appropriate configuration
5. **Scan Execution**: Start the vulnerability scan
6. **Progress Monitoring**: Track scan progress every 10 seconds
7. **Report Retrieval**: Fetch results when scan completes
8. **Data Integration**: Update Reports and Assets sections

### Scan Statuses

- **queued**: Scan is waiting to start
- **running**: Scan is in progress
- **completed**: Scan finished successfully
- **failed**: Scan encountered an error

## API Reference

### Start Scan

```http
POST /api/scan/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "assets": [
    {
      "name": "myrockshows.com",
      "domain": "myrockshows.com",
      "ip": "116.203.242.207",
      "type": "Web Server",
      "environment": "Production"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "scanId": "scan_user1_1703123456789",
  "message": "Scan started successfully",
  "data": {
    "scanId": "scan_user1_1703123456789",
    "userId": "user1",
    "taskId": "task_123",
    "targetId": "target_456",
    "assets": [...],
    "status": "running",
    "startTime": "2023-12-21T10:30:00.000Z",
    "progress": 0
  }
}
```

### Get Scan Status

```http
GET /api/scan/status/scan_user1_1703123456789
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scanId": "scan_user1_1703123456789",
    "status": "running",
    "progress": 45,
    "startTime": "2023-12-21T10:30:00.000Z",
    "assets": [...]
  }
}
```

### Get Scan Report

```http
GET /api/scan/report/scan_user1_1703123456789
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "scanId": "scan_user1_1703123456789",
    "reports": [
      {
        "id": "result_123",
        "name": "SSH Weak Encryption",
        "severity": 7.5,
        "cvss": 7.5,
        "cve": "CVE-2023-1234",
        "description": "SSH server uses weak encryption",
        "solution": "Update SSH configuration",
        "host": "116.203.242.207",
        "port": "22",
        "riskLevel": "High"
      }
    ],
    "reportCount": 1,
    "startTime": "2023-12-21T10:30:00.000Z",
    "endTime": "2023-12-21T10:45:00.000Z"
  }
}
```

## Security Considerations

### Authentication
- All API endpoints require valid JWT authentication
- Users can only access their own scan data
- Admin users have additional privileges

### Data Protection
- Scan credentials stored securely in environment variables
- Scan results cached in Redis with TTL
- No sensitive data logged in plain text

### Network Security
- HTTPS recommended for production environments
- Firewall rules should restrict GVM access
- Regular credential rotation recommended

## Error Handling

### Common Error Scenarios

1. **GVM Connection Failed**
   - Check network connectivity
   - Verify credentials
   - Ensure GVM service is running

2. **Asset Validation Failed**
   - Ensure user has configured assets
   - Verify asset format (IP/domain)

3. **Scan Creation Failed**
   - Check GVM permissions
   - Verify scan configuration
   - Ensure sufficient resources

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## Monitoring and Logging

### Log Levels
- **INFO**: Scan start/completion, status updates
- **WARN**: Connection issues, retry attempts
- **ERROR**: Scan failures, API errors

### Metrics
- Scan duration
- Number of vulnerabilities found
- Asset coverage
- Success/failure rates

## Troubleshooting

### Scan Not Starting
1. Check user has assets configured
2. Verify GVM connection
3. Check Redis connectivity
4. Review backend logs

### Scan Stuck in "Running" State
1. Check GVM task status
2. Verify network connectivity
3. Review scan configuration
4. Check GVM resources

### Reports Not Appearing
1. Verify scan completed successfully
2. Check report parsing logic
3. Review Redis data
4. Check frontend API calls

## Future Enhancements

- **Scheduled Scans**: Automatic recurring scans
- **Custom Scan Configurations**: User-defined scan parameters
- **Report Templates**: Customizable report formats
- **Integration with Other Tools**: Additional security tool integrations
- **Advanced Analytics**: Trend analysis and reporting

## Support

For technical support or questions about the Greenbone integration:

1. Check the troubleshooting section
2. Review application logs
3. Verify configuration settings
4. Contact the DefendSphere development team

## Version History

- **v1.0.0**: Initial Greenbone integration
  - Basic scan functionality
  - Report integration
  - Asset risk assessment
  - Real-time monitoring