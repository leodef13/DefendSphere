import { createClient } from 'redis'
import bcrypt from 'bcryptjs'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380'

const redis = createClient({ url: REDIS_URL })

async function initializeRedis() {
  try {
    await redis.connect()
    console.log('Connected to Redis')

    // Clear existing data (optional - remove in production)
    // await redis.flushAll()
    // console.log('Cleared existing data')

    // Initialize default users
    const adminExists = await redis.hGetAll('user:admin')
    if (!adminExists.username) {
      const hashedPassword = await bcrypt.hash('admin', 10)
      const adminUser = {
        id: '1',
        username: 'admin',
        email: 'admin@defendsphere.com',
        password: hashedPassword,
        role: 'admin',
        permissions: JSON.stringify(['all']),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      await redis.hSet('user:admin', adminUser)
      await redis.sAdd('users', 'admin')
      console.log('✅ Admin user created')
    } else {
      console.log('ℹ️  Admin user already exists')
    }

    const user1Exists = await redis.hGetAll('user:user1')
    if (!user1Exists.username) {
      const hashedPassword = await bcrypt.hash('user1', 10)
      const user1 = {
        id: '2',
        username: 'user1',
        email: 'user1@defendsphere.com',
        password: hashedPassword,
        role: 'user',
        permissions: JSON.stringify(['access.dashboard', 'access.assets', 'access.incidents', 'access.alerts']),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      await redis.hSet('user:user1', user1)
      await redis.sAdd('users', 'user1')
      console.log('✅ User1 created')
    } else {
      console.log('ℹ️  User1 already exists')
    }

    const user2Exists = await redis.hGetAll('user:user2')
    if (!user2Exists.username) {
      const hashedPassword = await bcrypt.hash('user2', 10)
      const user2 = {
        id: '3',
        username: 'user2',
        email: 'user2@defendsphere.com',
        password: hashedPassword,
        role: 'user',
        permissions: JSON.stringify(['access.dashboard', 'access.reports', 'access.assets', 'access.suppliers']),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      await redis.hSet('user:user2', user2)
      await redis.sAdd('users', 'user2')
      console.log('✅ User2 created')
    } else {
      console.log('ℹ️  User2 already exists')
    }

    // Initialize some sample data
    await redis.set('system:initialized', 'true')
    await redis.set('system:version', '1.0.0')
    await redis.set('system:lastInit', new Date().toISOString())

    console.log('✅ Redis initialization completed successfully')
    console.log('📊 Default users:')
    console.log('   - admin/admin (Super Admin)')
    console.log('   - user1/user1 (Security Analyst)')
    console.log('   - user2/user2 (Standard User)')

  } catch (error) {
    console.error('❌ Redis initialization failed:', error)
    process.exit(1)
  } finally {
    await redis.disconnect()
    console.log('Disconnected from Redis')
  }
}

// Run initialization
initializeRedis()