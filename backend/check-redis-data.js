import { createClient } from 'redis'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
})

redis.on('error', (err) => console.log('Redis Client Error', err))

async function checkRedisData() {
  try {
    await redis.connect()
    console.log('✅ Подключение к Redis установлено')
    
    // Проверяем пользователей
    const users = await redis.sMembers('users')
    console.log('Пользователи:', users)
    
    // Проверяем user1
    if (users.includes('user1')) {
      const user1 = await redis.hGetAll('user:user1')
      console.log('User1:', user1)
    }
    
    // Проверяем user3
    if (users.includes('user3')) {
      const user3 = await redis.hGetAll('user:user3')
      console.log('User3:', user3)
    }
    
    // Проверяем компании
    const companies = await redis.sMembers('companies')
    console.log('Компании:', companies)
    
    // Проверяем активы Company LLD
    const assetIds = await redis.sMembers('company:company-lld:assetIds')
    console.log('Активы Company LLD:', assetIds)
    
    // Проверяем все ключи
    const keys = await redis.keys('*')
    console.log('Все ключи:', keys)
    
  } catch (error) {
    console.error('Ошибка:', error.message)
  } finally {
    await redis.disconnect()
  }
}

checkRedisData()