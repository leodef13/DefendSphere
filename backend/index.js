import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { createClient } from 'redis'

const app = express()
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:2525' }))
app.use(express.json())
app.use(morgan('dev'))

const PORT = process.env.PORT || 5000
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

const redis = createClient({ url: REDIS_URL })
redis.on('error', (e) => console.error('Redis error:', e))
await redis.connect()

app.get('/api/health', async (_req, res) => {
  const pong = await redis.ping().catch(() => 'ERR')
  res.json({ ok: true, redis: pong })
})

app.listen(PORT, () => {
  console.log(`API on http://0.0.0.0:${PORT}`)
})
