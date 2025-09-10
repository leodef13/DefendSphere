import { createClient } from 'redis'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380'

async function fixOrganizations() {
  const redis = createClient({ url: REDIS_URL })
  
  try {
    await redis.connect()
    console.log('Connected to Redis')
    
    console.log('🔧 Исправление организаций...')
    
    // Добавляем Watson Morris в организации
    await redis.sAdd('organizations', 'Watson Morris')
    await redis.sAdd('organizations:names', 'Watson Morris')
    
    console.log('✅ Watson Morris добавлен в организации')
    
    // Проверяем результат
    const orgs = await redis.sMembers('organizations')
    const orgNames = await redis.sMembers('organizations:names')
    
    console.log('Организации:', orgs.join(', '))
    console.log('Названия организаций:', orgNames.join(', '))
    
    // Проверяем пользователей
    console.log('\n🔍 Проверка пользователей...')
    const admin = await redis.hGetAll('user:admin')
    const jon = await redis.hGetAll('user:jon')
    
    console.log('Admin organizations:', admin.organizations)
    console.log('Jon organizations:', jon.organizations)
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await redis.quit()
  }
}

fixOrganizations()