import { createClient } from 'redis'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380'

async function cleanupData() {
  const redis = createClient({ url: REDIS_URL })
  
  try {
    await redis.connect()
    console.log('Connected to Redis')
    
    // 1. Удаляем пользователей user1, user2, user3
    console.log('🗑️  Удаление пользователей...')
    const usersToDelete = ['user1', 'user2', 'user3']
    
    for (const username of usersToDelete) {
      // Удаляем по разным возможным ключам
      await redis.del(`user:${username}`)
      await redis.del(`user:2`) // user1
      await redis.del(`user:3`) // user2  
      await redis.del(`user:4`) // user3
      await redis.sRem('users', username)
      console.log(`✅ Удален пользователь: ${username}`)
    }
    
    // 2. Создаем admin пользователя
    console.log('👤 Создание admin пользователя...')
    const hashedPasswordAdmin = await bcrypt.hash('admin', 10)
    await redis.hSet('user:admin', {
      id: '1',
      username: 'admin',
      fullName: 'System Administrator',
      email: 'admin@defendsphere.com',
      organization: 'System',
      organizations: JSON.stringify(['System']),
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
      lastLogin: new Date().toISOString()
    })
    await redis.hSet('user:admin', 'password', hashedPasswordAdmin)
    await redis.sAdd('users', 'admin')
    console.log('✅ Создан admin пользователь')
    
    // 3. Обновляем jon пользователя (оставляем как есть)
    console.log('👤 Обновление jon пользователя...')
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
      lastLogin: new Date().toISOString()
    })
    await redis.hSet('user:jon', 'password', hashedPasswordJon)
    await redis.sAdd('users', 'jon')
    console.log('✅ Обновлен jon пользователь')
    
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
    await redis.del('assets')
    await redis.del('assets:Company LLD')
    await redis.del('assets:Watson Morris')
    
    // Создаем активы для Company LLD (4 актива)
    const companyLLDAssets = [
      {
        id: 'asset-1',
        name: 'Web Server - Production',
        type: 'Server',
        ip: '192.168.1.10',
        status: 'Active',
        organization: 'Company LLD',
        vulnerabilities: [
          { severity: 'High', count: 3 },
          { severity: 'Medium', count: 5 },
          { severity: 'Low', count: 2 }
        ],
        lastScan: new Date().toISOString()
      },
      {
        id: 'asset-2', 
        name: 'Database Server',
        type: 'Database',
        ip: '192.168.1.20',
        status: 'Active',
        organization: 'Company LLD',
        vulnerabilities: [
          { severity: 'Critical', count: 1 },
          { severity: 'High', count: 2 },
          { severity: 'Medium', count: 3 }
        ],
        lastScan: new Date().toISOString()
      },
      {
        id: 'asset-3',
        name: 'File Server',
        type: 'Storage',
        ip: '192.168.1.30',
        status: 'Active', 
        organization: 'Company LLD',
        vulnerabilities: [
          { severity: 'Medium', count: 4 },
          { severity: 'Low', count: 1 }
        ],
        lastScan: new Date().toISOString()
      },
      {
        id: 'asset-4',
        name: 'Mail Server',
        type: 'Mail',
        ip: '192.168.1.40',
        status: 'Active',
        organization: 'Company LLD',
        vulnerabilities: [
          { severity: 'High', count: 1 },
          { severity: 'Medium', count: 2 },
          { severity: 'Low', count: 3 }
        ],
        lastScan: new Date().toISOString()
      }
    ]
    
    // Создаем активы для Watson Morris (2 актива)
    const watsonMorrisAssets = [
      {
        id: 'asset-wm-1',
        name: 'WM Production Server',
        type: 'Server',
        ip: '10.0.1.10',
        status: 'Active',
        organization: 'Watson Morris',
        vulnerabilities: [
          { severity: 'High', count: 2 },
          { severity: 'Medium', count: 3 },
          { severity: 'Low', count: 1 }
        ],
        lastScan: new Date().toISOString()
      },
      {
        id: 'asset-wm-2',
        name: 'WM Database Cluster',
        type: 'Database',
        ip: '10.0.1.20',
        status: 'Active',
        organization: 'Watson Morris',
        vulnerabilities: [
          { severity: 'Critical', count: 1 },
          { severity: 'High', count: 1 },
          { severity: 'Medium', count: 2 }
        ],
        lastScan: new Date().toISOString()
      }
    ]
    
    // Сохраняем активы
    for (const asset of companyLLDAssets) {
      await redis.hSet(`asset:${asset.id}`, asset)
      await redis.sAdd('assets', asset.id)
      await redis.sAdd('assets:Company LLD', asset.id)
    }
    
    for (const asset of watsonMorrisAssets) {
      await redis.hSet(`asset:${asset.id}`, asset)
      await redis.sAdd('assets', asset.id)
      await redis.sAdd('assets:Watson Morris', asset.id)
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

cleanupData()