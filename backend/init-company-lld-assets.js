import { createClient } from 'redis'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
})

redis.on('error', (err) => console.log('Redis Client Error', err))

async function initializeCompanyLLDAssets() {
  try {
    await redis.connect()
    console.log('✅ Подключение к Redis установлено')
    
    // Проверяем, есть ли уже данные
    const existingAssets = await redis.sMembers('company:company-lld:assetIds')
    if (existingAssets.length > 0) {
      console.log('✅ Активы Company LLD уже существуют:', existingAssets.length)
      return
    }
    
    console.log('🔄 Инициализация активов Company LLD...')
    
    // Создаем 4 актива для Company LLD
    const assets = [
      {
        assetId: 'asset-www-001',
        name: 'www.company-lld.com',
        type: 'Web Server',
        environment: 'Production',
        ipAddress: '192.168.1.10',
        lastAssessment: '2025-01-15',
        complianceScore: 85,
        standards: ['ISO/IEC 27001', 'GDPR'],
        vulnerabilities: {
          critical: 0,
          high: 2,
          medium: 5,
          low: 8,
          total: 15
        }
      },
      {
        assetId: 'asset-db-002',
        name: 'db.company-lld.com',
        type: 'Database Server',
        environment: 'Production',
        ipAddress: '192.168.1.20',
        lastAssessment: '2025-01-14',
        complianceScore: 92,
        standards: ['ISO/IEC 27001', 'GDPR', 'PCI DSS'],
        vulnerabilities: {
          critical: 0,
          high: 1,
          medium: 3,
          low: 4,
          total: 8
        }
      },
      {
        assetId: 'asset-app-003',
        name: 'app.company-lld.com',
        type: 'Application Server',
        environment: 'Production',
        ipAddress: '192.168.1.30',
        lastAssessment: '2025-01-13',
        complianceScore: 78,
        standards: ['ISO/IEC 27001', 'GDPR'],
        vulnerabilities: {
          critical: 1,
          high: 3,
          medium: 7,
          low: 12,
          total: 23
        }
      },
      {
        assetId: 'asset-vpn-004',
        name: 'vpn.company-lld.com',
        type: 'VPN Gateway',
        environment: 'Production',
        ipAddress: '192.168.1.40',
        lastAssessment: '2025-01-12',
        complianceScore: 95,
        standards: ['ISO/IEC 27001', 'NIST'],
        vulnerabilities: {
          critical: 0,
          high: 0,
          medium: 2,
          low: 3,
          total: 5
        }
      }
    ]
    
    // Сохраняем активы в Redis
    for (const asset of assets) {
      await redis.hSet('company:company-lld:assets', asset.assetId, JSON.stringify(asset))
      await redis.sAdd('company:company-lld:assetIds', asset.assetId)
      console.log(`✅ Создан актив: ${asset.name}`)
    }
    
    // Добавляем компанию в список компаний
    await redis.sAdd('companies', 'company-lld')
    
    // Создаем данные компании
    const companyData = {
      id: 'company-lld',
      name: 'Company LLD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    await redis.hSet('company:company-lld', 'data', JSON.stringify(companyData))
    
    console.log('✅ Все активы Company LLD успешно инициализированы!')
    
    // Проверяем результат
    const assetIds = await redis.sMembers('company:company-lld:assetIds')
    console.log('Проверка: найдено активов:', assetIds.length)
    
  } catch (error) {
    console.error('❌ Ошибка инициализации:', error.message)
  } finally {
    await redis.disconnect()
  }
}

initializeCompanyLLDAssets()