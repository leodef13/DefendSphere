# Greenbone GVM Integration - DefendSphere

## Overview

The DefendSphere Dashboard includes a comprehensive integration with Greenbone Vulnerability Management (GVM) system, allowing users to perform automated security scans of their assets directly from the dashboard.

## Module: Scan's_defendSphere_team

### Features

- **Automated Asset Scanning**: Scan user assets using Greenbone GVM
- **Real-time Status Monitoring**: Track scan progress with live updates
- **Report Integration**: Automatically import and display scan results
- **Asset Updates**: Update asset risk levels and compliance scores based on scan results
- **Export Functionality**: Download scan reports in PDF and Excel formats

## Architecture

### Backend Components

#### 1. GreenboneService (`/backend/services/greenboneService.js`)

The core service handling all GVM interactions:

```javascript
class GreenboneService {
  // Connection management
  async connectToGreenbone()
  async initialize()
  
  // Scan operations
  async startScan(assets, userId)
  async getScanStatus(scanId)
  async getReports(scanId)
  
  // Data processing
  async parseReports(reports, assets)
  async updateUserAssets(userId, scanId)
  
  // Utility methods
  mapSeverityToRiskLevel(severity)
  calculateAssetRiskLevel(vulnerabilities)
  calculateCompliance(vulnerabilities)
}
```

#### 2. API Routes (`/backend/routes/scan.js`)

RESTful endpoints for scan operations:

- `POST /api/scan/start` - Start a new scan
- `GET /api/scan/status/:scanId` - Get scan status
- `GET /api/scan/report/:scanId` - Get scan reports
- `POST /api/scan/update-assets/:scanId` - Update user assets
- `GET /api/scan/test-connection` - Test GVM connection
- `GET /api/scan/user-assets` - Get user assets

### Frontend Components

#### 1. ScanService (`/frontend/src/services/scanService.ts`)

TypeScript service for frontend-backend communication:

```typescript
class ScanService {
  async startScan(assets: Asset[]): Promise<ScanResult>
  async getScanStatus(scanId: string): Promise<ScanStatusResult>
  async getScanReport(scanId: string): Promise<ScanReportResult>
  async updateUserAssets(scanId: string): Promise<ScanResult>
  async testConnection(): Promise<ScanResult>
  async getUserAssets(): Promise<{ success: boolean; assets?: Asset[] }>
  async pollScanStatus(scanId: string, onUpdate: Function): Promise<ScanStatus>
}
```

#### 2. Dashboard Integration

**Home Page (`/frontend/src/pages/Dashboard.tsx`)**:
- "Запустить скан активов" button (only visible when user has assets)
- Real-time scan status display
- Progress bar and status messages
- Automatic asset refresh after scan completion

**Reports Page (`/frontend/src/pages/Reports.tsx`)**:
- Greenbone scan reports section
- Vulnerability summaries with risk level distribution
- Export functionality (PDF/Excel)
- Integration with existing report data

**Assets Page (`/frontend/src/pages/Assets.tsx`)**:
- Updated asset information from scan results
- Risk level indicators with color coding
- Compliance score updates
- Last scan date tracking

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Greenbone GVM Configuration
GREENBONE_HOST=217.65.144.232
GREENBONE_PORT=9392
GREENBONE_USERNAME=admin
GREENBONE_PASSWORD=admin
GREENBONE_PROTOCOL=http

# Redis Configuration
REDIS_URL=redis://localhost:6380

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Server Configuration
PORT=5000
CORS_ORIGIN=http://localhost:5173
```

### Dependencies

#### Backend Dependencies

Add to `package.json`:

```json
{
  "dependencies": {
    "gvm-tools": "^23.4.0",
    "redis": "^4.6.10",
    "xml2js": "^0.6.2"
  }
}
```

Install dependencies:

```bash
cd backend
npm install
```

## Usage

### 1. Starting a Scan

1. Navigate to the Home page
2. Ensure you have assets configured (visible in Assets section)
3. Click "Запустить скан активов" button
4. Monitor scan progress in real-time

### 2. Monitoring Scan Status

The dashboard provides real-time updates:
- **Queued**: Scan is waiting to start
- **Running**: Scan is in progress (with progress percentage)
- **Completed**: Scan finished successfully
- **Failed**: Scan encountered an error

### 3. Viewing Results

After scan completion:
- **Reports Page**: View detailed vulnerability reports
- **Assets Page**: See updated risk levels and compliance scores
- **Home Page**: Updated security health metrics

### 4. Exporting Reports

From the Reports page:
- Click "PDF" button to download PDF report
- Click "Excel" button to download Excel report

## API Examples

### Start a Scan

```bash
curl -X POST http://localhost:5000/api/scan/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "assets": [
      {
        "id": "1",
        "name": "company.ltd",
        "domain": "company.ltd",
        "ip": "116.203.242.207",
        "type": "Web Server",
        "environment": "Production"
      }
    ]
  }'
```

### Get Scan Status

```bash
curl -X GET http://localhost:5000/api/scan/status/scan_user1_1234567890 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Get Scan Report

```bash
curl -X GET http://localhost:5000/api/scan/report/scan_user1_1234567890 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Security Considerations

### 1. Authentication
- All scan endpoints require valid JWT authentication
- Users can only access their own scans and reports
- Admin users have additional privileges

### 2. Data Protection
- Scan results are stored securely in Redis
- Sensitive information is not logged
- Reports are only accessible to authorized users

### 3. Network Security
- GVM connection uses configurable protocols (HTTP/HTTPS)
- Credentials are stored in environment variables
- Connection timeouts prevent hanging requests

## Error Handling

### Common Issues

1. **GVM Connection Failed**
   - Check GVM server availability
   - Verify credentials in `.env` file
   - Ensure network connectivity

2. **Scan Timeout**
   - Large scans may take longer
   - Check GVM server resources
   - Monitor scan progress

3. **Report Parsing Errors**
   - Verify GVM report format
   - Check XML parsing logic
   - Review error logs

### Troubleshooting

1. **Test Connection**:
   ```bash
   curl -X GET http://localhost:5000/api/scan/test-connection \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

2. **Check Logs**:
   ```bash
   # Backend logs
   tail -f backend/logs/app.log
   
   # Redis logs
   redis-cli monitor
   ```

3. **Verify Dependencies**:
   ```bash
   # Check GVM tools installation
   npm list gvm-tools
   
   # Test Redis connection
   redis-cli ping
   ```

## Performance Optimization

### 1. Scan Management
- Implement scan queuing for multiple users
- Add scan scheduling capabilities
- Optimize report parsing for large datasets

### 2. Caching
- Cache scan results in Redis
- Implement report caching
- Add asset data caching

### 3. Monitoring
- Add scan performance metrics
- Implement scan history tracking
- Monitor GVM server health

## Future Enhancements

### 1. Advanced Features
- Scheduled scans
- Custom scan configurations
- Multi-target scanning
- Scan templates

### 2. Integration Improvements
- Real-time notifications
- Email alerts for critical vulnerabilities
- Integration with other security tools
- API webhooks

### 3. User Experience
- Scan history dashboard
- Vulnerability trending
- Risk assessment reports
- Compliance tracking

## Support

For technical support or questions about the Greenbone integration:

1. Check the troubleshooting section above
2. Review the application logs
3. Verify configuration settings
4. Test individual components

## License

This integration module is part of the DefendSphere project and follows the same licensing terms.