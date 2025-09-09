import { createClient } from 'redis'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
})

redis.on('error', (err) => console.log('Redis Client Error', err))

async function debugAssetsData() {
  try {
    await redis.connect()
    console.log('✅ Подключение к Redis установлено')
    
    console.log('\n=== ОТЛАДКА ДАННЫХ АКТИВОВ ===\n')
    
    // 1. Проверяем пользователей
    console.log('1. Проверка пользователей:')
    const users = await redis.sMembers('users')
    console.log('Все пользователи:', users)
    
    if (users.includes('user1')) {
      const user1 = await redis.hGetAll('user:user1')
      console.log('✅ User1 данные:', {
        username: user1.username,
        organization: user1.organization,
        role: user1.role,
        permissions: user1.permissions
      })
    } else {
      console.log('❌ User1 не найден')
    }
    
    if (users.includes('user3')) {
      const user3 = await redis.hGetAll('user:user3')
      console.log('✅ User3 данные:', {
        username: user3.username,
        organization: user3.organization,
        role: user3.role,
        permissions: user3.permissions
      })
    } else {
      console.log('❌ User3 не найден')
    }
    
    // 2. Проверяем компании
    console.log('\n2. Проверка компаний:')
    const companies = await redis.sMembers('companies')
    console.log('Все компании:', companies)
    
    if (companies.includes('company-lld')) {
      const companyData = await redis.hGetAll('company:company-lld')
      console.log('✅ Company LLD данные:', companyData)
    } else {
      console.log('❌ Company LLD не найдена')
    }
    
    // 3. Проверяем активы Company LLD
    console.log('\n3. Проверка активов Company LLD:')
    const assetIds = await redis.sMembers('company:company-lld:assetIds')
    console.log('ID активов Company LLD:', assetIds)
    
    if (assetIds.length > 0) {
      console.log('✅ Активы найдены:')
      for (const assetId of assetIds) {
        const assetData = await redis.hGet('company:company-lld:assets', assetId)
        if (assetData) {
          const asset = JSON.parse(assetData)
          console.log(`  - ${asset.name} (${asset.type}) - ${asset.ipAddress}`)
        }
      }
    } else {
      console.log('❌ Активы не найдены')
    }
    
    // 4. Проверяем все активы в системе
    console.log('\n4. Проверка всех активов в системе:')
    const allAssets = await redis.sMembers('assets')
    console.log('Все активы в системе:', allAssets)
    
    // 5. Проверяем ключи Redis
    console.log('\n5. Проверка ключей Redis:')
    const keys = await redis.keys('*')
    const assetKeys = keys.filter(key => key.includes('asset'))
    console.log('Ключи связанные с активами:', assetKeys)
    
    // 6. Тестируем логику получения активов для user1
    console.log('\n6. Тестирование логики для user1:')
    const user1 = await redis.hGetAll('user:user1')
    if (user1.organization) {
      console.log('User1 organization:', user1.organization)
      const companyId = user1.organization === 'Company LLD' ? 'company-lld' : `company-${user1.organization.toLowerCase().replace(/\s+/g, '-')}`
      console.log('Calculated companyId:', companyId)
      
      const userAssetIds = await redis.sMembers(`company:${companyId}:assetIds`)
      console.log('Активы для user1:', userAssetIds)
    }
    
    // 7. Тестируем логику получения активов для user3
    console.log('\n7. Тестирование логики для user3:')
    const user3 = await redis.hGetAll('user:user3')
    if (user3.organization) {
      console.log('User3 organization:', user3.organization)
      const companyId = user3.organization === 'Company LLD' ? 'company-lld' : `company-${user3.organization.toLowerCase().replace(/\s+/g, '-')}`
      console.log('Calculated companyId:', companyId)
      
      const userAssetIds = await redis.sMembers(`company:${companyId}:assetIds`)
      console.log('Активы для user3:', userAssetIds)
    }
    
  } catch (error) {
    console.error('❌ Ошибка отладки:', error.message)
  } finally {
    await redis.disconnect()
  }
}

debugAssetsData()