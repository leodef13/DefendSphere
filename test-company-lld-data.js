import MockRedis from './backend/mock-redis.js'

// Создаем экземпляр MockRedis
const redis = new MockRedis()

async function testCompanyLLDData() {
  console.log('🔍 Тестирование данных Company LLD...\n')

  try {
    // Инициализируем пользователей правильно
    await initializeDefaultUsers()
    console.log('✅ Пользователи инициализированы')

    // Инициализируем данные Company LLD
    await initializeCompanyLLDData()
    console.log('✅ Данные Company LLD инициализированы\n')

    // Проверяем пользователей
    console.log('👥 Проверка пользователей:')
    const users = ['user1', 'user3']
    for (const username of users) {
      const user = await redis.hGetAll(`user:${username}`)
      console.log(`  ${username}:`)
      console.log(`    - ID: ${user.id}`)
      console.log(`    - Email: ${user.email}`)
      console.log(`    - Organization: ${user.organization}`)
      console.log(`    - Role: ${user.role}`)
      console.log(`    - Permissions: ${user.permissions}`)
      console.log('')
    }

    // Проверяем компанию
    console.log('🏢 Проверка компании:')
    const companyData = await redis.hGetAll('company:company-lld')
    if (companyData.data) {
      const company = JSON.parse(companyData.data)
      console.log(`  - ID: ${company.id}`)
      console.log(`  - Name: ${company.name}`)
      console.log(`  - Created: ${company.createdAt}`)
    }
    console.log('')

    // Проверяем активы
    console.log('💻 Проверка активов:')
    const assetIds = await redis.sMembers('company:company-lld:assetIds')
    console.log(`  - Количество активов: ${assetIds.length}`)
    
    for (const assetId of assetIds) {
      const assetData = await redis.hGet('company:company-lld:assets', assetId)
      if (assetData) {
        const asset = JSON.parse(assetData)
        console.log(`  - ${asset.name} (${asset.type})`)
        console.log(`    IP: ${asset.ipAddress}`)
        console.log(`    Compliance: ${asset.complianceScore}%`)
        console.log(`    Vulnerabilities: ${asset.vulnerabilities.total} total`)
      }
    }
    console.log('')

    // Тестируем логику получения активов для user1
    console.log('🔐 Тестирование доступа user1 к активам:')
    const user1 = await redis.hGetAll('user:user1')
    const user1Orgs = user1.organization ? [user1.organization] : []
    console.log(`  - Организации user1: ${JSON.stringify(user1Orgs)}`)
    
    const user1Assets = []
    for (const org of user1Orgs) {
      // Для Company LLD используем фиксированный ID
      const companyId = org === 'Company LLD' ? 'company-lld' : `company-${org.toLowerCase().replace(/\s+/g, '-')}`
      console.log(`  - Ищем активы для компании: ${companyId}`)
      const assetIds = await redis.sMembers(`company:${companyId}:assetIds`)
      console.log(`  - Найдено активов: ${assetIds.length}`)
      
      for (const assetId of assetIds) {
        const assetData = await redis.hGet(`company:${companyId}:assets`, assetId)
        if (assetData) {
          const asset = JSON.parse(assetData)
          user1Assets.push({
            id: asset.assetId,
            ...asset
          })
        }
      }
    }
    console.log(`  - Итого активов для user1: ${user1Assets.length}`)
    user1Assets.forEach(asset => {
      console.log(`    * ${asset.name} (${asset.type})`)
    })
    console.log('')

    // Тестируем логику получения активов для user3
    console.log('🔐 Тестирование доступа user3 к активам:')
    const user3 = await redis.hGetAll('user:user3')
    const user3Orgs = user3.organization ? [user3.organization] : []
    console.log(`  - Организации user3: ${JSON.stringify(user3Orgs)}`)
    
    const user3Assets = []
    for (const org of user3Orgs) {
      // Для Company LLD используем фиксированный ID
      const companyId = org === 'Company LLD' ? 'company-lld' : `company-${org.toLowerCase().replace(/\s+/g, '-')}`
      console.log(`  - Ищем активы для компании: ${companyId}`)
      const assetIds = await redis.sMembers(`company:${companyId}:assetIds`)
      console.log(`  - Найдено активов: ${assetIds.length}`)
      
      for (const assetId of assetIds) {
        const assetData = await redis.hGet(`company:${companyId}:assets`, assetId)
        if (assetData) {
          const asset = JSON.parse(assetData)
          user3Assets.push({
            id: asset.assetId,
            ...asset
          })
        }
      }
    }
    console.log(`  - Итого активов для user3: ${user3Assets.length}`)
    user3Assets.forEach(asset => {
      console.log(`    * ${asset.name} (${asset.type})`)
    })

  } catch (error) {
    console.error('❌ Ошибка при тестировании:', error)
  }
}

async function initializeCompanyLLDData() {
  try {
    // Create Company LLD if it doesn't exist
    const companyId = 'company-lld'
    const companyExists = await redis.hGetAll(`company:${companyId}`)
    if (!companyExists.data) {
      const companyData = {
        id: companyId,
        name: 'Company LLD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await redis.hSet(`company:${companyId}`, 'data', JSON.stringify(companyData))
      await redis.sAdd('companies', companyId)
      console.log('Company LLD created')
    }

    // Create demo assets for Company LLD
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

    // Store assets for Company LLD
    for (const asset of assets) {
      const existingAsset = await redis.hGet(`company:${companyId}:assets`, asset.assetId)
      if (!existingAsset) {
        await redis.hSet(`company:${companyId}:assets`, asset.assetId, JSON.stringify(asset))
        await redis.sAdd(`company:${companyId}:assetIds`, asset.assetId)
      }
    }
    console.log('Company LLD assets initialized')
  } catch (error) {
    console.error('Error initializing Company LLD data:', error)
  }
}

async function initializeDefaultUsers() {
  try {
    // Create user1
    const user1Exists = await redis.hGetAll('user:user1')
    if (!user1Exists.username) {
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
      // Сохраняем поля по отдельности
      for (const [field, value] of Object.entries(user1)) {
        await redis.hSet('user:user1', field, value)
      }
      await redis.sAdd('users', 'user1')
      console.log('User1 created')
    }

    // Create user3
    const user3Exists = await redis.hGetAll('user:user3')
    if (!user3Exists.username) {
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
      // Сохраняем поля по отдельности
      for (const [field, value] of Object.entries(user3)) {
        await redis.hSet('user:user3', field, value)
      }
      await redis.sAdd('users', 'user3')
      console.log('User3 created')
    }
  } catch (error) {
    console.error('Error initializing default users:', error)
  }
}

// Запускаем тест
testCompanyLLDData()