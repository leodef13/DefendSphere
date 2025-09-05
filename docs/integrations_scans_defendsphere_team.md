# Integrations: Scan's_defendSphere_team Configuration

## Overview

This document describes how to configure and manage the **Scan's_defendSphere_team** integration module in the DefendSphere Admin Panel. This integration connects DefendSphere with Greenbone Vulnerability Manager (GVM) to provide automated vulnerability scanning capabilities.

## Accessing Integration Configuration

### Prerequisites
- Admin privileges in DefendSphere
- Access to the Admin Panel
- Greenbone GVM instance with SSH access enabled

### Navigation
1. Log in to DefendSphere as an administrator
2. Navigate to **Admin Panel** → **Integrations**
3. Locate the **Scan's_defendSphere_team** card
4. Click on the card to open the configuration modal

## Integration Configuration

### Configuration Parameters

The integration requires the following parameters:

#### Host / Endpoint
- **Description**: IP address or hostname of the Greenbone GVM server
- **Example**: `217.65.144.232`
- **Required**: Yes
- **Default**: None

#### Port
- **Description**: SSH port for GVM connection
- **Example**: `9392`
- **Required**: Yes
- **Default**: `9392`

#### Username
- **Description**: GVM username for authentication
- **Example**: `admin`
- **Required**: Yes
- **Default**: None

#### Password
- **Description**: GVM password for authentication
- **Required**: Yes
- **Security**: Password is encrypted and masked in the interface
- **Default**: None

#### Use SSL/TLS
- **Description**: Enable SSL/TLS encryption for the connection
- **Type**: Checkbox
- **Default**: Unchecked (SSH is used by default)

### Configuration Process

#### Step 1: Open Configuration Modal
1. In the Admin Panel, click on the **Scan's_defendSphere_team** integration card
2. The configuration modal will open with empty fields (for new configuration) or populated fields (for existing configuration)

#### Step 2: Enter Connection Details
1. **Host/Endpoint**: Enter the GVM server address
2. **Port**: Enter the SSH port (typically 9392)
3. **Username**: Enter your GVM username
4. **Password**: Enter your GVM password (field is masked by default)
5. **Use SSL/TLS**: Check if you want to use SSL/TLS instead of SSH

#### Step 3: Test Connection
1. Click **Test Connection** to verify the configuration
2. Wait for the test result:
   - **Success**: Green indicator with "Connection successful" message
   - **Failure**: Red indicator with error details

#### Step 4: Save Configuration
1. If the test is successful, click **Save Settings**
2. The configuration will be encrypted and stored in Redis
3. The modal will close and the integration status will update to "Configured"

## Security Features

### Data Encryption
- All sensitive data (passwords, tokens) are encrypted using AES-256-GCM
- Encryption keys are stored in environment variables
- Data is encrypted before storage in Redis

### Access Control
- Only administrators can configure integrations
- All configuration changes are logged with admin user and timestamp
- Users cannot access integration configuration directly

### Audit Logging
All admin actions are logged with the following information:
- **Who**: Admin username
- **What**: Action performed (config update, connection test)
- **When**: Timestamp
- **Details**: Specific changes made or test results

## API Endpoints

### Get Integration Configuration
```http
GET /api/integrations/scans_defendsphere_team/config
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "config": {
    "host": "217.65.144.232",
    "port": 9392,
    "username": "admin",
    "password": "••••••••",
    "useSSL": false
  },
  "configured": true
}
```

### Save Integration Configuration
```http
POST /api/integrations/scans_defendsphere_team/config
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "host": "217.65.144.232",
  "port": 9392,
  "username": "admin",
  "password": "admin_password",
  "useSSL": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Integration configuration saved successfully"
}
```

### Test Integration Connection
```http
POST /api/integrations/scans_defendsphere_team/test
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "host": "217.65.144.232",
  "port": 9392,
  "username": "admin",
  "password": "admin_password",
  "useSSL": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Connection test successful",
  "details": {
    "version": "22.4"
  }
}
```

### Get Integration Status
```http
GET /api/integrations/scans_defendsphere_team/status
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "status": "connected",
  "message": "Integration is working",
  "lastTest": "2024-01-15T10:30:00Z",
  "details": {
    "version": "22.4"
  }
}
```

## Troubleshooting

### Common Issues

#### Connection Test Fails
**Symptoms**: Red error indicator when testing connection
**Possible Causes**:
- Incorrect host/port configuration
- Invalid username/password
- GVM server not accessible
- SSH access not enabled on GVM

**Solutions**:
1. Verify GVM server is running and accessible
2. Check SSH access is enabled in GOS administration menu
3. Confirm username/password are correct
4. Test SSH connection manually: `ssh admin@217.65.144.232 -p 9392`

#### Configuration Not Saving
**Symptoms**: "Save Settings" button doesn't work or shows error
**Possible Causes**:
- Missing required fields
- Network connectivity issues
- Redis connection problems

**Solutions**:
1. Ensure all required fields are filled
2. Check network connectivity to backend
3. Verify Redis is running and accessible

#### Integration Shows "Not Configured"
**Symptoms**: Integration card shows "Not Configured" status
**Possible Causes**:
- Configuration was not saved properly
- Redis data was cleared
- Configuration was deleted

**Solutions**:
1. Reconfigure the integration
2. Check Redis for stored configuration
3. Verify admin permissions

### Debug Mode

Enable debug logging by setting:
```bash
NODE_ENV=development
```

This will provide detailed logs of:
- Configuration save operations
- Connection test attempts
- Encryption/decryption operations
- Redis operations

## User Experience

### For Administrators
- **Easy Configuration**: Simple modal interface for setting up integration
- **Real-time Testing**: Immediate feedback on connection status
- **Secure Storage**: Passwords are encrypted and masked
- **Audit Trail**: All changes are logged for compliance

### For End Users
- **Transparent Operation**: Users don't need to know integration details
- **Automatic Scanning**: Scans work seamlessly once configured
- **No Credential Management**: Users don't handle sensitive data

## Best Practices

### Security
1. **Use Strong Passwords**: Ensure GVM passwords are complex and unique
2. **Regular Updates**: Keep GVM and DefendSphere updated
3. **Monitor Logs**: Regularly review admin action logs
4. **Access Control**: Limit admin access to necessary personnel only

### Configuration
1. **Test Before Save**: Always test connection before saving configuration
2. **Document Changes**: Keep records of configuration changes
3. **Backup Configuration**: Export configuration for disaster recovery
4. **Regular Testing**: Periodically test integration status

### Maintenance
1. **Monitor Status**: Check integration status regularly
2. **Update Credentials**: Rotate passwords periodically
3. **Review Logs**: Monitor for connection issues or errors
4. **Performance**: Monitor scan performance and adjust as needed

## Support

### Getting Help
1. **Check Logs**: Review admin action logs for error details
2. **Test Manually**: Verify GVM connectivity outside of DefendSphere
3. **Documentation**: Refer to Greenbone GVM documentation
4. **Contact Support**: Reach out to DefendSphere team for assistance

### Common Commands

#### Test GVM Connection Manually
```bash
# Test SSH connection
ssh admin@217.65.144.232 -p 9392

# Test with gvm-cli
gvm-cli --gmp-username admin --gmp-password password ssh --hostname 217.65.144.232 --xml "<get_version/>"
```

#### Check Redis Configuration
```bash
# Connect to Redis
redis-cli

# Check stored configuration
GET integration:scans_defendsphere_team:config

# List all integration keys
KEYS integration:*
```

## Version History

### v1.0.0 (Current)
- Initial release of Scan's_defendSphere_team integration
- Basic configuration and connection testing
- Encrypted credential storage
- Admin action logging
- Modal-based configuration interface

### Future Enhancements
- Multiple GVM instance support
- Advanced configuration options
- Integration health monitoring
- Automated failover
- Configuration templates

## License

This integration module is part of DefendSphere and follows the same licensing terms.