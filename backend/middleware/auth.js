const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware для проверки JWT токена
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Access token required',
      message: 'Please provide a valid authentication token'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expired',
          message: 'Your authentication token has expired. Please log in again.'
        });
      }
      return res.status(403).json({ 
        error: 'Invalid token',
        message: 'The provided token is invalid or corrupted'
      });
    }
    
    req.user = user;
    next();
  });
};

// Middleware для проверки роли admin
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: 'Admin access required',
      message: 'This resource requires administrator privileges'
    });
  }
  
  next();
};

// Middleware для проверки конкретного разрешения
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }
    
    if (req.user.role === 'admin') {
      return next(); // Admin имеет доступ ко всему
    }
    
    if (!req.user.permissions || !req.user.permissions.includes(permission)) {
      return res.status(403).json({ 
        error: 'Permission denied',
        message: `Access denied. Required permission: ${permission}`
      });
    }
    
    next();
  };
};

// Middleware для проверки владения ресурсом
const requireOwnership = (resourceType) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'Please log in to access this resource'
      });
    }
    
    if (req.user.role === 'admin') {
      return next(); // Admin может доступ ко всем ресурсам
    }
    
    const resourceId = req.params.id || req.body.id;
    if (!resourceId) {
      return res.status(400).json({ 
        error: 'Resource ID required',
        message: 'Please provide a valid resource identifier'
      });
    }
    
    try {
      // Здесь можно добавить логику проверки владения ресурсом
      // Например, проверка в базе данных
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to verify resource ownership'
      });
    }
  };
};

// Middleware для логирования запросов
const logRequest = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const { method, url, ip } = req;
  const userId = req.user?.id || 'anonymous';
  
  console.log(`[${timestamp}] ${method} ${url} - User: ${userId} - IP: ${ip}`);
  
  next();
};

// Middleware для rate limiting (базовая реализация)
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;
    
    // Очищаем старые записи
    if (requests.has(ip)) {
      const userRequests = requests.get(ip).filter(time => time > windowStart);
      requests.set(ip, userRequests);
    }
    
    const userRequests = requests.get(ip) || [];
    
    if (userRequests.length >= maxRequests) {
      return res.status(429).json({ 
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    userRequests.push(now);
    requests.set(ip, userRequests);
    
    next();
  };
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requirePermission,
  requireOwnership,
  logRequest,
  rateLimit
};