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

// GET /api/compliance - Получение всех записей Compliance для пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const complianceRecords = await client.hGetAll(`compliance:${userId}`);
    
    const records = Object.keys(complianceRecords).map(key => {
      const data = JSON.parse(complianceRecords[key]);
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
    console.error('Error fetching compliance records:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance records'
    });
  }
});

// POST /api/compliance - Создание новой записи Compliance
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      standard,
      department,
      status,
      compliancePercentage,
      lastAssessmentDate,
      nextScheduledAssessment,
      recommendations
    } = req.body;

    // Валидация обязательных полей
    if (!standard || !department) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: standard and department are required'
      });
    }

    const id = uuidv4();
    const complianceData = {
      standard,
      department,
      status: status || 'Not Assessed',
      compliancePercentage: parseInt(compliancePercentage) || 0,
      lastAssessmentDate: lastAssessmentDate || '',
      nextScheduledAssessment: nextScheduledAssessment || '',
      recommendations: recommendations || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Сохранение в Redis
    await client.hSet(`compliance:${userId}`, id, JSON.stringify(complianceData));

    // Логирование действия
    await client.lPush(`compliance:logs:${userId}`, JSON.stringify({
      action: 'create',
      recordId: id,
      standard: standard,
      timestamp: new Date().toISOString()
    }));

    res.status(201).json({
      success: true,
      message: 'Compliance record created successfully',
      data: {
        id,
        ...complianceData
      }
    });
  } catch (error) {
    console.error('Error creating compliance record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create compliance record'
    });
  }
});

// PUT /api/compliance/:id - Обновление записи Compliance
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      standard,
      department,
      status,
      compliancePercentage,
      lastAssessmentDate,
      nextScheduledAssessment,
      recommendations
    } = req.body;

    // Проверка существования записи
    const existingData = await client.hGet(`compliance:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Compliance record not found'
      });
    }

    // Валидация обязательных полей
    if (!standard || !department) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: standard and department are required'
      });
    }

    const existingRecord = JSON.parse(existingData);
    const updatedData = {
      ...existingRecord,
      standard,
      department,
      status: status || 'Not Assessed',
      compliancePercentage: parseInt(compliancePercentage) || 0,
      lastAssessmentDate: lastAssessmentDate || '',
      nextScheduledAssessment: nextScheduledAssessment || '',
      recommendations: recommendations || '',
      updatedAt: new Date().toISOString()
    };

    // Обновление в Redis
    await client.hSet(`compliance:${userId}`, id, JSON.stringify(updatedData));

    // Логирование действия
    await client.lPush(`compliance:logs:${userId}`, JSON.stringify({
      action: 'update',
      recordId: id,
      standard: standard,
      timestamp: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: 'Compliance record updated successfully',
      data: {
        id,
        ...updatedData
      }
    });
  } catch (error) {
    console.error('Error updating compliance record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update compliance record'
    });
  }
});

// DELETE /api/compliance/:id - Удаление записи Compliance
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Проверка существования записи
    const existingData = await client.hGet(`compliance:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Compliance record not found'
      });
    }

    const existingRecord = JSON.parse(existingData);

    // Удаление из Redis
    await client.hDel(`compliance:${userId}`, id);

    // Логирование действия
    await client.lPush(`compliance:logs:${userId}`, JSON.stringify({
      action: 'delete',
      recordId: id,
      standard: existingRecord.standard,
      timestamp: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: 'Compliance record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting compliance record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete compliance record'
    });
  }
});

// GET /api/compliance/:id/export - Экспорт записи Compliance
router.get('/:id/export', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { format = 'json' } = req.query;

    const existingData = await client.hGet(`compliance:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Compliance record not found'
      });
    }

    const record = JSON.parse(existingData);

    if (format === 'pdf') {
      // Симуляция экспорта в PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="compliance-${id}.pdf"`);
      res.json({
        success: true,
        message: 'PDF export generated',
        data: record,
        format: 'pdf'
      });
    } else if (format === 'excel') {
      // Симуляция экспорта в Excel
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="compliance-${id}.xlsx"`);
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
    console.error('Error exporting compliance record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export compliance record'
    });
  }
});

// GET /api/compliance/summary - Получение сводки по Compliance
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const complianceRecords = await client.hGetAll(`compliance:${userId}`);
    
    const records = Object.values(complianceRecords).map(data => JSON.parse(data));
    
    const summary = {
      totalRecords: records.length,
      totalIncidents: records.filter(r => r.status === 'Non-Compliant').length,
      avgCompliance: records.length > 0 
        ? Math.round(records.reduce((sum, r) => sum + (r.compliancePercentage || 0), 0) / records.length)
        : 0,
      riskLevelDistribution: {
        high: records.filter(r => (r.compliancePercentage || 0) < 40).length,
        medium: records.filter(r => (r.compliancePercentage || 0) >= 40 && (r.compliancePercentage || 0) <= 85).length,
        low: records.filter(r => (r.compliancePercentage || 0) > 85).length,
        notAssessed: records.filter(r => r.status === 'Not Assessed').length
      },
      statusDistribution: {
        'Compliant': records.filter(r => r.status === 'Compliant').length,
        'Partial': records.filter(r => r.status === 'Partial').length,
        'Non-Compliant': records.filter(r => r.status === 'Non-Compliant').length,
        'Not Assessed': records.filter(r => r.status === 'Not Assessed').length
      }
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error fetching compliance summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance summary'
    });
  }
});

// GET /api/compliance/logs/:userId - Получение логов Compliance
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

    const logs = await client.lRange(`compliance:logs:${userId}`, 0, -1);
    const parsedLogs = logs.map(log => JSON.parse(log));

    res.json({
      success: true,
      data: parsedLogs
    });
  } catch (error) {
    console.error('Error fetching compliance logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance logs'
    });
  }
});

// GET /api/compliance/stats - Статистика по Compliance (только для админов)
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
      'Compliant': 0,
      'Partial': 0,
      'Non-Compliant': 0,
      'Not Assessed': 0
    };
    let standardDistribution = {};

    for (const userId of users) {
      const records = await client.hGetAll(`compliance:${userId}`);
      totalRecords += Object.keys(records).length;
      
      Object.values(records).forEach(recordData => {
        const record = JSON.parse(recordData);
        totalCompliance += record.compliancePercentage || 0;
        statusDistribution[record.status] = (statusDistribution[record.status] || 0) + 1;
        standardDistribution[record.standard] = (standardDistribution[record.standard] || 0) + 1;
      });
    }

    const avgCompliance = totalRecords > 0 ? Math.round(totalCompliance / totalRecords) : 0;

    res.json({
      success: true,
      data: {
        totalRecords,
        avgCompliance,
        statusDistribution,
        standardDistribution,
        totalUsers: users.length
      }
    });
  } catch (error) {
    console.error('Error fetching compliance stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance statistics'
    });
  }
});

// POST /api/compliance/:id/assess - Проведение оценки Compliance
router.post('/:id/assess', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { assessmentData } = req.body;

    // Проверка существования записи
    const existingData = await client.hGet(`compliance:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Compliance record not found'
      });
    }

    const existingRecord = JSON.parse(existingData);
    
    // Симуляция оценки
    const assessmentResults = {
      complianceScore: Math.floor(Math.random() * 100),
      status: ['Compliant', 'Partial', 'Non-Compliant'][Math.floor(Math.random() * 3)],
      assessmentDate: new Date().toISOString(),
      assessor: req.user.username,
      findings: assessmentData?.findings || 'Assessment completed successfully'
    };

    const updatedData = {
      ...existingRecord,
      compliancePercentage: assessmentResults.complianceScore,
      status: assessmentResults.status,
      lastAssessmentDate: assessmentResults.assessmentDate,
      updatedAt: new Date().toISOString()
    };

    // Обновление записи с результатами оценки
    await client.hSet(`compliance:${userId}`, id, JSON.stringify(updatedData));

    // Сохранение результатов оценки
    await client.lPush(`compliance:assessments:${userId}:${id}`, JSON.stringify(assessmentResults));

    // Логирование действия
    await client.lPush(`compliance:logs:${userId}`, JSON.stringify({
      action: 'assess',
      recordId: id,
      standard: existingRecord.standard,
      assessmentResults,
      timestamp: new Date().toISOString()
    }));

    res.json({
      success: true,
      message: 'Compliance assessment completed successfully',
      data: {
        record: {
          id,
          ...updatedData
        },
        assessmentResults
      }
    });
  } catch (error) {
    console.error('Error assessing compliance record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to assess compliance record'
    });
  }
});

// GET /api/compliance/:id/assessments - Получение истории оценок Compliance
router.get('/:id/assessments', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Проверка существования записи
    const existingData = await client.hGet(`compliance:${userId}`, id);
    if (!existingData) {
      return res.status(404).json({
        success: false,
        message: 'Compliance record not found'
      });
    }

    const assessments = await client.lRange(`compliance:assessments:${userId}:${id}`, 0, -1);
    const parsedAssessments = assessments.map(assessment => JSON.parse(assessment));

    res.json({
      success: true,
      data: parsedAssessments
    });
  } catch (error) {
    console.error('Error fetching compliance assessments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance assessments'
    });
  }
});

export default router;