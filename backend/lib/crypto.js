import crypto from 'crypto'

// Derive a 32-byte key from env secrets
function getEncryptionKey() {
  const baseSecret = process.env.AI_SECRET_KEY || process.env.JWT_SECRET || 'your-secret-key'
  // Use SHA-256 to derive 32-byte key deterministically
  return crypto.createHash('sha256').update(baseSecret).digest()
}

export function encryptSecret(plainText) {
  if (plainText == null || plainText === '') return ''
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)
  const encrypted = Buffer.concat([cipher.update(String(plainText), 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  // Return iv:tag:ciphertext (base64)
  return [iv.toString('base64'), authTag.toString('base64'), encrypted.toString('base64')].join(':')
}

export function decryptSecret(encryptedValue) {
  if (!encryptedValue) return ''
  try {
    const [ivB64, tagB64, dataB64] = String(encryptedValue).split(':')
    const key = getEncryptionKey()
    const iv = Buffer.from(ivB64, 'base64')
    const authTag = Buffer.from(tagB64, 'base64')
    const data = Buffer.from(dataB64, 'base64')
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)
    const decrypted = Buffer.concat([decipher.update(data), decipher.final()])
    return decrypted.toString('utf8')
  } catch {
    return ''
  }
}

export function maskSecret(secret) {
  if (!secret) return ''
  const visible = 4
  return '*'.repeat(Math.max(0, secret.length - visible)) + secret.slice(-visible)
}

