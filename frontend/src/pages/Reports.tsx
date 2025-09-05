import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { API_ENDPOINTS } from '../config/api'
import { useAuth } from '../components/AuthProvider'
import { useI18n } from '../i18n'
import scanService, { ScanData, VulnerabilityReport } from '../services/scanService'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

interface Vulnerability {
  id: string
  name: string
  cve: string
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low'
  cvss: number
  status: string
  description: string
  recommendation: string
  asset: string
  discovered: string
}

interface ReportSummary {
  totalAssets: number
  totalVulnerabilities: number
  riskDistribution: {
    critical: number
    high: number
    medium: number
    low: number
  }
  securityHealth: number
  complianceScore: number
}

const COLORS = {
  Critical: '#8B0000',
  High: '#DC2626',
  Medium: '#F59E0B',
  Low: '#10B981'
}

const Reports: React.FC = () => {
  const { t } = useI18n()
  const { token, user } = useAuth()
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [scanReports, setScanReports] = useState<VulnerabilityReport[]>([])
  const [activeScan, setActiveScan] = useState<ScanData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReportData()
    if (user?.username === 'user1') {
      checkActiveScan()
    }
  }, [user])

  const fetchReportData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [summaryRes, vulnerabilitiesRes] = await Promise.all([
        fetch(API_ENDPOINTS.REPORTS_SUMMARY, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(API_ENDPOINTS.REPORTS_VULNERABILITIES, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (!summaryRes.ok || !vulnerabilitiesRes.ok) {
        throw new Error('Failed to fetch report data')
      }

      const summaryData = await summaryRes.json()
      const vulnerabilitiesData = await vulnerabilitiesRes.json()

      setSummary(summaryData.summary)
      setVulnerabilities(vulnerabilitiesData.vulnerabilities)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.REPORTS_EXPORT_PDF, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      alert('PDF export initiated. Download will start shortly.')
    } catch (err) {
      alert('Failed to export PDF')
    }
  }

  const handleExportExcel = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.REPORTS_EXPORT_EXCEL, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      alert('Excel export initiated. Download will start shortly.')
    } catch (err) {
      alert('Failed to export Excel')
    }
  }

  const checkActiveScan = async () => {
    try {
      const result = await scanService.getActiveScan()
      if (result.success && result.data) {
        setActiveScan(result.data)
        if (result.data.status === 'completed' && result.data.reports) {
          setScanReports(result.data.reports)
        }
      }
    } catch (error) {
      console.error('Failed to check active scan:', error)
    }
  }

  const downloadScanReport = async (scanId: string) => {
    try {
      const result = await scanService.getScanReport(scanId)
      if (result.success && result.data) {
        // Create downloadable content
        const reportContent = JSON.stringify(result.data, null, 2)
        const blob = new Blob([reportContent], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `scan-report-${scanId}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Failed to download scan report:', error)
      alert('Failed to download scan report')
    }
  }

  const riskDistributionData = summary ? [
    { name: 'Critical', value: summary.riskDistribution.critical, color: COLORS.Critical },
    { name: 'High', value: summary.riskDistribution.high, color: COLORS.High },
    { name: 'Medium', value: summary.riskDistribution.medium, color: COLORS.Medium },
    { name: 'Low', value: summary.riskDistribution.low, color: COLORS.Low }
  ] : []

  const vulnerabilityCountData = summary ? [
    { category: 'Critical', count: summary.riskDistribution.critical },
    { category: 'High', count: summary.riskDistribution.high },
    { category: 'Medium', count: summary.riskDistribution.medium },
    { category: 'Low', count: summary.riskDistribution.low }
  ] : []

  if (loading) return <div className="p-6">Loading report data...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Security Report - MyRockShows Analysis</h1>
        <div className="flex gap-2">
          <Button onClick={handleExportPDF} variant="secondary">
            Export PDF
          </Button>
          <Button onClick={handleExportExcel} variant="secondary">
            Export Excel
          </Button>
        </div>
      </div>

      {/* Greenbone Scan Reports Section */}
      {user?.username === 'user1' && (activeScan || scanReports.length > 0) && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-green-800">Greenbone Scan Reports</h2>
              </div>
              {activeScan && (
                <div className="flex items-center gap-2">
                  {activeScan.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                  {activeScan.status === 'running' && <Clock className="h-4 w-4 text-blue-600 animate-spin" />}
                  <span className="text-sm text-green-700">
                    {activeScan.status === 'completed' && 'Scan Completed'}
                    {activeScan.status === 'running' && `Scan Running (${activeScan.progress}%)`}
                    {activeScan.status === 'failed' && 'Scan Failed'}
                  </span>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {activeScan && activeScan.status === 'completed' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{activeScan.assets?.length || 0}</div>
                    <div className="text-sm text-gray-600">Assets Scanned</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{activeScan.reportCount || 0}</div>
                    <div className="text-sm text-gray-600">Vulnerabilities Found</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {activeScan.startTime && activeScan.endTime 
                        ? Math.round((new Date(activeScan.endTime).getTime() - new Date(activeScan.startTime).getTime()) / 1000 / 60)
                        : 0} min
                    </div>
                    <div className="text-sm text-gray-600">Scan Duration</div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => downloadScanReport(activeScan.scanId)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Scan Report
                  </Button>
                </div>
              </div>
            )}
            
            {scanReports.length > 0 && (
              <div className="mt-4">
                <h3 className="text-md font-semibold text-green-800 mb-3">Recent Scan Results</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {scanReports.slice(0, 10).map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          report.riskLevel === 'Critical' ? 'bg-red-800' :
                          report.riskLevel === 'High' ? 'bg-red-600' :
                          report.riskLevel === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}></div>
                        <div>
                          <div className="font-medium text-sm">{report.name}</div>
                          <div className="text-xs text-gray-500">{report.host}:{report.port}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{report.riskLevel}</div>
                        <div className="text-xs text-gray-500">CVSS: {report.cvss}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{summary.totalAssets}</div>
              <div className="text-sm text-gray-600">Assets Scanned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{summary.totalVulnerabilities}</div>
              <div className="text-sm text-gray-600">Vulnerabilities Found</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{summary.securityHealth}%</div>
              <div className="text-sm text-gray-600">Security Health</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{summary.complianceScore}%</div>
              <div className="text-sm text-gray-600">Compliance Score</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Risk Distribution</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">Vulnerabilities by Category</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vulnerabilityCountData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vulnerabilities Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Detailed Vulnerabilities</h3>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Vulnerability</th>
                  <th className="text-left px-4 py-2 font-medium">CVE</th>
                  <th className="text-left px-4 py-2 font-medium">Risk Level</th>
                  <th className="text-left px-4 py-2 font-medium">CVSS</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="text-left px-4 py-2 font-medium">Asset</th>
                </tr>
              </thead>
              <tbody>
                {vulnerabilities.map((vuln) => (
                  <tr key={vuln.id} className="border-t border-gray-100 dark:border-neutral-800">
                    <td className="px-4 py-2">
                      <div className="font-medium">{vuln.name}</div>
                      <div className="text-xs text-gray-500">{vuln.description}</div>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs">{vuln.cve}</td>
                    <td className="px-4 py-2">
                      <span 
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium`}
                        style={{ 
                          backgroundColor: `${COLORS[vuln.riskLevel]}20`,
                          color: COLORS[vuln.riskLevel]
                        }}
                      >
                        {vuln.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono">{vuln.cvss}</td>
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300">
                        {vuln.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">{vuln.asset}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Reports