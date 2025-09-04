import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'DefendSphere Backend is running',
    timestamp: new Date().toISOString()
  })
})

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Test endpoint working',
    redis_port: process.env.REDIS_URL || 'redis://localhost:6380'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 DefendSphere Test Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🔧 Test endpoint: http://localhost:${PORT}/api/test`)
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down test server...')
  process.exit(0)
})