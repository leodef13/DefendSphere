import express from 'express';
import { createClient } from 'redis';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Подключение к Redis
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
});

client.on('error', (err) => console.log('Redis Client Error', err));

// POST /api/company - создать компанию
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required'
      });
    }

    const companyId = `company-${name.toLowerCase().replace(/\s+/g, '-')}`;
    
    // Check if company already exists
    const existingCompany = await client.hGetAll(`company:${companyId}`);
    if (existingCompany.data) {
      return res.status(400).json({
        success: false,
        message: 'Company already exists'
      });
    }

    const companyData = {
      id: companyId,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await client.hSet(`company:${companyId}`, 'data', JSON.stringify(companyData));
    await client.sAdd('companies', companyId);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: companyData
    });
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create company'
    });
  }
});

// GET /api/company/:id - получить данные компании
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Check if user has access to this company
    const userOrgs = user.organizations || [];
    const hasAccess = userOrgs.some(org => 
      org.toLowerCase().replace(/\s+/g, '-') === id.replace('company-', '')
    );

    if (!hasAccess && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this company'
      });
    }

    const companyData = await client.hGetAll(`company:${id}`);
    if (!companyData.data) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    const company = JSON.parse(companyData.data);
    
    // Get users for this company
    const users = await client.sMembers('users');
    const companyUsers = [];
    
    for (const username of users) {
      const userData = await client.hGetAll(`user:${username}`);
      if (userData.organization) {
        const userOrg = userData.organization.toLowerCase().replace(/\s+/g, '-');
        if (userOrg === id.replace('company-', '')) {
          companyUsers.push({
            id: userData.id,
            username: userData.username,
            fullName: userData.fullName,
            email: userData.email,
            position: userData.position,
            role: userData.role,
            phone: userData.phone,
            permissions: JSON.parse(userData.permissions || '[]'),
            additionalOrganizations: JSON.parse(userData.additionalOrganizations || '[]')
          });
        }
      }
    }

    // Get assets for this company
    const assetIds = await client.sMembers(`company:${id}:assetIds`);
    const assets = [];
    
    for (const assetId of assetIds) {
      const assetData = await client.hGet(`company:${id}:assets`, assetId);
      if (assetData) {
        assets.push(JSON.parse(assetData));
      }
    }

    res.json({
      success: true,
      data: {
        ...company,
        users: companyUsers,
        assets: assets
      }
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company data'
    });
  }
});

// POST /api/company/:id/user - добавить пользователя
router.post('/:id/user', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, fullName, email, password, position, role, phone, permissions, additionalOrganizations } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await client.hGetAll(`user:${username}`);
    if (existingUser.username) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash(password, 10);

    const companyName = id.replace('company-', '').replace(/-/g, ' ');
    const userId = Date.now().toString();
    
    const user = {
      id: userId,
      username,
      fullName: fullName || '',
      email,
      passwordHash: hashedPassword,
      organization: companyName,
      position: position || '',
      role: role || 'user',
      phone: phone || '',
      permissions: JSON.stringify(permissions || ['access.dashboard']),
      additionalOrganizations: JSON.stringify(additionalOrganizations || []),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    await client.hSet(`user:${username}`, user);
    await client.sAdd('users', username);

    res.status(201).json({
      success: true,
      message: 'User added successfully',
      data: {
        ...user,
        permissions: JSON.parse(user.permissions),
        additionalOrganizations: JSON.parse(user.additionalOrganizations)
      }
    });
  } catch (error) {
    console.error('Error adding user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add user'
    });
  }
});

// POST /api/company/:id/asset - добавить актив
router.post('/:id/asset', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Check if user has access to this company
    const userOrgs = user.organizations || [];
    const hasAccess = userOrgs.some(org => 
      org.toLowerCase().replace(/\s+/g, '-') === id.replace('company-', '')
    );

    if (!hasAccess && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this company'
      });
    }

    const { name, type, environment, ipAddress, standards, vulnerabilities } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        success: false,
        message: 'Asset name and type are required'
      });
    }

    const assetId = uuidv4();
    const assetData = {
      assetId,
      name,
      type,
      environment: environment || 'Production',
      ipAddress: ipAddress || '',
      lastAssessment: new Date().toISOString().split('T')[0],
      complianceScore: 0,
      standards: standards || [],
      vulnerabilities: vulnerabilities || { critical: 0, high: 0, medium: 0, low: 0, total: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await client.hSet(`company:${id}:assets`, assetId, JSON.stringify(assetData));
    await client.sAdd(`company:${id}:assetIds`, assetId);

    res.status(201).json({
      success: true,
      message: 'Asset added successfully',
      data: assetData
    });
  } catch (error) {
    console.error('Error adding asset:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add asset'
    });
  }
});

// GET /api/company/:id/assets - получить активы компании
router.get('/:id/assets', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Check if user has access to this company
    const userOrgs = user.organizations || [];
    const hasAccess = userOrgs.some(org => 
      org.toLowerCase().replace(/\s+/g, '-') === id.replace('company-', '')
    );

    if (!hasAccess && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this company'
      });
    }

    const assetIds = await client.sMembers(`company:${id}:assetIds`);
    const assets = [];
    
    for (const assetId of assetIds) {
      const assetData = await client.hGet(`company:${id}:assets`, assetId);
      if (assetData) {
        assets.push(JSON.parse(assetData));
      }
    }

    res.json({
      success: true,
      data: assets
    });
  } catch (error) {
    console.error('Error fetching company assets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch company assets'
    });
  }
});

// POST /api/company/:id/supplier - добавить поставщика
router.post('/:id/supplier', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Check if user has access to this company
    const userOrgs = user.organizations || [];
    const hasAccess = userOrgs.some(org => 
      org.toLowerCase().replace(/\s+/g, '-') === id.replace('company-', '')
    );

    if (!hasAccess && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this company'
      });
    }

    const supplierData = {
      ...req.body,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await client.hSet(`company:${id}:suppliers`, supplierData.id, JSON.stringify(supplierData));
    await client.sAdd(`company:${id}:supplierIds`, supplierData.id);

    res.status(201).json({
      success: true,
      message: 'Supplier added successfully',
      data: supplierData
    });
  } catch (error) {
    console.error('Error adding supplier:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add supplier'
    });
  }
});

// POST /api/company/:id/customer - добавить клиента/партнёра
router.post('/:id/customer', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    // Check if user has access to this company
    const userOrgs = user.organizations || [];
    const hasAccess = userOrgs.some(org => 
      org.toLowerCase().replace(/\s+/g, '-') === id.replace('company-', '')
    );

    if (!hasAccess && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this company'
      });
    }

    const customerData = {
      ...req.body,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await client.hSet(`company:${id}:customers`, customerData.id, JSON.stringify(customerData));
    await client.sAdd(`company:${id}:customerIds`, customerData.id);

    res.status(201).json({
      success: true,
      message: 'Customer added successfully',
      data: customerData
    });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add customer'
    });
  }
});

export default router;