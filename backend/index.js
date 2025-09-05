import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import https from 'https'
import fs from 'fs'
import { createClient } from 'redis'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import assistantRoutes from './routes/assistant.js'
import starterGuideRoutes from './routes/starter-guide.js'
import customerTrustRoutes from './routes/customer-trust.js'
import assetsRoutes from './routes/assets.js'
import complianceRoutes from './routes/compliance.js'
import integrationsRoutes from './routes/integrations.js'
import reportsRoutes from './routes/reports.js'
import { authenticateToken, requireAdmin, requirePermission } from './middleware/auth.js'

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())
app.use(morgan('dev'))

const PORT = process.env.PORT || 5000
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

const redis = createClient({ url: REDIS_URL })
redis.on('error', (e) => console.error('Redis error:', e))
await redis.connect()

// Middleware to check admin role (local version for compatibility)
const requireAdminLocal = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

// Health check endpoint
app.get('/api/health', async (_req, res) => {
  const pong = await redis.ping().catch(() => 'ERR')
  res.json({ ok: true, redis: pong })
})

// Authentication endpoints
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    // Check if user already exists
    const existingUser = await redis.hGetAll(`user:${username}`)
    if (existingUser.username) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const userId = Date.now().toString()
    const user = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      role: 'user',
      permissions: JSON.stringify(['access.dashboard', 'access.reports']),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }

    await redis.hSet(`user:${username}`, user)
    await redis.sAdd('users', username)

    // Generate token
    const token = jwt.sign({ userId, username }, JWT_SECRET, { expiresIn: '24h' })

    // Remove password from response
    delete user.password

    res.status(201).json({
      token,
      user: {
        ...user,
        permissions: JSON.parse(user.permissions)
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    // Get user from Redis
    const user = await redis.hGetAll(`user:${username}`)
    if (!user.username) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Update last login
    await redis.hSet(`user:${username}`, 'lastLogin', new Date().toISOString())

    // Generate token
    const token = jwt.sign({ userId: user.id, username }, JWT_SECRET, { expiresIn: '24h' })

    // Remove password from response
    delete user.password

    res.json({
      token,
      user: {
        ...user,
        permissions: JSON.parse(user.permissions)
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await redis.hGetAll(`user:${req.user.username}`)
    if (!user.username) {
      return res.status(404).json({ message: 'User not found' })
    }

    delete user.password
    res.json({
      user: {
        ...user,
        permissions: JSON.parse(user.permissions)
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// User management endpoints (admin only)
app.get('/api/admin/users', authenticateToken, requireAdminLocal, async (req, res) => {
  try {
    const usernames = await redis.sMembers('users')
    const users = []

    for (const username of usernames) {
      const user = await redis.hGetAll(`user:${username}`)
      if (user.username) {
        delete user.password
        users.push({
          ...user,
          permissions: JSON.parse(user.permissions)
        })
      }
    }

    res.json({ users })
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.post('/api/admin/users', authenticateToken, requireAdminLocal, async (req, res) => {
  try {
    const { username, email, password, role, permissions } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' })
    }

    // Check if user already exists
    const existingUser = await redis.hGetAll(`user:${username}`)
    if (existingUser.username) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const userId = Date.now().toString()
    const user = {
      id: userId,
      username,
      email,
      password: hashedPassword,
      role: role || 'user',
      permissions: JSON.stringify(permissions || ['access.dashboard']),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }

    await redis.hSet(`user:${username}`, user)
    await redis.sAdd('users', username)

    delete user.password
    res.status(201).json({
      user: {
        ...user,
        permissions: JSON.parse(user.permissions)
      }
    })
  } catch (error) {
    console.error('Create user error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.put('/api/admin/users/:username', authenticateToken, requireAdminLocal, async (req, res) => {
  try {
    const { username } = req.params
    const { email, role, permissions, status } = req.body

    const user = await redis.hGetAll(`user:${username}`)
    if (!user.username) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update user fields
    const updates = {}
    if (email) updates.email = email
    if (role) updates.role = role
    if (permissions) updates.permissions = JSON.stringify(permissions)
    if (status) updates.status = status

    await redis.hSet(`user:${username}`, updates)

    // Get updated user
    const updatedUser = await redis.hGetAll(`user:${username}`)
    delete updatedUser.password

    res.json({
      user: {
        ...updatedUser,
        permissions: JSON.parse(updatedUser.permissions)
      }
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.delete('/api/admin/users/:username', authenticateToken, requireAdminLocal, async (req, res) => {
  try {
    const { username } = req.params

    const user = await redis.hGetAll(`user:${username}`)
    if (!user.username) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin users' })
    }

    await redis.del(`user:${username}`)
    await redis.sRem('users', username)

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Profile update endpoint
app.put('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const { username, email, currentPassword, newPassword } = req.body
    const user = await redis.hGetAll(`user:${req.user.username}`)

    if (!user.username) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Verify current password if changing password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required' })
      }

      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Current password is incorrect' })
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await redis.hSet(`user:${req.user.username}`, 'password', hashedPassword)
    }

    // Update other fields
    const updates = {}
    if (username && username !== req.user.username) {
      // Check if new username already exists
      const existingUser = await redis.hGetAll(`user:${username}`)
      if (existingUser.username) {
        return res.status(400).json({ message: 'Username already exists' })
      }
      updates.username = username
    }
    if (email) updates.email = email

    if (Object.keys(updates).length > 0) {
      await redis.hSet(`user:${req.user.username}`, updates)
    }

    res.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Initialize default users if they don't exist
async function initializeDefaultUsers() {
  try {
    const adminExists = await redis.hGetAll('user:admin')
    if (!adminExists.username) {
      const hashedPassword = await bcrypt.hash('admin', 10)
      const adminUser = {
        id: '1',
        username: 'admin',
        email: 'admin@defendsphere.com',
        password: hashedPassword,
        role: 'admin',
        permissions: JSON.stringify(['all']),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      await redis.hSet('user:admin', adminUser)
      await redis.sAdd('users', 'admin')
      console.log('Admin user created')
    }

    const user1Exists = await redis.hGetAll('user:user1')
    if (!user1Exists.username) {
      const hashedPassword = await bcrypt.hash('user1', 10)
      const user1 = {
        id: '2',
        username: 'user1',
        email: 'user1@defendsphere.com',
        password: hashedPassword,
        role: 'user',
        permissions: JSON.stringify(['access.dashboard', 'access.incidents', 'access.alerts']),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      await redis.hSet('user:user1', user1)
      await redis.sAdd('users', 'user1')
      console.log('User1 created')
    }

    const user2Exists = await redis.hGetAll('user:user2')
    if (!user2Exists.username) {
      const hashedPassword = await bcrypt.hash('user2', 10)
      const user2 = {
        id: '3',
        username: 'user2',
        email: 'user2@defendsphere.com',
        password: hashedPassword,
        role: 'user',
        permissions: JSON.stringify(['access.dashboard', 'access.reports']),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      await redis.hSet('user:user2', user2)
      await redis.sAdd('users', 'user2')
      console.log('User2 created')
    }
  } catch (error) {
    console.error('Error initializing default users:', error)
  }
}

// Initialize default users on startup
await initializeDefaultUsers()

// Подключаем маршруты
app.use('/api/assistant', assistantRoutes);
app.use('/api/starter-guide', starterGuideRoutes);
app.use('/api/customer-trust', customerTrustRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/reports', reportsRoutes);

// Start server with HTTPS if configured
const HTTPS_ENABLED = process.env.HTTPS === 'true'
const SSL_KEY_PATH = process.env.SSL_KEY_PATH || './certs/private-key.pem'
const SSL_CERT_PATH = process.env.SSL_CERT_PATH || './certs/certificate.pem'

if (HTTPS_ENABLED) {
  try {
    const options = {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH)
    }
    
    https.createServer(options, app).listen(PORT, () => {
      console.log(`🔐 HTTPS API server running on https://0.0.0.0:${PORT}`)
      console.log('Default users:')
      console.log('- admin/admin (Super Admin)')
      console.log('- user1/user1 (Security Analyst)')
      console.log('- user2/user2 (Standard User)')
    })
  } catch (error) {
    console.error('❌ Failed to start HTTPS server:', error.message)
    console.log('🔄 Falling back to HTTP server...')
    
    app.listen(PORT, () => {
      console.log(`🌐 HTTP API server running on http://0.0.0.0:${PORT}`)
      console.log('Default users:')
      console.log('- admin/admin (Super Admin)')
      console.log('- user1/user1 (Security Analyst)')
      console.log('- user2/user2 (Standard User)')
    })
  }
} else {
  app.listen(PORT, () => {
    console.log(`🌐 HTTP API server running on http://0.0.0.0:${PORT}`)
    console.log('Default users:')
    console.log('- admin/admin (Super Admin)')
    console.log('- user1/user1 (Security Analyst)')
    console.log('- user2/user2 (Standard User)')
  })
}
