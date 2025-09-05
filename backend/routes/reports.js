import express from 'express'
import { createClient } from 'redis'
import { authenticateToken, requirePermission } from '../middleware/auth.js'
import { reportData } from '../data/report-data.js'

const router = express.Router()
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
redis.on('error', (e) => console.error('Redis error in reports routes:', e))
await redis.connect()

// Get report summary
router.get('/summary', authenticateToken, requirePermission('access.reports'), async (req, res) => {
  try {
    // Check if user is user1 (has access to this specific report)
    if (req.user.username !== 'user1') {
      return res.status(403).json({ message: 'Access denied to this report' })
    }

    res.json({
      summary: reportData.summary,
      reportDate: reportData.reportDate,
      lastScan: reportData.lastScan
    })
  } catch (error) {
    console.error('Error fetching report summary:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get detailed vulnerabilities
router.get('/vulnerabilities', authenticateToken, requirePermission('access.reports'), async (req, res) => {
  try {
    if (req.user.username !== 'user1') {
      return res.status(403).json({ message: 'Access denied to this report' })
    }

    res.json({
      vulnerabilities: reportData.vulnerabilities,
      totalCount: reportData.vulnerabilities.length
    })
  } catch (error) {
    console.error('Error fetching vulnerabilities:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get assets data
router.get('/assets', authenticateToken, requirePermission('access.reports'), async (req, res) => {
  try {
    if (req.user.username !== 'user1') {
      return res.status(403).json({ message: 'Access denied to this report' })
    }

    res.json({
      assets: reportData.assets,
      totalCount: reportData.assets.length
    })
  } catch (error) {
    console.error('Error fetching assets:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get user profile data
router.get('/profile', authenticateToken, requirePermission('access.reports'), async (req, res) => {
  try {
    if (req.user.username !== 'user1') {
      return res.status(403).json({ message: 'Access denied to this report' })
    }

    res.json({
      profile: reportData.userProfile
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get compliance data
router.get('/compliance', authenticateToken, requirePermission('access.reports'), async (req, res) => {
  try {
    if (req.user.username !== 'user1') {
      return res.status(403).json({ message: 'Access denied to this report' })
    }

    res.json({
      compliance: reportData.compliance
    })
  } catch (error) {
    console.error('Error fetching compliance data:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Get full report data
router.get('/full', authenticateToken, requirePermission('access.reports'), async (req, res) => {
  try {
    if (req.user.username !== 'user1') {
      return res.status(403).json({ message: 'Access denied to this report' })
    }

    res.json({
      report: reportData
    })
  } catch (error) {
    console.error('Error fetching full report:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Export report as PDF (mock endpoint)
router.get('/export/pdf', authenticateToken, requirePermission('access.reports'), async (req, res) => {
  try {
    if (req.user.username !== 'user1') {
      return res.status(403).json({ message: 'Access denied to this report' })
    }

    // Mock PDF export - in real implementation, you would generate actual PDF
    res.json({
      message: 'PDF export initiated',
      downloadUrl: '/api/reports/download/pdf-report.pdf',
      status: 'generating'
    })
  } catch (error) {
    console.error('Error exporting PDF:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Export report as Excel (mock endpoint)
router.get('/export/excel', authenticateToken, requirePermission('access.reports'), async (req, res) => {
  try {
    if (req.user.username !== 'user1') {
      return res.status(403).json({ message: 'Access denied to this report' })
    }

    // Mock Excel export - in real implementation, you would generate actual Excel file
    res.json({
      message: 'Excel export initiated',
      downloadUrl: '/api/reports/download/excel-report.xlsx',
      status: 'generating'
    })
  } catch (error) {
    console.error('Error exporting Excel:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router