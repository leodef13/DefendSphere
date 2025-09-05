const axios = require('axios');
const redis = require('redis');
const { parseString } = require('xml2js');

class GreenboneService {
  constructor() {
    this.client = null;
    this.redisClient = null;
    this.isConnected = false;
    this.scanStatuses = new Map(); // In-memory cache for scan statuses
  }

  async initialize() {
    try {
      // Initialize Redis client
      this.redisClient = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });
      
      await this.redisClient.connect();
      console.log('GreenboneService: Redis connected');
      
      // Initialize HTTP client for GVM API
      this.client = axios.create({
        baseURL: `http://${process.env.GREENBONE_HOST || '217.65.144.232'}:${process.env.GREENBONE_PORT || 9392}`,
        auth: {
          username: process.env.GREENBONE_USERNAME || 'admin',
          password: process.env.GREENBONE_PASSWORD || 'admin'
        },
        timeout: 30000,
        headers: {
          'Content-Type': 'application/xml'
        }
      });
      
      console.log('GreenboneService: GVM HTTP client initialized');
    } catch (error) {
      console.error('GreenboneService initialization error:', error);
      throw error;
    }
  }

  async connectToGreenbone() {
    try {
      if (!this.client) {
        await this.initialize();
      }

      // Test connection by getting version
      const response = await this.client.get('/gmp');
      this.isConnected = true;
      console.log('GreenboneService: Connected to GVM');
      
      return {
        success: true,
        version: 'GVM API',
        message: 'Successfully connected to Greenbone GVM'
      };
    } catch (error) {
      this.isConnected = false;
      console.error('GreenboneService: Connection failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to connect to Greenbone GVM'
      };
    }
  }

  async startScan(assets, userId) {
    try {
      if (!this.isConnected) {
        const connectionResult = await this.connectToGreenbone();
        if (!connectionResult.success) {
          throw new Error('Cannot connect to Greenbone GVM');
        }
      }

      // Generate unique scan ID
      const scanId = `scan_${userId}_${Date.now()}`;
      
      // Create target
      const targetName = `DefendSphere_${userId}_${Date.now()}`;
      const targetHosts = assets.map(asset => asset.ip || asset.domain).join(',');
      
      const createTargetXML = `
        <create_target>
          <name>${targetName}</name>
          <hosts>${targetHosts}</hosts>
          <comment>DefendSphere scan for user ${userId}</comment>
        </create_target>
      `;

      const targetResponse = await this.client.post('/gmp', createTargetXML);
      const targetId = this.extractIdFromResponse(targetResponse.data);

      // Create task
      const taskName = `DefendSphere_Task_${userId}_${Date.now()}`;
      const createTaskXML = `
        <create_task>
          <name>${taskName}</name>
          <target id="${targetId}"/>
          <config id="daba56c8-73ec-11df-a475-002264764cea"/>
          <comment>DefendSphere task for user ${userId}</comment>
        </create_task>
      `;

      const taskResponse = await this.client.post('/gmp', createTaskXML);
      const taskId = this.extractIdFromResponse(taskResponse.data);

      // Start scan
      const startTaskXML = `<start_task task_id="${taskId}"/>`;
      await this.client.post('/gmp', startTaskXML);

      // Store scan info in Redis
      const scanInfo = {
        scanId,
        userId,
        taskId,
        targetId,
        status: 'queued',
        startTime: new Date().toISOString(),
        assets: assets,
        progress: 0
      };

      await this.redisClient.setEx(`scan:${scanId}`, 3600, JSON.stringify(scanInfo));
      this.scanStatuses.set(scanId, scanInfo);

      console.log(`GreenboneService: Scan started with ID ${scanId}`);
      
      return {
        success: true,
        scanId,
        taskId,
        message: 'Scan started successfully'
      };
    } catch (error) {
      console.error('GreenboneService: Start scan error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to start scan'
      };
    }
  }

  async getScanStatus(scanId) {
    try {
      // Check in-memory cache first
      if (this.scanStatuses.has(scanId)) {
        const scanInfo = this.scanStatuses.get(scanId);
        
        // Update status from GVM if scan is running
        if (scanInfo.status === 'running' || scanInfo.status === 'queued') {
          const updatedStatus = await this.updateScanStatusFromGVM(scanInfo);
          return updatedStatus;
        }
        
        return scanInfo;
      }

      // Check Redis
      const scanData = await this.redisClient.get(`scan:${scanId}`);
      if (scanData) {
        const scanInfo = JSON.parse(scanData);
        this.scanStatuses.set(scanId, scanInfo);
        
        // Update status from GVM if scan is running
        if (scanInfo.status === 'running' || scanInfo.status === 'queued') {
          const updatedStatus = await this.updateScanStatusFromGVM(scanInfo);
          return updatedStatus;
        }
        
        return scanInfo;
      }

      return {
        success: false,
        error: 'Scan not found',
        message: 'Scan ID not found'
      };
    } catch (error) {
      console.error('GreenboneService: Get scan status error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to get scan status'
      };
    }
  }

  async updateScanStatusFromGVM(scanInfo) {
    try {
      if (!this.isConnected) {
        return scanInfo;
      }

      const getTaskXML = `<get_tasks task_id="${scanInfo.taskId}"/>`;
      const response = await this.client.post('/gmp', getTaskXML);
      
      // Parse XML response to get status
      const statusMatch = response.data.match(/<status>([^<]+)<\/status>/);
      const progressMatch = response.data.match(/<progress>(\d+)<\/progress>/);
      
      const status = statusMatch ? statusMatch[1] : 'Unknown';
      const progress = progressMatch ? parseInt(progressMatch[1]) : scanInfo.progress;
      
      let newStatus = scanInfo.status;

      switch (status) {
        case 'Running':
          newStatus = 'running';
          break;
        case 'Done':
          newStatus = 'completed';
          break;
        case 'Stopped':
        case 'Interrupted':
          newStatus = 'failed';
          break;
        default:
          newStatus = 'queued';
      }

      // Update scan info
      const updatedScanInfo = {
        ...scanInfo,
        status: newStatus,
        progress,
        lastUpdate: new Date().toISOString()
      };

      // Update Redis and cache
      await this.redisClient.setEx(`scan:${scanInfo.scanId}`, 3600, JSON.stringify(updatedScanInfo));
      this.scanStatuses.set(scanInfo.scanId, updatedScanInfo);

      return updatedScanInfo;
    } catch (error) {
      console.error('GreenboneService: Update scan status error:', error);
      return scanInfo;
    }
  }

  async getReports(scanId) {
    try {
      const scanInfo = await this.getScanStatus(scanId);
      if (!scanInfo.success && scanInfo.status !== 'completed') {
        return {
          success: false,
          error: 'Scan not completed',
          message: 'Scan must be completed to get reports'
        };
      }

      if (!this.isConnected) {
        const connectionResult = await this.connectToGreenbone();
        if (!connectionResult.success) {
          throw new Error('Cannot connect to Greenbone GVM');
        }
      }

      // Get reports for the task
      const getReportsXML = `<get_reports task_id="${scanInfo.taskId}"/>`;
      const response = await this.client.post('/gmp', getReportsXML);
      
      // Parse XML response to get report IDs
      const reportIdMatches = response.data.match(/id="([^"]+)"/g);
      const reportIds = reportIdMatches ? reportIdMatches.map(match => match.match(/id="([^"]+)"/)[1]) : [];

      const reports = [];
      for (const reportId of reportIds) {
        const getReportXML = `<get_reports report_id="${reportId}"/>`;
        const reportResponse = await this.client.post('/gmp', getReportXML);
        reports.push({
          id: reportId,
          content: reportResponse.data,
          timestamp: new Date().toISOString()
        });
      }

      // Parse reports
      const parsedReports = await this.parseReports(reports, scanInfo.assets);

      // Store reports in Redis
      await this.redisClient.setEx(`reports:${scanId}`, 7200, JSON.stringify(parsedReports));

      return {
        success: true,
        reports: parsedReports,
        message: 'Reports retrieved successfully'
      };
    } catch (error) {
      console.error('GreenboneService: Get reports error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to get reports'
      };
    }
  }

  async parseReports(reports, assets) {
    try {
      const parsedReports = [];

      for (const report of reports) {
        const vulnerabilities = [];
        const assetVulnerabilities = new Map();

        // Parse XML report (simplified parsing)
        if (report.content && report.content.includes('<result>')) {
          const resultMatches = report.content.match(/<result>[\s\S]*?<\/result>/g);
          
          if (resultMatches) {
            for (const result of resultMatches) {
              const nameMatch = result.match(/<name>(.*?)<\/name>/);
              const cveMatch = result.match(/<cve>(.*?)<\/cve>/);
              const severityMatch = result.match(/<severity>(.*?)<\/severity>/);
              const hostMatch = result.match(/<host>(.*?)<\/host>/);
              const descriptionMatch = result.match(/<description>(.*?)<\/description>/);

              if (nameMatch && severityMatch) {
                const vulnerability = {
                  name: nameMatch[1],
                  cve: cveMatch ? cveMatch[1] : 'N/A',
                  severity: severityMatch[1],
                  host: hostMatch ? hostMatch[1] : 'Unknown',
                  description: descriptionMatch ? descriptionMatch[1] : 'No description available',
                  riskLevel: this.mapSeverityToRiskLevel(severityMatch[1]),
                  cvss: this.mapSeverityToCVSS(severityMatch[1]),
                  status: 'open',
                  recommendations: this.generateRecommendations(severityMatch[1])
                };

                vulnerabilities.push(vulnerability);

                // Group by asset
                const asset = assets.find(a => a.ip === vulnerability.host || a.domain === vulnerability.host);
                if (asset) {
                  if (!assetVulnerabilities.has(asset.id)) {
                    assetVulnerabilities.set(asset.id, []);
                  }
                  assetVulnerabilities.get(asset.id).push(vulnerability);
                }
              }
            }
          }
        }

        parsedReports.push({
          id: report.id,
          name: report.name,
          timestamp: report.timestamp,
          vulnerabilities,
          assetVulnerabilities: Object.fromEntries(assetVulnerabilities),
          summary: {
            totalVulnerabilities: vulnerabilities.length,
            critical: vulnerabilities.filter(v => v.riskLevel === 'Critical').length,
            high: vulnerabilities.filter(v => v.riskLevel === 'High').length,
            medium: vulnerabilities.filter(v => v.riskLevel === 'Medium').length,
            low: vulnerabilities.filter(v => v.riskLevel === 'Low').length
          }
        });
      }

      return parsedReports;
    } catch (error) {
      console.error('GreenboneService: Parse reports error:', error);
      throw error;
    }
  }

  mapSeverityToRiskLevel(severity) {
    const severityNum = parseFloat(severity);
    if (severityNum >= 9.0) return 'Critical';
    if (severityNum >= 7.0) return 'High';
    if (severityNum >= 4.0) return 'Medium';
    return 'Low';
  }

  mapSeverityToCVSS(severity) {
    return parseFloat(severity).toFixed(1);
  }

  generateRecommendations(severity) {
    const severityNum = parseFloat(severity);
    if (severityNum >= 9.0) {
      return 'Immediate action required. Apply security patches and implement additional monitoring.';
    } else if (severityNum >= 7.0) {
      return 'High priority. Schedule security updates and review system configuration.';
    } else if (severityNum >= 4.0) {
      return 'Medium priority. Plan security updates during next maintenance window.';
    } else {
      return 'Low priority. Monitor and address during regular maintenance.';
    }
  }

  async getUserAssets(userId) {
    try {
      const assetsData = await this.redisClient.get(`user:${userId}:assets`);
      if (assetsData) {
        return JSON.parse(assetsData);
      }
      return [];
    } catch (error) {
      console.error('GreenboneService: Get user assets error:', error);
      return [];
    }
  }

  async updateUserAssets(userId, scanId) {
    try {
      const reports = await this.getReports(scanId);
      if (!reports.success) {
        return { success: false, error: reports.error };
      }

      const userAssets = await this.getUserAssets(userId);
      const updatedAssets = [...userAssets];

      // Update assets with scan results
      for (const report of reports.reports) {
        for (const [assetId, vulnerabilities] of Object.entries(report.assetVulnerabilities)) {
          const assetIndex = updatedAssets.findIndex(a => a.id === assetId);
          if (assetIndex !== -1) {
            updatedAssets[assetIndex] = {
              ...updatedAssets[assetIndex],
              lastScan: new Date().toISOString(),
              vulnerabilities: vulnerabilities,
              riskLevel: this.calculateAssetRiskLevel(vulnerabilities),
              compliance: this.calculateCompliance(vulnerabilities)
            };
          }
        }
      }

      // Save updated assets
      await this.redisClient.setEx(`user:${userId}:assets`, 3600, JSON.stringify(updatedAssets));

      return {
        success: true,
        assets: updatedAssets,
        message: 'Assets updated successfully'
      };
    } catch (error) {
      console.error('GreenboneService: Update user assets error:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update user assets'
      };
    }
  }

  calculateAssetRiskLevel(vulnerabilities) {
    if (vulnerabilities.some(v => v.riskLevel === 'Critical')) return 'Critical';
    if (vulnerabilities.some(v => v.riskLevel === 'High')) return 'High';
    if (vulnerabilities.some(v => v.riskLevel === 'Medium')) return 'Medium';
    return 'Low';
  }

  calculateCompliance(vulnerabilities) {
    const total = vulnerabilities.length;
    if (total === 0) return 100;
    
    const critical = vulnerabilities.filter(v => v.riskLevel === 'Critical').length;
    const high = vulnerabilities.filter(v => v.riskLevel === 'High').length;
    
    // Calculate compliance based on critical and high vulnerabilities
    const compliance = Math.max(0, 100 - (critical * 20) - (high * 10));
    return Math.round(compliance);
  }

  extractIdFromResponse(xmlResponse) {
    try {
      const idMatch = xmlResponse.match(/id="([^"]+)"/);
      return idMatch ? idMatch[1] : null;
    } catch (error) {
      console.error('Error extracting ID from response:', error);
      return null;
    }
  }

  async cleanup() {
    try {
      if (this.redisClient) {
        await this.redisClient.quit();
      }
      console.log('GreenboneService: Cleanup completed');
    } catch (error) {
      console.error('GreenboneService: Cleanup error:', error);
    }
  }
}

module.exports = new GreenboneService();