import { createClient } from 'redis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380'

async function clearRedisCache() {
  const redis = createClient({ url: REDIS_URL })
  
  try {
    await redis.connect()
    console.log('Connected to Redis')
    
    console.log('🧹 Очистка кэша Redis...')
    
    // Получаем информацию о Redis
    const info = await redis.info('memory')
    console.log('Redis memory info before cleanup:')
    console.log(info.split('\n').filter(line => line.includes('used_memory')).join('\n'))
    
    // Очищаем весь кэш
    await redis.flushAll()
    console.log('✅ Redis кэш очищен')
    
    // Проверяем, что кэш действительно очищен
    const keys = await redis.keys('*')
    console.log(`Количество ключей после очистки: ${keys.length}`)
    
    if (keys.length === 0) {
      console.log('✅ Кэш полностью очищен')
    } else {
      console.log('⚠️  Остались ключи:', keys.slice(0, 10))
    }
    
  } catch (error) {
    console.error('❌ Ошибка при очистке кэша:', error.message)
  } finally {
    await redis.quit()
  }
}

clearRedisCache()