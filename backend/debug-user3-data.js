import { createClient } from 'redis'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
})

redis.on('error', (err) => console.log('Redis Client Error', err))

async function debugUser3Data() {
  try {
    await redis.connect()
    console.log('✅ Подключение к Redis установлено')
    
    // Проверяем данные user3
    console.log('\n🔍 Проверка данных user3:')
    const user3Data = await redis.hGetAll('user:user3')
    console.log('User3 данные:', user3Data)
    
    // Проверяем организации
    console.log('\n🏢 Проверка организаций:')
    console.log('Organization field:', user3Data.organization)
    console.log('Additional organizations:', user3Data.additionalOrganizations)
    
    // Проверяем активы Company LLD
    console.log('\n📊 Проверка активов Company LLD:')
    const assetIds = await redis.sMembers('company:company-lld:assetIds')
    console.log('Asset IDs:', assetIds)
    
    for (const assetId of assetIds) {
      const assetData = await redis.hGet('company:company-lld:assets', assetId)
      if (assetData) {
        const asset = JSON.parse(assetData)
        console.log(`- ${asset.name} (${asset.type})`)
      }
    }
    
    // Проверяем всех пользователей
    console.log('\n👥 Проверка всех пользователей:')
    const allUsers = await redis.sMembers('users')
    console.log('Все пользователи:', allUsers)
    
    for (const username of allUsers) {
      const userData = await redis.hGetAll(`user:${username}`)
      console.log(`${username}: organization = ${userData.organization}`)
    }
    
  } catch (error) {
    console.error('Ошибка:', error)
  } finally {
    await redis.disconnect()
  }
}

debugUser3Data()