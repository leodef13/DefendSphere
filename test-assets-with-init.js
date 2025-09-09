import MockRedis from './backend/mock-redis.js'

async function initializeTestData(redis) {
  console.log('Инициализация тестовых данных...')
  
  // 1. Создаем пользователей
  const user1 = {
    id: '2',
    username: 'user1',
    fullName: 'John Smith',
    email: 'user1@company-lld.com',
    password: 'hashed_user1',
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
  }
  
  const user3 = {
    id: '4',
    username: 'user3',
    fullName: 'Jane Doe',
    email: 'user3@company-lld.com',
    password: 'hashed_user3',
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
  
  // Сохраняем пользователей
  for (const [field, value] of Object.entries(user1)) {
    await redis.hSet('user:user1', field, value)
  }
  await redis.sAdd('users', 'user1')
  
  for (const [field, value] of Object.entries(user3)) {
    await redis.hSet('user:user3', field, value)
  }
  await redis.sAdd('users', 'user3')
  
  // 2. Создаем компанию
  const companyId = 'company-lld'
  const companyData = {
    id: companyId,
    name: 'Company LLD',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  await redis.hSet(`company:${companyId}`, 'data', JSON.stringify(companyData))
  await redis.sAdd('companies', companyId)
  
  // 3. Создаем активы
  const assets = [
    {
      assetId: 'asset-1',
      name: 'www.company-lld.com',
      type: 'Web Server',
      environment: 'Production',
      ipAddress: '116.203.242.207',
      lastAssessment: '2024-01-15',
      complianceScore: 75,
      standards: ['NIS2', 'GDPR', 'ISO/IEC 27001'],
      vulnerabilities: { critical: 1, high: 3, medium: 5, low: 1, total: 10 }
    },
    {
      assetId: 'asset-2',
      name: 'db.company-lld.com',
      type: 'Database Server',
      environment: 'Production',
      ipAddress: '10.0.0.12',
      lastAssessment: '2024-01-15',
      complianceScore: 70,
      standards: ['NIS2', 'ISO/IEC 27001'],
      vulnerabilities: { critical: 1, high: 2, medium: 4, low: 1, total: 8 }
    },
    {
      assetId: 'asset-3',
      name: 'app.company-lld.com',
      type: 'Application Server',
      environment: 'Production',
      ipAddress: '10.0.0.21',
      lastAssessment: '2024-01-15',
      complianceScore: 80,
      standards: ['GDPR', 'ISO/IEC 27001'],
      vulnerabilities: { critical: 2, high: 3, medium: 3, low: 1, total: 9 }
    },
    {
      assetId: 'asset-4',
      name: 'vpn.company-lld.com',
      type: 'VPN Gateway',
      environment: 'Production',
      ipAddress: '10.0.0.30',
      lastAssessment: '2024-01-15',
      complianceScore: 75,
      standards: ['NIS2'],
      vulnerabilities: { critical: 1, high: 1, medium: 2, low: 1, total: 5 }
    }
  ]
  
  // Сохраняем активы
  for (const asset of assets) {
    await redis.hSet(`company:${companyId}:assets`, asset.assetId, JSON.stringify(asset))
    await redis.sAdd(`company:${companyId}:assetIds`, asset.assetId)
  }
  
  console.log('Тестовые данные инициализированы!')
}

async function testAssetsWithInit() {
  const redis = new MockRedis()
  
  console.log('=== DEBUG: Проверка данных активов с инициализацией ===\n')
  
  // Инициализируем данные
  await initializeTestData(redis)
  
  // 1. Проверяем данные пользователей
  console.log('\n1. Проверка данных пользователей:')
  const user1 = await redis.hGetAll('user:user1')
  const user3 = await redis.hGetAll('user:user3')
  
  console.log('User1 данные:')
  console.log('- Username:', user1.username)
  console.log('- Organization:', user1.organization)
  console.log('- Role:', user1.role)
  console.log('- Permissions:', user1.permissions)
  
  console.log('\nUser3 данные:')
  console.log('- Username:', user3.username)
  console.log('- Organization:', user3.organization)
  console.log('- Role:', user3.role)
  console.log('- Permissions:', user3.permissions)
  
  // 2. Проверяем активы компании
  console.log('\n2. Проверка активов компании:')
  const assetIds = await redis.sMembers('company:company-lld:assetIds')
  console.log('Asset IDs:', assetIds)
  
  for (const assetId of assetIds) {
    const assetData = await redis.hGet('company:company-lld:assets', assetId)
    if (assetData) {
      const asset = JSON.parse(assetData)
      console.log(`Asset ${assetId}:`, asset.name, '-', asset.type)
    }
  }
  
  // 3. Симулируем логику получения активов для user1
  console.log('\n3. Симуляция логики получения активов для user1:')
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
  
  // 4. Симулируем логику получения активов для user3
  console.log('\n4. Симуляция логики получения активов для user3:')
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
  
  // 5. Проверяем права доступа
  console.log('\n5. Проверка прав доступа:')
  const user1Permissions = JSON.parse(user1.permissions)
  const user3Permissions = JSON.parse(user3.permissions)
  
  console.log('User1 имеет доступ к assets:', user1Permissions.includes('access.assets'))
  console.log('User3 имеет доступ к assets:', user3Permissions.includes('access.assets'))
}

testAssetsWithInit().catch(console.error)