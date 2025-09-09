import { createClient } from 'redis'
import bcrypt from 'bcryptjs'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
})

redis.on('error', (err) => console.log('Redis Client Error', err))

async function initializeCompanyLLDData() {
  try {
    await redis.connect()
    console.log('Подключение к Redis установлено')
    
    // 1. Создаем пользователей
    console.log('Создание пользователей...')
    
    const user1 = {
      id: '2',
      username: 'user1',
      fullName: 'John Smith',
      email: 'user1@company-lld.com',
      password: await bcrypt.hash('user1', 10),
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
      password: await bcrypt.hash('user3', 10),
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
    console.log('User1 создан')
    
    for (const [field, value] of Object.entries(user3)) {
      await redis.hSet('user:user3', field, value)
    }
    await redis.sAdd('users', 'user3')
    console.log('User3 создан')
    
    // 2. Создаем компанию
    console.log('Создание компании...')
    const companyId = 'company-lld'
    const companyData = {
      id: companyId,
      name: 'Company LLD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    await redis.hSet(`company:${companyId}`, 'data', JSON.stringify(companyData))
    await redis.sAdd('companies', companyId)
    console.log('Company LLD создана')
    
    // 3. Создаем активы
    console.log('Создание активов...')
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
    console.log('Активы Company LLD созданы')
    
    // 4. Проверяем результат
    console.log('\nПроверка созданных данных:')
    const user1Data = await redis.hGetAll('user:user1')
    const user3Data = await redis.hGetAll('user:user3')
    const assetIds = await redis.sMembers('company:company-lld:assetIds')
    
    console.log('User1:', user1Data.username, '-', user1Data.organization)
    console.log('User3:', user3Data.username, '-', user3Data.organization)
    console.log('Активы:', assetIds.length, 'штук')
    
    for (const assetId of assetIds) {
      const assetData = await redis.hGet('company:company-lld:assets', assetId)
      if (assetData) {
        const asset = JSON.parse(assetData)
        console.log(`- ${asset.name} (${asset.type})`)
      }
    }
    
    console.log('\n✅ Данные Company LLD успешно инициализированы!')
    
  } catch (error) {
    console.error('Ошибка инициализации:', error)
  } finally {
    await redis.disconnect()
  }
}

initializeCompanyLLDData()