const express = require('express');
const router = express.Router();
const greenboneService = require('../services/greenboneService');
const { authenticateToken } = require('../middleware/auth');

/**
 * Start asset scan
 * POST /api/scan/start
 */
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const { assets } = req.body;
    const userId = req.user.id;

    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Assets array is required and cannot be empty'
      });
    }

    // Validate assets structure
    for (const asset of assets) {
      if (!asset.ip && !asset.domain) {
        return res.status(400).json({
          success: false,
          message: 'Each asset must have either IP or domain'
        });
      }
    }

    const result = await greenboneService.startScan(assets, userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('Scan start error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
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

    const result = await greenboneService.getScanStatus(scanId);

    if (result.success) {
      // Verify user owns this scan
      if (result.data.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this scan'
        });
      }

      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }

  } catch (error) {
    console.error('Get scan status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * Get user's active scan
 * GET /api/scan/active
 */
router.get('/active', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await greenboneService.getUserActiveScan(userId);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }

  } catch (error) {
    console.error('Get active scan error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
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

    const result = await greenboneService.getScanStatus(scanId);

    if (result.success) {
      // Verify user owns this scan
      if (result.data.userId !== userId) {
        return res.status(403).json({
          success: false,
          message: 'Access denied to this scan'
        });
      }

      // Check if scan is completed
      if (result.data.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Scan is not completed yet'
        });
      }

      res.status(200).json({
        success: true,
        data: {
          scanId: result.data.scanId,
          reports: result.data.reports || [],
          reportCount: result.data.reportCount || 0,
          startTime: result.data.startTime,
          endTime: result.data.endTime,
          assets: result.data.assets
        }
      });
    } else {
      res.status(404).json(result);
    }

  } catch (error) {
    console.error('Get scan report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

/**
 * Test Greenbone connection
 * GET /api/scan/test-connection
 */
router.get('/test-connection', authenticateToken, async (req, res) => {
  try {
    const result = await greenboneService.connectToGreenbone();

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(500).json(result);
    }

  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;