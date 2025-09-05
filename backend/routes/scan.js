const express = require('express');
const router = express.Router();
const greenboneService = require('../services/greenboneService.js');
const { authenticateToken } = require('../middleware/auth.js');

/**
 * POST /api/scan/start
 * Start a new scan for user assets
 */
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.username;
    
    // Check if user has assets
    const assetsCheck = await greenboneService.checkUserAssets(userId);
    if (!assetsCheck.success) {
      return res.status(500).json({
        success: false,
        message: assetsCheck.message
      });
    }

    if (!assetsCheck.hasAssets) {
      return res.status(400).json({
        success: false,
        message: 'No assets found for scanning. Please add assets first.'
      });
    }

    // Start the scan
    const scanResult = await greenboneService.startScan(assetsCheck.assets, userId);
    
    if (!scanResult.success) {
      return res.status(500).json({
        success: false,
        message: scanResult.message
      });
    }

    res.json({
      success: true,
      scanId: scanResult.scanId,
      message: 'Scan started successfully',
      assets: assetsCheck.assets
    });

  } catch (error) {
    console.error('Error starting scan:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while starting scan'
    });
  }
});

/**
 * GET /api/scan/status/:scanId
 * Get scan status
 */
router.get('/status/:scanId', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.username;

    const statusResult = await greenboneService.getScanStatus(scanId);
    
    if (!statusResult.success) {
      return res.status(404).json({
        success: false,
        message: statusResult.message
      });
    }

    res.json({
      success: true,
      scanId,
      status: statusResult.status,
      progress: statusResult.progress,
      startTime: statusResult.startTime,
      endTime: statusResult.endTime,
      assets: statusResult.assets
    });

  } catch (error) {
    console.error('Error getting scan status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while getting scan status'
    });
  }
});

/**
 * GET /api/scan/report/:scanId
 * Get scan reports
 */
router.get('/report/:scanId', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.username;

    const reportResult = await greenboneService.getScanReports(scanId);
    
    if (!reportResult.success) {
      return res.status(404).json({
        success: false,
        message: reportResult.message
      });
    }

    res.json({
      success: true,
      scanId,
      reports: reportResult.reports,
      message: 'Reports retrieved successfully'
    });

  } catch (error) {
    console.error('Error getting scan reports:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while getting scan reports'
    });
  }
});

/**
 * GET /api/scan/assets
 * Check if user has assets for scanning
 */
router.get('/assets', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.username;
    
    const assetsCheck = await greenboneService.checkUserAssets(userId);
    
    res.json({
      success: true,
      hasAssets: assetsCheck.hasAssets,
      assets: assetsCheck.assets || []
    });

  } catch (error) {
    console.error('Error checking user assets:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while checking assets'
    });
  }
});

/**
 * POST /api/scan/connect
 * Test connection to Greenbone
 */
router.post('/connect', authenticateToken, async (req, res) => {
  try {
    const connectionResult = await greenboneService.connectToGreenbone();
    
    res.json({
      success: connectionResult.success,
      message: connectionResult.message
    });

  } catch (error) {
    console.error('Error testing Greenbone connection:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while testing connection'
    });
  }
});

module.exports = router;