import request from 'supertest'
import express from 'express'
import jwt from 'jsonwebtoken'

// Mock Redis for testing
const mockRedis = {
  hGetAll: jest.fn(),
  hSet: jest.fn(),
  sAdd: jest.fn(),
  sMembers: jest.fn()
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

// Mock integrations data
const mockIntegrations = [
  {
    id: '1',
    name: 'SIEM Integration',
    description: 'Security Information and Event Management system',
    status: 'active',
    type: 'security',
    lastSync: '2024-01-15T10:30:00Z',
    configurable: true
  },
  {
    id: '2',
    name: 'AWS CloudTrail',
    description: 'Amazon Web Services CloudTrail logging',
    status: 'active',
    type: 'cloud',
    lastSync: '2024-01-15T10:25:00Z',
    configurable: true
  },
  {
    id: '3',
    name: 'Microsoft Sentinel',
    description: 'Microsoft Azure Sentinel SIEM',
    status: 'inactive',
    type: 'security',
    configurable: true
  }
]

// Mock integration routes
app.get('/api/integrations', authenticateToken, async (req, res) => {
  try {
    res.json({ integrations: mockIntegrations })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.get('/api/integrations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const integration = mockIntegrations.find(i => i.id === id)
    
    if (!integration) {
      return res.status(404).json({ message: 'Integration not found' })
    }
    
    res.json({ integration })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.post('/api/integrations', authenticateToken, async (req, res) => {
  try {
    const { name, description, type, configurable = true } = req.body
    
    if (!name || !description || !type) {
      return res.status(400).json({ message: 'Name, description, and type are required' })
    }
    
    const newIntegration = {
      id: (mockIntegrations.length + 1).toString(),
      name,
      description,
      status: 'inactive',
      type,
      configurable,
      createdAt: new Date().toISOString()
    }
    
    mockIntegrations.push(newIntegration)
    
    res.status(201).json({ integration: newIntegration })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.put('/api/integrations/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body
    
    const integration = mockIntegrations.find(i => i.id === id)
    if (!integration) {
      return res.status(404).json({ message: 'Integration not found' })
    }
    
    integration.status = status
    if (status === 'active') {
      integration.lastSync = new Date().toISOString()
    }
    
    res.json({ integration })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

app.delete('/api/integrations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const index = mockIntegrations.findIndex(i => i.id === id)
    
    if (index === -1) {
      return res.status(404).json({ message: 'Integration not found' })
    }
    
    mockIntegrations.splice(index, 1)
    
    res.json({ message: 'Integration deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
})

describe('Integrations API Tests', () => {
  let userToken

  beforeAll(async () => {
    userToken = jwt.sign({ userId: '2', username: 'user1' }, 'test-secret', { expiresIn: '24h' })
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/integrations', () => {
    it('should get all integrations', async () => {
      const response = await request(app)
        .get('/api/integrations')
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('integrations')
      expect(Array.isArray(response.body.integrations)).toBe(true)
      expect(response.body.integrations.length).toBeGreaterThan(0)
    })

    it('should reject access without token', async () => {
      const response = await request(app)
        .get('/api/integrations')

      expect(response.status).toBe(401)
      expect(response.body.message).toBe('Access token required')
    })
  })

  describe('GET /api/integrations/:id', () => {
    it('should get integration by id', async () => {
      const response = await request(app)
        .get('/api/integrations/1')
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('integration')
      expect(response.body.integration.id).toBe('1')
      expect(response.body.integration.name).toBe('SIEM Integration')
    })

    it('should return 404 for non-existent integration', async () => {
      const response = await request(app)
        .get('/api/integrations/999')
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Integration not found')
    })
  })

  describe('POST /api/integrations', () => {
    it('should create new integration', async () => {
      const newIntegration = {
        name: 'New SIEM',
        description: 'New Security Information and Event Management',
        type: 'security',
        configurable: true
      }

      const response = await request(app)
        .post('/api/integrations')
        .set('Authorization', `Bearer ${userToken}`)
        .send(newIntegration)

      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('integration')
      expect(response.body.integration.name).toBe('New SIEM')
      expect(response.body.integration.status).toBe('inactive')
    })

    it('should reject creation without required fields', async () => {
      const incompleteIntegration = {
        name: 'New SIEM'
        // Missing description and type
      }

      const response = await request(app)
        .post('/api/integrations')
        .set('Authorization', `Bearer ${userToken}`)
        .send(incompleteIntegration)

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Name, description, and type are required')
    })
  })

  describe('PUT /api/integrations/:id/status', () => {
    it('should update integration status', async () => {
      const response = await request(app)
        .put('/api/integrations/1/status')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'inactive' })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('integration')
      expect(response.body.integration.status).toBe('inactive')
    })

    it('should set lastSync when activating integration', async () => {
      const response = await request(app)
        .put('/api/integrations/3/status')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'active' })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('integration')
      expect(response.body.integration.status).toBe('active')
      expect(response.body.integration.lastSync).toBeDefined()
    })

    it('should return 404 for non-existent integration', async () => {
      const response = await request(app)
        .put('/api/integrations/999/status')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ status: 'active' })

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Integration not found')
    })
  })

  describe('DELETE /api/integrations/:id', () => {
    it('should delete integration', async () => {
      const response = await request(app)
        .delete('/api/integrations/2')
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Integration deleted successfully')
    })

    it('should return 404 for non-existent integration', async () => {
      const response = await request(app)
        .delete('/api/integrations/999')
        .set('Authorization', `Bearer ${userToken}`)

      expect(response.status).toBe(404)
      expect(response.body.message).toBe('Integration not found')
    })
  })
})