const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth.js');
const greenboneService = require('../services/greenboneService.js');
const redis = require('../config/redis.js');

/**
 * Start asset scan
 * POST /api/scan/start
 */
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { assets } = req.body;

    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Assets list is required and must not be empty'
      });
    }

    // Check if user has assets
    const userAssets = await redis.hgetall(`user:${userId}:assets`);
    if (Object.keys(userAssets).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No assets found for user. Please add assets first.'
      });
    }

    // Start scan
    const result = await greenboneService.startScan(assets, userId);
    
    if (result.success) {
      // Store scan info in Redis
      await redis.hset(`scan:${result.scanId}`, {
        userId,
        status: 'running',
        startTime: new Date().toISOString(),
        assets: JSON.stringify(assets)
      });

      // Log the action
      await redis.lpush(`user:${userId}:actions`, JSON.stringify({
        action: 'scan_started',
        scanId: result.scanId,
        timestamp: new Date().toISOString(),
        assets: assets.length
      }));

      res.json({
        success: true,
        scanId: result.scanId,
        message: 'Scan started successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error('Error starting scan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get scan status
 * GET /api/scan/status/:scanId
 */
router.get('/status/:scanId', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    // Check if user owns this scan
    const scanInfo = await redis.hgetall(`scan:${scanId}`);
    if (!scanInfo || scanInfo.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found or access denied'
      });
    }

    // Get status from Greenbone service
    const result = await greenboneService.getScanStatus(scanId);
    
    if (result.success) {
      // Update Redis with latest status
      await redis.hset(`scan:${scanId}`, {
        status: result.status,
        progress: result.progress,
        endTime: result.endTime || ''
      });

      res.json({
        success: true,
        scanId: result.scanId,
        status: result.status,
        progress: result.progress,
        startTime: result.startTime,
        endTime: result.endTime,
        assets: result.assets
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error('Error getting scan status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get scan report
 * GET /api/scan/report/:scanId
 */
router.get('/report/:scanId', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    // Check if user owns this scan
    const scanInfo = await redis.hgetall(`scan:${scanId}`);
    if (!scanInfo || scanInfo.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found or access denied'
      });
    }

    // Get reports from Greenbone service
    const result = await greenboneService.getScanReports(scanId);
    
    if (result.success) {
      // Store report data in Redis for future access
      await redis.hset(`report:${scanId}`, {
        userId,
        scanId,
        timestamp: new Date().toISOString(),
        data: JSON.stringify(result.reports[0])
      });

      // Log the action
      await redis.lpush(`user:${userId}:actions`, JSON.stringify({
        action: 'report_generated',
        scanId,
        timestamp: new Date().toISOString(),
        vulnerabilities: result.reports[0].vulnerabilities?.length || 0
      }));

      res.json({
        success: true,
        scanId: result.scanId,
        report: result.reports[0]
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error('Error getting scan report:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Export scan report to PDF
 * GET /api/scan/export/pdf/:scanId
 */
router.get('/export/pdf/:scanId', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    // Check if user owns this scan
    const scanInfo = await redis.hgetall(`scan:${scanId}`);
    if (!scanInfo || scanInfo.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found or access denied'
      });
    }

    // Export to PDF
    const result = await greenboneService.exportReportToPDF(scanId);
    
    if (result.success) {
      // Log the action
      await redis.lpush(`user:${userId}:actions`, JSON.stringify({
        action: 'report_exported_pdf',
        scanId,
        timestamp: new Date().toISOString(),
        filename: result.filename
      }));

      res.json({
        success: true,
        filename: result.filename,
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Export scan report to Excel
 * GET /api/scan/export/excel/:scanId
 */
router.get('/export/excel/:scanId', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    // Check if user owns this scan
    const scanInfo = await redis.hgetall(`scan:${scanId}`);
    if (!scanInfo || scanInfo.userId !== userId) {
      return res.status(404).json({
        success: false,
        message: 'Scan not found or access denied'
      });
    }

    // Export to Excel
    const result = await greenboneService.exportReportToExcel(scanId);
    
    if (result.success) {
      // Log the action
      await redis.lpush(`user:${userId}:actions`, JSON.stringify({
        action: 'report_exported_excel',
        scanId,
        timestamp: new Date().toISOString(),
        filename: result.filename
      }));

      res.json({
        success: true,
        filename: result.filename,
        data: result.data
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message
      });
    }

  } catch (error) {
    console.error('Error exporting Excel:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Get user's scan history
 * GET /api/scan/history
 */
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all scans for this user
    const scanKeys = await redis.keys(`scan:*`);
    const userScans = [];

    for (const key of scanKeys) {
      const scanInfo = await redis.hgetall(key);
      if (scanInfo.userId === userId) {
        userScans.push({
          scanId: key.replace('scan:', ''),
          status: scanInfo.status,
          startTime: scanInfo.startTime,
          endTime: scanInfo.endTime,
          progress: scanInfo.progress || 0,
          assets: JSON.parse(scanInfo.assets || '[]')
        });
      }
    }

    // Sort by start time (newest first)
    userScans.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));

    res.json({
      success: true,
      scans: userScans
    });

  } catch (error) {
    console.error('Error getting scan history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * Check if user has assets
 * GET /api/scan/check-assets
 */
router.get('/check-assets', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user has assets
    const userAssets = await redis.hgetall(`user:${userId}:assets`);
    const hasAssets = Object.keys(userAssets).length > 0;

    res.json({
      success: true,
      hasAssets,
      assetCount: Object.keys(userAssets).length
    });

  } catch (error) {
    console.error('Error checking assets:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;