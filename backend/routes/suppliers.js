import express from 'express'
import { createClient } from 'redis'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6380' })
redis.on('error', (e) => console.error('Redis error in suppliers routes:', e))
await redis.connect()

function buildSupplierId() {
  return `sup-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// Seed demo data for Company LLD if empty
async function seedIfEmpty(user) {
  try {
    const key = `suppliers:${user.id}`
    const existing = await redis.hGetAll(key)
    if (Object.keys(existing).length > 0) return
    const userRecord = await redis.hGetAll(`user:${user.username}`)
    const orgs = userRecord.organizations ? JSON.parse(userRecord.organizations) : []
    if (!orgs.includes('Company LLD')) return
    const seed = [
      { name: 'Alfa SL', categoryAccess: 'With Access', supplierType: 'Services Supplier', subGradation: 'Cloud Infrastructure Provider', standards: ['NIS2','GDPR'], compliance: 92, lastAssessment: new Date(Date.now()-14*86400000).toISOString() },
      { name: 'Gamma Systems', categoryAccess: 'With Access', supplierType: 'Hardware Supplier', subGradation: 'Hardware Infrastructure', standards: ['NIS2','DORA'], compliance: 34, lastAssessment: new Date(Date.now()-21*86400000).toISOString() },
      { name: 'Delta Analytics', categoryAccess: 'With Access', supplierType: 'Services Supplier', subGradation: 'Business Intelligence Services', standards: ['GDPR','SOCv2'], compliance: 89, lastAssessment: new Date(Date.now()-7*86400000).toISOString() },
      { name: 'Epsilon Security', categoryAccess: 'With Access', supplierType: 'Services Supplier', subGradation: 'Cybersecurity Services', standards: ['NIS2','SOCv2','DORA'], compliance: 78, lastAssessment: new Date(Date.now()-60*86400000).toISOString() },
      { name: 'Eta Cloud Services', categoryAccess: 'With Access', supplierType: 'Services Supplier', subGradation: 'Cloud Storage Provider', standards: ['NIS2','GDPR','SOCv2'], compliance: 91, lastAssessment: new Date(Date.now()-7*86400000).toISOString() },
      { name: 'Iota Financial Services', categoryAccess: 'With Access', supplierType: 'Services Supplier', subGradation: 'Payment Processing', standards: ['DORA','GDPR'], compliance: 88, lastAssessment: new Date(Date.now()-14*86400000).toISOString() }
    ]
    for (const s of seed) {
      const id = buildSupplierId()
      const rec = { id, ...s, contactName: '', email: '', website: '' }
      await redis.hSet(key, id, JSON.stringify(rec))
    }
  } catch (e) {
    console.error('Seed suppliers error:', e)
  }
}

// List suppliers for current user (scoped)
router.get('/', authenticateToken, async (req, res) => {
  try {
    await seedIfEmpty(req.user)
    const key = `suppliers:${req.user.id}`
    const all = await redis.hGetAll(key)
    const suppliers = Object.values(all).map((s) => {
      try { return JSON.parse(s) } catch { return null }
    }).filter(Boolean)
    res.json({ suppliers })
  } catch (e) {
    console.error('List suppliers error:', e)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Add supplier
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, contactName, email, website, categoryAccess, supplierType, subGradation, standards, compliance, lastAssessment } = req.body
    if (!name) return res.status(400).json({ message: 'Supplier Name is required' })
    const id = buildSupplierId()
    const record = {
      id,
      name: String(name),
      contactName: contactName ? String(contactName) : '',
      email: email ? String(email) : '',
      website: website ? String(website) : '',
      categoryAccess: categoryAccess || 'No Access',
      supplierType: supplierType || 'Services Supplier',
      subGradation: subGradation || '',
      standards: Array.isArray(standards) ? standards : [],
      compliance: Number.isFinite(compliance) ? Number(compliance) : 0,
      lastAssessment: lastAssessment ? String(lastAssessment) : new Date().toISOString()
    }
    await redis.hSet(`suppliers:${req.user.id}`, id, JSON.stringify(record))
    res.status(201).json({ supplier: record })
  } catch (e) {
    console.error('Add supplier error:', e)
    res.status(500).json({ message: 'Internal server error' })
  }
})

// Remove supplier
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    await redis.hDel(`suppliers:${req.user.id}`, id)
    res.json({ ok: true })
  } catch (e) {
    console.error('Remove supplier error:', e)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router

