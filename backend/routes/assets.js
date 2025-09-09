import express from 'express';
import { createClient } from 'redis';
import { authenticateToken } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Подключение к Redis
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
});

client.on('error', (err) => console.log('Redis Client Error', err));

// Подключаемся к Redis при загрузке модуля
(async () => {
  try {
    if (!client.isOpen) {
      await client.connect();
      console.log('Assets Redis client connected');
    }
  } catch (error) {
    console.error('Failed to connect to Redis in assets routes:', error);
  }
})();

// GET /api/assets - Получение всех активов для пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Проверяем подключение к Redis
    if (!client.isOpen) {
      await client.connect();
    }
    
    const user = req.user;
    const userOrgs = user.organizations || [];
    
    console.log('Assets request for user:', user.username, 'organizations:', userOrgs);
    
    // Get assets from all companies the user has access to
    const allAssets = [];
    
    for (const org of userOrgs) {
      // Для Company LLD используем фиксированный ID
      const companyId = org === 'Company LLD' ? 'company-lld' : `company-${org.toLowerCase().replace(/\s+/g, '-')}`;
      console.log(`Looking for assets in company: ${companyId}`);
      
      const assetIds = await client.sMembers(`company:${companyId}:assetIds`);
      console.log(`Found asset IDs for ${companyId}:`, assetIds);
      
      for (const assetId of assetIds) {
        const assetData = await client.hGet(`company:${companyId}:assets`, assetId);
        if (assetData) {
          const asset = JSON.parse(assetData);
          console.log(`Loaded asset:`, asset.name);
          allAssets.push({
            id: asset.assetId,
            ...asset
          });
        }
      }
    }
    
    console.log(`Total assets found for user ${user.username}:`, allAssets.length);

    res.json({
      success: true,
      data: allAssets
    });
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assets'
    });
  }
});

// POST /api/assets - Создание нового актива
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      type,
      environment,
      assignedStandards,
      compliancePercentage,
      riskLevel,
      lastAssessment,
      owner,
      description,
      ipUrl
    } = req.body;

    // Валидация обязательных полей
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name and type are required'
      });
    }

    const id = uuidv4();
    const assetData = {
      name,
      type,
      environment: environment || 'Production',
      assignedStandards: Array.isArray(assignedStandards) ? assignedStandards : [],
      compliancePercentage: parseInt(compliancePercentage) || 0,
      riskLevel: riskLevel || 'Not Assessed',
      lastAssessment: lastAssessment || '',
      owner: owner || '',
      description: description || '',
      ipUrl: ipUrl || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Сохранение в Redis
    await client.hSet(`assets:${userId}`, id, JSON.stringify(assetData));

    // Логирование действия
    await client.lPush(`assets:logs:${userId}`, JSON.stringify({
      action: 'create',
      assetId: id,
      assetName: name,
      timestamp: new Date().toISOString()
    }));

    res.status(201).json({
      success: true,
      message: 'Asset created successfully',
      data: {
        id,
        ...assetData
      }
    });
  } catch (error) {
    console.error('Error creating asset:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create asset'
    });
  }
});

// PUT /api/assets/:id - Обновление актива
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      name,
      type,
      environment,
      assignedStandards,
      compliancePercentage,
      riskLevel,
      lastAssessment,
      owner,
      description,
      ipUrl
    } = req.body;

    // Проверка существования актива
    const existingData = await client.hGet(`assets:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    // Валидация обязательных полей
    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name and type are required'
      });
    }

    const existingAsset = JSON.parse(existingData);
    const updatedData = {
      ...existingAsset,
      name,
      type,
      environment: environment || 'Production',
      assignedStandards: Array.isArray(assignedStandards) ? assignedStandards : [],
      compliancePercentage: parseInt(compliancePercentage) || 0,
      riskLevel: riskLevel || 'Not Assessed',
      lastAssessment: lastAssessment || '',
      owner: owner || '',
      description: description || '',
      ipUrl: ipUrl || '',
      updatedAt: new Date().toISOString()
    };

    // Обновление в Redis
    await client.hSet(`assets:${userId}`, id, JSON.stringify(updatedData));

    // Логирование действия
    await client.lPush(`assets:logs:${userId}`, JSON.stringify({
      action: 'update',
      assetId: id,
      assetName: name,
      timestamp: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: 'Asset updated successfully',
      data: {
        id,
        ...updatedData
      }
    });
  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update asset'
    });
  }
});

// DELETE /api/assets/:id - Удаление актива
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Проверка существования актива
    const existingData = await client.hGet(`assets:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    const existingAsset = JSON.parse(existingData);

    // Удаление из Redis
    await client.hDel(`assets:${userId}`, id);

    // Логирование действия
    await client.lPush(`assets:logs:${userId}`, JSON.stringify({
      action: 'delete',
      assetId: id,
      assetName: existingAsset.name,
      timestamp: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: 'Asset deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete asset'
    });
  }
});

// POST /api/assets/:id/scan - Сканирование актива
router.post('/:id/scan', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Проверка существования актива
    const existingData = await client.hGet(`assets:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    const existingAsset = JSON.parse(existingData);
    
    // Симуляция сканирования
    const scanResults = {
      vulnerabilities: Math.floor(Math.random() * 10),
      complianceScore: Math.floor(Math.random() * 100),
      riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      scanDate: new Date().toISOString()
    };

    const updatedData = {
      ...existingAsset,
      compliancePercentage: scanResults.complianceScore,
      riskLevel: scanResults.riskLevel,
      lastAssessment: 'Just now',
      updatedAt: new Date().toISOString()
    };

    // Обновление актива с результатами сканирования
    await client.hSet(`assets:${userId}`, id, JSON.stringify(updatedData));

    // Сохранение результатов сканирования
    await client.lPush(`assets:scans:${userId}:${id}`, JSON.stringify(scanResults));

    // Логирование действия
    await client.lPush(`assets:logs:${userId}`, JSON.stringify({
      action: 'scan',
      assetId: id,
      assetName: existingAsset.name,
      scanResults,
      timestamp: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: 'Asset scan completed successfully',
      data: {
        asset: {
          id,
          ...updatedData
        },
        scanResults
      }
    });
  } catch (error) {
    console.error('Error scanning asset:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to scan asset'
    });
  }
});

// GET /api/assets/:id/export - Экспорт актива
router.get('/:id/export', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { format = 'json' } = req.query;

    const existingData = await client.hGet(`assets:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    const asset = JSON.parse(existingData);

    if (format === 'pdf') {
      // Симуляция экспорта в PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="asset-${id}.pdf"`);
      res.json({
        success: true,
        message: 'PDF export generated',
        data: asset,
        format: 'pdf'
      });
    } else if (format === 'excel') {
      // Симуляция экспорта в Excel
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="asset-${id}.xlsx"`);
      res.json({
        success: true,
        message: 'Excel export generated',
        data: asset,
        format: 'excel'
      });
    } else {
      res.json({
        success: true,
        data: asset
      });
    }
  } catch (error) {
    console.error('Error exporting asset:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export asset'
    });
  }
});

// GET /api/assets/:id/scans - Получение истории сканирований актива
router.get('/:id/scans', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Проверка существования актива
    const existingData = await client.hGet(`assets:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Asset not found'
      });
    }

    const scans = await client.lRange(`assets:scans:${userId}:${id}`, 0, -1);
    const parsedScans = scans.map(scan => JSON.parse(scan));

    res.json({
      success: true,
      data: parsedScans
    });
  } catch (error) {
    console.error('Error fetching asset scans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch asset scans'
    });
  }
});

// GET /api/assets/logs/:userId - Получение логов активов
router.get('/logs/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;

    // Проверка прав доступа (только админы или владелец)
    if (req.user.role !== 'admin' && requestingUserId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const logs = await client.lRange(`assets:logs:${userId}`, 0, -1);
    const parsedLogs = logs.map(log => JSON.parse(log));

    res.json({
      success: true,
      data: parsedLogs
    });
  } catch (error) {
    console.error('Error fetching asset logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch asset logs'
    });
  }
});

// GET /api/assets/stats - Статистика по активам (только для админов)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin role required.'
      });
    }

    // Получение всех пользователей
    const users = await client.sMembers('users');
    let totalAssets = 0;
    let totalCompliance = 0;
    let riskDistribution = {
      'High': 0,
      'Medium': 0,
      'Low': 0,
      'Not Assessed': 0
    };
    let typeDistribution = {};

    for (const userId of users) {
      const assets = await client.hGetAll(`assets:${userId}`);
      totalAssets += Object.keys(assets).length;
      
      Object.values(assets).forEach(assetData => {
        const asset = JSON.parse(assetData);
        totalCompliance += asset.compliancePercentage || 0;
        riskDistribution[asset.riskLevel] = (riskDistribution[asset.riskLevel] || 0) + 1;
        typeDistribution[asset.type] = (typeDistribution[asset.type] || 0) + 1;
      });
    }

    const avgCompliance = totalAssets > 0 ? Math.round(totalCompliance / totalAssets) : 0;

    res.json({
      success: true,
      data: {
        totalAssets,
        avgCompliance,
        riskDistribution,
        typeDistribution,
        totalUsers: users.length
      }
    });
  } catch (error) {
    console.error('Error fetching asset stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch asset statistics'
    });
  }
});

export default router;