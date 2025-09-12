import express from 'express'
import jwt from 'jsonwebtoken'
import { createClient } from 'redis'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6380' })
redis.on('error', (e) => console.error('Redis error:', e))
await redis.connect()

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const REFRESH_TTL = 7 * 24 * 60 * 60 // 7 days

router.post('/token/refresh', authenticateToken, async (req, res) => {
  try {
    const { token } = req.body || {}
    if (!token) return res.status(400).json({ message: 'Refresh token required' })
    const blacklisted = await redis.sIsMember('jwt:blacklist', token)
    if (blacklisted) return res.status(401).json({ message: 'Token revoked' })

    const decoded = jwt.verify(token, JWT_SECRET)
    const newAccess = jwt.sign({ userId: decoded.userId, username: decoded.username }, JWT_SECRET, { expiresIn: '15m' })
    const newRefresh = jwt.sign({ userId: decoded.userId, username: decoded.username }, JWT_SECRET, { expiresIn: '7d' })
    res.json({ accessToken: newAccess, refreshToken: newRefresh })
  } catch (e) {
    console.error('Refresh error:', e)
    res.status(401).json({ message: 'Invalid refresh token' })
  }
})

router.post('/token/revoke', authenticateToken, async (req, res) => {
  try {
    const { token } = req.body || {}
    if (!token) return res.status(400).json({ message: 'Token required' })
    await redis.sAdd('jwt:blacklist', token)
    await redis.expire('jwt:blacklist', REFRESH_TTL)
    res.json({ ok: true })
  } catch (e) {
    console.error('Revoke error:', e)
    res.status(500).json({ message: 'Internal server error' })
  }
})

export default router
