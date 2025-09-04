const express = require('express');
const router = express.Router();
const redis = require('redis');
const { authenticateToken } = require('../middleware/auth');

// Подключение к Redis
const client = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
});

client.on('error', (err) => console.log('Redis Client Error', err));

// База знаний по стандартам безопасности
const securityStandards = {
  'iso27001': {
    title: 'ISO/IEC 27001',
    description: 'Information Security Management Systems (ISMS)',
    keyPoints: [
      'Risk assessment and treatment',
      'Security controls implementation',
      'Management commitment and leadership',
      'Continuous improvement',
      'Documentation and records'
    ],
    url: '/compliance',
    category: 'International Standard'
  },
  'gdpr': {
    title: 'GDPR',
    description: 'General Data Protection Regulation',
    keyPoints: [
      'Data protection principles',
      'Individual rights',
      'Data breach notification',
      'Privacy by design',
      'Accountability and governance'
    ],
    url: '/compliance',
    category: 'EU Regulation'
  },
  'dora': {
    title: 'DORA',
    description: 'Digital Operational Resilience Act',
    keyPoints: [
      'ICT risk management',
      'Incident reporting',
      'Digital resilience testing',
      'Third-party risk management',
      'Information sharing'
    ],
    url: '/compliance',
    category: 'EU Regulation'
  },
  'nis2': {
    title: 'NIS2',
    description: 'Network and Information Security Directive',
    keyPoints: [
      'Risk management measures',
      'Incident reporting',
      'Security requirements',
      'Supervision and enforcement',
      'Cross-border cooperation'
    ],
    url: '/compliance',
    category: 'EU Directive'
  }
};

// Функция поиска по данным пользователя
async function searchUserData(userId, query) {
  try {
    // Поиск по профилю пользователя
    const userProfile = await client.hGetAll(`user:${userId}`);
    
    // Поиск по активам пользователя
    const userAssets = await client.sMembers(`user:${userId}:assets`);
    
    // Поиск по отчетам пользователя
    const userReports = await client.sMembers(`user:${userId}:reports`);
    
    const results = [];
    
    // Поиск по профилю
    Object.entries(userProfile).forEach(([key, value]) => {
      if (value.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'profile',
          field: key,
          value: value,
          url: '/profile'
        });
      }
    });
    
    // Поиск по активам
    for (const assetId of userAssets) {
      const asset = await client.hGetAll(`asset:${assetId}`);
      if (asset.name && asset.name.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'asset',
          name: asset.name,
          status: asset.status,
          url: '/assets'
        });
      }
    }
    
    // Поиск по отчетам
    for (const reportId of userReports) {
      const report = await client.hGetAll(`report:${reportId}`);
      if (report.title && report.title.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          type: 'report',
          title: report.title,
          date: report.date,
          url: '/reports'
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error searching user data:', error);
    return [];
  }
}

// Функция поиска по разделам Dashboard
function searchDashboardSections(query) {
  const sections = [
    { name: 'Home', url: '/home', description: 'Main dashboard overview' },
    { name: 'Reports', url: '/reports', description: 'Security reports and analytics' },
    { name: 'Compliance', url: '/compliance', description: 'Compliance monitoring and management' },
    { name: 'Assets', url: '/assets', description: 'Digital asset management' },
    { name: 'Suppliers', url: '/suppliers', description: 'Third-party supplier management' },
    { name: 'Integrations', url: '/integrations', description: 'System integrations' },
    { name: 'Customer Trust', url: '/customer-trust', description: 'Customer trust indicators' }
  ];
  
  return sections.filter(section => 
    section.name.toLowerCase().includes(query.toLowerCase()) ||
    section.description.toLowerCase().includes(query.toLowerCase())
  );
}

// Функция генерации ответа ассистента
function generateAssistantResponse(message, userRole, searchResults = []) {
  const lowerMessage = message.toLowerCase();
  
  // Поиск по стандартам безопасности
  for (const [key, standard] of Object.entries(securityStandards)) {
    if (lowerMessage.includes(key) || lowerMessage.includes(standard.title.toLowerCase())) {
      return {
        response: `${standard.title} (${standard.category}): ${standard.description}\n\nKey points:\n${standard.keyPoints.map(point => `• ${point}`).join('\n')}\n\nWould you like me to guide you to the compliance section for more details?`,
        type: 'text',
        data: {
          url: standard.url,
          title: `View ${standard.title} Compliance`
        }
      };
    }
  }
  
  // Поиск по разделам Dashboard
  if (lowerMessage.includes('dashboard') || lowerMessage.includes('section') || lowerMessage.includes('page')) {
    const sections = searchDashboardSections(message);
    if (sections.length > 0) {
      return {
        response: `I found these relevant dashboard sections:\n${sections.map(section => `• ${section.name}: ${section.description}`).join('\n')}\n\nWhich section would you like to explore?`,
        type: 'text'
      };
    }
  }
  
  // Поиск по данным пользователя
  if (searchResults.length > 0) {
    const resultsText = searchResults.map(result => {
      if (result.type === 'profile') {
        return `• Profile ${result.field}: ${result.value}`;
      } else if (result.type === 'asset') {
        return `• Asset: ${result.name} (${result.status})`;
      } else if (result.type === 'report') {
        return `• Report: ${result.title} (${result.date})`;
      }
    }).join('\n');
    
    return {
      response: `I found these items related to your query:\n${resultsText}\n\nWould you like me to show you more details about any of these?`,
      type: 'text'
    };
  }
  
  // Общие ответы
  if (lowerMessage.includes('help') || lowerMessage.includes('помощь')) {
    return {
      response: `I'm your Security Assistant! I can help you with:\n\n🔒 Security Standards:\n• ISO 27001, GDPR, DORA, NIS2\n\n📊 Dashboard Navigation:\n• Reports, Compliance, Assets, Suppliers\n\n👤 Personal Data:\n• Profile information, assets, reports\n\n💡 Quick Actions:\n• Generate reports, check compliance, monitor assets\n\nWhat would you like to know more about?`,
      type: 'text'
    };
  }
  
  if (lowerMessage.includes('compliance') || lowerMessage.includes('соответствие')) {
    return {
      response: `The Compliance section helps you monitor and manage compliance with various security standards. You can:\n\n• View compliance scores and status\n• Track audit progress\n• Generate compliance reports\n• Monitor certification status\n\nWould you like me to guide you to specific compliance areas or explain any particular standard?`,
      type: 'text',
      data: {
        url: '/compliance',
        title: 'Go to Compliance Section'
      }
    };
  }
  
  if (lowerMessage.includes('assets') || lowerMessage.includes('активы')) {
    return {
      response: `The Assets section provides comprehensive monitoring and management of your digital assets:\n\n• Server inventory and status\n• Database security monitoring\n• Endpoint protection status\n• Mobile device management\n• Vulnerability assessment\n• Risk level tracking\n\nI can help you navigate to specific asset categories or explain asset security best practices.`,
      type: 'text',
      data: {
        url: '/assets',
        title: 'Go to Assets Section'
      }
    };
  }
  
  if (lowerMessage.includes('reports') || lowerMessage.includes('отчеты')) {
    return {
      response: `The Reports section allows you to generate and analyze security reports:\n\n• Security incident reports\n• Compliance status reports\n• Asset vulnerability reports\n• Risk assessment reports\n• Custom report builder\n• Export functionality\n\nWhat type of report would you like to create or view?`,
      type: 'text',
      data: {
        url: '/reports',
        title: 'Go to Reports Section'
      }
    };
  }
  
  // Ответ по умолчанию
  return {
    response: `I understand your question about DefendSphere. I can help you with security compliance, asset management, reporting, and navigating the dashboard. Could you please be more specific about what you'd like to know?\n\nYou can ask me about:\n• Security standards (ISO 27001, GDPR, DORA, NIS2)\n• Dashboard features and navigation\n• Your personal data and assets\n• Compliance requirements and best practices`,
    type: 'text'
  };
}

// POST /api/assistant - Основной endpoint для ассистента
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { message, userId, userRole } = req.body;
    
    if (!message || !userId) {
      return res.status(400).json({ 
        error: 'Message and userId are required' 
      });
    }
    
    // Поиск по данным пользователя
    const userDataResults = await searchUserData(userId, message);
    
    // Поиск по разделам Dashboard
    const dashboardResults = searchDashboardSections(message);
    
    // Генерация ответа
    const response = generateAssistantResponse(message, userRole, userDataResults);
    
    // Логирование запроса
    await client.lPush(`assistant:logs:${userId}`, JSON.stringify({
      timestamp: new Date().toISOString(),
      message,
      response: response.response,
      userRole
    }));
    
    // Ограничение логов (храним только последние 100)
    await client.lTrim(`assistant:logs:${userId}`, 0, 99);
    
    res.json(response);
    
  } catch (error) {
    console.error('Assistant API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process assistant request'
    });
  }
});

// GET /api/assistant/logs - Получение истории запросов пользователя
router.get('/logs', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const logs = await client.lRange(`assistant:logs:${userId}`, 0, -1);
    
    const parsedLogs = logs.map(log => {
      try {
        return JSON.parse(log);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
    
    res.json({ logs: parsedLogs });
    
  } catch (error) {
    console.error('Error fetching assistant logs:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch assistant logs'
    });
  }
});

// GET /api/assistant/standards - Получение информации о стандартах
router.get('/standards', authenticateToken, async (req, res) => {
  try {
    const { standard } = req.query;
    
    if (standard && securityStandards[standard.toLowerCase()]) {
      res.json(securityStandards[standard.toLowerCase()]);
    } else {
      res.json({ 
        available: Object.keys(securityStandards),
        standards: securityStandards 
      });
    }
    
  } catch (error) {
    console.error('Error fetching standards:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to fetch security standards'
    });
  }
});

module.exports = router;