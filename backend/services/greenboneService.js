const redis = require('redis');

class GreenboneService {
  constructor() {
    this.gmp = null;
    this.redisClient = null;
    this.isConnected = false;
    this.init();
  }

  async init() {
    try {
      // Initialize Redis client
      this.redisClient = redis.createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379'
      });
      await this.redisClient.connect();
      console.log('GreenboneService: Redis connected');
    } catch (error) {
      console.error('GreenboneService: Redis connection failed:', error);
    }
  }

  /**
   * Connect to Greenbone GVM API (Mock implementation)
   * Note: In production, this would use actual gvm-tools Python library
   */
  async connectToGreenbone() {
    try {
      // Mock connection - in production this would use gvm-tools
      const config = {
        host: process.env.GREENBONE_HOST || '217.65.144.232',
        port: process.env.GREENBONE_PORT || 9392,
        username: process.env.GREENBONE_USERNAME || 'admin',
        password: process.env.GREENBONE_PASSWORD || 'admin',
        protocol: 'http'
      };

      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.isConnected = true;
      console.log('GreenboneService: Connected to Greenbone GVM (Mock)');
      return { success: true, message: 'Connected to Greenbone GVM' };
    } catch (error) {
      console.error('GreenboneService: Connection failed:', error);
      this.isConnected = false;
      return { success: false, message: 'Failed to connect to Greenbone GVM', error: error.message };
    }
  }

  /**
   * Start scan for given assets (Mock implementation)
   */
  async startScan(assets, userId) {
    try {
      if (!this.isConnected) {
        const connectionResult = await this.connectToGreenbone();
        if (!connectionResult.success) {
          return connectionResult;
        }
      }

      const scanId = `scan_${userId}_${Date.now()}`;
      
      // Mock scan data
      const scanData = {
        scanId,
        userId,
        taskId: `task_${Date.now()}`,
        targetId: `target_${Date.now()}`,
        assets,
        status: 'running',
        startTime: new Date().toISOString(),
        progress: 0
      };

      await this.redisClient.setEx(`scan:${scanId}`, 3600, JSON.stringify(scanData));
      await this.redisClient.setEx(`scan:user:${userId}`, 3600, scanId);

      console.log(`GreenboneService: Scan started with ID ${scanId} (Mock)`);
      
      // Start monitoring scan progress (mock)
      this.monitorScan(scanId, scanData.taskId);

      return {
        success: true,
        scanId,
        message: 'Scan started successfully',
        data: scanData
      };

    } catch (error) {
      console.error('GreenboneService: Start scan failed:', error);
      return {
        success: false,
        message: 'Failed to start scan',
        error: error.message
      };
    }
  }

  /**
   * Monitor scan progress (Mock implementation)
   */
  async monitorScan(scanId, taskId) {
    try {
      let progress = 0;
      const checkInterval = setInterval(async () => {
        try {
          // Mock progress update
          progress += Math.random() * 20; // Random progress increment
          if (progress > 100) progress = 100;

          // Update scan status in Redis
          const scanData = await this.redisClient.get(`scan:${scanId}`);
          if (scanData) {
            const data = JSON.parse(scanData);
            data.progress = Math.round(progress);
            data.status = progress >= 100 ? 'completed' : 'running';
            
            if (progress >= 100) {
              data.endTime = new Date().toISOString();
              data.status = 'completed';
              clearInterval(checkInterval);
              
              // Generate mock reports when scan is completed
              await this.generateMockReports(scanId, data.assets);
            }
            
            await this.redisClient.setEx(`scan:${scanId}`, 3600, JSON.stringify(data));
          }
        } catch (error) {
          console.error('GreenboneService: Monitor scan error:', error);
        }
      }, 5000); // Check every 5 seconds for faster demo

    } catch (error) {
      console.error('GreenboneService: Monitor scan failed:', error);
    }
  }

  /**
   * Generate mock reports for completed scan
   */
  async generateMockReports(scanId, assets) {
    try {
      const mockVulnerabilities = [
        {
          id: 'vuln_001',
          name: 'SSH Weak Encryption',
          severity: 7.5,
          cvss: 7.5,
          cve: 'CVE-2023-1234',
          description: 'SSH server uses weak encryption algorithms',
          solution: 'Update SSH configuration to use stronger encryption',
          host: assets[0]?.ip || assets[0]?.domain || '192.168.1.1',
          port: '22',
          nvt: 'SSH_WEAK_ENCRYPTION',
          timestamp: new Date().toISOString(),
          riskLevel: 'High'
        },
        {
          id: 'vuln_002',
          name: 'HTTP Server Information Disclosure',
          severity: 5.0,
          cvss: 5.0,
          cve: 'CVE-2023-5678',
          description: 'HTTP server discloses version information',
          solution: 'Configure server to hide version information',
          host: assets[0]?.ip || assets[0]?.domain || '192.168.1.1',
          port: '80',
          nvt: 'HTTP_VERSION_DISCLOSURE',
          timestamp: new Date().toISOString(),
          riskLevel: 'Medium'
        },
        {
          id: 'vuln_003',
          name: 'SSL/TLS Certificate Issues',
          severity: 4.0,
          cvss: 4.0,
          cve: 'CVE-2023-9012',
          description: 'SSL certificate has weak signature algorithm',
          solution: 'Update SSL certificate with stronger signature',
          host: assets[0]?.ip || assets[0]?.domain || '192.168.1.1',
          port: '443',
          nvt: 'SSL_WEAK_SIGNATURE',
          timestamp: new Date().toISOString(),
          riskLevel: 'Medium'
        }
      ];

      // Update scan data with mock reports
      const scanData = await this.redisClient.get(`scan:${scanId}`);
      if (scanData) {
        const data = JSON.parse(scanData);
        data.reports = mockVulnerabilities;
        data.reportCount = mockVulnerabilities.length;
        
        await this.redisClient.setEx(`scan:${scanId}`, 3600, JSON.stringify(data));
        console.log(`GreenboneService: Mock reports generated for scan ${scanId}`);
      }

    } catch (error) {
      console.error('GreenboneService: Generate mock reports failed:', error);
    }
  }

  /**
   * Get reports for completed scan
   */
  async getReports(scanId) {
    try {
      const scanData = await this.redisClient.get(`scan:${scanId}`);
      if (!scanData) {
        throw new Error('Scan data not found');
      }

      const data = JSON.parse(scanData);
      
      console.log(`GreenboneService: Reports retrieved for scan ${scanId}`);
      
      return {
        success: true,
        reports: data.reports || [],
        message: 'Reports retrieved successfully'
      };

    } catch (error) {
      console.error('GreenboneService: Get reports failed:', error);
      return {
        success: false,
        message: 'Failed to get reports',
        error: error.message
      };
    }
  }

  /**
   * Parse reports and extract asset/vulnerability data
   */
  async parseReports(reportData, assets) {
    try {
      const parsedReports = [];
      
      for (const result of reportData) {
        const report = {
          id: result.id,
          name: result.name,
          severity: result.severity,
          cvss: result.cvss,
          cve: result.cve,
          description: result.description,
          solution: result.solution,
          host: result.host,
          port: result.port,
          nvt: result.nvt,
          timestamp: result.timestamp,
          riskLevel: this.getRiskLevel(result.severity)
        };

        parsedReports.push(report);
      }

      // Group by asset and calculate risk levels
      const assetRiskData = {};
      
      for (const asset of assets) {
        const assetKey = asset.ip || asset.domain;
        assetRiskData[assetKey] = {
          name: asset.name || asset.domain,
          ip: asset.ip,
          domain: asset.domain,
          vulnerabilities: parsedReports.filter(r => r.host === assetKey),
          riskLevel: 'Low',
          compliance: 100
        };

        // Calculate risk level based on vulnerabilities
        const vulnerabilities = assetRiskData[assetKey].vulnerabilities;
        if (vulnerabilities.some(v => v.riskLevel === 'Critical')) {
          assetRiskData[assetKey].riskLevel = 'Critical';
          assetRiskData[assetKey].compliance = 25;
        } else if (vulnerabilities.some(v => v.riskLevel === 'High')) {
          assetRiskData[assetKey].riskLevel = 'High';
          assetRiskData[assetKey].compliance = 50;
        } else if (vulnerabilities.some(v => v.riskLevel === 'Medium')) {
          assetRiskData[assetKey].riskLevel = 'Medium';
          assetRiskData[assetKey].compliance = 75;
        }
      }

      // Save asset risk data to Redis
      for (const [assetKey, data] of Object.entries(assetRiskData)) {
        await this.redisClient.setEx(`asset:risk:${assetKey}`, 3600, JSON.stringify(data));
      }

      return parsedReports;

    } catch (error) {
      console.error('GreenboneService: Parse reports failed:', error);
      return [];
    }
  }

  /**
   * Get risk level from severity
   */
  getRiskLevel(severity) {
    if (severity >= 9.0) return 'Critical';
    if (severity >= 7.0) return 'High';
    if (severity >= 4.0) return 'Medium';
    return 'Low';
  }

  /**
   * Get scan status
   */
  async getScanStatus(scanId) {
    try {
      const scanData = await this.redisClient.get(`scan:${scanId}`);
      if (!scanData) {
        return {
          success: false,
          message: 'Scan not found'
        };
      }

      const data = JSON.parse(scanData);
      return {
        success: true,
        data
      };

    } catch (error) {
      console.error('GreenboneService: Get scan status failed:', error);
      return {
        success: false,
        message: 'Failed to get scan status',
        error: error.message
      };
    }
  }

  /**
   * Get user's active scan
   */
  async getUserActiveScan(userId) {
    try {
      const scanId = await this.redisClient.get(`scan:user:${userId}`);
      if (!scanId) {
        return {
          success: false,
          message: 'No active scan found'
        };
      }

      return await this.getScanStatus(scanId);

    } catch (error) {
      console.error('GreenboneService: Get user active scan failed:', error);
      return {
        success: false,
        message: 'Failed to get user active scan',
        error: error.message
      };
    }
  }

  /**
   * Disconnect from Greenbone
   */
  async disconnect() {
    try {
      if (this.gmp) {
        await this.gmp.disconnect();
        this.isConnected = false;
        console.log('GreenboneService: Disconnected from Greenbone GVM');
      }
    } catch (error) {
      console.error('GreenboneService: Disconnect failed:', error);
    }
  }
}

module.exports = new GreenboneService();