import express from 'express'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

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
  },
  {
    id: '4',
    name: 'Splunk Enterprise',
    description: 'Splunk Enterprise Security platform',
    status: 'error',
    type: 'monitoring',
    lastSync: '2024-01-14T15:45:00Z',
    configurable: true
  },
  {
    id: '5',
    name: 'PostgreSQL Database',
    description: 'PostgreSQL database monitoring',
    status: 'active',
    type: 'database',
    lastSync: '2024-01-15T10:20:00Z',
    configurable: false
  }
]

// Get all integrations
router.get('/', authenticateToken, async (req, res) => {
  try {
    res.json({ integrations: mockIntegrations })
  } catch (error) {
    console.error('Get integrations error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get integration by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const integration = mockIntegrations.find(i => i.id === id)
    
    if (!integration) {
      return res.status(404).json({ message: 'Integration not found' })
    }
    
    res.json({ integration })
  } catch (error) {
    console.error('Get integration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Update integration status
router.put('/:id/status', authenticateToken, async (req, res) => {
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
    console.error('Update integration status error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Create new integration
router.post('/', authenticateToken, async (req, res) => {
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
    console.error('Create integration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Delete integration
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const index = mockIntegrations.findIndex(i => i.id === id)
    
    if (index === -1) {
      return res.status(404).json({ message: 'Integration not found' })
    }
    
    mockIntegrations.splice(index, 1)
    
    res.json({ message: 'Integration deleted successfully' })
  } catch (error) {
    console.error('Delete integration error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router