import { createClient } from 'redis'
import bcrypt from 'bcryptjs'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
})

redis.on('error', (err) => console.log('Redis Client Error', err))

async function comprehensiveDiagnosis() {
  try {
    console.log('🔍 КОМПЛЕКСНАЯ ДИАГНОСТИКА СИСТЕМЫ')
    console.log('=====================================')
    
    // 1. Проверка подключения к Redis
    console.log('\n1️⃣ ПРОВЕРКА ПОДКЛЮЧЕНИЯ К REDIS')
    console.log('--------------------------------')
    await redis.connect()
    console.log('✅ Подключение к Redis установлено')
    
    // 2. Проверка всех пользователей
    console.log('\n2️⃣ ПРОВЕРКА ПОЛЬЗОВАТЕЛЕЙ')
    console.log('-------------------------')
    const allUsers = await redis.sMembers('users')
    console.log('Все пользователи в системе:', allUsers)
    
    for (const username of allUsers) {
      const userData = await redis.hGetAll(`user:${username}`)
      console.log(`\n👤 ${username}:`)
      console.log(`   ID: ${userData.id}`)
      console.log(`   Organization: ${userData.organization}`)
      console.log(`   Role: ${userData.role}`)
      console.log(`   Permissions: ${userData.permissions}`)
      console.log(`   Full Name: ${userData.fullName}`)
    }
    
    // 3. Проверка компаний
    console.log('\n3️⃣ ПРОВЕРКА КОМПАНИЙ')
    console.log('---------------------')
    const companies = await redis.sMembers('companies')
    console.log('Все компании:', companies)
    
    for (const companyId of companies) {
      const companyData = await redis.hGet(`company:${companyId}`, 'data')
      if (companyData) {
        const company = JSON.parse(companyData)
        console.log(`\n🏢 ${companyId}:`)
        console.log(`   Name: ${company.name}`)
        console.log(`   Created: ${company.createdAt}`)
      }
    }
    
    // 4. Проверка активов Company LLD
    console.log('\n4️⃣ ПРОВЕРКА АКТИВОВ COMPANY LLD')
    console.log('--------------------------------')
    const assetIds = await redis.sMembers('company:company-lld:assetIds')
    console.log('Asset IDs для Company LLD:', assetIds)
    
    if (assetIds.length === 0) {
      console.log('❌ АКТИВЫ НЕ НАЙДЕНЫ! Создаем...')
      
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
        console.log(`✅ Создан актив: ${asset.name}`)
      }
      
      console.log('✅ Все активы Company LLD созданы')
    } else {
      console.log('✅ Активы найдены:')
      for (const assetId of assetIds) {
        const assetData = await redis.hGet('company:company-lld:assets', assetId)
        if (assetData) {
          const asset = JSON.parse(assetData)
          console.log(`   - ${asset.name} (${asset.type}) - Compliance: ${asset.complianceScore}%`)
        }
      }
    }
    
    // 5. Проверка и исправление пользователей
    console.log('\n5️⃣ ПРОВЕРКА И ИСПРАВЛЕНИЕ ПОЛЬЗОВАТЕЛЕЙ')
    console.log('----------------------------------------')
    
    // Проверяем user1
    const user1Data = await redis.hGetAll('user:user1')
    if (!user1Data.username || user1Data.organization !== 'Company LLD') {
      console.log('❌ user1 требует исправления')
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
      
      for (const [field, value] of Object.entries(user1)) {
        await redis.hSet('user:user1', field, value)
      }
      await redis.sAdd('users', 'user1')
      console.log('✅ user1 исправлен')
    } else {
      console.log('✅ user1 в порядке')
    }
    
    // Проверяем user3
    const user3Data = await redis.hGetAll('user:user3')
    if (!user3Data.username || user3Data.organization !== 'Company LLD') {
      console.log('❌ user3 требует исправления')
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
      
      for (const [field, value] of Object.entries(user3)) {
        await redis.hSet('user:user3', field, value)
      }
      await redis.sAdd('users', 'user3')
      console.log('✅ user3 исправлен')
    } else {
      console.log('✅ user3 в порядке')
    }
    
    // 6. Создание компании если не существует
    console.log('\n6️⃣ ПРОВЕРКА КОМПАНИИ COMPANY LLD')
    console.log('----------------------------------')
    const companyExists = await redis.sIsMember('companies', 'company-lld')
    if (!companyExists) {
      console.log('❌ Компания Company LLD не найдена, создаем...')
      const companyData = {
        id: 'company-lld',
        name: 'Company LLD',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      await redis.hSet('company:company-lld', 'data', JSON.stringify(companyData))
      await redis.sAdd('companies', 'company-lld')
      console.log('✅ Компания Company LLD создана')
    } else {
      console.log('✅ Компания Company LLD существует')
    }
    
    // 7. Финальная проверка
    console.log('\n7️⃣ ФИНАЛЬНАЯ ПРОВЕРКА')
    console.log('---------------------')
    
    const finalUser1 = await redis.hGetAll('user:user1')
    const finalUser3 = await redis.hGetAll('user:user3')
    const finalAssets = await redis.sMembers('company:company-lld:assetIds')
    
    console.log('User1 organization:', finalUser1.organization)
    console.log('User3 organization:', finalUser3.organization)
    console.log('Company LLD assets count:', finalAssets.length)
    
    console.log('\n🎉 ДИАГНОСТИКА ЗАВЕРШЕНА!')
    console.log('========================')
    
  } catch (error) {
    console.error('❌ Ошибка диагностики:', error)
  } finally {
    await redis.disconnect()
  }
}

comprehensiveDiagnosis()