import { createClient } from 'redis'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
})

redis.on('error', (err) => console.log('Redis Client Error', err))

async function checkInitialization() {
  try {
    await redis.connect()
    console.log('✅ Подключение к Redis установлено')
    
    console.log('\n=== ПРОВЕРКА ИНИЦИАЛИЗАЦИИ ДАННЫХ ===\n')
    
    // 1. Проверяем пользователей
    console.log('1. Проверка пользователей:')
    const users = await redis.sMembers('users')
    console.log('Все пользователи:', users)
    
    if (users.includes('user1')) {
      const user1 = await redis.hGetAll('user:user1')
      console.log('✅ User1 найден:', user1.username, '-', user1.organization)
    } else {
      console.log('❌ User1 не найден')
    }
    
    if (users.includes('user3')) {
      const user3 = await redis.hGetAll('user:user3')
      console.log('✅ User3 найден:', user3.username, '-', user3.organization)
    } else {
      console.log('❌ User3 не найден')
    }
    
    // 2. Проверяем компании
    console.log('\n2. Проверка компаний:')
    const companies = await redis.sMembers('companies')
    console.log('Все компании:', companies)
    
    if (companies.includes('company-lld')) {
      const companyData = await redis.hGetAll('company:company-lld')
      console.log('✅ Company LLD найдена:', companyData.data ? 'данные есть' : 'данных нет')
    } else {
      console.log('❌ Company LLD не найдена')
    }
    
    // 3. Проверяем активы
    console.log('\n3. Проверка активов:')
    const assetIds = await redis.sMembers('company:company-lld:assetIds')
    console.log('Активы Company LLD:', assetIds.length, 'штук')
    
    if (assetIds.length > 0) {
      console.log('✅ Активы найдены:')
      for (const assetId of assetIds) {
        const assetData = await redis.hGet('company:company-lld:assets', assetId)
        if (assetData) {
          const asset = JSON.parse(assetData)
          console.log(`  - ${asset.name} (${asset.type})`)
        }
      }
    } else {
      console.log('❌ Активы не найдены')
    }
    
    // 4. Итоговая оценка
    console.log('\n=== ИТОГОВАЯ ОЦЕНКА ===')
    const hasUsers = users.includes('user1') && users.includes('user3')
    const hasCompany = companies.includes('company-lld')
    const hasAssets = assetIds.length > 0
    
    if (hasUsers && hasCompany && hasAssets) {
      console.log('✅ ВСЕ ДАННЫЕ ИНИЦИАЛИЗИРОВАНЫ КОРРЕКТНО!')
      console.log('Пользователи user1 и user3 должны видеть активы в разделе Assets')
    } else {
      console.log('❌ ДАННЫЕ НЕ ИНИЦИАЛИЗИРОВАНЫ ПОЛНОСТЬЮ')
      console.log('Пользователи:', hasUsers ? '✅' : '❌')
      console.log('Компания:', hasCompany ? '✅' : '❌')
      console.log('Активы:', hasAssets ? '✅' : '❌')
    }
    
  } catch (error) {
    console.error('❌ Ошибка проверки:', error.message)
  } finally {
    await redis.disconnect()
  }
}

checkInitialization()