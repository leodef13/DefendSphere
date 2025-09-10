import { createClient } from 'redis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380'

async function checkRedisData() {
  const redis = createClient({ url: REDIS_URL })
  
  try {
    await redis.connect()
    console.log('Connected to Redis')
    
    // Проверяем все ключи пользователей
    const userKeys = await redis.keys('user:*')
    console.log('User keys in Redis:', userKeys)
    
    for (const key of userKeys) {
      console.log(`\n--- ${key} ---`)
      const user = await redis.hGetAll(key)
      console.log('Username:', user.username)
      console.log('Email:', user.email)
      console.log('Organizations:', user.organizations)
      console.log('Role:', user.role)
    }
    
  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    await redis.quit()
  }
}

checkRedisData()