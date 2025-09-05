import { spawn } from 'child_process'
import { createClient } from 'redis'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Redis client for storing scan status
const redis = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' })
redis.on('error', (e) => console.error('Redis error in greenboneService:', e))
await redis.connect()

// Greenbone configuration
const GREENBONE_CONFIG = {
  hostname: process.env.GREENBONE_HOST || '217.65.144.232',
  port: process.env.GREENBONE_PORT || '9392',
  username: process.env.GREENBONE_USERNAME || 'admin',
  password: process.env.GREENBONE_PASSWORD || 'admin',
  protocol: 'ssh', // SSH connection to GVM
  // Default scan configuration IDs (these are standard GVM IDs)
  configId: 'daba56c8-73ec-11df-a475-002264764cea', // Full and Fast
  scannerId: '08b69003-5fc2-4037-a479-93b440211c73', // OpenVAS Scanner
  reportFormatId: '35ba7077-dc85-42ef-87c9-b0eda7e903b6' // PDF format
}

class GreenboneService {
  constructor() {
    this.scanStatuses = new Map()
  }

  /**
   * Connect to Greenbone GVM and test connection
   */
  async connectToGreenbone() {
    try {
      console.log('Connecting to Greenbone GVM...')
      
      // Test connection by getting version
      const version = await this.executeGvmCommand('<get_version/>')
      
      if (version && version.includes('<get_version_response')) {
        console.log('Successfully connected to Greenbone GVM')
        return { success: true, version: this.parseXmlResponse(version) }
      } else {
        throw new Error('Failed to get version from GVM')
      }
    } catch (error) {
      console.error('Failed to connect to Greenbone GVM:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Start scan for a list of assets
   */
  async startScan(assets, userId) {
    try {
      console.log(`Starting scan for user ${userId} with assets:`, assets)
      
      const scanId = `scan_${userId}_${Date.now()}`
      
      // Store scan status in Redis
      await redis.set(`scan:${scanId}`, JSON.stringify({
        id: scanId,
        userId,
        status: 'starting',
        assets,
        startTime: new Date().toISOString(),
        progress: 0,
        message: 'Initializing scan...'
      }))

      // Start scan process asynchronously
      this.performScan(scanId, assets, userId)
      
      return { success: true, scanId }
    } catch (error) {
      console.error('Failed to start scan:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Perform the actual scan process
   */
  async performScan(scanId, assets, userId) {
    try {
      // Update status to creating targets
      await this.updateScanStatus(scanId, 'creating_targets', 10, 'Creating targets in GVM...')
      
      // Create targets for each asset
      const targetIds = []
      for (const asset of assets) {
        const targetId = await this.createTarget(asset)
        if (targetId) {
          targetIds.push(targetId)
        }
      }

      if (targetIds.length === 0) {
        throw new Error('Failed to create any targets')
      }

      // Update status to creating task
      await this.updateScanStatus(scanId, 'creating_task', 20, 'Creating scan task...')
      
      // Create scan task
      const taskId = await this.createTask(scanId, targetIds)
      if (!taskId) {
        throw new Error('Failed to create scan task')
      }

      // Update status to starting scan
      await this.updateScanStatus(scanId, 'running', 30, 'Starting scan...')
      
      // Start the scan
      await this.startTask(taskId)
      
      // Monitor scan progress
      await this.monitorScan(scanId, taskId, assets)
      
    } catch (error) {
      console.error(`Scan ${scanId} failed:`, error)
      await this.updateScanStatus(scanId, 'failed', 0, `Scan failed: ${error.message}`)
    }
  }

  /**
   * Create a target in GVM
   */
  async createTarget(asset) {
    try {
      const targetName = `DefendSphere_${asset.name}_${Date.now()}`
      const hosts = asset.ip || asset.name
      
      const xmlCommand = `<create_target>
        <name>${targetName}</name>
        <hosts>${hosts}</hosts>
        <port_list id="33d0cd82-57c6-11e1-8ed1-406186ea4fc5"></port_list>
      </create_target>`
      
      const response = await this.executeGvmCommand(xmlCommand)
      const parsed = this.parseXmlResponse(response)
      
      if (parsed && parsed.id) {
        console.log(`Created target ${targetName} with ID: ${parsed.id}`)
        return parsed.id
      } else {
        throw new Error('Failed to create target')
      }
    } catch (error) {
      console.error('Failed to create target:', error)
      return null
    }
  }

  /**
   * Create a scan task in GVM
   */
  async createTask(scanId, targetIds) {
    try {
      const taskName = `DefendSphere_Scan_${scanId}`
      
      // Create task with first target (we'll add more targets if needed)
      const xmlCommand = `<create_task>
        <name>${taskName}</name>
        <target id="${targetIds[0]}"></target>
        <config id="${GREENBONE_CONFIG.configId}"></config>
        <scanner id="${GREENBONE_CONFIG.scannerId}"></scanner>
        <comment>DefendSphere automated scan</comment>
      </create_task>`
      
      const response = await this.executeGvmCommand(xmlCommand)
      const parsed = this.parseXmlResponse(response)
      
      if (parsed && parsed.id) {
        console.log(`Created task ${taskName} with ID: ${parsed.id}`)
        return parsed.id
      } else {
        throw new Error('Failed to create task')
      }
    } catch (error) {
      console.error('Failed to create task:', error)
      return null
    }
  }

  /**
   * Start a scan task
   */
  async startTask(taskId) {
    try {
      const xmlCommand = `<start_task task_id="${taskId}"/>`
      const response = await this.executeGvmCommand(xmlCommand)
      
      console.log(`Started task ${taskId}`)
      return true
    } catch (error) {
      console.error('Failed to start task:', error)
      return false
    }
  }

  /**
   * Monitor scan progress
   */
  async monitorScan(scanId, taskId, assets) {
    try {
      let progress = 30
      let lastProgress = 0
      
      while (progress < 100) {
        await new Promise(resolve => setTimeout(resolve, 30000)) // Wait 30 seconds
        
        const taskStatus = await this.getTaskStatus(taskId)
        
        if (taskStatus.status === 'Done') {
          progress = 100
          await this.updateScanStatus(scanId, 'completed', 100, 'Scan completed successfully')
          await this.processScanResults(scanId, taskId, assets)
          break
        } else if (taskStatus.status === 'Stopped' || taskStatus.status === 'Interrupted') {
          await this.updateScanStatus(scanId, 'failed', progress, 'Scan was stopped or interrupted')
          break
        } else if (taskStatus.status === 'Running') {
          progress = Math.min(30 + (taskStatus.progress || 0) * 0.6, 95)
          if (progress > lastProgress + 5) {
            await this.updateScanStatus(scanId, 'running', progress, `Scan in progress: ${taskStatus.progress || 0}%`)
            lastProgress = progress
          }
        }
      }
    } catch (error) {
      console.error(`Failed to monitor scan ${scanId}:`, error)
      await this.updateScanStatus(scanId, 'failed', 0, `Monitoring failed: ${error.message}`)
    }
  }

  /**
   * Get task status from GVM
   */
  async getTaskStatus(taskId) {
    try {
      const xmlCommand = `<get_tasks task_id="${taskId}"/>`
      const response = await this.executeGvmCommand(xmlCommand)
      const parsed = this.parseXmlResponse(response)
      
      if (parsed && parsed.task) {
        return {
          status: parsed.task.status,
          progress: parsed.task.progress
        }
      }
      return { status: 'Unknown', progress: 0 }
    } catch (error) {
      console.error('Failed to get task status:', error)
      return { status: 'Error', progress: 0 }
    }
  }

  /**
   * Process scan results and generate reports
   */
  async processScanResults(scanId, taskId, assets) {
    try {
      console.log(`Processing scan results for ${scanId}`)
      
      // Get reports for the task
      const reports = await this.getReports(taskId)
      
      if (reports && reports.length > 0) {
        // Parse the latest report
        const latestReport = reports[0]
        const parsedData = await this.parseReports(latestReport, assets)
        
        // Store results in Redis
        await redis.set(`scan:${scanId}:results`, JSON.stringify(parsedData))
        
        // Update scan status with results
        await this.updateScanStatus(scanId, 'completed', 100, 'Scan completed and results processed', parsedData)
        
        console.log(`Scan ${scanId} completed successfully with ${parsedData.vulnerabilities.length} vulnerabilities found`)
      } else {
        await this.updateScanStatus(scanId, 'completed', 100, 'Scan completed but no reports found')
      }
    } catch (error) {
      console.error(`Failed to process scan results for ${scanId}:`, error)
      await this.updateScanStatus(scanId, 'completed', 100, 'Scan completed but failed to process results')
    }
  }

  /**
   * Get reports for a task
   */
  async getReports(taskId) {
    try {
      const xmlCommand = `<get_reports task_id="${taskId}"/>`
      const response = await this.executeGvmCommand(xmlCommand)
      const parsed = this.parseXmlResponse(response)
      
      if (parsed && parsed.reports) {
        return Array.isArray(parsed.reports) ? parsed.reports : [parsed.reports]
      }
      return []
    } catch (error) {
      console.error('Failed to get reports:', error)
      return []
    }
  }

  /**
   * Parse reports and extract vulnerability data
   */
  async parseReports(report, assets) {
    try {
      const vulnerabilities = []
      const assetData = []
      
      // This is a simplified parser - in a real implementation,
      // you would parse the full XML report structure
      if (report && report.results) {
        const results = Array.isArray(report.results) ? report.results : [report.results]
        
        for (const result of results) {
          if (result && result.nvt) {
            vulnerabilities.push({
              id: `vuln_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: result.nvt.name || 'Unknown Vulnerability',
              cve: result.nvt.cve || 'N/A',
              riskLevel: this.calculateRiskLevel(result.severity),
              cvss: parseFloat(result.severity) || 0,
              status: 'Open',
              description: result.description || 'No description available',
              recommendation: result.solution || 'No solution available',
              asset: result.host || assets[0]?.name || 'Unknown',
              discovered: new Date().toISOString()
            })
          }
        }
      }
      
      // Update asset data based on vulnerabilities
      for (const asset of assets) {
        const assetVulns = vulnerabilities.filter(v => v.asset === asset.name || v.asset === asset.ip)
        const riskDistribution = this.calculateRiskDistribution(assetVulns)
        
        assetData.push({
          ...asset,
          vulnerabilities: riskDistribution,
          riskLevel: this.calculateAssetRiskLevel(riskDistribution),
          compliancePercentage: this.calculateCompliancePercentage(riskDistribution),
          lastAssessment: new Date().toISOString()
        })
      }
      
      return {
        vulnerabilities,
        assets: assetData,
        summary: {
          totalAssets: assets.length,
          totalVulnerabilities: vulnerabilities.length,
          riskDistribution: this.calculateOverallRiskDistribution(vulnerabilities),
          securityHealth: this.calculateSecurityHealth(vulnerabilities),
          complianceScore: this.calculateOverallComplianceScore(assetData)
        }
      }
    } catch (error) {
      console.error('Failed to parse reports:', error)
      return {
        vulnerabilities: [],
        assets: assets,
        summary: {
          totalAssets: assets.length,
          totalVulnerabilities: 0,
          riskDistribution: { critical: 0, high: 0, medium: 0, low: 0 },
          securityHealth: 100,
          complianceScore: 100
        }
      }
    }
  }

  /**
   * Calculate risk level from CVSS score
   */
  calculateRiskLevel(cvss) {
    const score = parseFloat(cvss) || 0
    if (score >= 9.0) return 'Critical'
    if (score >= 7.0) return 'High'
    if (score >= 4.0) return 'Medium'
    return 'Low'
  }

  /**
   * Calculate risk distribution for an asset
   */
  calculateRiskDistribution(vulnerabilities) {
    const distribution = { critical: 0, high: 0, medium: 0, low: 0 }
    
    for (const vuln of vulnerabilities) {
      distribution[vuln.riskLevel.toLowerCase()]++
    }
    
    return distribution
  }

  /**
   * Calculate overall risk distribution
   */
  calculateOverallRiskDistribution(vulnerabilities) {
    return this.calculateRiskDistribution(vulnerabilities)
  }

  /**
   * Calculate asset risk level
   */
  calculateAssetRiskLevel(riskDistribution) {
    if (riskDistribution.critical > 0) return 'Critical'
    if (riskDistribution.high > 0) return 'High'
    if (riskDistribution.medium > 0) return 'Medium'
    return 'Low'
  }

  /**
   * Calculate compliance percentage
   */
  calculateCompliancePercentage(riskDistribution) {
    const total = riskDistribution.critical + riskDistribution.high + riskDistribution.medium + riskDistribution.low
    if (total === 0) return 100
    
    const criticalWeight = riskDistribution.critical * 4
    const highWeight = riskDistribution.high * 3
    const mediumWeight = riskDistribution.medium * 2
    const lowWeight = riskDistribution.low * 1
    
    const totalWeight = criticalWeight + highWeight + mediumWeight + lowWeight
    const maxWeight = total * 4
    
    return Math.max(0, Math.round(100 - (totalWeight / maxWeight) * 100))
  }

  /**
   * Calculate security health
   */
  calculateSecurityHealth(vulnerabilities) {
    if (vulnerabilities.length === 0) return 100
    
    const criticalCount = vulnerabilities.filter(v => v.riskLevel === 'Critical').length
    const highCount = vulnerabilities.filter(v => v.riskLevel === 'High').length
    const mediumCount = vulnerabilities.filter(v => v.riskLevel === 'Medium').length
    const lowCount = vulnerabilities.filter(v => v.riskLevel === 'Low').length
    
    const totalWeight = criticalCount * 4 + highCount * 3 + mediumCount * 2 + lowCount * 1
    const maxWeight = vulnerabilities.length * 4
    
    return Math.max(0, Math.round(100 - (totalWeight / maxWeight) * 100))
  }

  /**
   * Calculate overall compliance score
   */
  calculateOverallComplianceScore(assets) {
    if (assets.length === 0) return 100
    
    const totalCompliance = assets.reduce((sum, asset) => sum + asset.compliancePercentage, 0)
    return Math.round(totalCompliance / assets.length)
  }

  /**
   * Update scan status in Redis
   */
  async updateScanStatus(scanId, status, progress, message, results = null) {
    try {
      const statusData = {
        id: scanId,
        status,
        progress,
        message,
        lastUpdate: new Date().toISOString(),
        ...(results && { results })
      }
      
      await redis.set(`scan:${scanId}`, JSON.stringify(statusData))
      console.log(`Scan ${scanId} status updated: ${status} (${progress}%) - ${message}`)
    } catch (error) {
      console.error('Failed to update scan status:', error)
    }
  }

  /**
   * Get scan status
   */
  async getScanStatus(scanId) {
    try {
      const statusData = await redis.get(`scan:${scanId}`)
      return statusData ? JSON.parse(statusData) : null
    } catch (error) {
      console.error('Failed to get scan status:', error)
      return null
    }
  }

  /**
   * Get scan results
   */
  async getScanResults(scanId) {
    try {
      const resultsData = await redis.get(`scan:${scanId}:results`)
      return resultsData ? JSON.parse(resultsData) : null
    } catch (error) {
      console.error('Failed to get scan results:', error)
      return null
    }
  }

  /**
   * Execute GVM command using gvm-cli
   */
  async executeGvmCommand(xmlCommand) {
    return new Promise((resolve, reject) => {
      const args = [
        '--gmp-username', GREENBONE_CONFIG.username,
        '--gmp-password', GREENBONE_CONFIG.password,
        'ssh',
        '--hostname', GREENBONE_CONFIG.hostname,
        '--port', GREENBONE_CONFIG.port,
        '--xml', xmlCommand
      ]
      
      const gvmCli = spawn('gvm-cli', args)
      
      let output = ''
      let errorOutput = ''
      
      gvmCli.stdout.on('data', (data) => {
        output += data.toString()
      })
      
      gvmCli.stderr.on('data', (data) => {
        errorOutput += data.toString()
      })
      
      gvmCli.on('close', (code) => {
        if (code === 0) {
          resolve(output)
        } else {
          reject(new Error(`gvm-cli failed with code ${code}: ${errorOutput}`))
        }
      })
      
      gvmCli.on('error', (error) => {
        reject(new Error(`Failed to execute gvm-cli: ${error.message}`))
      })
    })
  }

  /**
   * Parse XML response from GVM
   */
  parseXmlResponse(xmlString) {
    try {
      // Simple XML parsing - in production, use a proper XML parser
      const idMatch = xmlString.match(/id="([^"]+)"/)
      const statusMatch = xmlString.match(/status="([^"]+)"/)
      
      if (idMatch) {
        return {
          id: idMatch[1],
          status: statusMatch ? statusMatch[1] : 'unknown'
        }
      }
      
      return null
    } catch (error) {
      console.error('Failed to parse XML response:', error)
      return null
    }
  }
}

export default new GreenboneService()