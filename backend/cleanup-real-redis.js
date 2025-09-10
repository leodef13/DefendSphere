import { createClient } from 'redis'
import bcrypt from 'bcryptjs'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380'

async function cleanupRealRedis() {
  const redis = createClient({ url: REDIS_URL })
  
  try {
    await redis.connect()
    console.log('Connected to Redis')
    
    // 1. Удаляем всех пользователей
    console.log('🗑️  Удаление всех пользователей...')
    const userKeys = await redis.keys('user:*')
    for (const key of userKeys) {
      await redis.del(key)
      console.log(`✅ Удален: ${key}`)
    }
    
    // Удаляем из множества users
    await redis.del('users')
    
    // 2. Создаем admin пользователя
    console.log('👤 Создание admin пользователя...')
    const hashedPasswordAdmin = await bcrypt.hash('admin', 10)
    await redis.hSet('user:admin', {
      id: '1',
      username: 'admin',
      fullName: 'System Administrator',
      email: 'admin@defendsphere.com',
      organization: 'System',
      organizations: JSON.stringify(['Company LLD', 'Watson Morris']),
      position: 'System Administrator',
      role: 'admin',
      phone: '+1-555-0000',
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
      lastLogin: new Date().toISOString(),
      password: hashedPasswordAdmin
    })
    await redis.sAdd('users', 'admin')
    console.log('✅ Создан admin пользователь')
    
    // 3. Создаем jon пользователя
    console.log('👤 Создание jon пользователя...')
    const hashedPasswordJon = await bcrypt.hash('jon123', 10)
    await redis.hSet('user:jon', {
      id: '5',
      username: 'jon',
      fullName: 'Jon Smith',
      email: 'jon@watson-morris.com',
      organization: 'Watson Morris',
      organizations: JSON.stringify(['Watson Morris']),
      position: 'Security Manager',
      role: 'user',
      phone: '+1-555-0104',
      permissions: JSON.stringify([
        'access.dashboard',
        'access.assets',
        'access.reports',
        'access.compliance',
        'access.customerTrust',
        'access.suppliers'
      ]),
      additionalOrganizations: JSON.stringify([]),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      password: hashedPasswordJon
    })
    await redis.sAdd('users', 'jon')
    console.log('✅ Создан jon пользователь')
    
    // 4. Очищаем организации
    console.log('🏢 Очистка организаций...')
    await redis.del('organizations')
    await redis.del('organizations:names')
    
    // Создаем только нужные организации
    await redis.sAdd('organizations', 'Company LLD', 'Watson Morris')
    await redis.sAdd('organizations:names', 'Company LLD', 'Watson Morris')
    console.log('✅ Организации очищены, оставлены: Company LLD, Watson Morris')
    
    // 5. Очищаем активы
    console.log('💾 Очистка активов...')
    const assetKeys = await redis.keys('asset:*')
    for (const key of assetKeys) {
      await redis.del(key)
    }
    await redis.del('assets')
    await redis.del('assets:Company LLD')
    await redis.del('assets:Watson Morris')
    
    // Создаем активы для Company LLD (4 актива)
    const companyLLDAssets = [
      {
        id: 'asset-1',
        assetId: 'asset-1',
        name: 'www.company-lld.com',
        type: 'Web Server',
        environment: 'Production',
        ipAddress: '116.203.242.207',
        lastAssessment: '2025-09-10',
        complianceScore: 75,
        standards: JSON.stringify(['NIS2', 'GDPR', 'ISO/IEC 27001']),
        vulnerabilities: JSON.stringify({
          critical: 1,
          high: 3,
          medium: 5,
          low: 1,
          total: 10
        }),
        organization: 'Company LLD'
      },
      {
        id: 'asset-2',
        assetId: 'asset-2',
        name: 'db.company-lld.com',
        type: 'Database Server',
        environment: 'Production',
        ipAddress: '10.0.0.12',
        lastAssessment: '2025-09-10',
        complianceScore: 70,
        standards: JSON.stringify(['NIS2', 'ISO/IEC 27001']),
        vulnerabilities: JSON.stringify({
          critical: 1,
          high: 2,
          medium: 4,
          low: 1,
          total: 8
        }),
        organization: 'Company LLD'
      },
      {
        id: 'asset-3',
        assetId: 'asset-3',
        name: 'app.company-lld.com',
        type: 'Application Server',
        environment: 'Production',
        ipAddress: '10.0.0.21',
        lastAssessment: '2025-09-10',
        complianceScore: 80,
        standards: JSON.stringify(['GDPR', 'ISO/IEC 27001']),
        vulnerabilities: JSON.stringify({
          critical: 2,
          high: 3,
          medium: 3,
          low: 1,
          total: 9
        }),
        organization: 'Company LLD'
      },
      {
        id: 'asset-4',
        assetId: 'asset-4',
        name: 'vpn.company-lld.com',
        type: 'VPN Gateway',
        environment: 'Production',
        ipAddress: '10.0.0.30',
        lastAssessment: '2025-09-10',
        complianceScore: 75,
        standards: JSON.stringify(['NIS2']),
        vulnerabilities: JSON.stringify({
          critical: 1,
          high: 1,
          medium: 2,
          low: 1,
          total: 5
        }),
        organization: 'Company LLD'
      }
    ]
    
    // Создаем активы для Watson Morris (2 актива)
    const watsonMorrisAssets = [
      {
        id: 'wm-asset-1',
        assetId: 'wm-asset-1',
        name: 'www.watson-morris.com',
        type: 'Web Server',
        environment: 'Production',
        ipAddress: '192.168.1.100',
        lastAssessment: '2025-09-10',
        complianceScore: 85,
        standards: JSON.stringify(['ISO/IEC 27001', 'SOC 2']),
        vulnerabilities: JSON.stringify({
          critical: 0,
          high: 2,
          medium: 3,
          low: 2,
          total: 7
        }),
        organization: 'Watson Morris'
      },
      {
        id: 'wm-asset-2',
        assetId: 'wm-asset-2',
        name: 'db.watson-morris.com',
        type: 'Database Server',
        environment: 'Production',
        ipAddress: '192.168.1.101',
        lastAssessment: '2025-09-10',
        complianceScore: 90,
        standards: JSON.stringify(['ISO/IEC 27001']),
        vulnerabilities: JSON.stringify({
          critical: 0,
          high: 1,
          medium: 2,
          low: 1,
          total: 4
        }),
        organization: 'Watson Morris'
      }
    ]
    
    // Сохраняем активы для Company LLD
    for (const asset of companyLLDAssets) {
      await redis.hSet(`asset:${asset.id}`, asset)
      await redis.sAdd('assets', asset.id)
      await redis.sAdd('assets:Company LLD', asset.id)
      // Также сохраняем в формате, который ожидает API
      await redis.sAdd('company:company-lld:assetIds', asset.id)
      await redis.hSet('company:company-lld:assets', asset.id, JSON.stringify(asset))
    }
    
    // Сохраняем активы для Watson Morris
    for (const asset of watsonMorrisAssets) {
      await redis.hSet(`asset:${asset.id}`, asset)
      await redis.sAdd('assets', asset.id)
      await redis.sAdd('assets:Watson Morris', asset.id)
      // Также сохраняем в формате, который ожидает API
      await redis.sAdd('company:watson-morris:assetIds', asset.id)
      await redis.hSet('company:watson-morris:assets', asset.id, JSON.stringify(asset))
    }
    
    console.log('✅ Активы очищены и созданы:')
    console.log('   - Company LLD: 4 актива')
    console.log('   - Watson Morris: 2 актива')
    
    // 6. Очищаем другие данные
    console.log('🧹 Очистка дополнительных данных...')
    await redis.del('reports')
    await redis.del('scans')
    await redis.del('vulnerabilities')
    console.log('✅ Дополнительные данные очищены')
    
    console.log('🎉 Очистка данных завершена успешно!')
    console.log('')
    console.log('📊 Итоговое состояние:')
    console.log('👥 Пользователи: admin, jon')
    console.log('🏢 Организации: Company LLD, Watson Morris')
    console.log('💾 Активы: 4 (Company LLD) + 2 (Watson Morris) = 6 активов')
    
  } catch (error) {
    console.error('❌ Ошибка при очистке данных:', error)
  } finally {
    await redis.quit()
  }
}

cleanupRealRedis()