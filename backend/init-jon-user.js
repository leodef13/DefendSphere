import { createClient } from 'redis'
import bcrypt from 'bcryptjs'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
})

redis.on('error', (err) => console.log('Redis Client Error', err))

async function initializeJonUser() {
  try {
    await redis.connect()
    console.log('✅ Подключение к Redis установлено')
    
    // Проверяем существующего пользователя jon
    const existingJon = await redis.hGetAll('user:jon')
    if (existingJon.username) {
      console.log('ℹ️ Пользователь jon уже существует')
      return
    }
    
    // Создаем пользователя jon
    const jon = {
      id: '5',
      username: 'jon',
      fullName: 'Jon Smith',
      email: 'jon@watson-morris.com',
      password: await bcrypt.hash('jon123', 10),
      organization: 'Watson Morris',
      position: 'Security Manager',
      role: 'user',
      phone: '+1-555-0104',
      permissions: JSON.stringify([
        'access.dashboard',
        'access.assets',
        'access.reports',
        'access.compliance',
        'access.customerTrust',
        'access.suppliers'
      ]),
      additionalOrganizations: JSON.stringify([]),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }
    
    // Сохраняем пользователя jon
    for (const [field, value] of Object.entries(jon)) {
      await redis.hSet('user:jon', field, value)
    }
    await redis.sAdd('users', 'jon')
    console.log('✅ Пользователь jon создан')
    
    // Проверяем результат
    const jonData = await redis.hGetAll('user:jon')
    console.log('Jon user data:', {
      username: jonData.username,
      organization: jonData.organization,
      role: jonData.role,
      position: jonData.position
    })
    
  } catch (error) {
    console.error('❌ Ошибка создания пользователя jon:', error.message)
  } finally {
    await redis.disconnect()
  }
}

initializeJonUser()