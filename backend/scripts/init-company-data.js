import { createClient } from 'redis'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6380'

// Mock Redis client for development
class MockRedis {
  constructor() {
    this.data = new Map()
    this.connected = false
  }

  async connect() {
    this.connected = true
    console.log('Mock Redis connected')
    return this
  }

  async disconnect() {
    this.connected = false
    console.log('Mock Redis disconnected')
  }

  async hSet(key, field, value) {
    if (!this.data.has(key)) {
      this.data.set(key, new Map())
    }
    this.data.get(key).set(field, value)
    return 1
  }

  async hGetAll(key) {
    const keyData = this.data.get(key)
    if (!keyData) return {}
    
    const result = {}
    for (const [field, value] of keyData) {
      result[field] = value
    }
    return result
  }

  async hDel(key, field) {
    const keyData = this.data.get(key)
    if (!keyData) return 0
    return keyData.delete(field) ? 1 : 0
  }

  async sAdd(key, ...members) {
    if (!this.data.has(key)) {
      this.data.set(key, new Set())
    }
    const set = this.data.get(key)
    let added = 0
    for (const member of members) {
      if (!set.has(member)) {
        set.add(member)
        added++
      }
    }
    return added
  }

  async sMembers(key) {
    const set = this.data.get(key)
    return set ? Array.from(set) : []
  }

  async sRem(key, ...members) {
    const set = this.data.get(key)
    if (!set) return 0
    let removed = 0
    for (const member of members) {
      if (set.delete(member)) {
        removed++
      }
    }
    return removed
  }

  async lPush(key, ...values) {
    if (!this.data.has(key)) {
      this.data.set(key, [])
    }
    const list = this.data.get(key)
    list.unshift(...values)
    return list.length
  }

  async lRange(key, start, stop) {
    const list = this.data.get(key)
    if (!list) return []
    return list.slice(start, stop + 1)
  }

  async del(key) {
    return this.data.delete(key) ? 1 : 0
  }

  async exists(key) {
    return this.data.has(key) ? 1 : 0
  }

  async set(key, value) {
    this.data.set(key, value)
    return 'OK'
  }

  async get(key) {
    return this.data.get(key) || null
  }

  on(event, callback) {
    if (event === 'error') {
      this.errorCallback = callback
    }
  }
}

async function initializeCompanyData() {
  let redis
  
  try {
    // Try to connect to real Redis, fallback to mock
    try {
      redis = createClient({ url: REDIS_URL })
      await redis.connect()
      console.log('Connected to Redis')
    } catch (error) {
      console.log('Redis not available, using mock Redis')
      redis = new MockRedis()
      await redis.connect()
    }

    // Clear existing data (optional - remove in production)
    // await redis.flushAll()

    // Create Company LLD
    const companyId = 'company-lld'
    const companyData = {
      id: companyId,
      name: 'Company LLD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    await redis.hSet(`company:${companyId}`, 'data', JSON.stringify(companyData))
    await redis.sAdd('companies', companyId)
    console.log('✅ Company LLD created')

    // Create user1 for Company LLD
    const user1Exists = await redis.hGetAll('user:user1')
    if (!user1Exists.username) {
      const hashedPassword = await bcrypt.hash('user1', 10)
      const user1 = {
        id: '2',
        username: 'user1',
        fullName: 'John Smith',
        email: 'user1@company-lld.com',
        passwordHash: hashedPassword,
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
      await redis.hSet('user:user1', user1)
      await redis.sAdd('users', 'user1')
      console.log('✅ User1 created for Company LLD')
    } else {
      console.log('ℹ️  User1 already exists')
    }

    // Create user3 for Company LLD
    const user3Exists = await redis.hGetAll('user:user3')
    if (!user3Exists.username) {
      const hashedPassword = await bcrypt.hash('user3', 10)
      const user3 = {
        id: '4',
        username: 'user3',
        fullName: 'Jane Doe',
        email: 'user3@company-lld.com',
        passwordHash: hashedPassword,
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
      await redis.hSet('user:user3', user3)
      await redis.sAdd('users', 'user3')
      console.log('✅ User3 created for Company LLD')
    } else {
      console.log('ℹ️  User3 already exists')
    }

    // Create demo assets for Company LLD
    const assets = [
      {
        assetId: uuidv4(),
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
        assetId: uuidv4(),
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
        assetId: uuidv4(),
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
        assetId: uuidv4(),
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

    // Store assets for Company LLD
    for (const asset of assets) {
      await redis.hSet(`company:${companyId}:assets`, asset.assetId, JSON.stringify(asset))
    }
    await redis.sAdd(`company:${companyId}:assetIds`, ...assets.map(a => a.assetId))
    console.log('✅ Demo assets created for Company LLD')

    // Create Watson Morris company
    const watsonMorrisId = 'company-watson-morris'
    const watsonMorrisData = {
      id: watsonMorrisId,
      name: 'Watson Morris',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    await redis.hSet(`company:${watsonMorrisId}`, 'data', JSON.stringify(watsonMorrisData))
    await redis.sAdd('companies', watsonMorrisId)
    console.log('✅ Watson Morris company created')

    // Create demo assets for Watson Morris
    const watsonMorrisAssets = [
      {
        assetId: 'wm-asset-1',
        name: 'www.watson-morris.com',
        type: 'Web Server',
        environment: 'Production',
        ipAddress: '192.168.1.100',
        lastAssessment: '2024-01-20',
        complianceScore: 85,
        standards: ['ISO/IEC 27001', 'SOC 2'],
        vulnerabilities: { critical: 0, high: 2, medium: 3, low: 2, total: 7 }
      },
      {
        assetId: 'wm-asset-2',
        name: 'db.watson-morris.com',
        type: 'Database Server',
        environment: 'Production',
        ipAddress: '192.168.1.101',
        lastAssessment: '2024-01-20',
        complianceScore: 90,
        standards: ['ISO/IEC 27001'],
        vulnerabilities: { critical: 0, high: 1, medium: 2, low: 1, total: 4 }
      },
      {
        assetId: 'wm-asset-3',
        name: 'api.watson-morris.com',
        type: 'API Server',
        environment: 'Production',
        ipAddress: '192.168.1.102',
        lastAssessment: '2024-01-20',
        complianceScore: 88,
        standards: ['ISO/IEC 27001', 'SOC 2', 'PCI DSS'],
        vulnerabilities: { critical: 0, high: 1, medium: 4, low: 3, total: 8 }
      }
    ]

    // Store assets for Watson Morris
    for (const asset of watsonMorrisAssets) {
      await redis.hSet(`company:${watsonMorrisId}:assets`, asset.assetId, JSON.stringify(asset))
    }
    await redis.sAdd(`company:${watsonMorrisId}:assetIds`, ...watsonMorrisAssets.map(a => a.assetId))
    console.log('✅ Demo assets created for Watson Morris')

    // Create admin user
    const adminExists = await redis.hGetAll('user:admin')
    if (!adminExists.username) {
      const hashedPassword = await bcrypt.hash('admin', 10)
      const adminUser = {
        id: '1',
        username: 'admin',
        fullName: 'System Administrator',
        email: 'admin@defendsphere.com',
        passwordHash: hashedPassword,
        organization: 'DefendSphere',
        position: 'System Admin',
        role: 'admin',
        phone: '+1-555-0000',
        permissions: JSON.stringify(['all']),
        additionalOrganizations: JSON.stringify([]),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }
      await redis.hSet('user:admin', adminUser)
      await redis.sAdd('users', 'admin')
      console.log('✅ Admin user created')
    } else {
      console.log('ℹ️  Admin user already exists')
    }

    // Create user2 for different company
    const user2Exists = await redis.hGetAll('user:user2')
    if (!user2Exists.username) {
      const hashedPassword = await bcrypt.hash('user2', 10)
      const user2 = {
        id: '3',
        username: 'user2',
        fullName: 'Bob Wilson',
        email: 'user2@watson-morris.com',
        passwordHash: hashedPassword,
        organization: 'Watson Morris',
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
      }
      await redis.hSet('user:user2', user2)
      await redis.sAdd('users', 'user2')
      console.log('✅ User2 created for Watson Morris')
    } else {
      console.log('ℹ️  User2 already exists')
    }

    // Create jon for Watson Morris
    const jonExists = await redis.hGetAll('user:jon')
    if (!jonExists.username) {
      const hashedPassword = await bcrypt.hash('jon123', 10)
      const jon = {
        id: '5',
        username: 'jon',
        fullName: 'Jon Smith',
        email: 'jon@watson-morris.com',
        passwordHash: hashedPassword,
        organization: 'Watson Morris',
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
      }
      await redis.hSet('user:jon', jon)
      await redis.sAdd('users', 'jon')
      console.log('✅ Jon created for Watson Morris')
    } else {
      console.log('ℹ️  Jon already exists')
    }

    // Initialize system data
    await redis.set('system:initialized', 'true')
    await redis.set('system:version', '1.0.0')
    await redis.set('system:lastInit', new Date().toISOString())

    console.log('✅ Company data initialization completed successfully')
    console.log('📊 Created users:')
    console.log('   - admin/admin (System Administrator)')
    console.log('   - user1/user1 (CEO, Company LLD)')
    console.log('   - user2/user2 (Security Analyst, Watson Morris)')
    console.log('   - user3/user3 (CISO, Company LLD)')
    console.log('🏢 Created companies:')
    console.log('   - Company LLD (with 4 demo assets)')
    console.log('   - Watson Morris')

  } catch (error) {
    console.error('❌ Company data initialization failed:', error)
    process.exit(1)
  } finally {
    if (redis) {
      await redis.disconnect()
      console.log('Disconnected from Redis')
    }
  }
}

// Run initialization
initializeCompanyData()