# Quick Start Guide

This guide will help you get DefendSphere up and running quickly.

## 🚀 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **Redis** 6.0 or higher
- **Docker** (optional, for containerized deployment)
- **Git** (for cloning the repository)

## 📦 Installation Methods

### Method 1: Docker (Recommended)

The easiest way to get started is using Docker:

```bash
# Clone the repository
git clone https://github.com/leodef13/DefendSphere.git
cd DefendSphere

# Build and start all services
make build
make up

# Check if services are running
docker ps
```

### Method 2: Manual Installation

If you prefer to install manually:

```bash
# Clone the repository
git clone https://github.com/leodef13/DefendSphere.git
cd DefendSphere

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Start Redis (if not already running)
docker run -d -p 6380:6380 redis:alpine redis-server --port 6380
# OR install Redis locally and run: redis-server

# Start the backend server
npm start

# In a new terminal, start the frontend
cd frontend
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
REDIS_URL=redis://localhost:6380
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=DefendSphere
```

## 🎯 First Login

1. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

2. **Default User Accounts**
   - **Admin**: `admin` / `admin`
   - **User 1**: `user1` / `user1`
   - **User 2**: `user2` / `user2`

3. **Login Process**
   - Navigate to the login page
   - Enter your credentials
   - Click "Sign In"

## 🏠 Dashboard Overview

After logging in, you'll see the main dashboard with:

- **Security Health**: Overall system security status
- **Asset Monitoring**: Real-time asset status (124 assets)
- **Problem Tracking**: Critical (5), High (12), Medium (28), Low (43) issues
- **Health Trends**: Historical security health over time
- **Criticality Levels**: Visual breakdown by elements

## 🔍 Key Features to Explore

### 1. Assets Management
- Navigate to **Assets** in the sidebar
- View and manage IT assets
- Add new assets
- Run security scans

### 2. Compliance Tracking
- Go to **Compliance** section
- Track regulatory compliance
- View compliance status
- Generate compliance reports

### 3. AI Assistant
- Click the chat icon in the bottom-right corner
- Ask questions about security
- Get recommendations
- Search for information

### 4. Reports
- Visit the **Reports** section
- Generate security reports
- Export data in PDF/Excel format
- View analytics

## 🌍 Language Settings

DefendSphere supports multiple languages:

1. Click on your profile in the bottom-left corner
2. Go to **Settings**
3. Select your preferred language:
   - English (en)
   - Russian (ru)
   - Spanish (es)

## 🛠️ Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Kill process using port 5173
lsof -ti:5173 | xargs kill -9
```

**Redis Connection Issues**
```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG
```

**Frontend Build Issues**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

If you encounter issues:

1. Check the [Common Issues](common-issues.md) page
2. Review the [Troubleshooting Guide](troubleshooting.md)
3. Search [GitHub Issues](https://github.com/leodef13/DefendSphere/issues)
4. Create a new issue with details about your problem

## 📚 Next Steps

Now that you have DefendSphere running:

1. **Explore the Dashboard**: Familiarize yourself with the interface
2. **Configure Settings**: Set up your preferences and language
3. **Add Assets**: Start managing your IT assets
4. **Set Up Compliance**: Configure compliance standards
5. **Read the Full Documentation**: Explore other wiki pages

## 🔗 Additional Resources

- [Installation Guide](installation.md) - Detailed installation instructions
- [Configuration Guide](configuration.md) - Advanced configuration options
- [User Manual](user-management.md) - Complete user documentation
- [API Reference](api-reference.md) - API documentation
- [Security Best Practices](security-best-practices.md) - Security guidelines

---

**Version**: 1.0.0  
**Last Updated**: September 2025  
**Author**: DefendSphere Team "DefendSphere — Secure Smarter, Comply Faster"