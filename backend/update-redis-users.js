import { createClient } from 'redis'
import bcrypt from 'bcryptjs'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380'

async function updateRedisUsers() {
  const redis = createClient({ url: REDIS_URL })
  
  try {
    await redis.connect()
    console.log('Connected to Redis')
    
    // Update user1
    console.log('Updating user1...')
    await redis.hSet('user:user1', {
      id: '2',
      username: 'user1',
      fullName: 'John Smith',
      email: 'user1@company-lld.com',
      organization: 'Company LLD',
      organizations: JSON.stringify(['Company LLD']),
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
    })
    
    const hashedPassword1 = await bcrypt.hash('user1', 10)
    await redis.hSet('user:user1', 'password', hashedPassword1)
    console.log('✅ user1 updated')
    
    // Update user3
    console.log('Updating user3...')
    await redis.hSet('user:user3', {
      id: '4',
      username: 'user3',
      fullName: 'Jane Doe',
      email: 'user3@company-lld.com',
      organization: 'Company LLD',
      organizations: JSON.stringify(['Company LLD']),
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
    })
    
    const hashedPassword3 = await bcrypt.hash('user3', 10)
    await redis.hSet('user:user3', 'password', hashedPassword3)
    console.log('✅ user3 updated')
    
    // Update user2
    console.log('Updating user2...')
    await redis.hSet('user:user2', {
      id: '3',
      username: 'user2',
      fullName: 'Bob Wilson',
      email: 'user2@watson-morris.com',
      organization: 'Watson Morris',
      organizations: JSON.stringify(['Watson Morris']),
      position: 'Security Analyst',
      role: 'user',
      phone: '+1-555-0102',
      permissions: JSON.stringify([
        'access.dashboard',
        'access.reports',
        'access.assets',
        'access.suppliers'
      ]),
      additionalOrganizations: JSON.stringify([]),
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    })
    
    const hashedPassword2 = await bcrypt.hash('user2', 10)
    await redis.hSet('user:user2', 'password', hashedPassword2)
    console.log('✅ user2 updated')
    
    // Update jon
    console.log('Updating jon...')
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
    
    const hashedPasswordJon = await bcrypt.hash('jon123', 10)
    await redis.hSet('user:jon', 'password', hashedPasswordJon)
    console.log('✅ jon updated')
    
    // Add users to users set
    await redis.sAdd('users', 'user1', 'user2', 'user3', 'jon')
    console.log('✅ Users added to users set')
    
    console.log('🎉 All users updated successfully!')
    
  } catch (error) {
    console.error('Error updating users:', error)
  } finally {
    await redis.quit()
  }
}

updateRedisUsers()