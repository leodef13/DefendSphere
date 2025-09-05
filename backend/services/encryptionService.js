import crypto from 'crypto'

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm'
    this.key = this.getEncryptionKey()
  }

  getEncryptionKey() {
    const key = process.env.ENCRYPTION_KEY || 'defendsphere-default-key-32-chars'
    
    // Ensure key is exactly 32 bytes for AES-256
    if (key.length < 32) {
      return crypto.scryptSync(key, 'salt', 32)
    }
    
    return Buffer.from(key.slice(0, 32), 'utf8')
  }

  encrypt(text) {
    try {
      const iv = crypto.randomBytes(16)
      const cipher = crypto.createCipher(this.algorithm, this.key)
      cipher.setAAD(Buffer.from('defendsphere', 'utf8'))
      
      let encrypted = cipher.update(text, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const authTag = cipher.getAuthTag()
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      }
    } catch (error) {
      console.error('Encryption error:', error)
      throw new Error('Failed to encrypt data')
    }
  }

  decrypt(encryptedData) {
    try {
      const { encrypted, iv, authTag } = encryptedData
      
      const decipher = crypto.createDecipher(this.algorithm, this.key)
      decipher.setAAD(Buffer.from('defendsphere', 'utf8'))
      decipher.setAuthTag(Buffer.from(authTag, 'hex'))
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      console.error('Decryption error:', error)
      throw new Error('Failed to decrypt data')
    }
  }

  encryptSensitiveData(data) {
    if (typeof data === 'string') {
      return this.encrypt(data)
    }
    
    if (typeof data === 'object') {
      const encrypted = {}
      for (const [key, value] of Object.entries(data)) {
        if (this.isSensitiveField(key)) {
          encrypted[key] = this.encrypt(value)
        } else {
          encrypted[key] = value
        }
      }
      return encrypted
    }
    
    return data
  }

  decryptSensitiveData(data) {
    if (typeof data === 'object' && data.encrypted && data.iv && data.authTag) {
      return this.decrypt(data)
    }
    
    if (typeof data === 'object') {
      const decrypted = {}
      for (const [key, value] of Object.entries(data)) {
        if (this.isSensitiveField(key) && typeof value === 'object' && value.encrypted) {
          decrypted[key] = this.decrypt(value)
        } else {
          decrypted[key] = value
        }
      }
      return decrypted
    }
    
    return data
  }

  isSensitiveField(fieldName) {
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'credential']
    return sensitiveFields.some(field => 
      fieldName.toLowerCase().includes(field)
    )
  }
}

export default new EncryptionService()