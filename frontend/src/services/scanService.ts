import { API_ENDPOINTS } from '../config/api'

export interface Asset {
  name?: string
  domain?: string
  ip?: string
  type?: string
  environment?: string
}

export interface ScanData {
  scanId: string
  userId: string
  taskId: string
  targetId: string
  assets: Asset[]
  status: 'queued' | 'running' | 'completed' | 'failed'
  startTime: string
  endTime?: string
  progress: number
  reports?: VulnerabilityReport[]
  reportCount?: number
}

export interface VulnerabilityReport {
  id: string
  name: string
  severity: number
  cvss: number
  cve?: string
  description: string
  solution: string
  host: string
  port: string
  nvt: string
  timestamp: string
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low'
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
   * Start asset scan
   */
  async startScan(assets: Asset[]): Promise<{ success: boolean; data?: ScanData; message?: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_START, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ assets })
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Start scan error:', error)
      return {
        success: false,
        message: 'Failed to start scan'
      }
    }
  }

  /**
   * Get scan status
   */
  async getScanStatus(scanId: string): Promise<{ success: boolean; data?: ScanData; message?: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_STATUS(scanId), {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get scan status error:', error)
      return {
        success: false,
        message: 'Failed to get scan status'
      }
    }
  }

  /**
   * Get user's active scan
   */
  async getActiveScan(): Promise<{ success: boolean; data?: ScanData; message?: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_ACTIVE, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get active scan error:', error)
      return {
        success: false,
        message: 'Failed to get active scan'
      }
    }
  }

  /**
   * Get scan report
   */
  async getScanReport(scanId: string): Promise<{ success: boolean; data?: any; message?: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_REPORT(scanId), {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Get scan report error:', error)
      return {
        success: false,
        message: 'Failed to get scan report'
      }
    }
  }

  /**
   * Test Greenbone connection
   */
  async testConnection(): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_TEST_CONNECTION, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const result = await response.json()
      return result
    } catch (error) {
      console.error('Test connection error:', error)
      return {
        success: false,
        message: 'Failed to test connection'
      }
    }
  }

  /**
   * Get user's assets for scanning
   */
  async getUserAssets(): Promise<Asset[]> {
    try {
      const response = await fetch(API_ENDPOINTS.REPORTS_ASSETS, {
        method: 'GET',
        headers: this.getAuthHeaders()
      })

      const result = await response.json()
      if (result.success && result.data) {
        return result.data.map((asset: any) => ({
          name: asset.name,
          domain: asset.domain,
          ip: asset.ip,
          type: asset.type,
          environment: asset.environment
        }))
      }
      return []
    } catch (error) {
      console.error('Get user assets error:', error)
      return []
    }
  }
}

export default new ScanService()