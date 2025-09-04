# DefendSphere Dashboard

**DefendSphere — Secure Smarter, Comply Faster**

A comprehensive cybersecurity dashboard and compliance management platform built with React, Node.js, and Redis.

## 🌟 Features

### Core Dashboard
- **Real-time Security Monitoring**: Live threat detection and system health monitoring
- **Interactive Charts**: Custom SVG charts for security metrics and compliance status
- **Multi-language Support**: English, Russian, and Spanish localization
- **Responsive Design**: Mobile-first approach with TailwindCSS

### Security Management
- **Assets Management**: Track and monitor IT assets, servers, cloud resources, and IoT devices
- **Compliance Tracking**: GDPR, NIS2, ISO 27001, SOC2, PCI DSS, and DORA compliance monitoring
- **Customer Trust**: Manage client and partner relationships with compliance tracking
- **Suppliers Management**: Monitor third-party suppliers and their security compliance

### Advanced Features
- **AI-Powered Assistant**: Intelligent security assistant with natural language processing
- **Starter Guide**: Interactive questionnaire for security assessment
- **Reports Generation**: Comprehensive security and compliance reports
- **Role-Based Access Control**: Admin and user roles with granular permissions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Redis 6+
- Docker (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/leodef13/DefendSphere.git
cd DefendSphere
```

2. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

3. **Start Redis**
```bash
# Using Docker
docker run -d -p 6380:6379 redis:alpine

# Or install Redis locally
redis-server
```

4. **Start the application**
```bash
# Backend (from backend directory)
npm start

# Frontend (from frontend directory)
npm run dev
```

### Docker Deployment

```bash
# Build and start all services
make build
make up

# Stop services
make down
```

## 🏗️ Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: Context API
- **Routing**: React Router v6
- **Charts**: Custom SVG + Recharts
- **Icons**: Lucide React

### Backend (Node.js + Express)
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: Redis (primary data store)
- **Authentication**: JWT tokens
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Express-validator

### Database (Redis)
- **User Management**: User accounts, roles, and permissions
- **Security Data**: Incidents, alerts, system metrics
- **Compliance**: Standards, assessments, reports
- **Assets**: IT assets, configurations, scans
- **Logs**: Audit trails and system logs

## 📊 Dashboard Sections

### 1. Home Dashboard
- **Security Health**: Overall system security status
- **Asset Monitoring**: Real-time asset status (124 assets)
- **Problem Tracking**: Critical (5), High (12), Medium (28), Low (43) issues
- **Health Trends**: Historical security health over time
- **Criticality Levels**: Visual breakdown by elements

### 2. Assets Management
- **Asset Types**: Servers, Cloud Resources, Network Devices, Applications, Databases, IoT
- **Environments**: Production, Staging, Development, Test
- **Compliance Standards**: GDPR, NIS2, ISO 27001, SOC2, PCI DSS
- **Risk Assessment**: High, Medium, Low, Not Assessed
- **Scanning**: Automated vulnerability scanning and assessment

### 3. Compliance Management
- **Standards**: GDPR, NIS2, ISO 27001, SOC2, PCI DSS, DORA
- **Status Tracking**: Compliant, Partial, Non-Compliant, Not Assessed
- **Departments**: IT, Security, Operations, Finance, Risk Management
- **Assessments**: Scheduled and ad-hoc compliance assessments
- **Reporting**: Comprehensive compliance reports and summaries

### 4. Customer Trust
- **Client Management**: Track client relationships and compliance
- **Partner Relations**: Monitor partner security standards
- **Sectors**: Healthcare, Pharmaceutical, Motor, Oil, Construction, Engineering, Financial
- **Standards**: NIS2, SOC v2, GDPR, DORA compliance tracking
- **Assessments**: Regular security and compliance evaluations

### 5. Suppliers Management
- **Supplier Types**: Software, Hardware, Services, Administrative
- **Access Levels**: Infrastructure/Data access, Basic services
- **Compliance Monitoring**: Regular supplier security assessments
- **Standards**: NIS2, SOC v2, GDPR, DORA compliance
- **Risk Management**: Supplier risk evaluation and mitigation

### 6. Reports & Analytics
- **Report Types**: Security Assessment, Compliance Audit, Vulnerability Scan, Incident Report
- **Export Formats**: PDF, Excel export with current filters
- **Analytics**: Comprehensive security metrics and trends
- **Scheduling**: Automated report generation
- **Distribution**: Role-based report access

### 7. Starter Guide
- **Interactive Questionnaire**: 14-question security assessment
- **Sector Analysis**: Industry-specific security requirements
- **Compliance Mapping**: Standards relevance assessment
- **Recommendations**: Personalized security recommendations
- **Export**: Assessment results and recommendations

## 🔐 Security Features

### Authentication & Authorization
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Admin and user roles with granular permissions
- **Session Management**: Secure session handling with Redis
- **Password Security**: bcrypt hashing with salt

### Data Protection
- **Input Validation**: Comprehensive input sanitization
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS Protection**: Cross-origin request security
- **Helmet Security**: HTTP security headers

### Audit & Logging
- **Audit Trails**: Complete user action logging
- **Security Events**: Incident and alert tracking
- **System Logs**: Application and system monitoring
- **Compliance Logs**: Regulatory compliance tracking

## 🌍 Internationalization

### Supported Languages
- **English (en)**: Default language
- **Russian (ru)**: Полная поддержка русского языка
- **Spanish (es)**: Soporte completo en español

### Language Features
- **Dynamic Switching**: Real-time language switching
- **Persistent Selection**: Language preference saved in localStorage
- **Complete Coverage**: All UI elements translated
- **Context-Aware**: Translations consider usage context

## 🛠️ Development

### Project Structure
```
DefendSphere/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── layouts/        # Layout components
│   │   └── types/          # TypeScript types
│   └── package.json
├── backend/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── utils/              # Utility functions
│   └── package.json
├── docs/                   # Documentation
│   ├── en/                 # English docs
│   ├── ru/                 # Russian docs
│   └── es/                 # Spanish docs
├── wiki/                   # Wiki documentation
│   ├── en/                 # English wiki
│   ├── ru/                 # Russian wiki
│   └── es/                 # Spanish wiki
└── README.md               # Main documentation
```

### API Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

#### Dashboard Data
- `GET /api/dashboard` - Dashboard metrics
- `GET /api/incidents` - Security incidents
- `GET /api/alerts` - Security alerts

#### Assets Management
- `GET /api/assets` - Get all assets
- `POST /api/assets` - Create new asset
- `PUT /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset
- `POST /api/assets/:id/scan` - Scan asset

#### Compliance Management
- `GET /api/compliance` - Get compliance records
- `POST /api/compliance` - Create compliance record
- `PUT /api/compliance/:id` - Update compliance record
- `DELETE /api/compliance/:id` - Delete compliance record
- `GET /api/compliance/summary` - Get compliance summary

#### Customer Trust
- `GET /api/customer-trust` - Get customer trust records
- `POST /api/customer-trust` - Create customer trust record
- `PUT /api/customer-trust/:id` - Update customer trust record
- `DELETE /api/customer-trust/:id` - Delete customer trust record

#### Reports
- `GET /api/reports` - Get reports
- `POST /api/reports` - Create report
- `GET /api/reports/:id/export` - Export report

#### AI Assistant
- `POST /api/assistant` - Chat with AI assistant

### Environment Variables

#### Backend (.env)
```env
PORT=5000
REDIS_URL=redis://localhost:6380
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=DefendSphere
```

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm run test
npm run test:coverage
```

### Backend Testing
```bash
cd backend
npm test
npm run test:coverage
```

### Integration Testing
```bash
npm run test:integration
```

## 📦 Deployment

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm run build
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment Configuration
- Set production environment variables
- Configure Redis for production
- Set up SSL certificates
- Configure reverse proxy (nginx)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests
- Update documentation
- Follow the existing code style
- Add translations for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Wiki Documentation](wiki/)
- **Issues**: [GitHub Issues](https://github.com/leodef13/DefendSphere/issues)
- **Discussions**: [GitHub Discussions](https://github.com/leodef13/DefendSphere/discussions)

## 🔗 Links

- **Repository**: [DefendSphere on GitHub](https://github.com/leodef13/DefendSphere)
- **Live Demo**: [DefendSphere Demo](https://defendsphere-demo.com)
- **Documentation**: [Full Documentation](docs/)

---

**Version**: 1.0.0  
**Last Updated**: September 2025  
**Author**: DefendSphere Team "DefendSphere — Secure Smarter, Comply Faster"