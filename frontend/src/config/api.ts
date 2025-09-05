// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  ME: `${API_BASE_URL}/api/auth/me`,
  HEALTH: `${API_BASE_URL}/api/health`,
  DASHBOARD: `${API_BASE_URL}/api/dashboard`,
  ASSISTANT: `${API_BASE_URL}/api/assistant`,
  ASSETS: `${API_BASE_URL}/api/assets`,
  COMPLIANCE: `${API_BASE_URL}/api/compliance`,
  CUSTOMER_TRUST: `${API_BASE_URL}/api/customer-trust`,
  SUPPLIERS: `${API_BASE_URL}/api/suppliers`,
  REPORTS: `${API_BASE_URL}/api/reports`,
  REPORTS_SUMMARY: `${API_BASE_URL}/api/reports/summary`,
  REPORTS_VULNERABILITIES: `${API_BASE_URL}/api/reports/vulnerabilities`,
  REPORTS_ASSETS: `${API_BASE_URL}/api/reports/assets`,
  REPORTS_PROFILE: `${API_BASE_URL}/api/reports/profile`,
  REPORTS_COMPLIANCE: `${API_BASE_URL}/api/reports/compliance`,
  REPORTS_FULL: `${API_BASE_URL}/api/reports/full`,
  REPORTS_EXPORT_PDF: `${API_BASE_URL}/api/reports/export/pdf`,
  REPORTS_EXPORT_EXCEL: `${API_BASE_URL}/api/reports/export/excel`,
  STARTER_GUIDE: `${API_BASE_URL}/api/starter-guide`,
  INTEGRATIONS: `${API_BASE_URL}/api/integrations`,
  // Scan endpoints
  SCAN_ASSETS: `${API_BASE_URL}/api/scan/assets`,
  SCAN_START: `${API_BASE_URL}/api/scan/start`,
  SCAN_STATUS: (scanId: string) => `${API_BASE_URL}/api/scan/status/${scanId}`,
  SCAN_RESULTS: (scanId: string) => `${API_BASE_URL}/api/scan/results/${scanId}`,
  SCAN_HISTORY: `${API_BASE_URL}/api/scan/history`,
  SCAN_TEST_CONNECTION: `${API_BASE_URL}/api/scan/test-connection`,
  SCAN_CANCEL: (scanId: string) => `${API_BASE_URL}/api/scan/cancel/${scanId}`,
  // Admin endpoints
  ADMIN_USERS: `${API_BASE_URL}/api/admin/users`,
  ADMIN_USER: (username: string) => `${API_BASE_URL}/api/admin/users/${username}`,
}

export default API_BASE_URL