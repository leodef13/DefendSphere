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

    // Create admin user
    await this.hSet('user:admin', 'id', '1')
    await this.hSet('user:admin', 'username', 'admin')
    await this.hSet('user:admin', 'fullName', 'System Administrator')
    await this.hSet('user:admin', 'email', 'admin@defendsphere.com')
    await this.hSet('user:admin', 'organization', 'System')
    await this.hSet('user:admin', 'organizations', JSON.stringify(['System']))
    await this.hSet('user:admin', 'position', 'System Administrator')
    await this.hSet('user:admin', 'role', 'admin')
    await this.hSet('user:admin', 'phone', '+1-555-0000')
    await this.hSet('user:admin', 'permissions', JSON.stringify([
      'access.dashboard',
      'access.assets',
      'access.compliance',
      'access.customerTrust',
      'access.suppliers',
      'access.reports',
      'access.integrations',
      'access.admin'
    ]))
    await this.hSet('user:admin', 'additionalOrganizations', JSON.stringify([]))
    await this.hSet('user:admin', 'createdAt', new Date().toISOString())
    await this.hSet('user:admin', 'lastLogin', new Date().toISOString())
    
    const hashedPasswordAdmin = await bcrypt.default.hash('admin', 10)
    await this.hSet('user:admin', 'password', hashedPasswordAdmin)

    // Create jon
    await this.hSet('user:jon', 'id', '5')
    await this.hSet('user:jon', 'username', 'jon')
    await this.hSet('user:jon', 'fullName', 'Jon Smith')
    await this.hSet('user:jon', 'email', 'jon@watson-morris.com')
    await this.hSet('user:jon', 'organization', 'Watson Morris')
    await this.hSet('user:jon', 'organizations', JSON.stringify(['Watson Morris']))
    await this.hSet('user:jon', 'position', 'Security Manager')
    await this.hSet('user:jon', 'role', 'user')
    await this.hSet('user:jon', 'phone', '+1-555-0104')
    await this.hSet('user:jon', 'permissions', JSON.stringify([
      'access.dashboard',
      'access.assets',
      'access.reports',
      'access.compliance',
      'access.customerTrust',
      'access.suppliers'
    ]))
    await this.hSet('user:jon', 'additionalOrganizations', JSON.stringify([]))
    await this.hSet('user:jon', 'createdAt', new Date().toISOString())
    await this.hSet('user:jon', 'lastLogin', new Date().toISOString())
    
    const hashedPasswordJon = await bcrypt.default.hash('jon123', 10)
    await this.hSet('user:jon', 'password', hashedPasswordJon)

    console.log('Default users initialized')
  }
}

export default MockRedis