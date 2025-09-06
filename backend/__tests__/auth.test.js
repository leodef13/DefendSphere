import request from 'supertest'
import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createClient } from 'redis'

// Mock Redis for testing
const mockRedis = {
  hGetAll: jest.fn(),
  hSet: jest.fn(),
  sAdd: jest.fn(),
  sMembers: jest.fn(),
  ping: jest.fn(() => Promise.resolve('PONG'))
}

// Mock Redis client
jest.mock('redis', () => ({
  createClient: jest.fn(() => mockRedis)
}))

// Create test app
const app = express()
app.use(express.json())

// Mock authentication routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' })
    }

    // Mock user data
    const mockUsers = {
      admin: {
        id: '1',
        username: 'admin',
        email: 'admin@defendsphere.com',
        password: await bcrypt.hash('admin', 10),
        role: 'admin',
        permissions: JSON.stringify(['all']),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      user1: {
        id: '2',
        username: 'user1',
        email: 'user1@defendsphere.com',
        password: await bcrypt.hash('user1', 10),
        role: 'user',
        permissions: JSON.stringify(['access.dashboard', 'access.assets']),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      user2: {
        id: '3',
        username: 'user2',
        email: 'user2@defendsphere.com',
        password: await bcrypt.hash('user2', 10),
        role: 'user',
        permissions: JSON.stringify(['access.dashboard', 'access.reports', 'access.assets', 'access.suppliers']),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    }

    const user = mockUsers[username]
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ userId: user.id, username }, 'test-secret', { expiresIn: '24h' })

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        permissions: JSON.parse(user.permissions)
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.get('/api/health', async (req, res) => {
  const pong = await mockRedis.ping()
  res.json({ ok: true, redis: pong })
})

describe('Authentication Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/login', () => {
    it('should login admin user with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin'
        })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user.username).toBe('admin')
      expect(response.body.user.role).toBe('admin')
      expect(response.body.user.permissions).toContain('all')
    })

    it('should login user1 with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'user1',
          password: 'user1'
        })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user.username).toBe('user1')
      expect(response.body.user.role).toBe('user')
      expect(response.body.user.permissions).toContain('access.dashboard')
      expect(response.body.user.permissions).toContain('access.assets')
    })

    it('should login user2 with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'user2',
          password: 'user2'
        })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('user')
      expect(response.body.user.username).toBe('user2')
      expect(response.body.user.role).toBe('user')
      expect(response.body.user.permissions).toContain('access.dashboard')
      expect(response.body.user.permissions).toContain('access.reports')
    })

    it('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        })

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('Invalid credentials')
    })

    it('should reject login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password'
        })

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('Invalid credentials')
    })

    it('should reject login without username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'admin'
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Username and password are required')
    })

    it('should reject login without password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin'
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Username and password are required')
    })
  })

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('ok', true)
      expect(response.body).toHaveProperty('redis', 'PONG')
    })
  })
})