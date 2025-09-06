import express from 'express'
import { createClient } from 'redis'
import { authenticateToken, requireAdmin } from '../middleware/auth.js'
import { encryptSecret, decryptSecret } from '../lib/crypto.js'

const router = express.Router()

// Redis client local to this router (mirrors other routes)
const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6380'
})
client.on('error', (err) => console.log('Redis Client Error', err))
// Ensure Redis connection for this router
await client.connect().catch(err => {
  console.error('AI Assistant Redis connect error:', err)
})

const PROVIDER_KEYS = {
  openai: 'integration:ai:openai',
  claude: 'integration:ai:claude',
  gemini: 'integration:ai:gemini',
  azure: 'integration:ai:azure',
  mistral: 'integration:ai:mistral',
  groq: 'integration:ai:groq',
  vertex: 'integration:ai:vertex',
  ollama: 'integration:ai:ollama'
}

const ACTIVE_KEY = 'integration:ai:active'
const LOG_LIST = 'integration:ai:logs'

async function logAction(action, userId, details = {}) {
  try {
    await client.lPush(LOG_LIST, JSON.stringify({
      timestamp: new Date().toISOString(),
      action,
      userId,
      details
    }))
    await client.lTrim(LOG_LIST, 0, 499)
  } catch {}
}

function normalizeProvider(p) {
  const key = String(p || '').toLowerCase()
  if (key in PROVIDER_KEYS) return key
  throw new Error('Unsupported provider')
}

function redactConfigForResponse(config) {
  if (!config) return {}
  const result = { ...config }
  // redact any field that looks like a secret
  const secretFields = ['apiKey', 'token', 'secret', 'endpointKey']
  for (const f of secretFields) {
    if (result[f]) {
      try {
        const plain = decryptSecret(result[f])
        // show masked preview only
        result[f] = plain ? `***${plain.slice(-4)}` : ''
      } catch {
        result[f] = '***'
      }
    }
  }
  return result
}

// GET /api/ai-assistant (status) — available to any authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const active = await client.get(ACTIVE_KEY)
    if (!active) {
      return res.json({ active: false })
    }
    const provider = active
    return res.json({ active: true, provider })
  } catch (error) {
    console.error('AI assistant status error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/ai-assistant/:provider/config
router.get('/:provider/config', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const provider = normalizeProvider(req.params.provider)
    const key = PROVIDER_KEYS[provider]
    const config = await client.hGetAll(key)
    if (!config || Object.keys(config).length === 0) {
      return res.json({ configured: false, provider })
    }
    return res.json({ configured: true, provider, config: redactConfigForResponse(config) })
  } catch (error) {
    if (error.message === 'Unsupported provider') {
      return res.status(400).json({ error: 'Unsupported provider' })
    }
    console.error('Get provider config error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/ai-assistant/:provider/config
router.post('/:provider/config', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const provider = normalizeProvider(req.params.provider)
    const key = PROVIDER_KEYS[provider]
    const body = req.body || {}

    // Encrypt secrets if present
    const toSave = { ...body }
    for (const field of Object.keys(toSave)) {
      if (/(apiKey|token|secret|endpointKey)/i.test(field)) {
        toSave[field] = encryptSecret(String(toSave[field] || ''))
      } else {
        toSave[field] = String(toSave[field])
      }
    }

    if (Object.keys(toSave).length > 0) {
      await client.hSet(key, toSave)
    }
    await logAction('save_config', req.user.id, { provider })
    const saved = await client.hGetAll(key)
    return res.json({ ok: true, provider, config: redactConfigForResponse(saved) })
  } catch (error) {
    if (error.message === 'Unsupported provider') {
      return res.status(400).json({ error: 'Unsupported provider' })
    }
    console.error('Save provider config error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/ai-assistant/:provider/enable
router.post('/:provider/enable', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const provider = normalizeProvider(req.params.provider)
    await client.set(ACTIVE_KEY, provider)
    await logAction('enable_provider', req.user.id, { provider })
    res.json({ ok: true, active: true, provider })
  } catch (error) {
    if (error.message === 'Unsupported provider') {
      return res.status(400).json({ error: 'Unsupported provider' })
    }
    console.error('Enable provider error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/ai-assistant/:provider/disable
router.post('/:provider/disable', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const provider = normalizeProvider(req.params.provider)
    const current = await client.get(ACTIVE_KEY)
    if (current === provider) {
      await client.del(ACTIVE_KEY)
    }
    await logAction('disable_provider', req.user.id, { provider })
    res.json({ ok: true, active: false })
  } catch (error) {
    if (error.message === 'Unsupported provider') {
      return res.status(400).json({ error: 'Unsupported provider' })
    }
    console.error('Disable provider error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/ai-assistant/:provider/test
router.post('/:provider/test', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const provider = normalizeProvider(req.params.provider)
    const key = PROVIDER_KEYS[provider]
    const config = await client.hGetAll(key)
    if (!config || Object.keys(config).length === 0) {
      return res.status(400).json({ error: 'Provider not configured' })
    }

    let result
    if (provider === 'openai') {
      try {
        const apiKeyEnc = config.apiKey
        const apiKey = apiKeyEnc ? decryptSecret(apiKeyEnc) : ''
        const model = config.model || 'gpt-4o-mini'
        const endpoint = config.endpoint || 'https://api.openai.com/v1/chat/completions'

        const resp = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: req.body?.message || 'Ping' }],
            max_tokens: 64
          })
        })
        if (!resp.ok) throw new Error(`OpenAI HTTP ${resp.status}`)
        const data = await resp.json()
        const content = data?.choices?.[0]?.message?.content || 'OK'
        result = { provider, ok: true, message: content, timestamp: new Date().toISOString() }
      } catch (e) {
        result = { provider, ok: false, error: String(e.message || e) }
      }
    } else if (provider === 'gemini') {
      try {
        const apiKey = config.apiKey ? decryptSecret(config.apiKey) : ''
        const endpoint = config.endpoint || 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key='
        const url = endpoint.includes('key=') ? endpoint : `${endpoint}${apiKey}`
        const resp = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: req.body?.message || 'Ping' }]}] })
        })
        if (!resp.ok) throw new Error(`Gemini HTTP ${resp.status}`)
        const data = await resp.json()
        const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'OK'
        result = { provider, ok: true, message: content, timestamp: new Date().toISOString() }
      } catch (e) {
        result = { provider, ok: false, error: String(e.message || e) }
      }
    } else {
      result = {
        provider,
        ok: true,
        echo: req.body?.message || 'Hello from test',
        timestamp: new Date().toISOString()
      }
    }

    await logAction('test_provider', req.user.id, { provider })
    res.json(result)
  } catch (error) {
    if (error.message === 'Unsupported provider') {
      return res.status(400).json({ error: 'Unsupported provider' })
    }
    console.error('Test provider error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router

