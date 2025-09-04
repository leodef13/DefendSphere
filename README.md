# DefendSphere Dashboard

**DefendSphere — Secure Smarter, Comply Faster**

A comprehensive cybersecurity dashboard and compliance management platform.

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
docker run -d -p 6379:6379 redis:alpine

# Start application
# Backend: npm start (from backend directory)
# Frontend: npm run dev (from frontend directory)
```

## 🌟 Key Features

- **🔒 Real-time Security Monitoring** - Live threat detection and system health
- **📊 Interactive Dashboard** - Custom charts and comprehensive metrics
- **🌍 Multi-language Support** - English, Russian, Spanish
- **🤖 AI-Powered Assistant** - Intelligent security guidance
- **📋 Compliance Management** - GDPR, NIS2, ISO 27001, SOC2, PCI DSS, DORA
- **🏢 Asset Management** - IT assets, servers, cloud resources, IoT devices
- **👥 Customer Trust** - Client and partner relationship management
- **🏭 Supplier Management** - Third-party supplier monitoring
- **📈 Reports & Analytics** - Comprehensive security reports
- **📝 Starter Guide** - Interactive security assessment

## 🏗️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express.js, Redis
- **Authentication**: JWT tokens
- **Security**: Helmet, CORS, Rate limiting
- **Charts**: Custom SVG + Recharts
- **Icons**: Lucide React

## 📊 Dashboard Sections

1. **Home** - Security health overview and metrics
2. **Assets** - IT asset management and monitoring
3. **Compliance** - Regulatory compliance tracking
4. **Customer Trust** - Client relationship management
5. **Suppliers** - Third-party supplier monitoring
6. **Reports** - Security reports and analytics
7. **Starter Guide** - Interactive security assessment

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (Admin/User)
- Input validation and sanitization
- Rate limiting and CORS protection
- Comprehensive audit logging
- Password security with bcrypt

## 📚 Documentation

- **Main Documentation**: See language-specific README files above
- **Wiki**: Comprehensive guides and tutorials
- **API Documentation**: Complete API reference
- **Development Guide**: Setup and contribution guidelines

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