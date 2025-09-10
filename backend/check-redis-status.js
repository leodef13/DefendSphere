import { createClient } from 'redis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380'

async function checkRedisStatus() {
  const redis = createClient({ url: REDIS_URL })
  
  try {
    await redis.connect()
    console.log('Connected to Redis')
    
    // Проверяем статус Redis
    const info = await redis.info('server')
    console.log('Redis Server Info:')
    console.log(info.split('\n').filter(line => 
      line.includes('redis_version') || 
      line.includes('uptime_in_seconds') ||
      line.includes('connected_clients')
    ).join('\n'))
    
    // Проверяем ключи
    const keys = await redis.keys('*')
    console.log(`\nКоличество ключей в Redis: ${keys.length}`)
    
    if (keys.length > 0) {
      console.log('Найденные ключи:')
      keys.slice(0, 20).forEach(key => console.log(`  - ${key}`))
      if (keys.length > 20) {
        console.log(`  ... и еще ${keys.length - 20} ключей`)
      }
    }
    
    // Проверяем пользователей
    const userKeys = await redis.keys('user:*')
    console.log(`\nПользователи в Redis: ${userKeys.length}`)
    for (const key of userKeys) {
      const user = await redis.hGetAll(key)
      console.log(`  - ${key}: ${user.username || 'N/A'} (${user.role || 'N/A'})`)
    }
    
    // Проверяем активы
    const assetKeys = await redis.keys('asset:*')
    console.log(`\nАктивы в Redis: ${assetKeys.length}`)
    
    // Проверяем организации
    const orgKeys = await redis.keys('*organization*')
    console.log(`\nОрганизации в Redis: ${orgKeys.length}`)
    for (const key of orgKeys) {
      const data = await redis.sMembers(key)
      console.log(`  - ${key}: ${data.join(', ')}`)
    }
    
  } catch (error) {
    console.error('❌ Ошибка при проверке Redis:', error.message)
  } finally {
    await redis.quit()
  }
}

checkRedisStatus()