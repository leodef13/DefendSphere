import { createClient } from 'redis'
import bcrypt from 'bcryptjs'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
})

redis.on('error', (err) => console.log('Redis Client Error', err))

async function initializeUsers() {
  try {
    await redis.connect()
    console.log('✅ Подключение к Redis установлено')
    
    // Проверяем существующих пользователей
    const existingUsers = await redis.sMembers('users')
    console.log('Существующие пользователи:', existingUsers)
    
    // Создаем пользователей если их нет
    const users = [
      {
        id: '2',
        username: 'user1',
        fullName: 'John Smith',
        email: 'user1@company-lld.com',
        password: await bcrypt.hash('user1', 10),
        organization: 'Company LLD',
        position: 'CEO',
        role: 'admin',
        phone: '+1-555-0101',
        permissions: JSON.stringify([
          'access.dashboard',
          'access.assets',
          'access.compliance',
          'access.customerTrust',
          'access.suppliers',
          'access.reports',
          'access.integrations',
          'access.admin'
        ]),
        additionalOrganizations: JSON.stringify([]),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      },
      {
        id: '4',
        username: 'user3',
        fullName: 'Jane Doe',
        email: 'user3@company-lld.com',
        password: await bcrypt.hash('user3', 10),
        organization: 'Company LLD',
        position: 'CISO',
        role: 'user',
        phone: '+1-555-0103',
        permissions: JSON.stringify([
          'access.dashboard',
          'access.assets',
          'access.compliance',
          'access.customerTrust',
          'access.suppliers',
          'access.reports',
          'access.integrations'
        ]),
        additionalOrganizations: JSON.stringify([]),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
    ]
    
    for (const user of users) {
      if (!existingUsers.includes(user.username)) {
        // Сохраняем поля по отдельности
        for (const [field, value] of Object.entries(user)) {
          await redis.hSet(`user:${user.username}`, field, value)
        }
        await redis.sAdd('users', user.username)
        console.log(`✅ Создан пользователь: ${user.username}`)
      } else {
        console.log(`ℹ️ Пользователь уже существует: ${user.username}`)
      }
    }
    
    // Проверяем данные пользователей
    console.log('\n=== ПРОВЕРКА ДАННЫХ ПОЛЬЗОВАТЕЛЕЙ ===')
    for (const user of users) {
      const userData = await redis.hGetAll(`user:${user.username}`)
      console.log(`${user.username}:`, {
        username: userData.username,
        organization: userData.organization,
        role: userData.role
      })
    }
    
  } catch (error) {
    console.error('❌ Ошибка инициализации пользователей:', error.message)
  } finally {
    await redis.disconnect()
  }
}

initializeUsers()