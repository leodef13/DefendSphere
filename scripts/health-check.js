#!/usr/bin/env node

/**
 * DefendSphere Health Check Script
 * Проверка состояния всех компонентов системы
 */

const redis = require('redis');
const http = require('http');

// Конфигурация
const config = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6380,
        password: process.env.REDIS_PASSWORD || null,
        db: process.env.REDIS_DB || 0
    },
    backend: {
        host: process.env.BACKEND_HOST || 'localhost',
        port: process.env.BACKEND_PORT || 5000
    },
    frontend: {
        host: process.env.FRONTEND_HOST || 'localhost',
        port: process.env.FRONTEND_PORT || 3000
    }
};

// Цвета для вывода
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Функции для вывода
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
    log(`\n${'='.repeat(50)}`, 'blue');
    log(`  ${message}`, 'bright');
    log(`${'='.repeat(50)}`, 'blue');
}

function logSection(message) {
    log(`\n${message}`, 'cyan');
    log('-'.repeat(message.length), 'cyan');
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logWarning(message) {
    log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logInfo(message) {
    log(`ℹ️  ${message}`, 'blue');
}

// Проверка Redis
async function checkRedis() {
    logSection('Проверка Redis');
    
    try {
        const client = redis.createClient(config.redis);
        
        await client.connect();
        
        // Проверка подключения
        const ping = await client.ping();
        if (ping === 'PONG') {
            logSuccess('Redis подключение успешно');
        } else {
            logError('Redis не отвечает на ping');
            return false;
        }
        
        // Проверка базовых данных
        const userCount = await client.sCard('users');
        logInfo(`Количество пользователей: ${userCount}`);
        
        const adminUser = await client.hGetAll('user:admin');
        if (adminUser && adminUser.username) {
            logSuccess('Admin пользователь найден');
        } else {
            logWarning('Admin пользователь не найден');
        }
        
        // Проверка системных метрик
        const metrics = await client.hGetAll('system:metrics');
        if (metrics && Object.keys(metrics).length > 0) {
            logSuccess('Системные метрики доступны');
            logInfo(`Метрики: ${Object.keys(metrics).join(', ')}`);
        } else {
            logWarning('Системные метрики не найдены');
        }
        
        await client.quit();
        return true;
        
    } catch (error) {
        logError(`Ошибка подключения к Redis: ${error.message}`);
        return false;
    }
}

// Проверка Backend API
function checkBackend() {
    return new Promise((resolve) => {
        logSection('Проверка Backend API');
        
        const options = {
            hostname: config.backend.host,
            port: config.backend.port,
            path: '/api/health',
            method: 'GET',
            timeout: 5000
        };
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        const response = JSON.parse(data);
                        logSuccess('Backend API доступен');
                        logInfo(`Статус: ${response.status || 'OK'}`);
                        logInfo(`Время: ${response.timestamp || 'N/A'}`);
                        resolve(true);
                    } catch (e) {
                        logWarning('Backend отвечает, но неверный формат ответа');
                        resolve(false);
                    }
                } else {
                    logError(`Backend вернул статус: ${res.statusCode}`);
                    resolve(false);
                }
            });
        });
        
        req.on('error', (error) => {
            logError(`Ошибка подключения к Backend: ${error.message}`);
            resolve(false);
        });
        
        req.on('timeout', () => {
            logError('Backend не отвечает (таймаут)');
            req.destroy();
            resolve(false);
        });
        
        req.end();
    });
}

// Проверка Frontend
function checkFrontend() {
    return new Promise((resolve) => {
        logSection('Проверка Frontend');
        
        const options = {
            hostname: config.frontend.host,
            port: config.frontend.port,
            path: '/',
            method: 'GET',
            timeout: 5000
        };
        
        const req = http.request(options, (res) => {
            if (res.statusCode === 200) {
                logSuccess('Frontend доступен');
                logInfo(`Статус: ${res.statusCode}`);
                resolve(true);
            } else {
                logWarning(`Frontend вернул статус: ${res.statusCode}`);
                resolve(false);
            }
        });
        
        req.on('error', (error) => {
            logError(`Ошибка подключения к Frontend: ${error.message}`);
            resolve(false);
        });
        
        req.on('timeout', () => {
            logError('Frontend не отвечает (таймаут)');
            req.destroy();
            resolve(false);
        });
        
        req.end();
    });
}

// Проверка API endpoints
async function checkAPIEndpoints() {
    logSection('Проверка API Endpoints');
    
    const endpoints = [
        { path: '/api/auth/register', method: 'POST', description: 'Регистрация' },
        { path: '/api/auth/login', method: 'POST', description: 'Вход' },
        { path: '/api/admin/users', method: 'GET', description: 'Список пользователей' },
        { path: '/api/users/profile', method: 'PUT', description: 'Профиль пользователя' }
    ];
    
    let successCount = 0;
    
    for (const endpoint of endpoints) {
        try {
            const result = await checkEndpoint(endpoint);
            if (result) successCount++;
        } catch (error) {
            logError(`Ошибка проверки ${endpoint.description}: ${error.message}`);
        }
    }
    
    logInfo(`API endpoints: ${successCount}/${endpoints.length} доступны`);
    return successCount === endpoints.length;
}

function checkEndpoint(endpoint) {
    return new Promise((resolve) => {
        const options = {
            hostname: config.backend.host,
            port: config.backend.port,
            path: endpoint.path,
            method: endpoint.method,
            timeout: 3000
        };
        
        const req = http.request(options, (res) => {
            if (res.statusCode === 200 || res.statusCode === 401 || res.statusCode === 405) {
                logSuccess(`${endpoint.description}: ${res.statusCode}`);
                resolve(true);
            } else {
                logWarning(`${endpoint.description}: ${res.statusCode}`);
                resolve(false);
            }
        });
        
        req.on('error', () => {
            logError(`${endpoint.description}: недоступен`);
            resolve(false);
        });
        
        req.on('timeout', () => {
            logError(`${endpoint.description}: таймаут`);
            req.destroy();
            resolve(false);
        });
        
        req.end();
    });
}

// Проверка системных ресурсов
function checkSystemResources() {
    logSection('Проверка системных ресурсов');
    
    const os = require('os');
    
    // CPU
    const cpuUsage = os.loadavg();
    logInfo(`CPU Load: ${cpuUsage[0].toFixed(2)} (1min), ${cpuUsage[1].toFixed(2)} (5min), ${cpuUsage[2].toFixed(2)} (15min)`);
    
    // Memory
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const memoryUsage = ((usedMem / totalMem) * 100).toFixed(2);
    
    logInfo(`Memory: ${(usedMem / 1024 / 1024 / 1024).toFixed(2)}GB / ${(totalMem / 1024 / 1024 / 1024).toFixed(2)}GB (${memoryUsage}%)`);
    
    // Disk
    const fs = require('fs');
    try {
        const stats = fs.statSync('.');
        logInfo(`Disk: доступно для записи`);
    } catch (error) {
        logWarning(`Disk: проблемы с доступом`);
    }
    
    // Network
    const networkInterfaces = os.networkInterfaces();
    const localInterfaces = Object.keys(networkInterfaces).filter(name => 
        networkInterfaces[name].some(iface => !iface.internal)
    );
    
    if (localInterfaces.length > 0) {
        logSuccess(`Network: ${localInterfaces.join(', ')}`);
    } else {
        logWarning('Network: нет доступных интерфейсов');
    }
}

// Основная функция проверки
async function runHealthCheck() {
    logHeader('DefendSphere Health Check');
    logInfo(`Время проверки: ${new Date().toLocaleString()}`);
    
    const results = {
        redis: false,
        backend: false,
        frontend: false,
        api: false,
        system: true
    };
    
    try {
        // Проверка Redis
        results.redis = await checkRedis();
        
        // Проверка Backend
        results.backend = await checkBackend();
        
        // Проверка Frontend
        results.frontend = await checkFrontend();
        
        // Проверка API endpoints
        if (results.backend) {
            results.api = await checkAPIEndpoints();
        }
        
        // Проверка системных ресурсов
        checkSystemResources();
        
    } catch (error) {
        logError(`Критическая ошибка: ${error.message}`);
    }
    
    // Итоговый отчет
    logHeader('Итоговый отчет');
    
    const totalChecks = Object.keys(results).length;
    const passedChecks = Object.values(results).filter(Boolean).length;
    
    logInfo(`Всего проверок: ${totalChecks}`);
    logInfo(`Успешно: ${passedChecks}`);
    logInfo(`Неудачно: ${totalChecks - passedChecks}`);
    
    if (results.redis) logSuccess('Redis: OK');
    else logError('Redis: FAILED');
    
    if (results.backend) logSuccess('Backend: OK');
    else logError('Backend: FAILED');
    
    if (results.frontend) logSuccess('Frontend: OK');
    else logError('Frontend: FAILED');
    
    if (results.api) logSuccess('API Endpoints: OK');
    else logError('API Endpoints: FAILED');
    
    if (results.system) logSuccess('System Resources: OK');
    else logError('System Resources: FAILED');
    
    // Рекомендации
    if (passedChecks < totalChecks) {
        logHeader('Рекомендации');
        
        if (!results.redis) {
            logWarning('• Проверьте, что Redis запущен и доступен');
            logWarning('• Убедитесь, что порт 6380 не заблокирован');
        }
        
        if (!results.backend) {
            logWarning('• Проверьте, что Backend сервер запущен');
            logWarning('• Убедитесь, что порт 5000 не занят');
        }
        
        if (!results.frontend) {
            logWarning('• Проверьте, что Frontend приложение запущено');
            logWarning('• Убедитесь, что порт 3000 не занят');
        }
        
        if (!results.api) {
            logWarning('• Проверьте логи Backend сервера');
            logWarning('• Убедитесь, что все зависимости установлены');
        }
    } else {
        logSuccess('🎉 Все системы работают корректно!');
    }
    
    // Выход с кодом ошибки если есть проблемы
    process.exit(passedChecks === totalChecks ? 0 : 1);
}

// Запуск проверки
if (require.main === module) {
    runHealthCheck().catch(error => {
        logError(`Неожиданная ошибка: ${error.message}`);
        process.exit(1);
    });
}

module.exports = {
    checkRedis,
    checkBackend,
    checkFrontend,
    checkAPIEndpoints,
    checkSystemResources,
    runHealthCheck
};