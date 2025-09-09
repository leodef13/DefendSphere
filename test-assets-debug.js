import MockRedis from './backend/mock-redis.js'

async function testAssetsDebug() {
  const redis = new MockRedis()
  
  console.log('=== DEBUG: Проверка данных активов для Company LLD ===\n')
  
  // 1. Проверяем данные пользователей
  console.log('1. Проверка данных пользователей:')
  const user1 = await redis.hGetAll('user:user1')
  const user3 = await redis.hGetAll('user:user3')
  
  console.log('User1 данные:')
  console.log('- Username:', user1.username)
  console.log('- Organization:', user1.organization)
  console.log('- Role:', user1.role)
  console.log('- Permissions:', user1.permissions)
  console.log('- Additional Organizations:', user1.additionalOrganizations)
  
  console.log('\nUser3 данные:')
  console.log('- Username:', user3.username)
  console.log('- Organization:', user3.organization)
  console.log('- Role:', user3.role)
  console.log('- Permissions:', user3.permissions)
  console.log('- Additional Organizations:', user3.additionalOrganizations)
  
  // 2. Проверяем данные компании
  console.log('\n2. Проверка данных компании:')
  const companyData = await redis.hGetAll('company:company-lld')
  console.log('Company LLD данные:', companyData)
  
  // 3. Проверяем активы компании
  console.log('\n3. Проверка активов компании:')
  const assetIds = await redis.sMembers('company:company-lld:assetIds')
  console.log('Asset IDs:', assetIds)
  
  for (const assetId of assetIds) {
    const assetData = await redis.hGet('company:company-lld:assets', assetId)
    if (assetData) {
      const asset = JSON.parse(assetData)
      console.log(`Asset ${assetId}:`, asset.name, '-', asset.type)
    }
  }
  
  // 4. Симулируем логику получения активов для user1
  console.log('\n4. Симуляция логики получения активов для user1:')
  const user1Orgs = user1.organization ? [user1.organization] : []
  console.log('User1 organizations:', user1Orgs)
  
  const allAssets = []
  for (const org of user1Orgs) {
    console.log(`Обрабатываем организацию: ${org}`)
    const companyId = org === 'Company LLD' ? 'company-lld' : `company-${org.toLowerCase().replace(/\s+/g, '-')}`
    console.log(`Company ID: ${companyId}`)
    
    const orgAssetIds = await redis.sMembers(`company:${companyId}:assetIds`)
    console.log(`Найдено активов: ${orgAssetIds.length}`)
    
    for (const assetId of orgAssetIds) {
      const assetData = await redis.hGet(`company:${companyId}:assets`, assetId)
      if (assetData) {
        const asset = JSON.parse(assetData)
        allAssets.push({
          id: asset.assetId,
          ...asset
        })
        console.log(`- Добавлен актив: ${asset.name}`)
      }
    }
  }
  
  console.log(`\nИтого активов для user1: ${allAssets.length}`)
  
  // 5. Симулируем логику получения активов для user3
  console.log('\n5. Симуляция логики получения активов для user3:')
  const user3Orgs = user3.organization ? [user3.organization] : []
  console.log('User3 organizations:', user3Orgs)
  
  const allAssets3 = []
  for (const org of user3Orgs) {
    console.log(`Обрабатываем организацию: ${org}`)
    const companyId = org === 'Company LLD' ? 'company-lld' : `company-${org.toLowerCase().replace(/\s+/g, '-')}`
    console.log(`Company ID: ${companyId}`)
    
    const orgAssetIds = await redis.sMembers(`company:${companyId}:assetIds`)
    console.log(`Найдено активов: ${orgAssetIds.length}`)
    
    for (const assetId of orgAssetIds) {
      const assetData = await redis.hGet(`company:${companyId}:assets`, assetId)
      if (assetData) {
        const asset = JSON.parse(assetData)
        allAssets3.push({
          id: asset.assetId,
          ...asset
        })
        console.log(`- Добавлен актив: ${asset.name}`)
      }
    }
  }
  
  console.log(`\nИтого активов для user3: ${allAssets3.length}`)
  
  // 6. Проверяем все ключи в Redis
  console.log('\n6. Все ключи в Redis:')
  const allKeys = Object.keys(redis.data)
  console.log('Всего ключей:', allKeys.length)
  allKeys.forEach(key => {
    if (key.includes('company') || key.includes('user')) {
      console.log('-', key)
    }
  })
}

testAssetsDebug().catch(console.error)