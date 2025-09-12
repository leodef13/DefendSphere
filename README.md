# DefendSphere Dashboard

**DefendSphere — Secure Smarter, Comply Faster**

A comprehensive cybersecurity dashboard and compliance management platform.

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose (recommended)
- Node.js 18+ (for manual/local development)
- Git

### Installation (Docker Compose - recommended)
```bash
# Clone repository
git clone https://github.com/leodef13/DefendSphere.git
cd DefendSphere

# Start all services
docker compose up -d

# Check backend health
curl http://localhost:5000/api/health
```

### Installation (Manual / local)
```bash
# Clone repository
git clone https://github.com/leodef13/DefendSphere.git
cd DefendSphere

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Initialize Redis with default users
cd backend && npm run init-redis

# Start Redis server
redis-server

# Start backend (in one terminal)
cd backend && npm start

# Start frontend (in another terminal)
cd frontend && npm run dev
```

### Access URLs
- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:5000
- **Admin Panel**: http://localhost:3001/admin

### Default Users
- **admin/admin** - Full administrative access
- **user1/user1** - Security Analyst (Dashboard, Assets, Incidents, Alerts)
- **user2/user2** - Standard User (Dashboard, Reports, Assets, Suppliers)

## 🌍 Language / Язык / Idioma

Choose your preferred language:

### 🇺🇸 English
- [**README.en.md**](README.en.md) - Complete English documentation
- [**Wiki Documentation**](wiki/en/) - English wiki
- [**API Documentation**](docs/en/) - English API docs

### 🇷🇺 Русский
- [**README.ru.md**](README.ru.md) - Полная русская документация
- [**Wiki Документация**](wiki/ru/) - Русская wiki
- [**API Документация**](docs/ru/) - Русская API документация

### 🇪🇸 Español
- [**README.es.md**](README.es.md) - Documentación completa en español
- [**Documentación Wiki**](wiki/es/) - Wiki en español
- [**Documentación API**](docs/es/) - Documentación API en español

---

## 🚀 Quick Start / Быстрый старт / Inicio Rápido

### Docker Deployment
```bash
# Build and start all services
make build
make up

# Stop services
make down
```

### Manual Installation
```bash
# Clone repository
git clone https://github.com/leodef13/DefendSphere.git
cd DefendSphere

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Start Redis
docker run -d -p 6380:6380 redis:alpine redis-server --port 6380

# Start application
# Backend: npm start (from backend directory)
# Frontend: npm run dev (from frontend directory)
```

**📖 For detailed installation instructions, see [INSTALLATION.md](INSTALLATION.md)**

## 🌟 Key Features

- **🔒 Real-time Security Monitoring** - Live threat detection and system health
- **📊 Interactive Dashboard** - Custom charts and comprehensive metrics
- **🌍 Multi-language Support** - English, Russian, Spanish
- **🤖 AI-Powered Assistant** - Intelligent security guidance
- **📋 Compliance Management** - GDPR, NIS2, ISO 27001, SOC2, PCI DSS, DORA
- **🏢 Asset Management** - IT assets, servers, cloud resources, IoT devices
- **👥 Customer Trust** - Client and partner relationship management
- **🏭 Supplier Management** - Third-party supplier monitoring
- **🔌 Integrations** - SIEM, Cloud services, Monitoring tools
- **📈 Reports & Analytics** - Comprehensive security reports
- **📝 Starter Guide** - Interactive security assessment
- **👤 User Management** - Role-based access control and admin panel
- **🔐 Advanced Security** - JWT authentication, HTTPS support, audit logging

## 🏗️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express.js, Redis, PostgreSQL (Prisma), MinIO (S3), BullMQ (Redis)
- **Authentication**: JWT tokens
- **Security**: Helmet, CORS, Rate limiting
- **Charts**: Custom SVG + Recharts
- **Icons**: Lucide React

### Containers and Ports
- **redis**: 6380 (host 6380)
- **postgres**: 5432 (exposed internally; optional host port 55555)
- **minio**: 9000 (S3) and 9001 (console)
- **backend**: 5000
- **frontend**: 3001

### Backend Environment (Docker)
Key variables used by the backend container:
```
REDIS_URL=redis://redis:6380
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/defendsphere?schema=public
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=reports
JWT_SECRET=change-me
```

## 📊 Dashboard Sections

1. **Home** - Security health overview and metrics
2. **Assets** - IT asset management and monitoring
3. **Compliance** - Regulatory compliance tracking
4. **Customer Trust** - Client relationship management
5. **Suppliers** - Third-party supplier monitoring
6. **Reports** - Security reports and analytics
7. **Integrations** - SIEM, Cloud services, and monitoring tools
8. **Starter Guide** - Interactive security assessment
9. **Admin Panel** - User management and system administration
10. **User Dashboard** - Personal profile and settings

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (Admin/User)
- Granular permission system
- Input validation and sanitization
- Rate limiting and CORS protection
- HTTPS support for production
- Comprehensive audit logging
- Password security with bcrypt
- SQL injection protection
- XSS prevention

## 📚 Documentation

- **[User Guide](docs/USER_GUIDE.md)** - Complete user manual
- **[Admin Guide](docs/ADMIN_GUIDE.md)** - Administrator documentation
- **[API Guide](docs/API_GUIDE.md)** - Complete API reference
- **[Installation Guide](INSTALLATION.md)** - Setup and deployment
- **[Implementation Checklist](docs/IMPLEMENTATION_CHECKLIST.md)** - Feature completion status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and documentation
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/leodef13/DefendSphere/issues)
- **Discussions**: [GitHub Discussions](https://github.com/leodef13/DefendSphere/discussions)
- **Wiki**: [Wiki Documentation](wiki/)

---

**Version**: 1.0.0  
**Last Updated**: September 2025  
**Author**: DefendSphere Team "DefendSphere — Secure Smarter, Comply Faster"
