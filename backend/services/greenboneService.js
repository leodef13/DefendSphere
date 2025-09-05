const axios = require('axios');
const xml2js = require('xml2js');
const fs = require('fs').promises;
const path = require('path');

class GreenboneService {
  constructor() {
    this.isConnected = false;
    this.scanStatuses = new Map(); // Store scan statuses in memory
    this.parser = new xml2js.Parser();
    this.builder = new xml2js.Builder();
  }

  /**
   * Connect to Greenbone GVM API
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

      // For now, we'll simulate a connection since we don't have actual GVM access
      // In a real implementation, you would use SSH or HTTP to connect to GVM
      this.isConnected = true;
      
      console.log('✅ Connected to Greenbone GVM successfully (simulated)');
      return { success: true, message: 'Connected to Greenbone GVM' };
    } catch (error) {
      console.error('❌ Failed to connect to Greenbone GVM:', error.message);
      this.isConnected = false;
      return { success: false, message: `Connection failed: ${error.message}` };
    }
  }

  /**
   * Start scan for a list of assets
   */
  async startScan(assets, userId) {
    try {
      if (!this.isConnected) {
        const connectionResult = await this.connectToGreenbone();
        if (!connectionResult.success) {
          throw new Error(connectionResult.message);
        }
      }

      // Create scan configuration
      const scanConfig = {
        name: `DefendSphere_Scan_${userId}_${Date.now()}`,
        targets: assets.map(asset => asset.url || asset.ip),
        scanner: 'OpenVAS Default',
        config: 'Full and fast'
      };

      // Create target
      const target = await this.gmp.createTarget({
        name: `DefendSphere_Target_${userId}_${Date.now()}`,
        hosts: scanConfig.targets,
        port_list: 'All IANA assigned TCP'
      });

      // Create task
      const task = await this.gmp.createTask({
        name: scanConfig.name,
        target: target.id,
        scanner: scanConfig.scanner,
        config: scanConfig.config
      });

      // Start scan
      const scan = await this.gmp.startTask(task.id);

      // Store scan status
      const scanId = scan.id;
      this.scanStatuses.set(scanId, {
        id: scanId,
        userId,
        status: 'running',
        startTime: new Date(),
        assets: assets,
        targetId: target.id,
        taskId: task.id,
        progress: 0
      });

      console.log(`✅ Scan started successfully: ${scanId}`);
      return {
        success: true,
        scanId,
        message: 'Scan started successfully'
      };

    } catch (error) {
      console.error('❌ Failed to start scan:', error.message);
      return {
        success: false,
        message: `Scan failed: ${error.message}`
      };
    }
  }

  /**
   * Get scan status
   */
  async getScanStatus(scanId) {
    try {
      if (!this.isConnected) {
        const connectionResult = await this.connectToGreenbone();
        if (!connectionResult.success) {
          throw new Error(connectionResult.message);
        }
      }

      const scanInfo = this.scanStatuses.get(scanId);
      if (!scanInfo) {
        throw new Error('Scan not found');
      }

      // Get task status from GVM
      const task = await this.gmp.getTask(scanInfo.taskId);
      const progress = task.progress || 0;
      const status = task.status || 'unknown';

      // Update stored status
      scanInfo.progress = progress;
      scanInfo.status = status;

      if (status === 'Done') {
        scanInfo.endTime = new Date();
        scanInfo.status = 'completed';
      }

      return {
        success: true,
        scanId,
        status: scanInfo.status,
        progress,
        startTime: scanInfo.startTime,
        endTime: scanInfo.endTime,
        assets: scanInfo.assets
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
   * Get scan reports
   */
  async getScanReports(scanId) {
    try {
      if (!this.isConnected) {
        const connectionResult = await this.connectToGreenbone();
        if (!connectionResult.success) {
          throw new Error(connectionResult.message);
        }
      }

      const scanInfo = this.scanStatuses.get(scanId);
      if (!scanInfo) {
        throw new Error('Scan not found');
      }

      // Get reports for the task
      const reports = await this.gmp.getReports({
        task: scanInfo.taskId,
        format: 'xml'
      });

      if (!reports || reports.length === 0) {
        return {
          success: false,
          message: 'No reports found for this scan'
        };
      }

      // Parse the first report
      const report = reports[0];
      const parsedData = await this.parseReports(report);

      return {
        success: true,
        scanId,
        reports: [{
          id: report.id,
          name: report.name,
          timestamp: report.timestamp,
          ...parsedData
        }]
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
   * Parse reports data
   */
  async parseReports(reportData) {
    try {
      // This is a simplified parser - in real implementation you'd parse XML
      const vulnerabilities = [];
      const assets = [];

      // Mock parsing based on report structure
      if (reportData.vulnerabilities) {
        reportData.vulnerabilities.forEach(vuln => {
          vulnerabilities.push({
            name: vuln.name || 'Unknown Vulnerability',
            cve: vuln.cve || 'N/A',
            risk: vuln.severity || 'Medium',
            cvss: vuln.cvss || '5.0',
            status: 'Open',
            description: vuln.description || 'No description available',
            recommendation: vuln.recommendation || 'Review and patch if necessary'
          });
        });
      }

      if (reportData.hosts) {
        reportData.hosts.forEach(host => {
          assets.push({
            name: host.hostname || host.ip,
            ip: host.ip,
            type: 'Web Server',
            environment: 'Production',
            riskLevel: this.calculateRiskLevel(vulnerabilities.filter(v => v.risk)),
            compliance: this.calculateCompliance(vulnerabilities),
            lastScan: new Date().toISOString(),
            vulnerabilities: vulnerabilities.filter(v => v.risk)
          });
        });
      }

      return {
        summary: {
          totalAssets: assets.length,
          totalVulnerabilities: vulnerabilities.length,
          riskDistribution: this.calculateRiskDistribution(vulnerabilities)
        },
        vulnerabilities,
        assets
      };

    } catch (error) {
      console.error('❌ Failed to parse reports:', error.message);
      return {
        summary: { totalAssets: 0, totalVulnerabilities: 0, riskDistribution: {} },
        vulnerabilities: [],
        assets: []
      };
    }
  }

  /**
   * Calculate risk level for an asset
   */
  calculateRiskLevel(vulnerabilities) {
    if (!vulnerabilities || vulnerabilities.length === 0) {
      return 'Low';
    }

    const hasCritical = vulnerabilities.some(v => v.risk === 'Critical');
    const hasHigh = vulnerabilities.some(v => v.risk === 'High');
    const hasMedium = vulnerabilities.some(v => v.risk === 'Medium');

    if (hasCritical) return 'Critical';
    if (hasHigh) return 'High';
    if (hasMedium) return 'Medium';
    return 'Low';
  }

  /**
   * Calculate compliance percentage
   */
  calculateCompliance(vulnerabilities) {
    if (!vulnerabilities || vulnerabilities.length === 0) {
      return 100;
    }

    const criticalCount = vulnerabilities.filter(v => v.risk === 'Critical').length;
    const highCount = vulnerabilities.filter(v => v.risk === 'High').length;
    const mediumCount = vulnerabilities.filter(v => v.risk === 'Medium').length;
    const lowCount = vulnerabilities.filter(v => v.risk === 'Low').length;

    const totalWeight = criticalCount * 4 + highCount * 3 + mediumCount * 2 + lowCount * 1;
    const maxWeight = vulnerabilities.length * 4;
    
    return Math.max(0, Math.round(100 - (totalWeight / maxWeight) * 100));
  }

  /**
   * Calculate risk distribution
   */
  calculateRiskDistribution(vulnerabilities) {
    const distribution = {
      Critical: 0,
      High: 0,
      Medium: 0,
      Low: 0
    };

    vulnerabilities.forEach(vuln => {
      if (distribution.hasOwnProperty(vuln.risk)) {
        distribution[vuln.risk]++;
      }
    });

    return distribution;
  }

  /**
   * Export report to PDF
   */
  async exportReportToPDF(scanId) {
    try {
      const reportsResult = await this.getScanReports(scanId);
      if (!reportsResult.success) {
        throw new Error(reportsResult.message);
      }

      // In real implementation, you'd generate actual PDF
      // For now, return mock PDF data
      return {
        success: true,
        filename: `DefendSphere_Report_${scanId}.pdf`,
        data: 'Mock PDF data - in real implementation this would be actual PDF content'
      };

    } catch (error) {
      console.error('❌ Failed to export report to PDF:', error.message);
      return {
        success: false,
        message: `Failed to export PDF: ${error.message}`
      };
    }
  }

  /**
   * Export report to Excel
   */
  async exportReportToExcel(scanId) {
    try {
      const reportsResult = await this.getScanReports(scanId);
      if (!reportsResult.success) {
        throw new Error(reportsResult.message);
      }

      // In real implementation, you'd generate actual Excel
      // For now, return mock Excel data
      return {
        success: true,
        filename: `DefendSphere_Report_${scanId}.xlsx`,
        data: 'Mock Excel data - in real implementation this would be actual Excel content'
      };

    } catch (error) {
      console.error('❌ Failed to export report to Excel:', error.message);
      return {
        success: false,
        message: `Failed to export Excel: ${error.message}`
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