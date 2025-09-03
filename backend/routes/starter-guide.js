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

// GET /api/starter-guide - Получение данных анкеты пользователя
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const starterGuideData = await client.hGetAll(`starter-guide:${userId}`);

    if (!starterGuideData || Object.keys(starterGuideData).length === 0) {
      return res.status(404).json({
        error: 'Starter guide data not found',
        message: 'No starter guide data found for this user'
      });
    }

    // Преобразуем данные из Redis в правильный формат
    const data = {
      id: starterGuideData.id,
      userId: starterGuideData.userId,
      sector: starterGuideData.sector,
      hasInformationSystems: starterGuideData.hasInformationSystems === 'true',
      systemLocation: starterGuideData.systemLocation || undefined,
      processesEUCitizenData: starterGuideData.processesEUCitizenData === 'true',
      dataTypes: starterGuideData.dataTypes ? JSON.parse(starterGuideData.dataTypes) : [],
      hasSecurityStrategy: starterGuideData.hasSecurityStrategy,
      hasSecurityResponsible: starterGuideData.hasSecurityResponsible === 'true',
      hasCybersecurityTeam: starterGuideData.hasCybersecurityTeam,
      hasDisasterRecoveryPlan: starterGuideData.hasDisasterRecoveryPlan,
      testsVulnerabilities: starterGuideData.testsVulnerabilities,
      wantsVulnerabilityReport: starterGuideData.wantsVulnerabilityReport === 'true',
      publicResources: starterGuideData.publicResources || undefined,
      relevantStandards: starterGuideData.relevantStandards ? JSON.parse(starterGuideData.relevantStandards) : [],
      plansCertifiedAudit: starterGuideData.plansCertifiedAudit,
      interestedInPreAudit: starterGuideData.interestedInPreAudit === 'true',
      wantsSelfAssessment: starterGuideData.wantsSelfAssessment === 'true',
      contactName: starterGuideData.contactName,
      companyName: starterGuideData.companyName,
      email: starterGuideData.email,
      phone: starterGuideData.phone,
      privacyPolicyAccepted: starterGuideData.privacyPolicyAccepted === 'true',
      createdAt: starterGuideData.createdAt,
      updatedAt: starterGuideData.updatedAt
    };

    res.json(data);
  } catch (error) {
    console.error('Error fetching starter guide data:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch starter guide data'
    });
  }
});

// POST /api/starter-guide - Создание новой анкеты
router.post('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      sector,
      hasInformationSystems,
      systemLocation,
      processesEUCitizenData,
      dataTypes,
      hasSecurityStrategy,
      hasSecurityResponsible,
      hasCybersecurityTeam,
      hasDisasterRecoveryPlan,
      testsVulnerabilities,
      wantsVulnerabilityReport,
      publicResources,
      relevantStandards,
      plansCertifiedAudit,
      interestedInPreAudit,
      wantsSelfAssessment,
      contactName,
      companyName,
      email,
      phone,
      privacyPolicyAccepted
    } = req.body;

    // Валидация обязательных полей
    if (!sector || !contactName || !companyName || !email || !phone || !privacyPolicyAccepted) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please fill in all required fields'
      });
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    const now = new Date().toISOString();
    const id = uuidv4();

    // Сохраняем данные в Redis
    const starterGuideData = {
      id,
      userId,
      sector,
      hasInformationSystems: hasInformationSystems.toString(),
      systemLocation: systemLocation || '',
      processesEUCitizenData: processesEUCitizenData.toString(),
      dataTypes: JSON.stringify(dataTypes || []),
      hasSecurityStrategy,
      hasSecurityResponsible: hasSecurityResponsible.toString(),
      hasCybersecurityTeam,
      hasDisasterRecoveryPlan,
      testsVulnerabilities,
      wantsVulnerabilityReport: wantsVulnerabilityReport.toString(),
      publicResources: publicResources || '',
      relevantStandards: JSON.stringify(relevantStandards || []),
      plansCertifiedAudit,
      interestedInPreAudit: interestedInPreAudit.toString(),
      wantsSelfAssessment: wantsSelfAssessment.toString(),
      contactName,
      companyName,
      email,
      phone,
      privacyPolicyAccepted: privacyPolicyAccepted.toString(),
      createdAt: now,
      updatedAt: now
    };

    await client.hSet(`starter-guide:${userId}`, starterGuideData);

    // Добавляем в список всех анкет
    await client.sAdd('starter-guide:all', id);
    await client.hSet(`starter-guide:details:${id}`, starterGuideData);

    // Логируем создание
    await client.lPush(`starter-guide:logs:${userId}`, JSON.stringify({
      action: 'created',
      timestamp: now,
      data: { id, companyName, contactName }
    }));

    res.status(201).json({
      ...starterGuideData,
      hasInformationSystems: hasInformationSystems,
      processesEUCitizenData: processesEUCitizenData,
      dataTypes: dataTypes || [],
      hasSecurityResponsible: hasSecurityResponsible,
      wantsVulnerabilityReport: wantsVulnerabilityReport,
      relevantStandards: relevantStandards || [],
      interestedInPreAudit: interestedInPreAudit,
      wantsSelfAssessment: wantsSelfAssessment,
      privacyPolicyAccepted: privacyPolicyAccepted
    });
  } catch (error) {
    console.error('Error creating starter guide:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to create starter guide'
    });
  }
});

// PUT /api/starter-guide/:id - Обновление анкеты
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const updateData = req.body;

    // Проверяем, что анкета принадлежит пользователю
    const existingData = await client.hGetAll(`starter-guide:${userId}`);
    if (!existingData || existingData.id !== id) {
      return res.status(404).json({
        error: 'Starter guide not found',
        message: 'No starter guide found with this ID for this user'
      });
    }

    // Валидация обязательных полей
    if (!updateData.sector || !updateData.contactName || !updateData.companyName || !updateData.email || !updateData.phone || !updateData.privacyPolicyAccepted) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Please fill in all required fields'
      });
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(updateData.email)) {
      return res.status(400).json({
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    const now = new Date().toISOString();

    // Обновляем данные
    const updatedData = {
      ...existingData,
      ...updateData,
      hasInformationSystems: updateData.hasInformationSystems.toString(),
      processesEUCitizenData: updateData.processesEUCitizenData.toString(),
      dataTypes: JSON.stringify(updateData.dataTypes || []),
      hasSecurityResponsible: updateData.hasSecurityResponsible.toString(),
      wantsVulnerabilityReport: updateData.wantsVulnerabilityReport.toString(),
      relevantStandards: JSON.stringify(updateData.relevantStandards || []),
      interestedInPreAudit: updateData.interestedInPreAudit.toString(),
      wantsSelfAssessment: updateData.wantsSelfAssessment.toString(),
      privacyPolicyAccepted: updateData.privacyPolicyAccepted.toString(),
      updatedAt: now
    };

    await client.hSet(`starter-guide:${userId}`, updatedData);
    await client.hSet(`starter-guide:details:${id}`, updatedData);

    // Логируем обновление
    await client.lPush(`starter-guide:logs:${userId}`, JSON.stringify({
      action: 'updated',
      timestamp: now,
      data: { id, companyName: updateData.companyName, contactName: updateData.contactName }
    }));

    res.json({
      ...updatedData,
      hasInformationSystems: updateData.hasInformationSystems,
      processesEUCitizenData: updateData.processesEUCitizenData,
      dataTypes: updateData.dataTypes || [],
      hasSecurityResponsible: updateData.hasSecurityResponsible,
      wantsVulnerabilityReport: updateData.wantsVulnerabilityReport,
      relevantStandards: updateData.relevantStandards || [],
      interestedInPreAudit: updateData.interestedInPreAudit,
      wantsSelfAssessment: updateData.wantsSelfAssessment,
      privacyPolicyAccepted: updateData.privacyPolicyAccepted
    });
  } catch (error) {
    console.error('Error updating starter guide:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to update starter guide'
    });
  }
});

// GET /api/starter-guide/:id/export - Экспорт анкеты
router.get('/:id/export', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { format } = req.query;

    // Проверяем, что анкета принадлежит пользователю
    const existingData = await client.hGetAll(`starter-guide:${userId}`);
    if (!existingData || existingData.id !== id) {
      return res.status(404).json({
        error: 'Starter guide not found',
        message: 'No starter guide found with this ID for this user'
      });
    }

    // Преобразуем данные в правильный формат
    const data = {
      id: existingData.id,
      userId: existingData.userId,
      sector: existingData.sector,
      hasInformationSystems: existingData.hasInformationSystems === 'true',
      systemLocation: existingData.systemLocation || undefined,
      processesEUCitizenData: existingData.processesEUCitizenData === 'true',
      dataTypes: existingData.dataTypes ? JSON.parse(existingData.dataTypes) : [],
      hasSecurityStrategy: existingData.hasSecurityStrategy,
      hasSecurityResponsible: existingData.hasSecurityResponsible === 'true',
      hasCybersecurityTeam: existingData.hasCybersecurityTeam,
      hasDisasterRecoveryPlan: existingData.hasDisasterRecoveryPlan,
      testsVulnerabilities: existingData.testsVulnerabilities,
      wantsVulnerabilityReport: existingData.wantsVulnerabilityReport === 'true',
      publicResources: existingData.publicResources || undefined,
      relevantStandards: existingData.relevantStandards ? JSON.parse(existingData.relevantStandards) : [],
      plansCertifiedAudit: existingData.plansCertifiedAudit,
      interestedInPreAudit: existingData.interestedInPreAudit === 'true',
      wantsSelfAssessment: existingData.wantsSelfAssessment === 'true',
      contactName: existingData.contactName,
      companyName: existingData.companyName,
      email: existingData.email,
      phone: existingData.phone,
      privacyPolicyAccepted: existingData.privacyPolicyAccepted === 'true',
      createdAt: existingData.createdAt,
      updatedAt: existingData.updatedAt
    };

    if (format === 'pdf') {
      // Здесь можно добавить генерацию PDF
      // Пока возвращаем JSON с заголовком для PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="starter-guide-${data.companyName}.pdf"`);
      
      // Простая PDF-подобная структура в JSON
      const pdfData = {
        title: 'DefendSphere Starter Guide Assessment',
        company: data.companyName,
        contact: data.contactName,
        email: data.email,
        phone: data.phone,
        assessment: {
          sector: data.sector,
          informationSystems: data.hasInformationSystems ? 'Yes' : 'No',
          systemLocation: data.systemLocation || 'N/A',
          euDataProcessing: data.processesEUCitizenData ? 'Yes' : 'No',
          dataTypes: data.dataTypes.join(', ') || 'N/A',
          securityStrategy: data.hasSecurityStrategy,
          securityResponsible: data.hasSecurityResponsible ? 'Yes' : 'No',
          cybersecurityTeam: data.hasCybersecurityTeam,
          disasterRecovery: data.hasDisasterRecoveryPlan,
          vulnerabilityTesting: data.testsVulnerabilities,
          vulnerabilityReport: data.wantsVulnerabilityReport ? 'Yes' : 'No',
          publicResources: data.publicResources || 'N/A',
          relevantStandards: data.relevantStandards.join(', ') || 'N/A',
          certifiedAudit: data.plansCertifiedAudit,
          preAuditCheckup: data.interestedInPreAudit ? 'Yes' : 'No',
          selfAssessment: data.wantsSelfAssessment ? 'Yes' : 'No'
        },
        generatedAt: new Date().toISOString()
      };

      res.json(pdfData);
    } else if (format === 'excel') {
      // Здесь можно добавить генерацию Excel
      // Пока возвращаем JSON с заголовком для Excel
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="starter-guide-${data.companyName}.xlsx"`);
      
      // Простая Excel-подобная структура в JSON
      const excelData = {
        sheetName: 'Starter Guide Assessment',
        headers: [
          'Field', 'Value', 'Category'
        ],
        rows: [
          ['Company Name', data.companyName, 'Contact Information'],
          ['Contact Name', data.contactName, 'Contact Information'],
          ['Email', data.email, 'Contact Information'],
          ['Phone', data.phone, 'Contact Information'],
          ['Sector', data.sector, 'Organization'],
          ['Information Systems', data.hasInformationSystems ? 'Yes' : 'No', 'Organization'],
          ['System Location', data.systemLocation || 'N/A', 'Organization'],
          ['EU Data Processing', data.processesEUCitizenData ? 'Yes' : 'No', 'Data Protection'],
          ['Data Types', data.dataTypes.join(', ') || 'N/A', 'Data Protection'],
          ['Security Strategy', data.hasSecurityStrategy, 'Security'],
          ['Security Responsible', data.hasSecurityResponsible ? 'Yes' : 'No', 'Security'],
          ['Cybersecurity Team', data.hasCybersecurityTeam, 'Security'],
          ['Disaster Recovery', data.hasDisasterRecoveryPlan, 'Security'],
          ['Vulnerability Testing', data.testsVulnerabilities, 'Security'],
          ['Vulnerability Report', data.wantsVulnerabilityReport ? 'Yes' : 'No', 'Security'],
          ['Public Resources', data.publicResources || 'N/A', 'Security'],
          ['Relevant Standards', data.relevantStandards.join(', ') || 'N/A', 'Compliance'],
          ['Certified Audit', data.plansCertifiedAudit, 'Compliance'],
          ['Pre-audit Checkup', data.interestedInPreAudit ? 'Yes' : 'No', 'Compliance'],
          ['Self Assessment', data.wantsSelfAssessment ? 'Yes' : 'No', 'Compliance']
        ]
      };

      res.json(excelData);
    } else {
      res.status(400).json({
        error: 'Invalid format',
        message: 'Please specify format as "pdf" or "excel"'
      });
    }
  } catch (error) {
    console.error('Error exporting starter guide:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to export starter guide'
    });
  }
});

// DELETE /api/starter-guide/:id - Удаление анкеты
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Проверяем, что анкета принадлежит пользователю
    const existingData = await client.hGetAll(`starter-guide:${userId}`);
    if (!existingData || existingData.id !== id) {
      return res.status(404).json({
        error: 'Starter guide not found',
        message: 'No starter guide found with this ID for this user'
      });
    }

    // Удаляем данные
    await client.del(`starter-guide:${userId}`);
    await client.del(`starter-guide:details:${id}`);
    await client.sRem('starter-guide:all', id);

    // Логируем удаление
    await client.lPush(`starter-guide:logs:${userId}`, JSON.stringify({
      action: 'deleted',
      timestamp: new Date().toISOString(),
      data: { id, companyName: existingData.companyName }
    }));

    res.json({
      message: 'Starter guide deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting starter guide:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to delete starter guide'
    });
  }
});

// GET /api/starter-guide/logs/:userId - Получение логов анкеты
router.get('/logs/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Проверяем, что пользователь запрашивает свои логи или является админом
    if (req.user.id !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You can only view your own logs'
      });
    }

    const logs = await client.lRange(`starter-guide:logs:${userId}`, 0, -1);
    const parsedLogs = logs.map(log => {
      try {
        return JSON.parse(log);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);

    res.json({ logs: parsedLogs });
  } catch (error) {
    console.error('Error fetching starter guide logs:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch starter guide logs'
    });
  }
});

// GET /api/starter-guide/stats - Статистика по анкетам (только для админов)
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin access required'
      });
    }

    const allIds = await client.sMembers('starter-guide:all');
    const stats = {
      total: allIds.length,
      bySector: {},
      byCompliance: {
        high: 0,
        medium: 0,
        low: 0
      },
      recentSubmissions: 0
    };

    // Получаем детали для статистики
    for (const id of allIds.slice(0, 100)) { // Ограничиваем для производительности
      const data = await client.hGetAll(`starter-guide:details:${id}`);
      if (data) {
        // Статистика по секторам
        const sector = data.sector || 'Unknown';
        stats.bySector[sector] = (stats.bySector[sector] || 0) + 1;

        // Статистика по compliance (на основе выбранных стандартов)
        const standards = data.relevantStandards ? JSON.parse(data.relevantStandards) : [];
        if (standards.length >= 3) {
          stats.byCompliance.high++;
        } else if (standards.length >= 1) {
          stats.byCompliance.medium++;
        } else {
          stats.byCompliance.low++;
        }

        // Недавние заявки (последние 30 дней)
        const createdAt = new Date(data.createdAt);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        if (createdAt > thirtyDaysAgo) {
          stats.recentSubmissions++;
        }
      }
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching starter guide stats:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to fetch starter guide statistics'
    });
  }
});

module.exports = router;