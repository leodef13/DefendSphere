# Installation (Defend branch)

This guide will help you install and run DefendSphere on your system.

## Requirements

- Docker & Docker Compose
- Node.js 18+

## Quick Start

```bash
docker compose up -d
```

Then open:
- Backend health: `http://localhost:5000/api/health`
- Frontend: `http://localhost:3000`
- MinIO Console: `http://localhost:9001` (minioadmin/minioadmin)

## Services

- redis:6380 (host 6380)
- postgres:5432
- minio:9000 (console 9001)
- backend:5000
- frontend:3000

## Backend env (.env)

```env
REDIS_URL=redis://redis:6380
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/defendsphere?schema=public
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=reports
JWT_SECRET=change-me
```

## Notes

- For local Redis only you can run: `sudo docker run -d -p 6380:6380 redis:alpine redis-server --port 6380`
- Health endpoint returns Redis ping result.
- Prisma is configured to use PostgreSQL; run migrations and seed as needed.

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