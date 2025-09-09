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
        id: 'user1',
        username: 'user1',
        fullName: 'User One',
        email: 'user1@company-lld.com',
        password: 'user1', // В реальном приложении должен быть хеш
        organization: 'Company LLD',
        position: 'Security Analyst',
        role: 'user',
        phone: '+1-555-0101',
        permissions: JSON.stringify(['view_assets', 'view_reports']),
        additionalOrganizations: JSON.stringify([])
      },
      {
        id: 'user3',
        username: 'user3',
        fullName: 'User Three',
        email: 'user3@company-lld.com',
        password: 'user3', // В реальном приложении должен быть хеш
        organization: 'Company LLD',
        position: 'IT Manager',
        role: 'user',
        phone: '+1-555-0103',
        permissions: JSON.stringify(['view_assets', 'view_reports', 'manage_assets']),
        additionalOrganizations: JSON.stringify([])
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