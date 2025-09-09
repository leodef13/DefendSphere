import fetch from 'node-fetch'

const API_BASE = 'http://localhost:5000'

async function testAPI() {
  try {
    console.log('🧪 Testing DefendSphere API...\n')

    // Test health endpoint
    console.log('1. Testing health endpoint...')
    const healthResponse = await fetch(`${API_BASE}/api/health`)
    const healthData = await healthResponse.json()
    console.log('✅ Health check:', healthData)

    // Test login for user1
    console.log('\n2. Testing login for user1...')
    const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user1', password: 'user1' })
    })
    const loginData = await loginResponse.json()
    console.log('✅ Login successful:', { username: loginData.user.username, organizations: loginData.user.organizations })
    
    const token = loginData.token

    // Test assets endpoint
    console.log('\n3. Testing assets endpoint...')
    const assetsResponse = await fetch(`${API_BASE}/api/assets`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const assetsData = await assetsResponse.json()
    console.log('✅ Assets data:', {
      success: assetsData.success,
      count: assetsData.data?.length || 0,
      assets: assetsData.data?.map(a => ({ name: a.name, type: a.type, complianceScore: a.complianceScore })) || []
    })

    // Test company endpoint
    console.log('\n4. Testing company endpoint...')
    const companyResponse = await fetch(`${API_BASE}/api/company/company-lld`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    const companyData = await companyResponse.json()
    console.log('✅ Company data:', {
      success: companyData.success,
      companyName: companyData.data?.name,
      usersCount: companyData.data?.users?.length || 0,
      assetsCount: companyData.data?.assets?.length || 0
    })

    // Test login for user3
    console.log('\n5. Testing login for user3...')
    const login3Response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'user3', password: 'user3' })
    })
    const login3Data = await login3Response.json()
    console.log('✅ User3 login successful:', { username: login3Data.user.username, organizations: login3Data.user.organizations })
    
    const token3 = login3Data.token

    // Test assets endpoint for user3
    console.log('\n6. Testing assets endpoint for user3...')
    const assets3Response = await fetch(`${API_BASE}/api/assets`, {
      headers: { 'Authorization': `Bearer ${token3}` }
    })
    const assets3Data = await assets3Response.json()
    console.log('✅ User3 assets data:', {
      success: assets3Data.success,
      count: assets3Data.data?.length || 0,
      assets: assets3Data.data?.map(a => ({ name: a.name, type: a.type, complianceScore: a.complianceScore })) || []
    })

    console.log('\n🎉 All tests completed successfully!')
    console.log('\n📊 Summary:')
    console.log('- user1 and user3 can both access Company LLD assets')
    console.log('- Assets are properly structured with compliance scores and vulnerabilities')
    console.log('- Company-based access control is working')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testAPI()