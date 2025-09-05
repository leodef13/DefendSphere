// Report data for user1 based on analysis results
export const reportData = {
  user: 'user1',
  company: 'MyRockShows Ltd',
  reportDate: '2024-01-15',
  lastScan: '2024-01-15',
  
  // Summary data
  summary: {
    totalAssets: 1,
    totalVulnerabilities: 7,
    riskDistribution: {
      critical: 0,
      high: 3,
      medium: 3,
      low: 1
    },
    securityHealth: 75, // Percentage
    complianceScore: 75
  },

  // Assets data
  assets: [
    {
      id: 'asset-1',
      name: 'myrockshows.com',
      type: 'Web Server',
      environment: 'Production',
      ip: '116.203.242.207',
      assignedStandards: ['GDPR', 'NIS2'],
      compliancePercentage: 75,
      riskLevel: 'High',
      lastAssessment: '2024-01-15',
      vulnerabilities: {
        critical: 0,
        high: 3,
        medium: 3,
        low: 1
      }
    }
  ],

  // Vulnerabilities data
  vulnerabilities: [
    {
      id: 'vuln-1',
      name: 'SQL Injection Vulnerability',
      cve: 'CVE-2024-0001',
      riskLevel: 'High',
      cvss: 8.5,
      status: 'Open',
      description: 'SQL injection vulnerability in login form',
      recommendation: 'Implement parameterized queries and input validation',
      asset: 'myrockshows.com',
      discovered: '2024-01-15'
    },
    {
      id: 'vuln-2',
      name: 'Cross-Site Scripting (XSS)',
      cve: 'CVE-2024-0002',
      riskLevel: 'High',
      cvss: 7.8,
      status: 'Open',
      description: 'Reflected XSS in search functionality',
      recommendation: 'Implement proper output encoding and CSP headers',
      asset: 'myrockshows.com',
      discovered: '2024-01-15'
    },
    {
      id: 'vuln-3',
      name: 'Insecure Direct Object Reference',
      cve: 'CVE-2024-0003',
      riskLevel: 'High',
      cvss: 7.2,
      status: 'Open',
      description: 'Direct access to user data without authorization',
      recommendation: 'Implement proper access controls and authorization checks',
      asset: 'myrockshows.com',
      discovered: '2024-01-15'
    },
    {
      id: 'vuln-4',
      name: 'Weak Password Policy',
      cve: 'CVE-2024-0004',
      riskLevel: 'Medium',
      cvss: 5.5,
      status: 'Open',
      description: 'Password policy does not meet security standards',
      recommendation: 'Implement strong password requirements (min 12 chars, complexity)',
      asset: 'myrockshows.com',
      discovered: '2024-01-15'
    },
    {
      id: 'vuln-5',
      name: 'Missing Security Headers',
      cve: 'CVE-2024-0005',
      riskLevel: 'Medium',
      cvss: 4.8,
      status: 'Open',
      description: 'Missing security headers (HSTS, CSP, X-Frame-Options)',
      recommendation: 'Configure security headers in web server',
      asset: 'myrockshows.com',
      discovered: '2024-01-15'
    },
    {
      id: 'vuln-6',
      name: 'Outdated SSL/TLS Configuration',
      cve: 'CVE-2024-0006',
      riskLevel: 'Medium',
      cvss: 4.2,
      status: 'Open',
      description: 'SSL/TLS configuration allows weak ciphers',
      recommendation: 'Update SSL/TLS configuration to use strong ciphers only',
      asset: 'myrockshows.com',
      discovered: '2024-01-15'
    },
    {
      id: 'vuln-7',
      name: 'Information Disclosure',
      cve: 'CVE-2024-0007',
      riskLevel: 'Low',
      cvss: 3.1,
      status: 'Open',
      description: 'Server version information disclosed in headers',
      recommendation: 'Disable server version disclosure in HTTP headers',
      asset: 'myrockshows.com',
      discovered: '2024-01-15'
    }
  ],

  // User profile data from questionnaire
  userProfile: {
    companyName: 'MyRockShows Ltd',
    userName: 'user1',
    email: 'user1@myrockshows.com',
    phone: '+1-555-0123',
    registeredSystems: 1,
    recommendedStandards: ['GDPR', 'NIS2', 'DORA'],
    contacts: {
      dpo: {
        name: 'John Smith',
        email: 'dpo@myrockshows.com',
        phone: '+1-555-0124'
      },
      ciso: {
        name: 'Jane Doe',
        email: 'ciso@myrockshows.com',
        phone: '+1-555-0125'
      }
    }
  },

  // Compliance data
  compliance: {
    gdpr: {
      score: 75,
      status: 'Partially Compliant',
      issues: ['Data processing consent', 'Right to erasure implementation']
    },
    nis2: {
      score: 70,
      status: 'Partially Compliant',
      issues: ['Incident response procedures', 'Security monitoring']
    },
    dora: {
      score: 80,
      status: 'Mostly Compliant',
      issues: ['Third-party risk management']
    }
  }
}

export default reportData