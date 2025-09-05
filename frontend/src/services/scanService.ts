import { API_ENDPOINTS } from '../config/api'

export interface Asset {
  id: string
  name: string
  domain?: string
  ip?: string
  type: string
  environment: string
}

export interface ScanStatus {
  scanId: string
  userId: string
  taskId: string
  targetId: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  startTime: string
  lastUpdate?: string
  progress: number
  assets: Asset[]
}

export interface Vulnerability {
  name: string
  cve: string
  severity: string
  host: string
  description: string
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low'
  cvss: string
  status: string
  recommendations: string
}

export interface ScanReport {
  id: string
  name: string
  timestamp: string
  vulnerabilities: Vulnerability[]
  assetVulnerabilities: Record<string, Vulnerability[]>
  summary: {
    totalVulnerabilities: number
    critical: number
    high: number
    medium: number
    low: number
  }
}

export interface ScanResult {
  success: boolean
  scanId?: string
  message?: string
  error?: string
}

export interface ScanStatusResult {
  success: boolean
  scan?: ScanStatus
  error?: string
}

export interface ScanReportResult {
  success: boolean
  reports?: ScanReport[]
  message?: string
  error?: string
}

class ScanService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  async startScan(assets: Asset[]): Promise<ScanResult> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_START, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ assets })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start scan')
      }

      return data
    } catch (error) {
      console.error('Start scan error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getScanStatus(scanId: string): Promise<ScanStatusResult> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_STATUS(scanId), {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get scan status')
      }

      return data
    } catch (error) {
      console.error('Get scan status error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getScanReport(scanId: string): Promise<ScanReportResult> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_REPORT(scanId), {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get scan report')
      }

      return data
    } catch (error) {
      console.error('Get scan report error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async updateUserAssets(scanId: string): Promise<ScanResult> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_UPDATE_ASSETS(scanId), {
        method: 'POST',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user assets')
      }

      return data
    } catch (error) {
      console.error('Update user assets error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async testConnection(): Promise<ScanResult> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_TEST_CONNECTION, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to test connection')
      }

      return data
    } catch (error) {
      console.error('Test connection error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async getUserAssets(): Promise<{ success: boolean; assets?: Asset[]; error?: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_USER_ASSETS, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get user assets')
      }

      return data
    } catch (error) {
      console.error('Get user assets error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Utility method to check if user has assets for scanning
  async hasAssetsForScanning(): Promise<boolean> {
    try {
      const result = await this.getUserAssets()
      return result.success && (result.assets?.length || 0) > 0
    } catch (error) {
      console.error('Check assets error:', error)
      return false
    }
  }

  // Utility method to get scan status with polling
  async pollScanStatus(scanId: string, onUpdate: (status: ScanStatus) => void, maxAttempts = 60): Promise<ScanStatus> {
    let attempts = 0
    
    const poll = async (): Promise<ScanStatus> => {
      attempts++
      
      const result = await this.getScanStatus(scanId)
      
      if (!result.success || !result.scan) {
        throw new Error(result.error || 'Failed to get scan status')
      }

      onUpdate(result.scan)

      // Stop polling if scan is completed or failed
      if (result.scan.status === 'completed' || result.scan.status === 'failed') {
        return result.scan
      }

      // Stop polling if max attempts reached
      if (attempts >= maxAttempts) {
        throw new Error('Scan status polling timeout')
      }

      // Wait 5 seconds before next poll
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      return poll()
    }

    return poll()
  }
}

export default new ScanService()