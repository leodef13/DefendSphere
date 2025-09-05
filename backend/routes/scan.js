const express = require('express');
const router = express.Router();
const greenboneService = require('../services/greenboneService');
const { authenticateToken } = require('../middleware/auth');

// Initialize Greenbone service
greenboneService.initialize().catch(console.error);

// Start scan endpoint
router.post('/start', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { assets } = req.body;

    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Assets array is required and cannot be empty'
      });
    }

    // Validate assets format
    const validAssets = assets.filter(asset => 
      asset && (asset.ip || asset.domain) && asset.id
    );

    if (validAssets.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid assets with IP or domain are required'
      });
    }

    const result = await greenboneService.startScan(validAssets, userId);

    if (result.success) {
      res.json({
        success: true,
        scanId: result.scanId,
        message: result.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Start scan error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to start scan'
    });
  }
});

// Get scan status endpoint
router.get('/status/:scanId', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    if (!scanId) {
      return res.status(400).json({
        success: false,
        error: 'Scan ID is required'
      });
    }

    const result = await greenboneService.getScanStatus(scanId);

    if (result.success === false && result.error === 'Scan not found') {
      return res.status(404).json({
        success: false,
        error: 'Scan not found'
      });
    }

    // Verify scan belongs to user
    if (result.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      scan: result
    });
  } catch (error) {
    console.error('Get scan status error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to get scan status'
    });
  }
});

// Get scan report endpoint
router.get('/report/:scanId', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    if (!scanId) {
      return res.status(400).json({
        success: false,
        error: 'Scan ID is required'
      });
    }

    // First check scan status to verify ownership
    const scanStatus = await greenboneService.getScanStatus(scanId);
    if (scanStatus.success === false && scanStatus.error === 'Scan not found') {
      return res.status(404).json({
        success: false,
        error: 'Scan not found'
      });
    }

    if (scanStatus.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const result = await greenboneService.getReports(scanId);

    if (result.success) {
      res.json({
        success: true,
        reports: result.reports,
        message: result.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Get scan report error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to get scan report'
    });
  }
});

// Update user assets with scan results
router.post('/update-assets/:scanId', authenticateToken, async (req, res) => {
  try {
    const { scanId } = req.params;
    const userId = req.user.id;

    if (!scanId) {
      return res.status(400).json({
        success: false,
        error: 'Scan ID is required'
      });
    }

    // Verify scan belongs to user
    const scanStatus = await greenboneService.getScanStatus(scanId);
    if (scanStatus.success === false && scanStatus.error === 'Scan not found') {
      return res.status(404).json({
        success: false,
        error: 'Scan not found'
      });
    }

    if (scanStatus.userId !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const result = await greenboneService.updateUserAssets(userId, scanId);

    if (result.success) {
      res.json({
        success: true,
        assets: result.assets,
        message: result.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Update user assets error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to update user assets'
    });
  }
});

// Test Greenbone connection
router.get('/test-connection', authenticateToken, async (req, res) => {
  try {
    const result = await greenboneService.connectToGreenbone();

    if (result.success) {
      res.json({
        success: true,
        version: result.version,
        message: result.message
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.error,
        message: result.message
      });
    }
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to test connection'
    });
  }
});

// Get user assets for scan
router.get('/user-assets', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const assets = await greenboneService.getUserAssets(userId);

    res.json({
      success: true,
      assets: assets
    });
  } catch (error) {
    console.error('Get user assets error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: 'Failed to get user assets'
    });
  }
});

module.exports = router;