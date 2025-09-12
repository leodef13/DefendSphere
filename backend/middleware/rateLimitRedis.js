import { createClient } from 'redis'

const WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000)
const MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX || 100)
const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6380'

const redis = createClient({ url: REDIS_URL })
redis.on('error', (e) => console.error('Redis rate-limit error:', e))
await redis.connect()

export function rateLimitRedis() {
  return async (req, res, next) => {
    try {
      // Never rate-limit CORS preflight
      if (req.method === 'OPTIONS') return next()

      const ip = (req.ip || req.connection?.remoteAddress || 'unknown').replace('::ffff:', '')
      const windowStart = Math.floor(Date.now() / WINDOW_MS) * WINDOW_MS
      const key = `ratelimit:${ip}:${windowStart}`

      const current = await redis.incr(key)
      if (current === 1) {
        const ttl = Math.ceil((windowStart + WINDOW_MS - Date.now()) / 1000)
        await redis.expire(key, ttl)
      }

      res.setHeader('X-RateLimit-Limit', String(MAX_REQUESTS))
      res.setHeader('X-RateLimit-Remaining', String(Math.max(0, MAX_REQUESTS - current)))

      if (current > MAX_REQUESTS) {
        return res.status(429).json({ message: 'Too many requests' })
      }
      next()
    } catch (e) {
      // Fail-open on rate limiter to not block traffic
      console.error('Rate limit middleware error:', e)
      next()
    }
  }
}

