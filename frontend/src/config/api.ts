// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://217.65.144.232:5000'

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  HEALTH: `${API_BASE_URL}/api/health`,
  DASHBOARD: `${API_BASE_URL}/api/dashboard`,
  ASSISTANT: `${API_BASE_URL}/api/assistant`,
  ASSETS: `${API_BASE_URL}/api/assets`,
  COMPLIANCE: `${API_BASE_URL}/api/compliance`,
  CUSTOMER_TRUST: `${API_BASE_URL}/api/customer-trust`,
  SUPPLIERS: `${API_BASE_URL}/api/suppliers`,
  REPORTS: `${API_BASE_URL}/api/reports`,
  STARTER_GUIDE: `${API_BASE_URL}/api/starter-guide`,
}

export default API_BASE_URL