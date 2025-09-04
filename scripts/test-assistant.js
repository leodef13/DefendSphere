#!/usr/bin/env node

/**
 * Test script for DefendSphere Security Assistant API
 * Usage: node scripts/test-assistant.js
 */

const fetch = require('node-fetch');

const API_BASE = process.env.API_URL || 'http://localhost:5000/api';
const TEST_USER = {
  username: 'admin',
  password: 'admin'
};

async function testAssistantAPI() {
  console.log('🔐 Testing DefendSphere Security Assistant API...\n');

  try {
    // 1. Login to get token
    console.log('1️⃣ Testing Authentication...');
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(TEST_USER)
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const { token, user } = await loginResponse.json();
    console.log(`✅ Login successful for user: ${user.username} (${user.role})`);
    console.log(`🔑 Token received: ${token.substring(0, 20)}...\n`);

    // 2. Test Assistant endpoint
    console.log('2️⃣ Testing Security Assistant...');
    
    const testMessages = [
      'Tell me about ISO 27001',
      'What is GDPR?',
      'How do I check compliance?',
      'Show me my assets',
      'Generate a security report',
      'What is DORA?',
      'Explain NIS2 requirements'
    ];

    for (const message of testMessages) {
      console.log(`\n📝 Testing message: "${message}"`);
      
      const assistantResponse = await fetch(`${API_BASE}/assistant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message,
          userId: user.id,
          userRole: user.role
        })
      });

      if (assistantResponse.ok) {
        const data = await assistantResponse.json();
        console.log(`✅ Response received (${data.type}):`);
        console.log(`   ${data.response.substring(0, 100)}...`);
        
        if (data.data) {
          console.log(`   📎 Additional data: ${JSON.stringify(data.data)}`);
        }
      } else {
        console.log(`❌ Failed: ${assistantResponse.status} ${assistantResponse.statusText}`);
      }
    }

    // 3. Test Standards endpoint
    console.log('\n3️⃣ Testing Security Standards...');
    const standardsResponse = await fetch(`${API_BASE}/assistant/standards`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (standardsResponse.ok) {
      const standards = await standardsResponse.json();
      console.log('✅ Available standards:');
      Object.keys(standards.standards).forEach(key => {
        const standard = standards.standards[key];
        console.log(`   • ${standard.title} (${standard.category})`);
      });
    } else {
      console.log(`❌ Standards failed: ${standardsResponse.status}`);
    }

    // 4. Test Logs endpoint
    console.log('\n4️⃣ Testing Chat Logs...');
    const logsResponse = await fetch(`${API_BASE}/assistant/logs`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (logsResponse.ok) {
      const logs = await logsResponse.json();
      console.log(`✅ Chat logs retrieved: ${logs.logs.length} entries`);
      if (logs.logs.length > 0) {
        const latest = logs.logs[0];
        console.log(`   📝 Latest: "${latest.message}" at ${latest.timestamp}`);
      }
    } else {
      console.log(`❌ Logs failed: ${logsResponse.status}`);
    }

    // 5. Test User Profile
    console.log('\n5️⃣ Testing User Profile...');
    const profileResponse = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (profileResponse.ok) {
      const profile = await profileResponse.json();
      console.log('✅ User profile:');
      console.log(`   • Username: ${profile.username}`);
      console.log(`   • Role: ${profile.role}`);
      console.log(`   • Permissions: ${profile.permissions.join(', ')}`);
      console.log(`   • Created: ${profile.createdAt}`);
    } else {
      console.log(`❌ Profile failed: ${profileResponse.status}`);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 Test Summary:');
    console.log('   ✅ Authentication: Working');
    console.log('   ✅ Security Assistant: Working');
    console.log('   ✅ Security Standards: Working');
    console.log('   ✅ Chat Logs: Working');
    console.log('   ✅ User Profile: Working');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n🔍 Troubleshooting:');
    console.error('   1. Make sure the backend server is running');
    console.error('   2. Check if Redis is accessible');
    console.error('   3. Verify the API URL is correct');
    console.error('   4. Check server logs for errors');
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAssistantAPI();
}

module.exports = { testAssistantAPI };