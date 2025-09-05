# DefendSphere Administrator Guide

## 🛡️ Overview

This guide provides comprehensive instructions for administrators managing the DefendSphere cybersecurity dashboard platform.

## 🔐 Admin Access

### Admin Panel Access
1. **Login** with admin credentials (admin/admin by default)
2. **Navigate** to the Admin Panel using the sidebar link
3. **Verify** admin privileges are active

### Admin Capabilities
- User management (CRUD operations)
- Role and permission assignment
- System configuration
- Access control management
- Audit logging and monitoring

## 👥 User Management

### Creating New Users

1. **Access Admin Panel** → Users section
2. **Click "Add User"** button
3. **Fill in user details**:
   - Username (unique identifier)
   - Email address
   - Password (secure password required)
   - Role (Admin or User)
   - Permissions (select appropriate access levels)

4. **Configure Permissions**:
   - `access.dashboard` - Access to main dashboard
   - `access.assets` - Asset management access
   - `access.compliance` - Compliance tracking access
   - `access.customerTrust` - Customer trust management
   - `access.suppliers` - Supplier management access
   - `access.reports` - Reports and analytics access
   - `access.integrations` - Integration management access
   - `access.incidents` - Incident management access
   - `access.alerts` - Alert management access
   - `access.admin` - Administrative access (admin only)

5. **Save** the new user

### Editing Users

1. **Find the user** in the users list
2. **Click the edit icon** (pencil icon)
3. **Modify** user details as needed:
   - Email address
   - Role assignment
   - Permission levels
4. **Save changes**

### Deleting Users

1. **Locate the user** to be deleted
2. **Click the delete icon** (trash icon)
3. **Confirm deletion** in the popup dialog
4. **Verify** user has been removed

⚠️ **Warning**: Deleting users is permanent and cannot be undone.

## 🔑 Role Management

### Admin Role
- **Full system access**
- **User management capabilities**
- **System configuration rights**
- **All permission levels**

### User Role
- **Limited access** based on assigned permissions
- **No user management** capabilities
- **Restricted system access**

### Permission System

#### Core Permissions
- `access.dashboard` - Basic dashboard access
- `access.reports` - View reports and analytics

#### Module Permissions
- `access.assets` - Asset management
- `access.compliance` - Compliance tracking
- `access.customerTrust` - Customer relationship management
- `access.suppliers` - Supplier management
- `access.integrations` - Integration management
- `access.incidents` - Incident management
- `access.alerts` - Alert management

#### Administrative Permissions
- `access.admin` - Administrative panel access
- `all` - Full system access (admin only)

## 🔧 System Configuration

### Environment Variables

Configure the following environment variables for optimal performance:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
REDIS_URL=redis://localhost:6379

# Security Configuration
JWT_SECRET=your_secure_jwt_secret_here
CORS_ORIGIN=https://yourdomain.com

# HTTPS Configuration (Optional)
HTTPS=true
SSL_KEY_PATH=./certs/private-key.pem
SSL_CERT_PATH=./certs/certificate.pem
```

### Redis Configuration

1. **Install Redis** server
2. **Configure Redis** for production use
3. **Initialize default users**:
   ```bash
   cd backend
   npm run init-redis
   ```

### HTTPS Setup

1. **Generate certificates**:
   ```bash
   ./scripts/setup-https.sh
   ```

2. **Configure environment**:
   ```bash
   export HTTPS=true
   export SSL_KEY_PATH=./certs/private-key.pem
   export SSL_CERT_PATH=./certs/certificate.pem
   ```

3. **Restart the server**

## 📊 Monitoring and Logging

### User Activity Monitoring
- **Login attempts** and success/failure rates
- **User actions** and system interactions
- **Permission changes** and role modifications
- **Data access** patterns and frequency

### System Health Monitoring
- **Server performance** metrics
- **Database connectivity** status
- **API response times** and error rates
- **Resource utilization** tracking

### Audit Logs
- **User management** activities
- **Permission changes** and role assignments
- **System configuration** modifications
- **Security events** and alerts

## 🚨 Security Best Practices

### Password Policies
- **Enforce strong passwords** (minimum 8 characters, mixed case, numbers, symbols)
- **Regular password changes** (recommended every 90 days)
- **Account lockout** after failed login attempts
- **Password history** to prevent reuse

### Access Control
- **Principle of least privilege** - grant minimum required access
- **Regular access reviews** - audit user permissions quarterly
- **Role-based access** - use roles instead of individual permissions
- **Temporary access** - set expiration dates for temporary users

### System Security
- **Regular updates** - keep system and dependencies updated
- **HTTPS enforcement** - use SSL/TLS for all communications
- **Firewall configuration** - restrict access to necessary ports
- **Backup procedures** - regular data backups and recovery testing

## 🔄 Backup and Recovery

### Data Backup
1. **Redis data backup**:
   ```bash
   redis-cli --rdb /backup/redis-backup.rdb
   ```

2. **Configuration backup**:
   ```bash
   cp -r config/ /backup/config-backup/
   ```

3. **Certificate backup**:
   ```bash
   cp -r certs/ /backup/certs-backup/
   ```

### Recovery Procedures
1. **Restore Redis data**:
   ```bash
   redis-cli --pipe < /backup/redis-backup.rdb
   ```

2. **Restore configuration**:
   ```bash
   cp -r /backup/config-backup/ config/
   ```

3. **Restart services**:
   ```bash
   npm start
   ```

## 🆘 Troubleshooting

### Common Admin Issues

1. **User Creation Fails**
   - Check username uniqueness
   - Verify email format
   - Ensure strong password requirements
   - Check Redis connectivity

2. **Permission Issues**
   - Verify user role assignments
   - Check permission configurations
   - Review access control settings
   - Test with different user accounts

3. **System Performance**
   - Monitor Redis memory usage
   - Check server resource utilization
   - Review API response times
   - Analyze error logs

4. **HTTPS Problems**
   - Verify certificate validity
   - Check certificate paths
   - Ensure proper file permissions
   - Test certificate chain

### Emergency Procedures

1. **System Lockout**
   - Access Redis directly to reset admin password
   - Use emergency admin account (if configured)
   - Contact system administrator

2. **Data Corruption**
   - Restore from latest backup
   - Reinitialize default users
   - Verify data integrity

3. **Security Breach**
   - Immediately change all passwords
   - Review access logs
   - Disable compromised accounts
   - Notify security team

## 📞 Support and Maintenance

### Regular Maintenance Tasks
- **Weekly**: Review user access and permissions
- **Monthly**: Update system dependencies
- **Quarterly**: Security audit and access review
- **Annually**: Full system security assessment

### Support Contacts
- **Technical Support**: IT support team
- **Security Team**: Security operations center
- **Vendor Support**: DefendSphere development team
- **Emergency Contact**: 24/7 support hotline

### Documentation Updates
- **Keep documentation current** with system changes
- **Update user guides** when features change
- **Maintain troubleshooting guides** with new issues
- **Review and update** security procedures regularly

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Administrator**: DefendSphere Team