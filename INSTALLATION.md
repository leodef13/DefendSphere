# DefendSphere Installation Guide

This guide will help you install and run DefendSphere on your system.

## 🚀 Quick Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **Redis** 6.0 or higher  
- **Docker** (optional, for containerized deployment)
- **Git** (for cloning the repository)

### Method 1: Docker Installation (Recommended)

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

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

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
docker run -d -p 6379:6379 redis:alpine
# OR install Redis locally and run: redis-server

# Start the backend server
cd backend
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
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=DefendSphere
```

## 🎯 First Login

After installation, you can log in with these default accounts:

- **Admin**: `admin` / `admin`
- **User 1**: `user1` / `user1`  
- **User 2**: `user2` / `user2`

## 📁 Project Structure

After cloning, your DefendSphere directory should contain:

```
DefendSphere/
├── frontend/                 # React frontend application
│   ├── src/                 # Source code
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── layouts/            # Layout components
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend application
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── index.js            # Main server file
│   └── package.json        # Backend dependencies
├── docs/                   # API documentation
│   ├── en/                 # English docs
│   ├── ru/                 # Russian docs
│   └── es/                 # Spanish docs
├── wiki/                   # Wiki documentation
│   ├── en/                 # English wiki
│   ├── ru/                 # Russian wiki
│   └── es/                 # Spanish wiki
├── README.md               # Main documentation
├── README.en.md            # English documentation
├── README.ru.md            # Russian documentation
├── README.es.md            # Spanish documentation
├── docker-compose.yml      # Docker configuration
├── Makefile               # Build commands
└── install.sh             # Installation script
```

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

**Missing Files After Clone**

If you only see README.md and .git after cloning:

```bash
# Make sure you're on the main branch
git branch

# If not on main, switch to it
git checkout main

# Pull latest changes
git pull origin main
```

## 🐳 Docker Commands

```bash
# Build all services
make build

# Start all services
make up

# Stop all services
make down

# View logs
docker-compose logs -f

# Rebuild and restart
make rebuild
```

## 📚 Next Steps

After successful installation:

1. **Explore the Dashboard**: Navigate to http://localhost:5173
2. **Read Documentation**: Check the [Wiki Documentation](wiki/)
3. **API Reference**: See [API Documentation](docs/)
4. **Configure Settings**: Set up your preferences
5. **Add Assets**: Start managing your IT assets

## 🆘 Getting Help

If you encounter issues:

1. Check the [Troubleshooting Guide](wiki/en/common-issues.md)
2. Review [GitHub Issues](https://github.com/leodef13/DefendSphere/issues)
3. Create a new issue with details about your problem
4. Join [GitHub Discussions](https://github.com/leodef13/DefendSphere/discussions)

## 🔗 Additional Resources

- [Quick Start Guide](wiki/en/quick-start.md)
- [User Manual](wiki/en/user-management.md)
- [API Documentation](docs/en/API.md)
- [Development Guide](wiki/en/frontend-development.md)
- [Security Best Practices](wiki/en/security-best-practices.md)

---

**Version**: 1.0.0  
**Last Updated**: September 2025  
**Author**: DefendSphere Team "DefendSphere — Secure Smarter, Comply Faster"