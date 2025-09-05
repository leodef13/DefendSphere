import express from 'express'
import { createClient } from 'redis'
import { authenticateToken, requirePermission } from '../middleware/auth.js'
import greenboneService from '../services/greenboneService.js'

const router = express.Router()
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
redis.on('error', (e) => console.error('Redis error in scan routes:', e))
await redis.connect()

// Get user's assets for scanning
router.get('/assets', authenticateToken, requirePermission('access.assets'), async (req, res) => {
  try {
    const userId = req.user.username
    
    // Get user's assets from Redis or database
    // For now, we'll use the report data for user1
    if (userId === 'user1') {
      const assets = [
        {
          id: 'asset-1',
          name: 'myrockshows.com',
          type: 'Web Server',
          environment: 'Production',
          ip: '116.203.242.207',
          assignedStandards: ['GDPR', 'NIS2'],
          compliancePercentage: 75,
          riskLevel: 'High',
          lastAssessment: '2024-01-15',
          vulnerabilities: {
            critical: 0,
            high: 3,
            medium: 3,
            low: 1
          }
        }
      ]
      
      res.json({
        success: true,
        assets,
        canScan: assets.length > 0
      })
    } else {
      // For other users, return empty assets for now
      res.json({
        success: true,
        assets: [],
        canScan: false,
        message: 'No assets available for scanning'
      })
    }
  } catch (error) {
    console.error('Error fetching user assets:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch assets' 
    })
  }
})

// Start scan for user's assets
router.post('/start', authenticateToken, requirePermission('access.assets'), async (req, res) => {
  try {
    const userId = req.user.username
    
    // Get user's assets
    const assetsResponse = await fetch(`${req.protocol}://${req.get('host')}/api/scan/assets`, {
      headers: { 'Authorization': `Bearer ${req.headers.authorization.split(' ')[1]}` }
    })
    
    if (!assetsResponse.ok) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch user assets' 
      })
    }
    
    const assetsData = await assetsResponse.json()
    
    if (!assetsData.success || !assetsData.canScan || assetsData.assets.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No assets available for scanning' 
      })
    }
    
    // Test Greenbone connection first
    const connectionTest = await greenboneService.connectToGreenbone()
    if (!connectionTest.success) {
      return res.status(503).json({ 
        success: false, 
        error: 'Greenbone GVM is not available',
        details: connectionTest.error
      })
    }
    
    // Start the scan
    const scanResult = await greenboneService.startScan(assetsData.assets, userId)
    
    if (scanResult.success) {
      res.json({
        success: true,
        scanId: scanResult.scanId,
        message: 'Scan started successfully',
        assets: assetsData.assets.length
      })
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to start scan',
        details: scanResult.error
      })
    }
  } catch (error) {
    console.error('Error starting scan:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    })
  }
})

// Get scan status
router.get('/status/:scanId', authenticateToken, requirePermission('access.assets'), async (req, res) => {
  try {
    const { scanId } = req.params
    const userId = req.user.username
    
    // Verify scan belongs to user
    const scanStatus = await greenboneService.getScanStatus(scanId)
    
    if (!scanStatus) {
      return res.status(404).json({ 
        success: false, 
        error: 'Scan not found' 
      })
    }
    
    // Check if scan belongs to current user
    if (scanStatus.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied to this scan' 
      })
    }
    
    res.json({
      success: true,
      scan: scanStatus
    })
  } catch (error) {
    console.error('Error getting scan status:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get scan status' 
    })
  }
})

// Get scan results
router.get('/results/:scanId', authenticateToken, requirePermission('access.assets'), async (req, res) => {
  try {
    const { scanId } = req.params
    const userId = req.user.username
    
    // Verify scan belongs to user
    const scanStatus = await greenboneService.getScanStatus(scanId)
    
    if (!scanStatus) {
      return res.status(404).json({ 
        success: false, 
        error: 'Scan not found' 
      })
    }
    
    if (scanStatus.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied to this scan' 
      })
    }
    
    // Get scan results
    const results = await greenboneService.getScanResults(scanId)
    
    if (!results) {
      return res.status(404).json({ 
        success: false, 
        error: 'Scan results not found' 
      })
    }
    
    res.json({
      success: true,
      results
    })
  } catch (error) {
    console.error('Error getting scan results:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get scan results' 
    })
  }
})

// Get user's scan history
router.get('/history', authenticateToken, requirePermission('access.assets'), async (req, res) => {
  try {
    const userId = req.user.username
    
    // Get all scans for user from Redis
    const scanKeys = await redis.keys(`scan:scan_${userId}_*`)
    const scans = []
    
    for (const key of scanKeys) {
      const scanData = await redis.get(key)
      if (scanData) {
        const scan = JSON.parse(scanData)
        scans.push({
          id: scan.id,
          status: scan.status,
          progress: scan.progress,
          message: scan.message,
          startTime: scan.startTime,
          lastUpdate: scan.lastUpdate,
          assets: scan.assets?.length || 0
        })
      }
    }
    
    // Sort by start time (newest first)
    scans.sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
    
    res.json({
      success: true,
      scans
    })
  } catch (error) {
    console.error('Error getting scan history:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get scan history' 
    })
  }
})

// Test Greenbone connection
router.get('/test-connection', authenticateToken, requirePermission('access.assets'), async (req, res) => {
  try {
    const connectionTest = await greenboneService.connectToGreenbone()
    
    res.json({
      success: connectionTest.success,
      message: connectionTest.success ? 'Greenbone GVM is available' : 'Greenbone GVM is not available',
      details: connectionTest.error || connectionTest.version
    })
  } catch (error) {
    console.error('Error testing Greenbone connection:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to test connection' 
    })
  }
})

// Cancel a running scan
router.post('/cancel/:scanId', authenticateToken, requirePermission('access.assets'), async (req, res) => {
  try {
    const { scanId } = req.params
    const userId = req.user.username
    
    // Verify scan belongs to user
    const scanStatus = await greenboneService.getScanStatus(scanId)
    
    if (!scanStatus) {
      return res.status(404).json({ 
        success: false, 
        error: 'Scan not found' 
      })
    }
    
    if (scanStatus.userId !== userId) {
      return res.status(403).json({ 
        success: false, 
        error: 'Access denied to this scan' 
      })
    }
    
    if (scanStatus.status === 'completed' || scanStatus.status === 'failed') {
      return res.status(400).json({ 
        success: false, 
        error: 'Cannot cancel completed or failed scan' 
      })
    }
    
    // Update scan status to cancelled
    await greenboneService.updateScanStatus(scanId, 'cancelled', scanStatus.progress, 'Scan cancelled by user')
    
    res.json({
      success: true,
      message: 'Scan cancelled successfully'
    })
  } catch (error) {
    console.error('Error cancelling scan:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Failed to cancel scan' 
    })
  }
})

export default router