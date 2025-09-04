import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import MockRedis from './mock-redis.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json())
app.use(morgan('dev'))

const PORT = process.env.PORT || 5000
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Use mock Redis instead of real Redis
const redis = new MockRedis()
await redis.connect()
await redis.initializeDefaultUsers()

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await redis.hGetAll(`user:${decoded.userId}`)
    
    if (!user.id) {
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'DefendSphere Backend is running',
    mode: 'mock-redis',
    timestamp: new Date().toISOString()
  })
})

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    // Find user by username
    let user = null
    for (let i = 1; i <= 3; i++) {
      const userData = await redis.hGetAll(`user:${i}`)
      if (userData.username === username) {
        user = userData
        break
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Dashboard data endpoint
app.get('/api/dashboard', authenticateToken, async (req, res) => {
  try {
    const dashboardData = {
      securityHealth: 75,
      status: "Need Attention",
      lastScan: "2 days ago",
      assets: {
        total: 124,
        critical: 5,
        high: 12,
        medium: 28,
        low: 43
      },
      healthTrends: [
        { date: "2025-08-01", health: 60 },
        { date: "2025-08-10", health: 40 },
        { date: "2025-08-20", health: 55 },
        { date: "2025-08-30", health: 15 }
      ],
      criticalityLevels: {
        assets: { green: 20, yellow: 10, red: 5 },
        compliance: { green: 15, yellow: 15, red: 10 },
        suppliers: { green: 20, yellow: 10, red: 5 }
      }
    }

    res.json(dashboardData)
  } catch (error) {
    console.error('Dashboard error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Assets endpoint
app.get('/api/assets', authenticateToken, async (req, res) => {
  try {
    const mockAssets = [
      {
        id: '1',
        name: 'Web Server 01',
        type: 'Servers',
        environment: 'Production',
        assignedStandards: ['GDPR', 'NIS2'],
        compliancePercentage: 85,
        riskLevel: 'Medium',
        lastAssessment: '2025-09-01',
        owner: 'IT Department',
        description: 'Main web server',
        ipUrl: '192.168.1.100'
      },
      {
        id: '2',
        name: 'Database Server',
        type: 'Databases',
        environment: 'Production',
        assignedStandards: ['GDPR', 'ISO 27001'],
        compliancePercentage: 90,
        riskLevel: 'Low',
        lastAssessment: '2025-09-01',
        owner: 'Database Team',
        description: 'Primary database server',
        ipUrl: '192.168.1.50'
      }
    ]

    res.json(mockAssets)
  } catch (error) {
    console.error('Assets error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Compliance endpoint
app.get('/api/compliance', authenticateToken, async (req, res) => {
  try {
    const mockCompliance = [
      {
        id: '1',
        standard: 'GDPR',
        department: 'IT Department',
        status: 'Compliant',
        compliancePercentage: 95,
        lastAssessmentDate: '2025-09-01',
        nextScheduledAssessment: '2025-12-01',
        recommendations: 'Continue current practices'
      },
      {
        id: '2',
        standard: 'NIS2',
        department: 'Security Team',
        status: 'Partial',
        compliancePercentage: 70,
        lastAssessmentDate: '2025-08-15',
        nextScheduledAssessment: '2025-11-15',
        recommendations: 'Implement additional security measures'
      }
    ]

    res.json(mockCompliance)
  } catch (error) {
    console.error('Compliance error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Customer Trust endpoint
app.get('/api/customer-trust', authenticateToken, async (req, res) => {
  try {
    const mockCustomerTrust = [
      {
        id: '1',
        name: 'Acme Corporation',
        category: 'Client',
        sector: 'Healthcare',
        assignedStandards: ['GDPR', 'NIS2'],
        compliancePercentage: 92,
        lastAssessment: '2025-09-01',
        responsiblePerson: 'John Doe',
        email: 'john@acme.com',
        website: 'https://acme.com'
      }
    ]

    res.json(mockCustomerTrust)
  } catch (error) {
    console.error('Customer Trust error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Suppliers endpoint
app.get('/api/suppliers', authenticateToken, async (req, res) => {
  try {
    const mockSuppliers = [
      {
        id: '1',
        name: 'Cloud Provider Inc',
        category: 'With Access',
        subGradation: 'Services Supplier',
        assignedStandards: ['NIS2', 'SOC v2'],
        compliancePercentage: 88,
        lastAssessment: '2025-09-01'
      }
    ]

    res.json(mockSuppliers)
  } catch (error) {
    console.error('Suppliers error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Reports endpoint
app.get('/api/reports', authenticateToken, async (req, res) => {
  try {
    const mockReports = [
      {
        id: '1',
        name: 'Monthly Security Report',
        type: 'Security Assessment',
        owner: 'Security Team',
        createdDate: '2025-09-01',
        status: 'Completed',
        riskLevel: 'Medium',
        notes: 'Monthly security assessment report'
      }
    ]

    res.json(mockReports)
  } catch (error) {
    console.error('Reports error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// AI Assistant endpoint
app.post('/api/assistant', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body

    if (!message) {
      return res.status(400).json({ message: 'Message is required' })
    }

    // Simple mock response
    const response = {
      response: `I received your message: "${message}". This is a mock response from the AI Assistant. In a real implementation, this would connect to an AI service.`,
      suggestions: [
        'View asset management guide',
        'Check compliance requirements',
        'Generate security report'
      ]
    }

    res.json(response)
  } catch (error) {
    console.error('Assistant error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 DefendSphere Backend running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🌐 External access: http://217.65.144.232:${PORT}/api/health`)
  console.log(`🔐 Mock Redis mode - no external Redis required`)
  console.log(`👤 Default users: admin/admin, user1/user1, user2/user2`)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...')
  await redis.disconnect()
  process.exit(0)
})