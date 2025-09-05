import request from 'supertest'
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Mock Redis for testing
const mockRedis = {
  hGetAll: jest.fn(),
  hSet: jest.fn(),
  sAdd: jest.fn(),
  sMembers: jest.fn(),
  sRem: jest.fn(),
  del: jest.fn()
}

// Mock Redis client
jest.mock('redis', () => ({
  createClient: jest.fn(() => mockRedis)
}))

// Create test app
const app = express()
app.use(express.json())

// Mock middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, 'test-secret')
    req.user = {
      id: decoded.userId,
      username: decoded.username,
      role: decoded.username === 'admin' ? 'admin' : 'user',
      permissions: decoded.username === 'admin' ? ['all'] : ['access.dashboard']
    }
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' })
  }
}

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

// Mock admin routes
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const mockUsers = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@defendsphere.com',
        role: 'admin',
        permissions: ['all'],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      {
        id: '2',
        username: 'user1',
        email: 'user1@defendsphere.com',
        role: 'user',
        permissions: ['access.dashboard', 'access.assets'],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    ]

    res.json({ users: mockUsers })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.post('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username, email, password, role, permissions } = req.body

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' })
    }

    // Mock user creation
    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      role: role || 'user',
      permissions: permissions || ['access.dashboard'],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }

    res.status(201).json({ user: newUser })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.put('/api/admin/users/:username', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username } = req.params
    const { email, role, permissions } = req.body

    // Mock user update
    const updatedUser = {
      id: '1',
      username,
      email: email || 'updated@example.com',
      role: role || 'user',
      permissions: permissions || ['access.dashboard'],
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }

    res.json({ user: updatedUser })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.delete('/api/admin/users/:username', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { username } = req.params

    if (username === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' })
    }

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

describe('Admin Panel Tests', () => {
  let adminToken
  let userToken

  beforeAll(async () => {
    // Generate test tokens
    adminToken = jwt.sign({ userId: '1', username: 'admin' }, 'test-secret', { expiresIn: '24h' })
    userToken = jwt.sign({ userId: '2', username: 'user1' }, 'test-secret', { expiresIn: '24h' })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/admin/users', () => {
    it('should get all users for admin', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('users')
      expect(Array.isArray(response.body.users)).toBe(true)
      expect(response.body.users.length).toBeGreaterThan(0)
    })

    it('should reject access for non-admin user', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Admin access required')
    })

    it('should reject access without token', async () => {
      const response = await request(app)
        .get('/api/admin/users')

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('Access token required')
    })
  })

  describe('POST /api/admin/users', () => {
    it('should create new user for admin', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123',
        role: 'user',
        permissions: ['access.dashboard', 'access.reports']
      }

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newUser)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('user')
      expect(response.body.user.username).toBe('newuser')
      expect(response.body.user.email).toBe('newuser@example.com')
      expect(response.body.user.role).toBe('user')
    })

    it('should reject user creation without required fields', async () => {
      const incompleteUser = {
        username: 'newuser'
        // Missing email and password
      }

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(incompleteUser)

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Username, email, and password are required')
    })

    it('should reject user creation for non-admin', async () => {
      const newUser = {
        username: 'newuser',
        email: 'newuser@example.com',
        password: 'password123'
      }

      const response = await request(app)
        .post('/api/admin/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newUser)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Admin access required')
    })
  })

  describe('PUT /api/admin/users/:username', () => {
    it('should update user for admin', async () => {
      const updateData = {
        email: 'updated@example.com',
        role: 'user',
        permissions: ['access.dashboard', 'access.assets']
      }

      const response = await request(app)
        .put('/api/admin/users/user1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('user')
      expect(response.body.user.username).toBe('user1')
    })

    it('should reject user update for non-admin', async () => {
      const updateData = {
        email: 'updated@example.com'
      }

      const response = await request(app)
        .put('/api/admin/users/user1')
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Admin access required')
    })
  })

  describe('DELETE /api/admin/users/:username', () => {
    it('should delete user for admin', async () => {
      const response = await request(app)
        .delete('/api/admin/users/user1')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('User deleted successfully')
    })

    it('should prevent admin user deletion', async () => {
      const response = await request(app)
        .delete('/api/admin/users/admin')
        .set('Authorization', `Bearer ${adminToken}`)

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Cannot delete admin user')
    })

    it('should reject user deletion for non-admin', async () => {
      const response = await request(app)
        .delete('/api/admin/users/user1')
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).toBe(403)
      expect(response.body.message).toBe('Admin access required')
    })
  })
})