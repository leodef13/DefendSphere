import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authenticateTokenFallback } from '../middleware/auth-fallback.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Путь к файлам с данными
const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');
const assetsFile = path.join(dataDir, 'assets.json');

// Функция для загрузки данных из файлов
function loadDataFromFiles() {
  try {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const assets = JSON.parse(fs.readFileSync(assetsFile, 'utf8'));
    return { users, assets };
  } catch (error) {
    console.error('Error loading data from files:', error);
    return { users: [], assets: [] };
  }
}

// GET /api/assets/fallback - Получение активов из файлов (fallback)
router.get('/fallback', authenticateTokenFallback, async (req, res) => {
  try {
    const user = req.user;
    const userOrgs = user.organizations || [];
    
    console.log('Assets fallback request for user:', user.username, 'organizations:', userOrgs);
    
    // Загружаем данные из файлов
    const { users } = loadDataFromFiles();
    
    // Проверяем, есть ли пользователь в файлах
    const userData = users.find(u => u.username === user.username);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: 'User not found in fallback data'
      });
    }
    
    // Загружаем активы в зависимости от организации пользователя
    let userAssets = [];
    
    if (userData.organization === 'Company LLD') {
      const assetsFile = path.join(dataDir, 'assets.json');
      const assets = JSON.parse(fs.readFileSync(assetsFile, 'utf8'));
      userAssets = assets;
      console.log(`Loaded Company LLD assets: ${assets.length}`);
    } else if (userData.organization === 'Watson Morris') {
      const assetsFile = path.join(dataDir, 'watson-morris-assets.json');
      const assets = JSON.parse(fs.readFileSync(assetsFile, 'utf8'));
      userAssets = assets;
      console.log(`Loaded Watson Morris assets: ${assets.length}`);
    }
    
    console.log(`Found ${userAssets.length} assets for user ${user.username} (${userData.organization})`);
    
    res.json({
      success: true,
      data: userAssets
    });
  } catch (error) {
    console.error('Error in assets fallback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assets from fallback'
    });
  }
});

// GET /api/assets/test - Тестовый endpoint для проверки данных
router.get('/test', async (req, res) => {
  try {
    const { users, assets } = loadDataFromFiles();
    
    res.json({
      success: true,
      message: 'Fallback data loaded successfully',
      data: {
        users: users.map(u => ({
          username: u.username,
          organization: u.organization,
          role: u.role
        })),
        assets: assets.map(a => ({
          name: a.name,
          type: a.type,
          complianceScore: a.complianceScore
        }))
      }
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load test data',
      error: error.message
    });
  }
});

export default router;