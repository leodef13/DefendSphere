const express = require('express');
const router = express.Router();
const redis = require('redis');
const { authenticateToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// Подключение к Redis
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

// GET /api/customer-trust - Получение всех записей Customer Trust для пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const customerTrusts = await client.hGetAll(`customer-trust:${userId}`);
    
    const records = Object.keys(customerTrusts).map(key => {
      const data = JSON.parse(customerTrusts[key]);
      return {
        id: key,
        ...data
      };
    });

    res.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Error fetching customer trust records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer trust records'
    });
  }
});

// POST /api/customer-trust - Создание новой записи Customer Trust
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      name,
      category,
      sector,
      assignedStandards,
      compliancePercentage,
      lastAssessment,
      responsiblePerson,
      email,
      website
    } = req.body;

    // Валидация обязательных полей
    if (!name || !category || !sector || !responsiblePerson || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const id = uuidv4();
    const customerTrustData = {
      name,
      category,
      sector,
      assignedStandards: Array.isArray(assignedStandards) ? assignedStandards : [],
      compliancePercentage: parseInt(compliancePercentage) || 0,
      lastAssessment: lastAssessment || '',
      responsiblePerson,
      email,
      website: website || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Сохранение в Redis
    await client.hSet(`customer-trust:${userId}`, id, JSON.stringify(customerTrustData));

    // Логирование действия
    await client.lPush(`customer-trust:logs:${userId}`, JSON.stringify({
      action: 'create',
      recordId: id,
      recordName: name,
      timestamp: new Date().toISOString()
    }));

    res.status(201).json({
      success: true,
      message: 'Customer Trust record created successfully',
      data: {
        id,
        ...customerTrustData
      }
    });
  } catch (error) {
    console.error('Error creating customer trust record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer trust record'
    });
  }
});

// PUT /api/customer-trust/:id - Обновление записи Customer Trust
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      name,
      category,
      sector,
      assignedStandards,
      compliancePercentage,
      lastAssessment,
      responsiblePerson,
      email,
      website
    } = req.body;

    // Проверка существования записи
    const existingData = await client.hGet(`customer-trust:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Customer Trust record not found'
      });
    }

    // Валидация обязательных полей
    if (!name || !category || !sector || !responsiblePerson || !email) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    const existingRecord = JSON.parse(existingData);
    const updatedData = {
      ...existingRecord,
      name,
      category,
      sector,
      assignedStandards: Array.isArray(assignedStandards) ? assignedStandards : [],
      compliancePercentage: parseInt(compliancePercentage) || 0,
      lastAssessment: lastAssessment || '',
      responsiblePerson,
      email,
      website: website || '',
      updatedAt: new Date().toISOString()
    };

    // Обновление в Redis
    await client.hSet(`customer-trust:${userId}`, id, JSON.stringify(updatedData));

    // Логирование действия
    await client.lPush(`customer-trust:logs:${userId}`, JSON.stringify({
      action: 'update',
      recordId: id,
      recordName: name,
      timestamp: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: 'Customer Trust record updated successfully',
      data: {
        id,
        ...updatedData
      }
    });
  } catch (error) {
    console.error('Error updating customer trust record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer trust record'
    });
  }
});

// DELETE /api/customer-trust/:id - Удаление записи Customer Trust
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Проверка существования записи
    const existingData = await client.hGet(`customer-trust:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Customer Trust record not found'
      });
    }

    const existingRecord = JSON.parse(existingData);

    // Удаление из Redis
    await client.hDel(`customer-trust:${userId}`, id);

    // Логирование действия
    await client.lPush(`customer-trust:logs:${userId}`, JSON.stringify({
      action: 'delete',
      recordId: id,
      recordName: existingRecord.name,
      timestamp: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: 'Customer Trust record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting customer trust record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer trust record'
    });
  }
});

// GET /api/customer-trust/:id/export - Экспорт записи Customer Trust
router.get('/:id/export', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { format = 'json' } = req.query;

    const existingData = await client.hGet(`customer-trust:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Customer Trust record not found'
      });
    }

    const record = JSON.parse(existingData);

    if (format === 'pdf') {
      // Симуляция экспорта в PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="customer-trust-${id}.pdf"`);
      res.json({
        success: true,
        message: 'PDF export generated',
        data: record,
        format: 'pdf'
      });
    } else if (format === 'excel') {
      // Симуляция экспорта в Excel
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="customer-trust-${id}.xlsx"`);
      res.json({
        success: true,
        message: 'Excel export generated',
        data: record,
        format: 'excel'
      });
    } else {
      res.json({
        success: true,
        data: record
      });
    }
  } catch (error) {
    console.error('Error exporting customer trust record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export customer trust record'
    });
  }
});

// GET /api/customer-trust/logs/:userId - Получение логов Customer Trust
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

    const logs = await client.lRange(`customer-trust:logs:${userId}`, 0, -1);
    const parsedLogs = logs.map(log => JSON.parse(log));

    res.json({
      success: true,
      data: parsedLogs
    });
  } catch (error) {
    console.error('Error fetching customer trust logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer trust logs'
    });
  }
});

// GET /api/customer-trust/stats - Статистика по Customer Trust (только для админов)
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
    let totalRecords = 0;
    let totalCompliance = 0;
    let statusDistribution = {
      'Client': 0,
      'Partner': 0
    };

    for (const userId of users) {
      const records = await client.hGetAll(`customer-trust:${userId}`);
      totalRecords += Object.keys(records).length;
      
      Object.values(records).forEach(recordData => {
        const record = JSON.parse(recordData);
        totalCompliance += record.compliancePercentage || 0;
        statusDistribution[record.category] = (statusDistribution[record.category] || 0) + 1;
      });
    }

    const avgCompliance = totalRecords > 0 ? Math.round(totalCompliance / totalRecords) : 0;

    res.json({
      success: true,
      data: {
        totalRecords,
        avgCompliance,
        statusDistribution,
        totalUsers: users.length
      }
    });
  } catch (error) {
    console.error('Error fetching customer trust stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer trust statistics'
    });
  }
});

module.exports = router;