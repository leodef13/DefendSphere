import express from 'express'
import { createClient } from 'redis'
import { authenticateToken, requirePermission } from '../middleware/auth.js'
import { reportData } from '../data/report-data.js'
import prisma from '../lib/prisma.js'

const router = express.Router()
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6380' })
redis.on('error', (e) => console.error('Redis error in reports routes:', e))
await redis.connect()

// Get report summary
router.get('/summary', authenticateToken, requirePermission('access.reports'), async (req, res) => {
  try {
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

// Additional Defend routes
router.get('/:id', authenticateToken, requirePermission('access.reports'), async (req, res) => {
  try {
    const id = Number(req.params.id)
    const report = await prisma.reports.findUnique({
      where: { id },
      include: { assets: true, vulnerabilities: true, reportFile: true }
    })
    if (!report) return res.status(404).json({ message: 'Report not found' })
    res.json({ report })
  } catch (error) {
    console.error('Error fetching report by id:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/export/pdf', authenticateToken, requirePermission('access.reports'), async (_req, res) => {
  try {
    // Stub implementation: return queued status and a placeholder URL
    res.json({
      message: 'PDF export queued',
      downloadUrl: '/downloads/report-latest.pdf',
      status: 'queued'
    })
  } catch (error) {
    console.error('Error exporting PDF:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})

router.get('/export/excel', authenticateToken, requirePermission('access.reports'), async (_req, res) => {
  try {
    // Stub implementation: return queued status and a placeholder URL
    res.json({
      message: 'Excel export queued',
      downloadUrl: '/downloads/report-latest.xlsx',
      status: 'queued'
    })
  } catch (error) {
    console.error('Error exporting Excel:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
})