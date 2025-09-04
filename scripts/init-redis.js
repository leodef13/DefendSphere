#!/usr/bin/env node

import { createClient } from 'redis'
import bcrypt from 'bcryptjs'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

async function initializeRedis() {
  console.log('🚀 Initializing Redis for DefendSphere...')
  
  const redis = createClient({ url: REDIS_URL })
  
  try {
    await redis.connect()
    console.log('✅ Connected to Redis')
    
    // Clear existing data (optional - comment out in production)
    // await redis.flushDb()
    // console.log('🗑️  Cleared existing data')
    
    // Initialize default users
    await initializeDefaultUsers(redis)
    
    // Initialize sample data
    await initializeSampleData(redis)
    
    console.log('✅ Redis initialization completed successfully!')
    console.log('\n📋 Default users created:')
    console.log('   👑 admin/admin (Super Admin)')
    console.log('   👤 user1/user1 (Security Analyst)')
    console.log('   👤 user2/user2 (Standard User)')
    console.log('\n🔑 You can now log in with these credentials')
    
  } catch (error) {
    console.error('❌ Error initializing Redis:', error)
    process.exit(1)
  } finally {
    await redis.disconnect()
  }
}

async function initializeDefaultUsers(redis) {
  console.log('👥 Creating default users...')
  
  // Admin user
  const adminPassword = await bcrypt.hash('admin', 10)
  const adminUser = {
    id: '1',
    username: 'admin',
    email: 'admin@defendsphere.com',
    password: adminPassword,
    role: 'admin',
    permissions: JSON.stringify(['all']),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: 'active'
  }
  
  await redis.hSet('user:admin', adminUser)
  await redis.sAdd('users', 'admin')
  console.log('   ✅ Admin user created')
  
  // User1 - Security Analyst
  const user1Password = await bcrypt.hash('user1', 10)
  const user1 = {
    id: '2',
    username: 'user1',
    email: 'user1@defendsphere.com',
    password: user1Password,
    role: 'user',
    permissions: JSON.stringify([
      'access.dashboard',
      'access.incidents',
      'access.alerts',
      'access.reports',
      'access.compliance'
    ]),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: 'active'
  }
  
  await redis.hSet('user:user1', user1)
  await redis.sAdd('users', 'user1')
  console.log('   ✅ User1 (Security Analyst) created')
  
  // User2 - Standard User
  const user2Password = await bcrypt.hash('user2', 10)
  const user2 = {
    id: '3',
    username: 'user2',
    email: 'user2@defendsphere.com',
    password: user2Password,
    role: 'user',
    permissions: JSON.stringify([
      'access.dashboard',
      'access.reports'
    ]),
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
    status: 'active'
  }
  
  await redis.hSet('user:user2', user2)
  await redis.sAdd('users', 'user2')
  console.log('   ✅ User2 (Standard User) created')
}

async function initializeSampleData(redis) {
  console.log('📊 Creating sample data...')
  
  // Sample incidents
  const incidents = [
    {
      id: '1',
      time: '08:30 AM',
      type: 'Malware',
      severity: 'High',
      status: 'Blocked',
      description: 'Suspicious file detected and quarantined'
    },
    {
      id: '2',
      time: '09:15 AM',
      type: 'Phishing',
      severity: 'Medium',
      status: 'Resolved',
      description: 'Phishing email reported and blocked'
    },
    {
      id: '3',
      time: '10:45 AM',
      type: 'DDoS',
      severity: 'High',
      status: 'Active',
      description: 'DDoS attack detected, mitigation in progress'
    }
  ]
  
  for (const incident of incidents) {
    await redis.hSet(`incident:${incident.id}`, incident)
  }
  await redis.sAdd('incidents', ...incidents.map(i => i.id))
  console.log('   ✅ Sample incidents created')
  
  // Sample alerts
  const alerts = [
    {
      id: '1',
      title: 'Suspicious Login Detected',
      description: 'Unusual login from a new device in Germany',
      severity: 'Medium',
      status: 'Active'
    },
    {
      id: '2',
      title: 'Malware Signature Update',
      description: 'New signatures available for immediate update',
      severity: 'Low',
      status: 'Resolved'
    },
    {
      id: '3',
      title: 'High Traffic Spike',
      description: 'Potential DDoS pattern identified in region US-East',
      severity: 'High',
      status: 'Investigating'
    }
  ]
  
  for (const alert of alerts) {
    await redis.hSet(`alert:${alert.id}`, alert)
  }
  await redis.sAdd('alerts', ...alerts.map(a => a.id))
  console.log('   ✅ Sample alerts created')
  
  // System metrics
  const metrics = {
    activeDefenses: 128,
    blockedThreats: 2314,
    systemUptime: '99.98%',
    pendingAlerts: 7,
    lastUpdated: new Date().toISOString()
  }
  
  await redis.hSet('system:metrics', metrics)
  console.log('   ✅ System metrics created')
}

// Run initialization
initializeRedis().catch(console.error)