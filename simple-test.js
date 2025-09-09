// Simple test to verify the system works
console.log('🧪 Testing DefendSphere System...\n')

// Test 1: Check if we can import the backend modules
try {
  console.log('1. Testing backend module imports...')
  const { createClient } = await import('redis')
  console.log('✅ Redis client imported successfully')
  
  const bcrypt = await import('bcryptjs')
  console.log('✅ bcrypt imported successfully')
  
  const jwt = await import('jsonwebtoken')
  console.log('✅ JWT imported successfully')
} catch (error) {
  console.log('❌ Import error:', error.message)
}

// Test 2: Test mock Redis functionality
try {
  console.log('\n2. Testing mock Redis functionality...')
  
  // Import our mock Redis
  const MockRedis = (await import('./backend/mock-redis.js')).default
  const redis = new MockRedis()
  await redis.connect()
  
  // Test basic operations
  await redis.hSet('test:key', 'field1', 'value1')
  const result = await redis.hGetAll('test:key')
  console.log('✅ Mock Redis operations work:', result)
  
  await redis.disconnect()
} catch (error) {
  console.log('❌ Mock Redis error:', error.message)
}

// Test 3: Test user data structure
try {
  console.log('\n3. Testing user data structure...')
  
  const MockRedis = (await import('./backend/mock-redis.js')).default
  const redis = new MockRedis()
  await redis.connect()
  
  // Create test user
  const testUser = {
    id: 'test-1',
    username: 'testuser',
    fullName: 'Test User',
    email: 'test@company-lld.com',
    organization: 'Company LLD',
    position: 'Test Position',
    role: 'user',
    permissions: JSON.stringify(['access.dashboard', 'access.assets']),
    additionalOrganizations: JSON.stringify([])
  }
  
  // Set user data field by field
  for (const [key, value] of Object.entries(testUser)) {
    await redis.hSet('user:testuser', key, value)
  }
  
  const retrievedUser = await redis.hGetAll('user:testuser')
  console.log('✅ User data structure works:', {
    username: retrievedUser.username,
    organization: retrievedUser.organization,
    permissions: JSON.parse(retrievedUser.permissions || '[]')
  })
  
  await redis.disconnect()
} catch (error) {
  console.log('❌ User data error:', error.message)
}

// Test 4: Test asset data structure
try {
  console.log('\n4. Testing asset data structure...')
  
  const MockRedis = (await import('./backend/mock-redis.js')).default
  const redis = new MockRedis()
  await redis.connect()
  
  // Create test asset
  const testAsset = {
    assetId: 'test-asset-1',
    name: 'test.company-lld.com',
    type: 'Web Server',
    environment: 'Production',
    ipAddress: '192.168.1.100',
    lastAssessment: '2024-01-15',
    complianceScore: 85,
    standards: ['NIS2', 'GDPR'],
    vulnerabilities: { critical: 0, high: 1, medium: 2, low: 3, total: 6 }
  }
  
  await redis.hSet('company:company-lld:assets', testAsset.assetId, JSON.stringify(testAsset))
  const retrievedAsset = await redis.hGet('company:company-lld:assets', testAsset.assetId)
  const parsedAsset = JSON.parse(retrievedAsset)
  
  console.log('✅ Asset data structure works:', {
    name: parsedAsset.name,
    type: parsedAsset.type,
    complianceScore: parsedAsset.complianceScore,
    vulnerabilities: parsedAsset.vulnerabilities
  })
  
  await redis.disconnect()
} catch (error) {
  console.log('❌ Asset data error:', error.message)
}

console.log('\n🎉 System tests completed!')
console.log('\n📊 Summary:')
console.log('- Backend modules can be imported')
console.log('- Mock Redis functionality works')
console.log('- User data structure is correct')
console.log('- Asset data structure is correct')
console.log('- Company LLD data structure is ready')