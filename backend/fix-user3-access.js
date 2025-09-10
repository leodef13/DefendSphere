import { createClient } from 'redis'
import bcrypt from 'bcryptjs'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
})

redis.on('error', (err) => console.log('Redis Client Error', err))

async function fixUser3Access() {
  try {
    await redis.connect()
    console.log('✅ Подключение к Redis установлено')
    
    // Проверяем текущие данные user3
    console.log('\n🔍 Проверка текущих данных user3:')
    const currentUser3 = await redis.hGetAll('user:user3')
    console.log('Текущие данные:', currentUser3)
    
    // Обновляем данные user3
    console.log('\n🔄 Обновление данных user3...')
    const user3Data = {
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
    
    // Сохраняем обновленные данные
    for (const [field, value] of Object.entries(user3Data)) {
      await redis.hSet('user:user3', field, value)
    }
    
    // Добавляем в список пользователей если не добавлен
    await redis.sAdd('users', 'user3')
    
    console.log('✅ Данные user3 обновлены')
    
    // Проверяем активы Company LLD
    console.log('\n📊 Проверка активов Company LLD:')
    const assetIds = await redis.sMembers('company:company-lld:assetIds')
    console.log('Asset IDs:', assetIds)
    
    if (assetIds.length === 0) {
      console.log('⚠️  Активы Company LLD не найдены, создаем...')
      
      // Создаем активы
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
        await redis.hSet('company:company-lld:assets', asset.assetId, JSON.stringify(asset))
        await redis.sAdd('company:company-lld:assetIds', asset.assetId)
      }
      
      console.log('✅ Активы Company LLD созданы')
    } else {
      console.log('✅ Активы Company LLD уже существуют')
    }
    
    // Финальная проверка
    console.log('\n🎯 Финальная проверка:')
    const finalUser3 = await redis.hGetAll('user:user3')
    console.log('User3 organization:', finalUser3.organization)
    console.log('User3 permissions:', finalUser3.permissions)
    
    const finalAssets = await redis.sMembers('company:company-lld:assetIds')
    console.log('Company LLD assets:', finalAssets.length)
    
    console.log('\n✅ Исправление завершено!')
    
  } catch (error) {
    console.error('❌ Ошибка:', error)
  } finally {
    await redis.disconnect()
  }
}

fixUser3Access()