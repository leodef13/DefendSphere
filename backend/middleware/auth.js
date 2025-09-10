import jwt from 'jsonwebtoken'
import { createClient } from 'redis'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380'

const redis = createClient({ url: REDIS_URL })
redis.on('error', (e) => console.error('Redis error:', e))
await redis.connect()

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  console.log('Auth middleware - token present:', !!token)

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    console.log('Token decoded:', { userId: decoded.userId, username: decoded.username })
    
    let user = null;
    let useFallback = false;

    try {
      // Try both possible Redis keys
      user = await redis.hGetAll(`user:${decoded.username}`)
      if (!user.username) {
        user = await redis.hGetAll(`user:${decoded.userId}`)
      }
      if (!user.username) {
        useFallback = true;
      }
    } catch (redisError) {
      console.log('Redis not available in auth middleware, using fallback')
      useFallback = true;
    }

    if (useFallback) {
      // Fallback to file-based authentication
      try {
        const fs = await import('fs');
        const path = await import('path');
        const dataDir = path.join(process.cwd(), 'data');
        const usersFile = path.join(dataDir, 'users.json');
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        user = users.find(u => u.username === decoded.username);
        
        if (!user) {
          return res.status(401).json({ message: 'User not found' })
        }
      } catch (fallbackError) {
        console.error('Fallback auth error:', fallbackError);
        return res.status(500).json({ message: 'Authentication service unavailable' })
      }
    }
    
    if (!user || !user.username) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: Array.isArray(user.permissions) ? user.permissions : (user.permissions ? JSON.parse(user.permissions) : []),
      organizations: Array.isArray(user.organizations) ? user.organizations : (user.organizations ? JSON.parse(user.organizations) : (user.organization ? [user.organization] : []))
    }
    
    console.log('User authenticated:', { username: req.user.username, organizations: req.user.organizations })
    next()
  } catch (error) {
    console.error('Token verification error:', error)
    return res.status(403).json({ message: 'Invalid token' })
  }
}

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (req.user.role === 'admin' || req.user.permissions.includes('all')) {
      return next()
    }
    
    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({ message: `Permission '${permission}' required` })
    }
    
    next()
  }
}