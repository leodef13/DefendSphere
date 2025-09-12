import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const org1 = await prisma.organization.upsert({ where: { name: 'Watson Morris' }, update: {}, create: { name: 'Watson Morris' } })
  const org2 = await prisma.organization.upsert({ where: { name: 'Company LLD' }, update: {}, create: { name: 'Company LLD' } })

  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@defendsphere.com',
      passwordHash: await bcrypt.hash('admin', 10),
      role: 'admin',
      permissions: JSON.stringify(['all']),
      organizations: { connect: [{ id: org1.id }, { id: org2.id }] },
    }
  })

  await prisma.user.upsert({
    where: { username: 'jon' },
    update: {},
    create: {
      username: 'jon',
      email: 'jon@watsonmorris.com',
      passwordHash: await bcrypt.hash('jon123', 10),
      role: 'user',
      permissions: JSON.stringify(['access.dashboard','access.assets','access.reports']),
      organizations: { connect: [{ id: org1.id }] },
    }
  })

  await prisma.user.upsert({
    where: { username: 'user1' },
    update: {},
    create: {
      username: 'user1',
      email: 'user1@company-lld.com',
      passwordHash: await bcrypt.hash('user1', 10),
      role: 'admin',
      permissions: JSON.stringify(['access.dashboard','access.assets','access.compliance','access.customerTrust','access.suppliers','access.reports','access.integrations','access.admin']),
      organizations: { connect: [{ id: org2.id }] },
    }
  })

  await prisma.user.upsert({
    where: { username: 'user2' },
    update: {},
    create: {
      username: 'user2',
      email: 'user2@defendsphere.com',
      passwordHash: await bcrypt.hash('user2', 10),
      role: 'user',
      permissions: JSON.stringify(['access.dashboard','access.reports']),
      organizations: { connect: [{ id: org1.id }] },
    }
  })

  await prisma.asset.createMany({
    data: [
      { organizationId: org2.id, name: 'www.company-lld.com', type: 'Web Server', environment: 'Production', compliancePercent: 75, riskLevel: 'Medium' },
      { organizationId: org2.id, name: 'db.company-lld.com', type: 'Database', environment: 'Production', compliancePercent: 70, riskLevel: 'High' },
      { organizationId: org2.id, name: 'app.company-lld.com', type: 'Application Server', environment: 'Production', compliancePercent: 80, riskLevel: 'Medium' },
      { organizationId: org2.id, name: 'vpn.company-lld.com', type: 'VPN Gateway', environment: 'Production', compliancePercent: 75, riskLevel: 'Low' },
      { organizationId: org1.id, name: 'www.watson-morris.com', type: 'Web Server', environment: 'Production', compliancePercent: 78, riskLevel: 'Medium' },
      { organizationId: org1.id, name: 'db.watson-morris.com', type: 'Database', environment: 'Production', compliancePercent: 72, riskLevel: 'High' },
      { organizationId: org1.id, name: 'vpn.watson-morris.com', type: 'VPN Gateway', environment: 'Production', compliancePercent: 76, riskLevel: 'Low' },
    ],
    skipDuplicates: true
  })

  await prisma.complianceRecord.createMany({
    data: [
      { organizationId: org2.id, standard: 'ISO/IEC 27001', department: 'IT', status: 'Compliant', compliancePercentage: 92 },
      { organizationId: org2.id, standard: 'GDPR', department: 'Security', status: 'Partial', compliancePercentage: 75 },
      { organizationId: org1.id, standard: 'NIS2', department: 'Operations', status: 'Non-Compliant', compliancePercentage: 35 }
    ],
    skipDuplicates: true
  })

  console.log('Seed completed')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })

