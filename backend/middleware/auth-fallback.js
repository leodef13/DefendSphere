import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Путь к файлам с данными
const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');

// Функция для загрузки пользователей из файлов
function loadUsersFromFiles() {
  try {
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    return users;
  } catch (error) {
    console.error('Error loading users from files:', error);
    return [];
  }
}

export const authenticateTokenFallback = async (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    
    // Загружаем пользователей из файлов
    const users = loadUsersFromFiles();
    const user = users.find(u => u.username === decoded.username);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      permissions: user.permissions || [],
      organizations: user.organizations || (user.organization ? [user.organization] : [])
    }
    next()
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' })
  }
}