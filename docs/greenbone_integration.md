# Greenbone (GVM) Integration Module

## Overview

The DefendSphere Dashboard includes a comprehensive integration module with Greenbone Vulnerability Manager (GVM) for automated asset scanning and vulnerability assessment. This module, named `Scan's_defendSphere_team`, provides seamless connectivity between the DefendSphere platform and Greenbone's OpenVAS scanning engine.

## Features

- **Automated Asset Scanning**: Scan user assets using Greenbone's OpenVAS engine
- **Real-time Status Monitoring**: Track scan progress and completion status
- **Report Generation**: Generate detailed vulnerability reports in PDF and Excel formats
- **Asset Management**: Update asset information based on scan results
- **Secure Integration**: Encrypted communication with Greenbone GVM
- **User Access Control**: Role-based access to scanning functionality

## Architecture

### Backend Components

#### 1. Greenbone Service (`/backend/services/greenboneService.js`)

The core service that handles all Greenbone GVM interactions:

```javascript
class GreenboneService {
  // Connect to Greenbone GVM API
  async connectToGreenbone()
  
  // Start scan for a list of assets
  async startScan(assets, userId)
  
  // Get scan status and progress
  async getScanStatus(scanId)
  
  // Retrieve scan reports
  async getScanReports(scanId)
  
  // Parse and process report data
  async parseReports(reportData)
  
  // Export reports to PDF/Excel
  async exportReportToPDF(scanId)
  async exportReportToExcel(scanId)
}
```

#### 2. Scan API Routes (`/backend/routes/scan.js`)

RESTful API endpoints for scan management:

- `POST /api/scan/start` - Start asset scan
- `GET /api/scan/status/:scanId` - Get scan status
- `GET /api/scan/report/:scanId` - Get scan report
- `GET /api/scan/history` - Get user's scan history
- `GET /api/scan/check-assets` - Check if user has assets
- `GET /api/scan/export/pdf/:scanId` - Export report to PDF
- `GET /api/scan/export/excel/:scanId` - Export report to Excel

### Frontend Components

#### 1. Scan Service (`/frontend/src/services/scanService.ts`)

TypeScript service for frontend-backend communication:

```typescript
class ScanService {
  // Check if user has assets
  async checkAssets()
  
  // Start asset scan
  async startScan(assets)
  
  // Get scan status
  async getScanStatus(scanId)
  
  // Get scan report
  async getScanReport(scanId)
  
  // Get scan history
  async getScanHistory()
  
  // Export reports
  async exportToPDF(scanId)
  async exportToExcel(scanId)
  
  // Poll scan status until completion
  async pollScanStatus(scanId, onUpdate, interval)
}
```

#### 2. Dashboard Integration

The Home page includes a "Запустить скан активов" (Start Asset Scan) button that:
- Checks if user has assets
- Displays scan status and progress
- Shows real-time updates during scanning

#### 3. Reports Integration

The Reports page displays:
- Greenbone scan reports
- Vulnerability summaries
- Risk distribution charts
- Export options for PDF/Excel

#### 4. Assets Integration

The Assets page updates with:
- Latest scan results
- Updated risk levels
- Compliance percentages
- Vulnerability counts

## Configuration

### Environment Variables

Create a `.env` file in the backend directory with the following Greenbone configuration:

```env
# Greenbone GVM Configuration
GREENBONE_HOST=217.65.144.232
GREENBONE_PORT=9392
GREENBONE_USERNAME=admin
GREENBONE_PASSWORD=admin
GREENBONE_PROTOCOL=http
```

### Dependencies

The integration requires the following npm packages:

```json
{
  "dependencies": {
    "gvm-tools": "^23.4.0"
  }
}
```

Install with:
```bash
cd backend
npm install gvm-tools
```

## Usage

### Starting a Scan

1. **Prerequisites**: User must have at least one asset configured
2. **Access**: Navigate to the Home page (Dashboard)
3. **Action**: Click "Запустить скан активов" button
4. **Monitoring**: Watch real-time progress updates

### API Usage Examples

#### Start a Scan

```javascript
const response = await fetch('/api/scan/start', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    assets: [
      { id: '1', name: 'example.com', url: 'example.com', type: 'Web Server' }
    ]
  })
})
```

#### Check Scan Status

```javascript
const response = await fetch('/api/scan/status/scan-id-123', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

#### Get Scan Report

```javascript
const response = await fetch('/api/scan/report/scan-id-123', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

## Security Considerations

### Authentication
- All API endpoints require JWT authentication
- Users can only access their own scans and reports
- Admin users have additional privileges

### Data Protection
- Scan data is stored securely in Redis
- Reports are encrypted during transmission
- User credentials are stored in environment variables

### Network Security
- HTTPS recommended for production environments
- Firewall rules should restrict access to Greenbone GVM
- Regular security updates for gvm-tools dependency

## Error Handling

The integration includes comprehensive error handling for:

- **Connection Failures**: Greenbone GVM unavailable
- **Authentication Errors**: Invalid credentials
- **Scan Failures**: Asset scanning errors
- **Report Generation**: Export failures
- **Network Issues**: Timeout and connectivity problems

Error messages are user-friendly and logged for debugging.

## Monitoring and Logging

### Logging
- All scan activities are logged in Redis
- User actions are tracked for audit purposes
- Error logs include detailed stack traces

### Monitoring
- Real-time scan progress tracking
- Status updates every 10 seconds during scanning
- Completion notifications

## Troubleshooting

### Common Issues

1. **Greenbone Connection Failed**
   - Check network connectivity to GVM server
   - Verify credentials in `.env` file
   - Ensure GVM service is running

2. **Scan Not Starting**
   - Verify user has assets configured
   - Check Redis connection
   - Review backend logs for errors

3. **Report Generation Failed**
   - Ensure scan completed successfully
   - Check file system permissions
   - Verify gvm-tools installation

### Debug Mode

Enable debug logging by setting:
```env
LOG_LEVEL=debug
```

## Future Enhancements

Planned improvements include:

- **Scheduled Scans**: Automated recurring scans
- **Custom Scan Configurations**: User-defined scan parameters
- **Integration with Other Tools**: Additional vulnerability scanners
- **Advanced Reporting**: Custom report templates
- **Notification System**: Email/SMS alerts for critical findings

## Support

For technical support or questions about the Greenbone integration:

1. Check the troubleshooting section above
2. Review backend logs for error details
3. Verify configuration settings
4. Contact the DefendSphere development team

## Version History

- **v1.0.0** - Initial Greenbone integration
  - Basic scan functionality
  - Report generation
  - Asset management integration
  - User interface components