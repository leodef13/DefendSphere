// Простой скрипт для инициализации данных без Redis
// Этот скрипт создаст файл с данными, которые можно использовать для тестирования

import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const usersFile = path.join(dataDir, 'users.json')
const assetsFile = path.join(dataDir, 'assets.json')

// Создаем директорию data если не существует
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Данные пользователей
const users = [
  {
    id: '2',
    username: 'user1',
    fullName: 'John Smith',
    email: 'user1@company-lld.com',
    password: 'user1', // В реальном приложении должен быть хеш
    organization: 'Company LLD',
    position: 'CEO',
    role: 'admin',
    phone: '+1-555-0101',
    permissions: [
      'access.dashboard',
      'access.assets',
      'access.compliance',
      'access.customerTrust',
      'access.suppliers',
      'access.reports',
      'access.integrations',
      'access.admin'
    ],
    additionalOrganizations: [],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '4',
    username: 'user3',
    fullName: 'Jane Doe',
    email: 'user3@company-lld.com',
    password: 'user3', // В реальном приложении должен быть хеш
    organization: 'Company LLD',
    position: 'CISO',
    role: 'user',
    phone: '+1-555-0103',
    permissions: [
      'access.dashboard',
      'access.assets',
      'access.compliance',
      'access.customerTrust',
      'access.suppliers',
      'access.reports',
      'access.integrations'
    ],
    additionalOrganizations: [],
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
]

// Данные активов
const assets = [
  {
    id: 'asset-1',
    assetId: 'asset-1',
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
    id: 'asset-2',
    assetId: 'asset-2',
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
    id: 'asset-3',
    assetId: 'asset-3',
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
    id: 'asset-4',
    assetId: 'asset-4',
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

// Сохраняем данные
fs.writeFileSync(usersFile, JSON.stringify(users, null, 2))
fs.writeFileSync(assetsFile, JSON.stringify(assets, null, 2))

console.log('✅ Данные инициализированы:')
console.log(`   Пользователи: ${usersFile}`)
console.log(`   Активы: ${assetsFile}`)
console.log(`   Пользователей: ${users.length}`)
console.log(`   Активов: ${assets.length}`)

// Выводим информацию о пользователях
console.log('\n👥 Пользователи:')
users.forEach(user => {
  console.log(`   ${user.username}: ${user.fullName} (${user.organization}) - ${user.role}`)
})

// Выводим информацию об активах
console.log('\n📊 Активы:')
assets.forEach(asset => {
  console.log(`   ${asset.name}: ${asset.type} - Compliance: ${asset.complianceScore}%`)
})