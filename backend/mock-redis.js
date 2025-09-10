// Mock Redis client for development without Redis server
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

  async hGet(key, field) {
    const keyData = this.data.get(key)
    if (!keyData) return null
    return keyData.get(field) || null
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

  async lTrim(key, start, stop) {
    const list = this.data.get(key)
    if (!list) return 'OK'
    this.data.set(key, list.slice(start, stop + 1))
    return 'OK'
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
    // Mock event handling
    if (event === 'error') {
      this.errorCallback = callback
    }
  }

  // Initialize with default users
  async initializeDefaultUsers() {
    // Create default admin user
    await this.hSet('user:1', 'id', '1')
    await this.hSet('user:1', 'username', 'admin')
    await this.hSet('user:1', 'email', 'admin@defendsphere.com')
    await this.hSet('user:1', 'role', 'admin')
    await this.hSet('user:1', 'permissions', JSON.stringify(['all']))
    
    // Hash password for admin
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.default.hash('admin', 10)
    await this.hSet('user:1', 'password', hashedPassword)

    // Create default user1
    await this.hSet('user:2', 'id', '2')
    await this.hSet('user:2', 'username', 'user1')
    await this.hSet('user:2', 'fullName', 'John Smith')
    await this.hSet('user:2', 'email', 'user1@company-lld.com')
    await this.hSet('user:2', 'organization', 'Company LLD')
    await this.hSet('user:2', 'organizations', JSON.stringify(['Company LLD']))
    await this.hSet('user:2', 'position', 'CEO')
    await this.hSet('user:2', 'role', 'admin')
    await this.hSet('user:2', 'phone', '+1-555-0101')
    await this.hSet('user:2', 'permissions', JSON.stringify([
      'access.dashboard',
      'access.assets',
      'access.compliance',
      'access.customerTrust',
      'access.suppliers',
      'access.reports',
      'access.integrations',
      'access.admin'
    ]))
    await this.hSet('user:2', 'additionalOrganizations', JSON.stringify([]))
    await this.hSet('user:2', 'createdAt', new Date().toISOString())
    await this.hSet('user:2', 'lastLogin', new Date().toISOString())
    
    const hashedPassword1 = await bcrypt.default.hash('user1', 10)
    await this.hSet('user:2', 'password', hashedPassword1)

    // Create default user2
    await this.hSet('user:3', 'id', '3')
    await this.hSet('user:3', 'username', 'user2')
    await this.hSet('user:3', 'fullName', 'Alice Johnson')
    await this.hSet('user:3', 'email', 'user2@watson-morris.com')
    await this.hSet('user:3', 'organization', 'Watson Morris')
    await this.hSet('user:3', 'organizations', JSON.stringify(['Watson Morris']))
    await this.hSet('user:3', 'position', 'Security Analyst')
    await this.hSet('user:3', 'role', 'user')
    await this.hSet('user:3', 'phone', '+1-555-0102')
    await this.hSet('user:3', 'permissions', JSON.stringify([
      'access.dashboard',
      'access.assets',
      'access.reports'
    ]))
    await this.hSet('user:3', 'additionalOrganizations', JSON.stringify([]))
    await this.hSet('user:3', 'createdAt', new Date().toISOString())
    await this.hSet('user:3', 'lastLogin', new Date().toISOString())
    
    const hashedPassword2 = await bcrypt.default.hash('user2', 10)
    await this.hSet('user:3', 'password', hashedPassword2)

    // Create user3
    await this.hSet('user:4', 'id', '4')
    await this.hSet('user:4', 'username', 'user3')
    await this.hSet('user:4', 'fullName', 'Jane Doe')
    await this.hSet('user:4', 'email', 'user3@company-lld.com')
    await this.hSet('user:4', 'organization', 'Company LLD')
    await this.hSet('user:4', 'organizations', JSON.stringify(['Company LLD']))
    await this.hSet('user:4', 'position', 'CISO')
    await this.hSet('user:4', 'role', 'user')
    await this.hSet('user:4', 'phone', '+1-555-0103')
    await this.hSet('user:4', 'permissions', JSON.stringify([
      'access.dashboard',
      'access.assets',
      'access.compliance',
      'access.customerTrust',
      'access.suppliers',
      'access.reports',
      'access.integrations'
    ]))
    await this.hSet('user:4', 'additionalOrganizations', JSON.stringify([]))
    await this.hSet('user:4', 'createdAt', new Date().toISOString())
    await this.hSet('user:4', 'lastLogin', new Date().toISOString())
    
    const hashedPassword3 = await bcrypt.default.hash('user3', 10)
    await this.hSet('user:4', 'password', hashedPassword3)

    // Create jon
    await this.hSet('user:5', 'id', '5')
    await this.hSet('user:5', 'username', 'jon')
    await this.hSet('user:5', 'fullName', 'Jon Smith')
    await this.hSet('user:5', 'email', 'jon@watson-morris.com')
    await this.hSet('user:5', 'organization', 'Watson Morris')
    await this.hSet('user:5', 'organizations', JSON.stringify(['Watson Morris']))
    await this.hSet('user:5', 'position', 'Security Manager')
    await this.hSet('user:5', 'role', 'user')
    await this.hSet('user:5', 'phone', '+1-555-0104')
    await this.hSet('user:5', 'permissions', JSON.stringify([
      'access.dashboard',
      'access.assets',
      'access.reports',
      'access.compliance',
      'access.customerTrust',
      'access.suppliers'
    ]))
    await this.hSet('user:5', 'additionalOrganizations', JSON.stringify([]))
    await this.hSet('user:5', 'createdAt', new Date().toISOString())
    await this.hSet('user:5', 'lastLogin', new Date().toISOString())
    
    const hashedPasswordJon = await bcrypt.default.hash('jon123', 10)
    await this.hSet('user:5', 'password', hashedPasswordJon)

    console.log('Default users initialized')
  }
}

export default MockRedis