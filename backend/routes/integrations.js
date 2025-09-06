import express from 'express'
import { createClient } from 'redis'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import encryptionService from '../services/encryptionService.js'
import greenboneService from '../services/greenboneService.cjs'

const router = express.Router()
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6380' })
redis.on('error', (e) => console.error('Redis error in integrations routes:', e))
await redis.connect()

// Get all available integrations
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const integrations = [
      {
        id: 'scans_defendsphere_team',
        name: "Scan's_defendSphere_team",
        description: 'Greenbone GVM integration for automated vulnerability scanning',
        status: 'available',
        category: 'Security Scanning',
        icon: 'shield-scan',
        version: '1.0.0',
        author: 'DefendSphere Team'
      },
      {
        id: 'ai_providers',
        name: 'AI Providers',
        description: 'Integrations with external AI systems for the Security Assistant',
        status: 'available',
        category: 'AI',
        icon: 'bot',
        version: '1.0.0',
        author: 'DefendSphere Team',
        providers: [
          {
            key: 'openai',
            title: 'OpenAI (Chat Completions)',
            params: ['apiKey', 'model', 'endpoint']
          },
          {
            key: 'claude',
            title: 'Anthropic Claude',
            params: ['apiKey', 'model', 'endpoint']
          },
          {
            key: 'gemini',
            title: 'Google Gemini',
            params: ['apiKey', 'model', 'endpoint']
          },
          {
            key: 'azure',
            title: 'Azure OpenAI',
            params: ['apiKey', 'endpoint', 'deploymentId']
          }
        ]
      }
    ]

    // Check which integrations are configured
    for (const integration of integrations) {
      const config = await redis.get(`integration:${integration.id}:config`)
      integration.status = config ? 'configured' : 'available'
      integration.configured = !!config
    }

    res.json({
      success: true,
      integrations
    })
  } catch (error) {
    console.error('Error fetching integrations:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch integrations' 
    })
  }
})

// Get integration configuration
router.get('/:integrationId/config', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { integrationId } = req.params
    
    if (integrationId !== 'scans_defendsphere_team') {
      return res.status(404).json({ 
        success: false, 
        error: 'Integration not found' 
      })
    }

    const configData = await redis.get(`integration:${integrationId}:config`)
    
    if (!configData) {
      return res.json({
        success: true,
        config: null,
        configured: false
      })
    }

    const config = JSON.parse(configData)
    
    // Decrypt sensitive data for display (but mask passwords)
    const decryptedConfig = encryptionService.decryptSensitiveData(config)
    
    // Mask sensitive fields for display
    const maskedConfig = {
      ...decryptedConfig,
      password: decryptedConfig.password ? '••••••••' : '',
      token: decryptedConfig.token ? '••••••••' : ''
    }

    res.json({
      success: true,
      config: maskedConfig,
      configured: true
    })
  } catch (error) {
    console.error('Error fetching integration config:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch integration configuration' 
    })
  }
})

// Save integration configuration
router.post('/:integrationId/config', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { integrationId } = req.params
    const config = req.body
    const adminUser = req.user.username

    if (integrationId !== 'scans_defendsphere_team') {
      return res.status(404).json({ 
        success: false, 
        error: 'Integration not found' 
      })
    }

    // Validate required fields
    const requiredFields = ['host', 'port', 'username', 'password']
    for (const field of requiredFields) {
      if (!config[field]) {
        return res.status(400).json({ 
          success: false, 
          error: `Missing required field: ${field}` 
        })
      }
    }

    // Get existing config to track changes
    const existingConfigData = await redis.get(`integration:${integrationId}:config`)
    let existingConfig = null
    if (existingConfigData) {
      existingConfig = encryptionService.decryptSensitiveData(JSON.parse(existingConfigData))
    }

    // Encrypt sensitive data before storing
    const encryptedConfig = encryptionService.encryptSensitiveData(config)
    
    // Save configuration
    await redis.set(`integration:${integrationId}:config`, JSON.stringify(encryptedConfig))
    
    // Log admin action
    await logAdminAction(adminUser, 'integration_config_update', {
      integrationId,
      changes: getConfigChanges(existingConfig, config)
    })

    res.json({
      success: true,
      message: 'Integration configuration saved successfully'
    })
  } catch (error) {
    console.error('Error saving integration config:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save integration configuration' 
    })
  }
})

// Test integration connection
router.post('/:integrationId/test', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { integrationId } = req.params
    const testConfig = req.body

    if (integrationId !== 'scans_defendsphere_team') {
      return res.status(404).json({ 
        success: false, 
        error: 'Integration not found' 
      })
    }

    // Test connection using provided config or saved config
    let configToTest = testConfig
    
    if (!configToTest || !configToTest.host) {
      // Use saved configuration
      const configData = await redis.get(`integration:${integrationId}:config`)
      if (!configData) {
        return res.status(400).json({ 
          success: false, 
          error: 'No configuration found. Please save configuration first.' 
        })
      }
      
      const savedConfig = JSON.parse(configData)
      configToTest = encryptionService.decryptSensitiveData(savedConfig)
    }

    // Test connection to Greenbone GVM
    const connectionTest = await testGreenboneConnection(configToTest)
    
    // Log test result
    await logAdminAction(req.user.username, 'integration_test', {
      integrationId,
      success: connectionTest.success,
      error: connectionTest.error
    })

    res.json({
      success: connectionTest.success,
      message: connectionTest.success ? 'Connection test successful' : 'Connection test failed',
      details: connectionTest.details || connectionTest.error
    })
  } catch (error) {
    console.error('Error testing integration:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to test integration connection' 
    })
  }
})

// Get integration status
router.get('/:integrationId/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { integrationId } = req.params

    if (integrationId !== 'scans_defendsphere_team') {
      return res.status(404).json({ 
        success: false, 
        error: 'Integration not found' 
      })
    }

    const configData = await redis.get(`integration:${integrationId}:config`)
    
    if (!configData) {
      return res.json({
        success: true,
        status: 'not_configured',
        message: 'Integration not configured'
      })
    }

    // Test current configuration
    const config = JSON.parse(configData)
    const decryptedConfig = encryptionService.decryptSensitiveData(config)
    const connectionTest = await testGreenboneConnection(decryptedConfig)

    res.json({
      success: true,
      status: connectionTest.success ? 'connected' : 'disconnected',
      message: connectionTest.success ? 'Integration is working' : 'Integration connection failed',
      lastTest: new Date().toISOString(),
      details: connectionTest.details || connectionTest.error
    })
  } catch (error) {
    console.error('Error getting integration status:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get integration status' 
    })
  }
})

// Get admin action logs
router.get('/logs', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query
    const offset = (page - 1) * limit

    // Get logs from Redis
    const logKeys = await redis.keys('admin_log:*')
    const logs = []

    for (const key of logKeys.slice(offset, offset + parseInt(limit))) {
      const logData = await redis.get(key)
      if (logData) {
        logs.push(JSON.parse(logData))
      }
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

    res.json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: logKeys.length
      }
    })
  } catch (error) {
    console.error('Error fetching admin logs:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch admin logs' 
    })
  }
})

// Helper function to test Greenbone connection
async function testGreenboneConnection(config) {
  try {
    // Temporarily override greenbone service config
    const originalConfig = {
      hostname: process.env.GREENBONE_HOST,
      port: process.env.GREENBONE_PORT,
      username: process.env.GREENBONE_USERNAME,
      password: process.env.GREENBONE_PASSWORD
    }

    // Set test configuration
    process.env.GREENBONE_HOST = config.host
    process.env.GREENBONE_PORT = config.port.toString()
    process.env.GREENBONE_USERNAME = config.username
    process.env.GREENBONE_PASSWORD = config.password

    // Test connection
    const result = await greenboneService.connectToGreenbone()

    // Restore original configuration
    process.env.GREENBONE_HOST = originalConfig.hostname
    process.env.GREENBONE_PORT = originalConfig.port
    process.env.GREENBONE_USERNAME = originalConfig.username
    process.env.GREENBONE_PASSWORD = originalConfig.password

    return result
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
}

// Helper function to get configuration changes
function getConfigChanges(oldConfig, newConfig) {
  if (!oldConfig) {
    return ['Initial configuration']
  }

  const changes = []
  const fields = ['host', 'port', 'username', 'useSSL']

  for (const field of fields) {
    if (oldConfig[field] !== newConfig[field]) {
      changes.push(`${field}: ${oldConfig[field]} → ${newConfig[field]}`)
    }
  }

  // Check password change (without revealing the actual password)
  if (oldConfig.password !== newConfig.password) {
    changes.push('password: updated')
  }

  return changes.length > 0 ? changes : ['No changes detected']
}

// Helper function to log admin actions
async function logAdminAction(adminUser, action, details) {
  try {
    const logEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      adminUser,
      action,
      details,
      timestamp: new Date().toISOString(),
      ip: '127.0.0.1' // In production, get from request
    }

    await redis.set(`admin_log:${logEntry.id}`, JSON.stringify(logEntry))
    
    // Keep only last 1000 logs
    const logKeys = await redis.keys('admin_log:*')
    if (logKeys.length > 1000) {
      const sortedKeys = logKeys.sort()
      const keysToDelete = sortedKeys.slice(0, logKeys.length - 1000)
      await redis.del(...keysToDelete)
    }
  } catch (error) {
    console.error('Failed to log admin action:', error)
  }
}

export default router