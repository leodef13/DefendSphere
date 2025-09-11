import express from 'express'
import { createClient } from 'redis'
import prisma from '../lib/prisma.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6380' })
redis.on('error', (e) => console.error('Redis error assets-db:', e))
await redis.connect()

router.get('/', authenticateToken, async (req, res) => {
  try {
    const orgs = req.user.organizations || []
    const cacheKey = `assets:orgs:${orgs.sort().join(',')}`
    const cached = await redis.get(cacheKey)
    if (cached) return res.json({ data: JSON.parse(cached) })

    const organizations = await prisma.organization.findMany({
      where: { name: { in: orgs } },
      select: { id: true }
    })
    const orgIds = organizations.map(o => o.id)
    const assets = await prisma.asset.findMany({ where: { organizationId: { in: orgIds } } })

    await redis.set(cacheKey, JSON.stringify(assets), { EX: 60 })
    return res.json({ data: assets })
  } catch (e) {
    console.error('assets-db error:', e)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

export default router