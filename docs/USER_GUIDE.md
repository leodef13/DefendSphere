# DefendSphere User Guide

## 🌟 Overview

DefendSphere is a comprehensive cybersecurity dashboard and compliance management platform designed to help organizations monitor, manage, and maintain their security posture.

## 🚀 Getting Started

### Accessing the Dashboard

1. **Open your web browser** and navigate to the DefendSphere URL
2. **Login** using your credentials:
   - Username: Your assigned username
   - Password: Your assigned password
3. **Select your language** using the language switcher (English, Russian, Spanish)

### Default Users

For testing and initial setup, the following users are available:

- **admin/admin** - Full administrative access
- **user1/user1** - Security Analyst with access to Dashboard, Assets, Incidents, Alerts
- **user2/user2** - Standard User with access to Dashboard, Reports, Assets, Suppliers

## 📊 Dashboard Sections

### UI/UX Overview

- Sidebar
  - Fixed order: Home → Starter Guide → Assets → Reports → Compliance → Customer Trust → Suppliers → Integrations
  - Integrations is visible to Admin only
  - Sections without permission are hidden; overall order is preserved
  - Colors: background #003a6a, text #ffffff; user block with initials and Logout at the bottom

- Main Content
  - Inter font; body background #f8f9fa; text color #2c2c2c
  - Cards (#fdfeff) with soft shadows; hover elevation
  - Primary buttons: #56a3d9 (hover #134876)

### 1. Home Dashboard
- **Security Health Overview**: Real-time security metrics and status
- **Threat Monitoring**: Live threat detection and system health
- **Recent Incidents**: Latest security incidents and their status
- **Interactive Charts**: Visual representation of security data

### 2. Assets Management
- **IT Asset Tracking**: Monitor servers, workstations, and devices
- **Cloud Resources**: Track cloud infrastructure and services
- **IoT Devices**: Monitor Internet of Things devices
- **Asset Health**: Real-time status of all managed assets

### 3. Compliance Tracking
- **Regulatory Compliance**: Monitor GDPR, NIS2, ISO 27001, SOC2, PCI DSS, DORA
- **Compliance Status**: Visual indicators of compliance levels
- **Audit Trails**: Track compliance activities and changes
- **Reporting**: Generate compliance reports

### 4. Customer Trust
- **Client Relationships**: Manage customer and partner relationships
- **Trust Metrics**: Monitor trust indicators and satisfaction
- **Communication Logs**: Track interactions with clients
- **Service Level Agreements**: Monitor SLA compliance

### 5. Suppliers Management
- **Third-party Monitoring**: Track supplier security posture
- **Risk Assessment**: Evaluate supplier risks
- **Contract Management**: Monitor supplier agreements
- **Performance Metrics**: Track supplier performance

### 6. Reports & Analytics
- **Security Reports**: Comprehensive security analysis
- **Compliance Reports**: Regulatory compliance documentation
- **Trend Analysis**: Historical data and trends
- **Custom Reports**: Create tailored reports

### 7. Integrations
- **SIEM Integration**: Connect with Security Information and Event Management systems
- **Cloud Services**: Integrate with AWS, Azure, Google Cloud
- **Monitoring Tools**: Connect with Splunk, ELK Stack, etc.
- **Database Connections**: Monitor PostgreSQL, MySQL, MongoDB

### 8. Starter Guide
## 🤖 AI Assistant (Chat)

- Floating chat button at bottom-right of the Dashboard
- Header background #56a3d9 (white text), scrollable messages area
- Input with Send button; animations: slide-in (window), fade-in (messages)
- Message bubbles: user (#56a3d9, white), AI (#f1f1f1, dark)

- **Interactive Assessment**: Step-by-step security evaluation
- **Best Practices**: Security recommendations
- **Implementation Guide**: How-to guides for security measures
- **Checklist**: Security implementation checklist

## 👤 User Management

### User Dashboard
Access your personal dashboard by clicking on your profile in the sidebar:

- **Profile Information**: View and edit your personal details
- **Account Settings**: Change password and email
- **Permissions**: View your access permissions
- **Activity History**: Track your recent activities

### Admin Panel (Admin Users Only)
Administrators have access to additional features:

- **User Management**: Create, edit, and delete users
- **Role Assignment**: Assign roles and permissions
- **Access Control**: Manage access to different sections
- **System Settings**: Configure system-wide settings

## 🔐 Security Features

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Password Security**: Encrypted password storage
- **Session Management**: Secure session handling
- **Multi-factor Authentication**: Enhanced security (coming soon)

### Authorization
- **Role-based Access**: Different access levels for different roles
- **Permission System**: Granular permission control
- **Resource Protection**: Secure access to sensitive data
- **Audit Logging**: Track all user activities

## 🌍 Multi-language Support

DefendSphere supports three languages:

- **English (EN)**: Default language
- **Русский (RU)**: Russian language support
- **Español (ES)**: Spanish language support

Switch languages using the language selector in the top-right corner or in the sidebar.

## 📱 Mobile Support

DefendSphere is fully responsive and works on:

- **Desktop Computers**: Full feature access
- **Tablets**: Optimized interface for tablet use
- **Mobile Phones**: Mobile-friendly interface
- **Touch Devices**: Touch-optimized controls

## 🔧 Troubleshooting

### Common Issues

1. **Login Problems**
   - Verify your username and password
   - Check if your account is active
   - Contact your administrator if issues persist

2. **Access Denied**
   - Ensure you have the required permissions
   - Check with your administrator about access rights
   - Verify your role assignments

3. **Page Loading Issues**
   - Check your internet connection
   - Clear browser cache and cookies
   - Try refreshing the page

4. **Language Issues**
   - Use the language switcher to change languages
   - Refresh the page after changing language
   - Check browser language settings

### Getting Help

- **Documentation**: Check the wiki and documentation
- **Support Team**: Contact your IT support team
- **Administrator**: Reach out to your system administrator
- **Issues**: Report bugs through the issue tracking system

## 📚 Additional Resources

- **API Documentation**: [API Guide](API_GUIDE.md)
- **Admin Guide**: [Administrator Guide](ADMIN_GUIDE.md)
- **Installation Guide**: [Installation Instructions](INSTALLATION.md)
- **Troubleshooting**: [Troubleshooting Guide](TROUBLESHOOTING.md)

## 🔄 Updates and Maintenance

- **Regular Updates**: The system is regularly updated with new features
- **Security Patches**: Security updates are applied automatically
- **Maintenance Windows**: Scheduled maintenance is announced in advance
- **Version History**: Check the changelog for recent updates

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Support**: DefendSphere Team

## Admin Panel

- Purpose: User management and system administration
- Access: Admin only
- Capabilities:
  - Create users (login, name, email, organization [required], role/position, phone, permissions)
  - Edit users (email, role/position, permissions)
  - Delete users
  - Validate unique login and required organization
- Permissions mapping to Sidebar sections
- Organization role: users of same organization share access to Reports, Compliance, Assets, Suppliers

## User Dashboard

- Purpose: Personal profile and settings
- Access: All authenticated users
- Fields shown:
  - Full name
  - Email
  - Organization (read-only)
  - Role/position
  - Phone
- Editing rules:
  - Organization is not editable by user
  - Other fields are editable

## Sidebar Access Rules

- Admin Panel: admin only
- User Dashboard: all users
- Sections visible based on user permissions and organization policy

## Visualizations for Company LLD

For deployments that host organization-specific PNGs, the dashboard will reference static images at:

- `/reports/organizations/CompanyLLDL/total_security_health.png`
- `/reports/organizations/CompanyLLDL/high_problems.png`
- `/reports/organizations/CompanyLLDL/critical_problems.png`
- `/reports/organizations/CompanyLLDL/medium_problems.png`
- `/reports/organizations/CompanyLLDL/low_problems.png`
- `/reports/organizations/CompanyLLDL/Vulsecheal.png`

Place these files on the target host; they are not stored in the repository.

## Profile Update Endpoint

User profile updates are performed via `PUT /api/users/profile` with JSON body:

```
{
  "email": "new@example.com",
  "currentPassword": "optional-current",
  "newPassword": "optional-new"
}
```

## Navigation Cleanup

The Incidents/Alerts sections are not part of the current UI and were removed from navigation and tests.