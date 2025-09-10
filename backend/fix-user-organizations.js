import { createClient } from 'redis'

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
})

redis.on('error', (err) => console.log('Redis Client Error', err))

async function fixUserOrganizations() {
  try {
    await redis.connect()
    console.log('✅ Подключение к Redis установлено')
    
    // Получаем всех пользователей
    const usernames = await redis.sMembers('users')
    console.log('Найдены пользователи:', usernames)
    
    for (const username of usernames) {
      const user = await redis.hGetAll(`user:${username}`)
      if (user.username) {
        console.log(`\n👤 Обрабатываем пользователя: ${username}`)
        console.log('Текущая организация:', user.organization)
        
        // Добавляем поле organizations если его нет
        if (!user.organizations && user.organization) {
          const organizations = JSON.stringify([user.organization])
          await redis.hSet(`user:${username}`, 'organizations', organizations)
          console.log(`✅ Добавлено organizations: ${organizations}`)
        } else if (user.organizations) {
          console.log('✅ organizations уже существует:', user.organizations)
        } else {
          console.log('⚠️ Нет организации для пользователя')
        }
      }
    }
    
    console.log('\n🎉 Обновление завершено!')
    
  } catch (error) {
    console.error('❌ Ошибка обновления:', error.message)
  } finally {
    await redis.disconnect()
  }
}

fixUserOrganizations()