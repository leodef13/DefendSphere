# Dashboard Overview

The DefendSphere dashboard provides a comprehensive view of your organization's cybersecurity posture and compliance status.

## 🏠 Main Dashboard

### Security Health Overview

The main dashboard displays key security metrics:

- **Total Security Health**: 75% (circular chart)
- **Status**: "Need Attention"
- **Last Scan**: 2 days ago

### Asset Monitoring

Real-time monitoring of your IT assets:

- **Assets Monitoring**: 124 total assets
- **Critical Problems**: 5 issues requiring immediate attention
- **High Problems**: 12 issues with high priority
- **Medium Problems**: 28 issues with medium priority
- **Low Problems**: 43 issues with low priority

### Health Trends

Historical view of security health over time:

- **August 1, 2025**: 60% health
- **August 10, 2025**: 40% health
- **August 20, 2025**: 55% health
- **August 30, 2025**: 15% health

### Criticality Levels

Visual breakdown by security elements:

- **Assets**: Green (20), Yellow (10), Red (5)
- **Compliance**: Green (15), Yellow (15), Red (10)
- **Suppliers**: Green (20), Yellow (10), Red (5)

## 🧭 Navigation

### Sidebar Navigation

The left sidebar shows a fixed sequence of sections (only these):

1. **🏠 Home**
2. **📊 Starter Guide**
3. **💻 Assets**
4. **📈 Reports**
5. **✅ Compliance**
6. **🤝 Customer Trust**
7. **🏭 Suppliers**
8. **🔗 Integrations** (Admin only)

Rules:
- Sections are hidden if the user lacks permission, but the overall order is preserved
- Integrations is visible only for Admin
- No other sections (Incidents, Alerts, etc.) are displayed in the sidebar

### User Profile (Bottom Left)

Your user profile displays:

- **Initials**: In a colored circle (e.g., "JS" for "Jon Smith")
- **Username**: Your login name (e.g., "Jon")
- **Role**: Your assigned role (e.g., "user" or "admin")

## 📊 Dashboard Sections

### 1. Assets Management

**Purpose**: Track and manage IT assets

**Key Features**:
- Asset inventory management
- Security scanning and assessment
- Compliance tracking per asset
- Risk level monitoring
- Environment categorization (Production, Staging, Development, Test)

**Asset Types**:
- Servers
- Cloud Resources
- Network Devices
- Applications
- Databases
- IoT Devices
- Other

### 2. Compliance Management

**Purpose**: Monitor regulatory compliance

**Supported Standards**:
- GDPR (General Data Protection Regulation)
- NIS2 (Network and Information Systems Directive)
- ISO 27001 (Information Security Management)
- SOC2 (Service Organization Control)
- PCI DSS (Payment Card Industry Data Security Standard)
- DORA (Digital Operational Resilience Act)

**Compliance Status**:
- ✅ Compliant
- ⚠️ Partial
- ❌ Non-Compliant
- ❓ Not Assessed

### 3. Customer Trust

**Purpose**: Manage client and partner relationships

**Categories**:
- **Client**: Direct customers
- **Partner**: Business partners

**Sectors**:
- Healthcare
- Pharmaceutical
- Motor Industry
- Oil Industry
- Construction
- Engineering
- Financial Services

### 4. Suppliers Management

**Purpose**: Monitor third-party suppliers

**Supplier Types**:
- Software Suppliers
- Hardware Suppliers
- Service Suppliers (including cloud)
- Administrative/Economic Materials and Services

**Access Levels**:
- With Access to Infrastructure/Data
- No Access (Basic Services)

### 5. Reports & Analytics

**Purpose**: Generate comprehensive security reports

**Report Types**:
- Security Assessment
- Compliance Audit
- Vulnerability Scan
- Incident Report
- Other

**Export Formats**:
- PDF
- Excel

### 6. Starter Guide

**Purpose**: Interactive security assessment

**Features**:
- 14-question questionnaire
- Sector-specific analysis
- Compliance mapping
- Personalized recommendations
- Exportable results

## 🤖 AI Assistant

### Accessing the Assistant

The AI Assistant is available as a floating chat widget in the bottom-right corner of the dashboard.

### Features

- **Natural Language Processing**: Ask questions in plain English
- **Security Guidance**: Get recommendations on security best practices
- **Information Search**: Search for specific security standards or procedures
- **Contextual Help**: Get help specific to your current page or task

### Example Queries

- "How do I add a new asset?"
- "What is GDPR compliance?"
- "Show me my compliance status"
- "How do I generate a security report?"

## 🎨 User Interface

### Design Principles

- **Clean and Modern**: Minimalist design with focus on functionality
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Accessible**: WCAG 2.1 AA compliant
- **Consistent**: Uniform design language across all sections

### Color Coding

- **Green**: Good status, compliant, low risk
- **Yellow**: Warning, partial compliance, medium risk
- **Red**: Critical, non-compliant, high risk
- **Gray**: Not assessed, unknown status

### Interactive Elements

- **Hover Effects**: Visual feedback on interactive elements
- **Loading States**: Clear indication of processing
- **Error Handling**: User-friendly error messages
- **Success Feedback**: Confirmation of successful actions

## 🔧 Customization

### Dashboard Layout

- **Collapsible Sidebar**: Hide/show navigation for more screen space
- **Resizable Panels**: Adjust panel sizes to your preference
- **Theme Selection**: Light or dark theme options
- **Language Selection**: Switch between English, Russian, and Spanish

### User Preferences

- **Notification Settings**: Configure alert preferences
- **Default Views**: Set preferred default sections
- **Export Settings**: Configure default export formats
- **Display Options**: Adjust chart types and data density

## 📱 Mobile Experience

The dashboard is fully responsive and optimized for mobile devices:

- **Touch-Friendly**: Large touch targets for mobile interaction
- **Swipe Navigation**: Swipe gestures for navigation
- **Mobile Menu**: Collapsible navigation for small screens
- **Optimized Charts**: Charts adapt to mobile screen sizes

## 🔍 Search and Filtering

### Global Search

Use the search functionality to quickly find:
- Assets by name or IP
- Compliance records by standard
- Reports by type or date
- Users by name or role

### Advanced Filtering

Each section includes advanced filtering options:
- **Date Ranges**: Filter by specific time periods
- **Status Filters**: Filter by compliance or risk status
- **Category Filters**: Filter by asset type or department
- **Custom Filters**: Create custom filter combinations

## 📊 Data Visualization

### Chart Types

- **Circular Progress**: Security health and compliance percentages
- **Bar Charts**: Comparative data across categories
- **Line Charts**: Trends over time
- **Pie Charts**: Distribution of statuses or categories

### Interactive Features

- **Drill-Down**: Click charts to see detailed information
- **Tooltips**: Hover for additional context
- **Zoom**: Zoom in on specific time periods
- **Export**: Export charts as images or data

## Admin vs User Views

- Admin users see aggregated data across all organizations on Home and in Admin Panel.
- Regular users see only data for their own organizations (User Dashboard and other views).

---

**Version**: 1.0.0  
**Last Updated**: September 2025  
**Author**: DefendSphere Team "DefendSphere — Secure Smarter, Comply Faster"