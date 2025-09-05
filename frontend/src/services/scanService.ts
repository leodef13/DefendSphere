import { API_ENDPOINTS } from '../config/api'

export interface ScanAsset {
  id: string
  name: string
  url?: string
  ip?: string
  type: string
}

export interface ScanStatus {
  scanId: string
  status: 'running' | 'completed' | 'failed' | 'queued'
  progress: number
  startTime: string
  endTime?: string
  assets: ScanAsset[]
}

export interface ScanReport {
  id: string
  name: string
  timestamp: string
  summary: {
    totalAssets: number
    totalVulnerabilities: number
    riskDistribution: {
      Critical: number
      High: number
      Medium: number
      Low: number
    }
  }
  vulnerabilities: Array<{
    name: string
    cve: string
    risk: 'Critical' | 'High' | 'Medium' | 'Low'
    cvss: string
    status: string
    description: string
    recommendation: string
  }>
  assets: Array<{
    name: string
    ip: string
    type: string
    environment: string
    riskLevel: string
    compliance: number
    lastScan: string
    vulnerabilities: any[]
  }>
}

export interface ScanHistoryItem {
  scanId: string
  status: string
  startTime: string
  endTime?: string
  progress: number
  assets: ScanAsset[]
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
   * Check if user has assets
   */
  async checkAssets(): Promise<{ hasAssets: boolean; assetCount: number }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_CHECK_ASSETS, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to check assets')
      }

      const data = await response.json()
      return {
        hasAssets: data.hasAssets,
        assetCount: data.assetCount
      }
    } catch (error) {
      console.error('Error checking assets:', error)
      return { hasAssets: false, assetCount: 0 }
    }
  }

  /**
   * Start asset scan
   */
  async startScan(assets: ScanAsset[]): Promise<{ success: boolean; scanId?: string; message: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_START, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ assets })
      })

      const data = await response.json()
      return {
        success: data.success,
        scanId: data.scanId,
        message: data.message
      }
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
  async getScanStatus(scanId: string): Promise<ScanStatus | null> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_STATUS(scanId), {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to get scan status')
      }

      const data = await response.json()
      if (data.success) {
        return {
          scanId: data.scanId,
          status: data.status,
          progress: data.progress,
          startTime: data.startTime,
          endTime: data.endTime,
          assets: data.assets
        }
      }
      return null
    } catch (error) {
      console.error('Error getting scan status:', error)
      return null
    }
  }

  /**
   * Get scan report
   */
  async getScanReport(scanId: string): Promise<ScanReport | null> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_REPORT(scanId), {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to get scan report')
      }

      const data = await response.json()
      if (data.success) {
        return data.report
      }
      return null
    } catch (error) {
      console.error('Error getting scan report:', error)
      return null
    }
  }

  /**
   * Get scan history
   */
  async getScanHistory(): Promise<ScanHistoryItem[]> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_HISTORY, {
        headers: this.getAuthHeaders()
      })

      if (!response.ok) {
        throw new Error('Failed to get scan history')
      }

      const data = await response.json()
      if (data.success) {
        return data.scans
      }
      return []
    } catch (error) {
      console.error('Error getting scan history:', error)
      return []
    }
  }

  /**
   * Export scan report to PDF
   */
  async exportToPDF(scanId: string): Promise<{ success: boolean; filename?: string; data?: string; message: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_EXPORT_PDF(scanId), {
        headers: this.getAuthHeaders()
      })

      const data = await response.json()
      return {
        success: data.success,
        filename: data.filename,
        data: data.data,
        message: data.message || 'Export completed'
      }
    } catch (error) {
      console.error('Error exporting to PDF:', error)
      return {
        success: false,
        message: 'Failed to export to PDF'
      }
    }
  }

  /**
   * Export scan report to Excel
   */
  async exportToExcel(scanId: string): Promise<{ success: boolean; filename?: string; data?: string; message: string }> {
    try {
      const response = await fetch(API_ENDPOINTS.SCAN_EXPORT_EXCEL(scanId), {
        headers: this.getAuthHeaders()
      })

      const data = await response.json()
      return {
        success: data.success,
        filename: data.filename,
        data: data.data,
        message: data.message || 'Export completed'
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      return {
        success: false,
        message: 'Failed to export to Excel'
      }
    }
  }

  /**
   * Poll scan status until completion
   */
  async pollScanStatus(scanId: string, onUpdate: (status: ScanStatus) => void, interval: number = 5000): Promise<ScanStatus> {
    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          const status = await this.getScanStatus(scanId)
          if (status) {
            onUpdate(status)
            
            if (status.status === 'completed' || status.status === 'failed') {
              resolve(status)
              return
            }
          }
          
          setTimeout(poll, interval)
        } catch (error) {
          reject(error)
        }
      }
      
      poll()
    })
  }
}

export default new ScanService()