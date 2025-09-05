import { API_ENDPOINTS } from '../config/api'

export interface ScanAsset {
  name: string
  url?: string
  ip?: string
}

export interface ScanStatus {
  scanId: string
  status: 'queued' | 'running' | 'completed' | 'failed'
  progress: number
  startTime: string
  endTime?: string
  assets: ScanAsset[]
}

export interface ScanReport {
  summary: {
    totalAssets: number
    totalVulnerabilities: number
    riskDistribution: {
      critical: number
      high: number
      medium: number
      low: number
    }
  }
  vulnerabilities: Array<{
    name: string
    cve: string
    risk: string
    cvss: string
    status: string
    recommendations: string
    host: string
    port: string
    description: string
  }>
  assets: Array<{
    name: string
    type: string
    environment: string
    ip: string
    url: string
    assignedStandards: string[]
    compliancePercentage: number
    riskLevel: string
    lastAssessment: string
    vulnerabilities: any[]
  }>
}

class ScanService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }

  /**
   * Check if user has assets for scanning
   */
  async checkUserAssets(): Promise<{ success: boolean; hasAssets: boolean; assets: ScanAsset[] }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_ASSETS, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error checking user assets:', error)
      return {
        success: false,
        hasAssets: false,
        assets: []
      }
    }
  }

  /**
   * Start a new scan
   */
  async startScan(): Promise<{ success: boolean; scanId?: string; message: string; assets?: ScanAsset[] }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_START, {
        method: 'POST',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error starting scan:', error)
      return {
        success: false,
        message: 'Failed to start scan'
      }
    }
  }

  /**
   * Get scan status
   */
  async getScanStatus(scanId: string): Promise<{ success: boolean; status?: ScanStatus; message?: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_STATUS(scanId), {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: data.success,
        status: data.success ? {
          scanId: data.scanId,
          status: data.status,
          progress: data.progress,
          startTime: data.startTime,
          endTime: data.endTime,
          assets: data.assets
        } : undefined,
        message: data.message
      }
    } catch (error) {
      console.error('Error getting scan status:', error)
      return {
        success: false,
        message: 'Failed to get scan status'
      }
    }
  }

  /**
   * Get scan reports
   */
  async getScanReports(scanId: string): Promise<{ success: boolean; reports?: ScanReport; message?: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_REPORT(scanId), {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return {
        success: data.success,
        reports: data.reports,
        message: data.message
      }
    } catch (error) {
      console.error('Error getting scan reports:', error)
      return {
        success: false,
        message: 'Failed to get scan reports'
      }
    }
  }

  /**
   * Test connection to Greenbone
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_CONNECT, {
        method: 'POST',
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error testing connection:', error)
      return {
        success: false,
        message: 'Failed to test connection'
      }
    }
  }

  /**
   * Poll scan status until completion
   */
  async pollScanStatus(scanId: string, onUpdate: (status: ScanStatus) => void): Promise<ScanStatus> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const result = await this.getScanStatus(scanId)
          
          if (!result.success) {
            reject(new Error(result.message || 'Failed to get scan status'))
            return
          }

          if (result.status) {
            onUpdate(result.status)
            
            if (result.status.status === 'completed' || result.status.status === 'failed') {
              resolve(result.status)
              return
            }
          }

          // Continue polling every 5 seconds
          setTimeout(poll, 5000)
        } catch (error) {
          reject(error)
        }
      }

      poll()
    })
  }
}

export default new ScanService()