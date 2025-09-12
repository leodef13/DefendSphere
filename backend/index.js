import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import morgan from 'morgan'
import https from 'https'
import fs from 'fs'
import { createClient } from 'redis'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import assistantRoutes from './routes/assistant.js'
import aiAssistantRoutes from './routes/ai-assistant.js'
import starterGuideRoutes from './routes/starter-guide.js'
import customerTrustRoutes from './routes/customer-trust.js'
import assetsRoutes from './routes/assets.js'
import assetsFallbackRoutes from './routes/assets-fallback.js'
import assetsDbRoutes from './routes/assets-db.js'
import complianceRoutes from './routes/compliance.js'
import integrationsRoutes from './routes/integrations.js'
import suppliersRoutes from './routes/suppliers.js'
import reportsRoutes from './routes/reports.js'
import uploadRoutes from './routes/upload.js'
import parseRoutes from './routes/parse.js'
import scanRoutes from './routes/scan.js'
import companiesRoutes from './routes/companies.js'
import authRefreshRoutes from './routes/auth-refresh.js'
import { authenticateToken, requireAdmin, requirePermission } from './middleware/auth.js'

const app = express()
app.use(helmet())
app.disable('x-powered-by')
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })
app.use(limiter)
// CORS setup: allow multiple origins via comma-separated CORS_ORIGIN, with sensible defaults
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://217.65.144.232:5173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))
// Handle preflight for all routes
app.options('*', cors(corsOptions))

// Explicit CORS headers middleware (belt-and-suspenders)
app.use((req, res, next) => {
  const origin = req.headers.origin
  const firstAllowed = allowedOrigins[0]
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || firstAllowed)
    res.header('Vary', 'Origin')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})
app.use(express.json())
app.use(morgan('dev'))

const PORT = process.env.PORT || 5000
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6380'
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
    const { username, password, login } = req.body
    const loginName = username || login

    console.log('Login attempt:', { username, login, loginName, hasPassword: !!password })

    if (!loginName || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    let user = null;
    let useFallback = false;

    try {
      // Try to get user from Redis first
      user = await redis.hGetAll(`user:${loginName}`)
      if (!user.username) {
        useFallback = true;
      }
    } catch (redisError) {
      console.log('Redis not available, using fallback:', redisError.message)
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
        user = users.find(u => u.username === loginName);
        
        if (!user) {
          return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Simple password check for fallback (in production, use proper hashing)
        if (user.password !== password) {
          return res.status(401).json({ message: 'Invalid credentials' })
        }

        console.log('Using fallback authentication for user:', loginName);
        console.log('User data from fallback:', JSON.stringify(user, null, 2));
      } catch (fallbackError) {
        console.error('Fallback authentication error:', fallbackError);
        return res.status(500).json({ message: 'Authentication service unavailable' })
      }
    } else {
      // Check password with bcrypt for Redis users
      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' })
      }
    }

    // Generate token
    const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' })

    // Remove password from response
    delete user.password

    const processedUser = {
      ...user,
      permissions: Array.isArray(user.permissions) ? user.permissions : JSON.parse(user.permissions || '[]'),
      organizations: Array.isArray(user.organizations) ? user.organizations : (user.organizations ? JSON.parse(user.organizations) : (user.organization ? [user.organization] : []))
    };

    console.log('Login successful for user:', loginName);
    console.log('Processed user data:', JSON.stringify(processedUser, null, 2));

    res.json({
      token,
      user: processedUser
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    let user = null;
    let useFallback = false;

    try {
      // Try to get user from Redis first
      user = await redis.hGetAll(`user:${req.user.username}`)
      if (!user.username) {
        useFallback = true;
      }
    } catch (redisError) {
      console.log('Redis not available for /me, using fallback:', redisError.message)
      useFallback = true;
    }

    if (useFallback) {
      // Fallback to file-based user data
      try {
        const fs = await import('fs');
        const path = await import('path');
        const dataDir = path.join(process.cwd(), 'data');
        const usersFile = path.join(dataDir, 'users.json');
        
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        user = users.find(u => u.username === req.user.username);
        
        if (!user) {
          return res.status(404).json({ message: 'User not found' })
        }

        console.log('Using fallback user data for:', req.user.username);
      } catch (fallbackError) {
        console.error('Fallback user data error:', fallbackError);
        return res.status(500).json({ message: 'User service unavailable' })
      }
    }

    delete user.password
    res.json({
      user: {
        ...user,
        permissions: Array.isArray(user.permissions) ? user.permissions : JSON.parse(user.permissions || '[]'),
        organizations: Array.isArray(user.organizations) ? user.organizations : (user.organizations ? JSON.parse(user.organizations) : (user.organization ? [user.organization] : []))
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
          permissions: JSON.parse(user.permissions),
          organizations: user.organizations ? JSON.parse(user.organizations) : (user.organization ? [user.organization] : [])
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
    const { username, email, password, role, permissions, organization, organizations, fullName, phone, position } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' })
    }

    // Resolve organizations array
    let orgs = []
    if (Array.isArray(organizations)) orgs = organizations.filter(Boolean).map(String)
    else if (organization) orgs = [String(organization)]
    if (orgs.length === 0) {
      return res.status(400).json({ message: 'At least one organization is required' })
    }

    // Check if user already exists
    const existingUser = await redis.hGetAll(`user:${username}`)
    if (existingUser.username) {
      return res.status(400).json({ message: 'Username already exists' })
    }

    // Unique email check
    const usernames = await redis.sMembers('users')
    for (const u of usernames) {
      const urec = await redis.hGetAll(`user:${u}`)
      if (urec.email && urec.email.toLowerCase() === email.toLowerCase()) {
        return res.status(400).json({ message: 'Email already exists' })
      }
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
      organizations: JSON.stringify(orgs),
      fullName: fullName || '',
      phone: phone || '',
      position: position || '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }

    await redis.hSet(`user:${username}`, user)
    await redis.sAdd('users', username)

    delete user.password
    res.status(201).json({
      user: {
        ...user,
        permissions: JSON.parse(user.permissions),
        organizations: orgs
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
    const { email, role, permissions, status, fullName, phone, position, organizations } = req.body

    const user = await redis.hGetAll(`user:${username}`)
    if (!user.username) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update user fields
    const updates = {}
    if (email) {
      // Check email uniqueness against other users
      const all = await redis.sMembers('users')
      for (const u of all) {
        if (u === username) continue
        const urec = await redis.hGetAll(`user:${u}`)
        if (urec.email && urec.email.toLowerCase() === email.toLowerCase()) {
          return res.status(400).json({ message: 'Email already exists' })
        }
      }
      updates.email = email
    }
    if (role) updates.role = role
    if (permissions) updates.permissions = JSON.stringify(permissions)
    if (status) updates.status = status
    if (fullName !== undefined) updates.fullName = fullName
    if (phone !== undefined) updates.phone = phone
    if (position !== undefined) updates.position = position
    if (organizations) {
      const orgs = Array.isArray(organizations) ? organizations.filter(Boolean).map(String) : []
      if (orgs.length === 0) return res.status(400).json({ message: 'At least one organization is required' })
      updates.organizations = JSON.stringify(orgs)
    }

    await redis.hSet(`user:${username}`, updates)

    // Get updated user
    const updatedUser = await redis.hGetAll(`user:${username}`)
    delete updatedUser.password

    res.json({
      user: {
        ...updatedUser,
        permissions: JSON.parse(updatedUser.permissions),
        organizations: updatedUser.organizations ? JSON.parse(updatedUser.organizations) : []
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

// Admin: set password for any user (including self) without current password
app.put('/api/admin/users/:username/password', authenticateToken, requireAdminLocal, async (req, res) => {
  try {
    const { username } = req.params
    const { newPassword } = req.body
    if (!newPassword || String(newPassword).length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' })
    }
    const user = await redis.hGetAll(`user:${username}`)
    if (!user.username) {
      return res.status(404).json({ message: 'User not found' })
    }
    const hashedPassword = await bcrypt.hash(String(newPassword), 10)
    await redis.hSet(`user:${username}`, 'password', hashedPassword)
    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Admin set password error:', error)
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
      // Сохраняем поля по отдельности
      for (const [field, value] of Object.entries(adminUser)) {
        await redis.hSet('user:admin', field, value)
      }
      await redis.sAdd('users', 'admin')
      console.log('Admin user created')
    }

    const user1Exists = await redis.hGetAll('user:user1')
    if (!user1Exists.username) {
      const hashedPassword = await bcrypt.hash('user1', 10)
      const user1 = {
        id: '2',
        username: 'user1',
        fullName: 'John Smith',
        email: 'user1@company-lld.com',
        password: hashedPassword,
        organization: 'Company LLD',
        position: 'CEO',
        role: 'admin',
        phone: '+1-555-0101',
        permissions: JSON.stringify([
          'access.dashboard',
          'access.assets',
          'access.compliance',
          'access.customerTrust',
          'access.suppliers',
          'access.reports',
          'access.integrations',
          'access.admin'
        ]),
        additionalOrganizations: JSON.stringify([]),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      // Сохраняем поля по отдельности
      for (const [field, value] of Object.entries(user1)) {
        await redis.hSet('user:user1', field, value)
      }
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
        organizations: JSON.stringify(['Watson Morris']),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      // Сохраняем поля по отдельности
      for (const [field, value] of Object.entries(user2)) {
        await redis.hSet('user:user2', field, value)
      }
      await redis.sAdd('users', 'user2')
      console.log('User2 created')
    }

    const user3Exists = await redis.hGetAll('user:user3')
    if (!user3Exists.username) {
      const hashedPassword = await bcrypt.hash('user3', 10)
      const user3 = {
        id: '4',
        username: 'user3',
        fullName: 'Jane Doe',
        email: 'user3@company-lld.com',
        password: hashedPassword,
        organization: 'Company LLD',
        position: 'CISO',
        role: 'user',
        phone: '+1-555-0103',
        permissions: JSON.stringify([
          'access.dashboard',
          'access.assets',
          'access.compliance',
          'access.customerTrust',
          'access.suppliers',
          'access.reports',
          'access.integrations'
        ]),
        additionalOrganizations: JSON.stringify([]),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      // Сохраняем поля по отдельности
      for (const [field, value] of Object.entries(user3)) {
        await redis.hSet('user:user3', field, value)
      }
      await redis.sAdd('users', 'user3')
      console.log('User3 created')
    }
  } catch (error) {
    console.error('Error initializing default users:', error)
  }
}

// Initialize default users on startup
await initializeDefaultUsers()

// Initialize Company LLD data
async function initializeCompanyLLDData() {
  try {
    // Create Company LLD if it doesn't exist
    const companyId = 'company-lld'
    const companyExists = await redis.hGetAll(`company:${companyId}`)
    if (!companyExists.data) {
      const companyData = {
        id: companyId,
        name: 'Company LLD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await redis.hSet(`company:${companyId}`, 'data', JSON.stringify(companyData))
      await redis.sAdd('companies', companyId)
      console.log('Company LLD created')
    }

    // Create demo assets for Company LLD
    const assets = [
      {
        assetId: 'asset-1',
        name: 'www.company-lld.com',
        type: 'Web Server',
        environment: 'Production',
        ipAddress: '116.203.242.207',
        lastAssessment: '2024-01-15',
        complianceScore: 75,
        standards: ['NIS2', 'GDPR', 'ISO/IEC 27001'],
        vulnerabilities: { critical: 1, high: 3, medium: 5, low: 1, total: 10 }
      },
      {
        assetId: 'asset-2',
        name: 'db.company-lld.com',
        type: 'Database Server',
        environment: 'Production',
        ipAddress: '10.0.0.12',
        lastAssessment: '2024-01-15',
        complianceScore: 70,
        standards: ['NIS2', 'ISO/IEC 27001'],
        vulnerabilities: { critical: 1, high: 2, medium: 4, low: 1, total: 8 }
      },
      {
        assetId: 'asset-3',
        name: 'app.company-lld.com',
        type: 'Application Server',
        environment: 'Production',
        ipAddress: '10.0.0.21',
        lastAssessment: '2024-01-15',
        complianceScore: 80,
        standards: ['GDPR', 'ISO/IEC 27001'],
        vulnerabilities: { critical: 2, high: 3, medium: 3, low: 1, total: 9 }
      },
      {
        assetId: 'asset-4',
        name: 'vpn.company-lld.com',
        type: 'VPN Gateway',
        environment: 'Production',
        ipAddress: '10.0.0.30',
        lastAssessment: '2024-01-15',
        complianceScore: 75,
        standards: ['NIS2'],
        vulnerabilities: { critical: 1, high: 1, medium: 2, low: 1, total: 5 }
      }
    ]

    // Store assets for Company LLD
    for (const asset of assets) {
      const existingAsset = await redis.hGet(`company:${companyId}:assets`, asset.assetId)
      if (!existingAsset) {
        await redis.hSet(`company:${companyId}:assets`, asset.assetId, JSON.stringify(asset))
        await redis.sAdd(`company:${companyId}:assetIds`, asset.assetId)
      }
    }
    console.log('Company LLD assets initialized')
  } catch (error) {
    console.error('Error initializing Company LLD data:', error)
  }
}

// Initialize Company LLD data on startup
await initializeCompanyLLDData()

// Подключаем маршруты
app.use('/api/assistant', assistantRoutes);
app.use('/api/ai-assistant', aiAssistantRoutes);
app.use('/api/starter-guide', starterGuideRoutes);
app.use('/api/auth', authRefreshRoutes);
app.use('/api/customer-trust', customerTrustRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/assets', assetsFallbackRoutes);
app.use('/api/assets', assetsDbRoutes);
app.use('/api/compliance', complianceRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/reports', uploadRoutes);
app.use('/api/reports', parseRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/company', companiesRoutes);

// Organizations registry endpoints (admin)
app.get('/api/admin/organizations-names', authenticateToken, requireAdminLocal, async (req, res) => {
  try {
    const setMembers = await redis.sMembers('organizations')
    res.json({ organizations: setMembers })
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.post('/api/admin/organizations-names', authenticateToken, requireAdminLocal, async (req, res) => {
  try {
    const { name } = req.body
    if (!name || String(name).trim().length === 0) return res.status(400).json({ message: 'Organization name is required' })
    await redis.sAdd('organizations', String(name))
    res.status(201).json({ ok: true })
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.delete('/api/admin/organizations-names/:name', authenticateToken, requireAdminLocal, async (req, res) => {
  try {
    const { name } = req.params
    await redis.sRem('organizations', String(name))
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Admin and organization summaries
app.get('/api/admin/summary', authenticateToken, requireAdminLocal, async (req, res) => {
  try {
    const usernames = await redis.sMembers('users')
    const organizationsMap = new Map()
    const usersPerOrg = {}
    const assetsPerOrg = {}
    let totalAssets = 0
    let totalSuppliers = 0
    const suppliersPerOrg = {}

    for (const username of usernames) {
      const user = await redis.hGetAll(`user:${username}`)
      if (!user.id) continue
      const orgs = user.organizations ? JSON.parse(user.organizations) : (user.organization ? [user.organization] : [])
      const assets = await redis.hGetAll(`assets:${user.id}`)
      const assetCount = Object.keys(assets).length
      totalAssets += assetCount
      // suppliers are stored by user id if present
      const suppliers = await redis.hGetAll(`suppliers:${user.id}`)
      const supplierCount = Object.keys(suppliers).length
      totalSuppliers += supplierCount
      for (const org of orgs) {
        organizationsMap.set(org, true)
        usersPerOrg[org] = (usersPerOrg[org] || 0) + 1
        assetsPerOrg[org] = (assetsPerOrg[org] || 0) + assetCount
        suppliersPerOrg[org] = (suppliersPerOrg[org] || 0) + supplierCount
      }
    }

    res.json({
      organizations: organizationsMap.size,
      usersPerOrganization: usersPerOrg,
      assetsPerOrganization: assetsPerOrg,
      suppliersPerOrganization: suppliersPerOrg,
      totalAssets,
      totalSuppliers
    })
  } catch (error) {
    console.error('Admin summary error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.get('/api/admin/organizations', authenticateToken, requireAdminLocal, async (req, res) => {
  try {
    const usernames = await redis.sMembers('users')
    const orgToUsers = {}
    const orgToAssets = {}
    const orgToSuppliers = {}

    // First pass: collect users and assets per org
    for (const username of usernames) {
      const user = await redis.hGetAll(`user:${username}`)
      if (!user.id) continue
      const orgs = user.organizations ? JSON.parse(user.organizations) : (user.organization ? [user.organization] : [])
      const assets = await redis.hGetAll(`assets:${user.id}`)
      const assetCount = Object.keys(assets).length
      const suppliers = await redis.hGetAll(`suppliers:${user.id}`)
      const supplierCount = Object.keys(suppliers).length
      for (const org of orgs) {
        if (!orgToUsers[org]) orgToUsers[org] = new Set()
        orgToUsers[org].add(username)
        orgToAssets[org] = (orgToAssets[org] || 0) + assetCount
        orgToSuppliers[org] = (orgToSuppliers[org] || 0) + supplierCount
      }
    }

    const organizations = Object.keys(orgToUsers).map((name) => ({
      name,
      userCount: orgToUsers[name].size,
      assetCount: orgToAssets[name] || 0,
      supplierCount: orgToSuppliers[name] || 0
    }))

    res.json({ organizations })
  } catch (error) {
    console.error('Admin organizations error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.get('/api/org/summary', authenticateToken, async (req, res) => {
  try {
    const orgs = req.user.organizations || []
    const usernames = await redis.sMembers('users')
    const usersPerOrg = {}
    const assetsPerOrg = {}
    let totalAssets = 0
    let totalSuppliers = 0
    const suppliersPerOrg = {}

    for (const username of usernames) {
      const user = await redis.hGetAll(`user:${username}`)
      if (!user.id) continue
      const userOrgs = user.organizations ? JSON.parse(user.organizations) : (user.organization ? [user.organization] : [])
      const intersect = userOrgs.some((o) => orgs.includes(o))
      if (!intersect) continue
      const assets = await redis.hGetAll(`assets:${user.id}`)
      const assetCount = Object.keys(assets).length
      totalAssets += assetCount
      const suppliers = await redis.hGetAll(`suppliers:${user.id}`)
      const supplierCount = Object.keys(suppliers).length
      totalSuppliers += supplierCount
      for (const org of userOrgs) {
        if (!orgs.includes(org)) continue
        usersPerOrg[org] = (usersPerOrg[org] || 0) + 1
        assetsPerOrg[org] = (assetsPerOrg[org] || 0) + assetCount
        suppliersPerOrg[org] = (suppliersPerOrg[org] || 0) + supplierCount
      }
    }

    res.json({
      organizations: orgs.length,
      usersPerOrganization: usersPerOrg,
      assetsPerOrganization: assetsPerOrg,
      suppliersPerOrganization: suppliersPerOrg,
      totalAssets,
      totalSuppliers
    })
  } catch (error) {
    console.error('Org summary error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

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
