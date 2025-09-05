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

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await redis.hGetAll(`user:${decoded.username}`)
    
    if (!user.username) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions ? JSON.parse(user.permissions) : []
    }
    next()
  } catch (error) {
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