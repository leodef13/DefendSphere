# Greenbone GVM Integration

## Overview

The DefendSphere Dashboard includes a comprehensive integration module with Greenbone Vulnerability Management (GVM) system, allowing users to perform automated security scans of their assets directly from the dashboard.

## Module Name: `Scan's_defendSphere_team`

## Features

### 1. Asset Scanning
- **Automated Scanning**: Users can initiate security scans for their registered assets
- **Real-time Status**: Live monitoring of scan progress and status
- **Asset Validation**: Scans are only available for users with registered assets

### 2. Report Integration
- **Automatic Report Processing**: Scan results are automatically parsed and integrated into the Reports section
- **Vulnerability Analysis**: Detailed vulnerability information with CVSS scores and recommendations
- **Risk Assessment**: Automatic risk level calculation and compliance scoring

### 3. Asset Management
- **Dynamic Updates**: Asset information is updated based on scan results
- **Risk Visualization**: Color-coded risk levels and compliance percentages
- **Historical Tracking**: Last assessment dates and vulnerability counts

## Technical Architecture

### Backend Components

#### 1. Greenbone Service (`/backend/services/greenboneService.js`)
```javascript
class GreenboneService {
  // Core methods
  async connectToGreenbone()     // Establish GVM connection
  async startScan(assets, userId) // Initiate asset scanning
  async getScanStatus(scanId)    // Monitor scan progress
  async getScanReports(scanId)   // Retrieve scan results
  async parseReports(reportData) // Process and structure data
}
```

#### 2. API Endpoints (`/backend/routes/scan.js`)
- `POST /api/scan/start` - Start new scan
- `GET /api/scan/status/:scanId` - Get scan status
- `GET /api/scan/report/:scanId` - Get scan reports
- `GET /api/scan/assets` - Check user assets
- `POST /api/scan/connect` - Test GVM connection

### Frontend Components

#### 1. Scan Service (`/frontend/src/services/scanService.ts`)
```typescript
class ScanService {
  async checkUserAssets()     // Verify user has scanable assets
  async startScan()           // Initiate scanning process
  async getScanStatus(scanId) // Monitor scan progress
  async getScanReports(scanId) // Retrieve scan results
  async testConnection()      // Test GVM connectivity
}
```

#### 2. Dashboard Integration
- **Home Page**: Scan button with asset validation
- **Reports Section**: Automatic report display and download
- **Assets Section**: Dynamic asset updates with risk indicators

## Configuration

### Environment Variables
```bash
# Greenbone GVM Configuration
GREENBONE_HOST=217.65.144.232
GREENBONE_PORT=9392
GREENBONE_USERNAME=admin
GREENBONE_PASSWORD=admin
GREENBONE_PROTOCOL=http
```

### Dependencies
```json
{
  "gvm-tools": "^23.4.0"
}
```

## Usage Guide

### 1. Prerequisites
- User must have registered assets in the system
- Greenbone GVM server must be accessible
- Valid GVM credentials configured

### 2. Starting a Scan
1. Navigate to the Home dashboard
2. Verify that the "Запустить скан активов" button is visible (indicates user has assets)
3. Click the button to initiate scanning
4. Monitor progress through the real-time status display

### 3. Monitoring Progress
- **Status Indicators**: Visual status with icons (running, completed, error)
- **Progress Bar**: Real-time percentage completion
- **Status Messages**: Descriptive text updates

### 4. Viewing Results
- **Reports Section**: New scan reports appear automatically
- **Assets Section**: Updated asset information with new risk assessments
- **Download Options**: PDF and Excel export capabilities

## Data Flow

### 1. Scan Initiation
```
User clicks scan button → Frontend validates assets → Backend connects to GVM → 
Scan configuration created → Target and task created → Scan started
```

### 2. Progress Monitoring
```
Frontend polls status → Backend queries GVM → Status updated → 
Progress displayed → Continue until completion
```

### 3. Result Processing
```
Scan completes → Reports retrieved → Data parsed → 
Vulnerabilities extracted → Assets updated → UI refreshed
```

## Security Considerations

### 1. Authentication
- All scan operations require valid JWT authentication
- User-specific asset validation prevents unauthorized scanning
- GVM credentials stored securely in environment variables

### 2. Data Protection
- Scan results are processed and stored securely
- Sensitive vulnerability data is properly handled
- User access controls maintained throughout the process

### 3. Error Handling
- Graceful degradation when GVM is unavailable
- Comprehensive error logging and user feedback
- Timeout handling for long-running scans

## Troubleshooting

### Common Issues

#### 1. "No assets found for scanning"
- **Cause**: User has no registered assets
- **Solution**: Add assets through the Assets section first

#### 2. "Connection failed to Greenbone"
- **Cause**: GVM server unavailable or credentials incorrect
- **Solution**: Verify GVM server status and credentials

#### 3. "Scan failed to start"
- **Cause**: GVM configuration or network issues
- **Solution**: Check GVM logs and network connectivity

### Debug Information
- All scan operations are logged with timestamps
- Error messages include detailed context
- Status polling provides real-time feedback

## API Examples

### Start Scan
```bash
curl -X POST http://localhost:5000/api/scan/start \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"
```

### Get Scan Status
```bash
curl -X GET http://localhost:5000/api/scan/status/<scanId> \
  -H "Authorization: Bearer <token>"
```

### Get Scan Reports
```bash
curl -X GET http://localhost:5000/api/scan/report/<scanId> \
  -H "Authorization: Bearer <token>"
```

## Future Enhancements

### Planned Features
1. **Scheduled Scans**: Automated recurring scans
2. **Scan Templates**: Predefined scan configurations
3. **Advanced Filtering**: Custom vulnerability filtering
4. **Integration APIs**: Third-party tool integration
5. **Compliance Mapping**: Automated compliance checking

### Performance Optimizations
1. **Async Processing**: Background scan processing
2. **Caching**: Report data caching for faster access
3. **Batch Operations**: Multiple asset scanning
4. **Progress Streaming**: Real-time progress updates

## Support

For technical support or feature requests related to the Greenbone integration:
- Check the application logs for detailed error information
- Verify GVM server connectivity and configuration
- Ensure all dependencies are properly installed
- Review the troubleshooting section above

## Version History

- **v1.0.0**: Initial Greenbone integration implementation
- Basic scan functionality with real-time monitoring
- Report parsing and asset updates
- User interface integration