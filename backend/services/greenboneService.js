const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class GreenboneService {
  constructor() {
    this.gmp = null;
    this.isConnected = false;
    this.scanStatuses = new Map(); // Store scan statuses in memory
  }

  /**
   * Connect to Greenbone GVM API (Mock implementation)
   */
  async connectToGreenbone() {
    try {
      const config = {
        host: process.env.GREENBONE_HOST || '217.65.144.232',
        port: process.env.GREENBONE_PORT || 9392,
        username: process.env.GREENBONE_USERNAME || 'admin',
        password: process.env.GREENBONE_PASSWORD || 'admin',
        protocol: 'http'
      };

      // Mock connection - in real implementation, this would use gvm-tools
      // For now, we'll simulate a successful connection
      this.isConnected = true;
      
      console.log('✅ Connected to Greenbone GVM successfully (Mock)');
      return { success: true, message: 'Connected to Greenbone GVM' };
    } catch (error) {
      console.error('❌ Failed to connect to Greenbone GVM:', error.message);
      this.isConnected = false;
      return { success: false, message: `Connection failed: ${error.message}` };
    }
  }

  /**
   * Start scan for a list of assets (Mock implementation)
   */
  async startScan(assets, userId) {
    try {
      if (!this.isConnected) {
        const connectionResult = await this.connectToGreenbone();
        if (!connectionResult.success) {
          throw new Error(connectionResult.message);
        }
      }

      // Generate a mock scan ID
      const scanId = `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Store scan status
      const scanStatus = {
        scanId,
        taskId: `task_${scanId}`,
        targetId: `target_${scanId}`,
        userId,
        assets,
        status: 'queued',
        startTime: new Date(),
        progress: 0
      };

      this.scanStatuses.set(scanId, scanStatus);

      // Simulate scan progression
      setTimeout(() => {
        this.simulateScanProgress(scanId);
      }, 2000);

      console.log(`✅ Scan started successfully. Scan ID: ${scanId}`);
      return {
        success: true,
        scanId,
        message: 'Scan started successfully'
      };

    } catch (error) {
      console.error('❌ Failed to start scan:', error.message);
      return {
        success: false,
        message: `Failed to start scan: ${error.message}`
      };
    }
  }

  /**
   * Simulate scan progress (Mock implementation)
   */
  async simulateScanProgress(scanId) {
    const scanStatus = this.scanStatuses.get(scanId);
    if (!scanStatus) return;

    const progressSteps = [
      { status: 'running', progress: 10 },
      { status: 'running', progress: 25 },
      { status: 'running', progress: 50 },
      { status: 'running', progress: 75 },
      { status: 'running', progress: 90 },
      { status: 'completed', progress: 100 }
    ];

    for (let i = 0; i < progressSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));
      
      const step = progressSteps[i];
      scanStatus.status = step.status;
      scanStatus.progress = step.progress;
      
      if (step.status === 'completed') {
        scanStatus.endTime = new Date();
      }
      
      console.log(`📊 Scan ${scanId}: ${step.status} - ${step.progress}%`);
    }
  }

  /**
   * Get scan status (Mock implementation)
   */
  async getScanStatus(scanId) {
    try {
      const scanStatus = this.scanStatuses.get(scanId);
      if (!scanStatus) {
        return {
          success: false,
          message: 'Scan not found'
        };
      }

      return {
        success: true,
        status: scanStatus.status,
        progress: scanStatus.progress,
        startTime: scanStatus.startTime,
        endTime: scanStatus.endTime,
        assets: scanStatus.assets
      };

    } catch (error) {
      console.error('❌ Failed to get scan status:', error.message);
      return {
        success: false,
        message: `Failed to get scan status: ${error.message}`
      };
    }
  }

  /**
   * Get scan reports (Mock implementation)
   */
  async getScanReports(scanId) {
    try {
      const scanStatus = this.scanStatuses.get(scanId);
      if (!scanStatus) {
        return {
          success: false,
          message: 'Scan not found'
        };
      }

      if (scanStatus.status !== 'completed') {
        return {
          success: false,
          message: 'Scan not completed yet'
        };
      }

      // Generate mock report data
      const mockReportData = {
        results: [
          {
            name: 'HTTP Server Detection',
            cve: 'N/A',
            severity: 2.5,
            cvss: '2.5',
            host: scanStatus.assets[0]?.ip || '192.168.1.1',
            port: '80',
            description: 'HTTP server detected on port 80'
          },
          {
            name: 'SSL/TLS Certificate Issues',
            cve: 'CVE-2023-1234',
            severity: 6.8,
            cvss: '6.8',
            host: scanStatus.assets[0]?.ip || '192.168.1.1',
            port: '443',
            description: 'SSL certificate has weak encryption'
          },
          {
            name: 'Outdated Software Version',
            cve: 'CVE-2023-5678',
            severity: 8.2,
            cvss: '8.2',
            host: scanStatus.assets[0]?.ip || '192.168.1.1',
            port: '22',
            description: 'SSH server running outdated version'
          }
        ],
        hosts: scanStatus.assets.map(asset => ({
          name: asset.name,
          ip: asset.ip
        }))
      };

      const parsedData = await this.parseReports(mockReportData);

      return {
        success: true,
        reports: parsedData,
        message: 'Reports retrieved successfully'
      };

    } catch (error) {
      console.error('❌ Failed to get scan reports:', error.message);
      return {
        success: false,
        message: `Failed to get scan reports: ${error.message}`
      };
    }
  }

  /**
   * Parse reports and extract asset/vulnerability data
   */
  async parseReports(reportData) {
    try {
      const parsedData = {
        summary: {
          totalAssets: 0,
          totalVulnerabilities: 0,
          riskDistribution: {
            critical: 0,
            high: 0,
            medium: 0,
            low: 0
          }
        },
        vulnerabilities: [],
        assets: []
      };

      // Parse vulnerabilities from report
      if (reportData.results && reportData.results.length > 0) {
        for (const result of reportData.results) {
          const vulnerability = {
            name: result.name || 'Unknown Vulnerability',
            cve: result.cve || 'N/A',
            risk: this.mapSeverityToRisk(result.severity),
            cvss: result.cvss || 'N/A',
            status: 'open',
            recommendations: this.getRecommendations(result.severity),
            host: result.host || 'Unknown',
            port: result.port || 'N/A',
            description: result.description || 'No description available'
          };

          parsedData.vulnerabilities.push(vulnerability);
          parsedData.summary.totalVulnerabilities++;

          // Update risk distribution
          if (vulnerability.risk === 'Critical') parsedData.summary.riskDistribution.critical++;
          else if (vulnerability.risk === 'High') parsedData.summary.riskDistribution.high++;
          else if (vulnerability.risk === 'Medium') parsedData.summary.riskDistribution.medium++;
          else if (vulnerability.risk === 'Low') parsedData.summary.riskDistribution.low++;
        }
      }

      // Parse assets from report
      if (reportData.hosts && reportData.hosts.length > 0) {
        for (const host of reportData.hosts) {
          const asset = {
            name: host.name || host.ip,
            type: 'Web Server',
            environment: 'Production',
            ip: host.ip,
            url: host.name,
            assignedStandards: ['GDPR', 'NIS2'],
            compliancePercentage: this.calculateCompliance(parsedData.summary.riskDistribution),
            riskLevel: this.calculateOverallRisk(parsedData.summary.riskDistribution),
            lastAssessment: new Date().toISOString().split('T')[0],
            vulnerabilities: parsedData.vulnerabilities.filter(v => v.host === host.ip || v.host === host.name)
          };

          parsedData.assets.push(asset);
          parsedData.summary.totalAssets++;
        }
      }

      return parsedData;

    } catch (error) {
      console.error('❌ Failed to parse reports:', error.message);
      throw error;
    }
  }

  /**
   * Map GVM severity to risk level
   */
  mapSeverityToRisk(severity) {
    if (severity >= 9.0) return 'Critical';
    if (severity >= 7.0) return 'High';
    if (severity >= 4.0) return 'Medium';
    return 'Low';
  }

  /**
   * Get recommendations based on severity
   */
  getRecommendations(severity) {
    if (severity >= 9.0) return 'Immediate action required. Patch immediately.';
    if (severity >= 7.0) return 'High priority. Schedule patching within 24 hours.';
    if (severity >= 4.0) return 'Medium priority. Schedule patching within 1 week.';
    return 'Low priority. Schedule patching within 1 month.';
  }

  /**
   * Calculate compliance percentage
   */
  calculateCompliance(riskDistribution) {
    const total = riskDistribution.critical + riskDistribution.high + 
                  riskDistribution.medium + riskDistribution.low;
    
    if (total === 0) return 100;
    
    const criticalWeight = riskDistribution.critical * 4;
    const highWeight = riskDistribution.high * 3;
    const mediumWeight = riskDistribution.medium * 2;
    const lowWeight = riskDistribution.low * 1;
    
    const weightedScore = (total * 4) - (criticalWeight + highWeight + mediumWeight + lowWeight);
    return Math.max(0, Math.round((weightedScore / (total * 4)) * 100));
  }

  /**
   * Calculate overall risk level
   */
  calculateOverallRisk(riskDistribution) {
    if (riskDistribution.critical > 0) return 'Critical';
    if (riskDistribution.high > 0) return 'High';
    if (riskDistribution.medium > 0) return 'Medium';
    return 'Low';
  }

  /**
   * Check if user has assets
   */
  async checkUserAssets(userId) {
    try {
      // This would typically check the database for user assets
      // For now, we'll simulate checking if user1 has assets
      if (userId === 'user1') {
        return {
          success: true,
          hasAssets: true,
          assets: [
            { name: 'myrockshows.com', url: 'myrockshows.com', ip: '116.203.242.207' }
          ]
        };
      }
      
      return {
        success: true,
        hasAssets: false,
        assets: []
      };
    } catch (error) {
      console.error('❌ Failed to check user assets:', error.message);
      return {
        success: false,
        message: `Failed to check user assets: ${error.message}`
      };
    }
  }

  /**
   * Disconnect from Greenbone
   */
  async disconnect() {
    try {
      if (this.gmp && this.isConnected) {
        await this.gmp.disconnect();
        this.isConnected = false;
        console.log('✅ Disconnected from Greenbone GVM');
      }
    } catch (error) {
      console.error('❌ Error disconnecting from Greenbone:', error.message);
    }
  }
}

module.exports = new GreenboneService();