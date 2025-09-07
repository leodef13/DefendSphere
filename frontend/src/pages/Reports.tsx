import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { API_ENDPOINTS } from '../config/api'
import { useAuth } from '../components/AuthProvider'
import { useI18n } from '../i18n'
import scanService, { type ScanStatus, type ScanReport } from '../services/scanService'
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
  const [scanReports, setScanReports] = useState<ScanReport[]>([])
  const [activeScan, setActiveScan] = useState<ScanStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const imageBase = '/reports/organizations/CompanyLLDL'

  const isCompanyLLD = Array.isArray(user?.organizations) && user!.organizations!.includes('Company LLD')

  useEffect(() => {
    fetchReportData()
    if (isCompanyLLD) {
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
      const history = await scanService.getScanHistory()
      if (history.length > 0) {
        const latestScan = history[0]
        setActiveScan(latestScan)
        if (latestScan.status === 'completed') {
          const report = await scanService.getScanReport(latestScan.scanId)
          if (report) {
            setScanReports([report])
          }
        }
      }
    } catch (error) {
      console.error('Failed to check active scan:', error)
    }
  }

  const downloadScanReport = async (scanId: string, format: 'pdf' | 'excel') => {
    try {
      const result = format === 'pdf' 
        ? await scanService.exportToPDF(scanId)
        : await scanService.exportToExcel(scanId)
      
      if (result.success && result.data) {
        // Create downloadable content
        const blob = new Blob([result.data], { 
          type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = result.filename || `scan-report-${scanId}.${format === 'pdf' ? 'pdf' : 'xlsx'}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      } else {
        alert(result.message || 'Failed to download scan report')
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

  const healthPieData = summary ? [
    { name: 'Healthy', value: Math.round(summary.totalAssets * (summary.securityHealth / 100)), color: '#10B981' },
    { name: 'Vulnerable', value: summary.totalAssets - Math.round(summary.totalAssets * (summary.securityHealth / 100)), color: '#DC2626' }
  ] : []

  const assetsPieData = summary ? [
    { name: 'Assets', value: summary.totalAssets, color: '#3B82F6' }
  ] : []

  if (loading) return <div className="p-6">Loading report data...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Security Report - Company LLD Analysis</h1>
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
      {isCompanyLLD && (activeScan || scanReports.length > 0) && (
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

      {/* Summary + Charts */}
      {summary && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Summary</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Summary table */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium">Metric</th>
                      <th className="text-left px-4 py-2 font-medium">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-100 dark:border-neutral-800">
                      <td className="px-4 py-2">Total systems/assets scanned</td>
                      <td className="px-4 py-2 font-medium">{summary.totalAssets}</td>
                    </tr>
                    <tr className="border-t border-gray-100 dark:border-neutral-800">
                      <td className="px-4 py-2">Total vulnerabilities detected</td>
                      <td className="px-4 py-2 font-medium">{summary.totalVulnerabilities}</td>
                    </tr>
                    <tr className="border-t border-gray-100 dark:border-neutral-800">
                      <td className="px-4 py-2">Risk Level distribution</td>
                      <td className="px-4 py-2">
                        Critical: {summary.riskDistribution.critical}, High: {summary.riskDistribution.high}, Medium: {summary.riskDistribution.medium}, Low: {summary.riskDistribution.low}
                      </td>
                    </tr>
                    <tr className="border-t border-gray-100 dark:border-neutral-800">
                      <td className="px-4 py-2">Security Health</td>
                      <td className="px-4 py-2 font-medium">{summary.securityHealth}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Risk Distribution Pie */}
                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={riskDistributionData} dataKey="value" nameKey="name" outerRadius={80} label>
                        {riskDistributionData.map((entry, index) => (
                          <Cell key={`risk-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center text-xs mt-2">Risk Level distribution</div>
                </div>

                {/* Security Health Pie */}
                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={healthPieData} dataKey="value" nameKey="name" outerRadius={80} label>
                        {healthPieData.map((entry, index) => (
                          <Cell key={`health-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center text-xs mt-2">Security Health</div>
                </div>

                {/* Assets Pie */}
                <div className="w-full h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={assetsPieData} dataKey="value" nameKey="name" outerRadius={80} label>
                        {assetsPieData.map((entry, index) => (
                          <Cell key={`assets-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center text-xs mt-2">Assets scanned</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Static Visualization for Company LLD */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Risk & Health Visualization</h3>
        </CardHeader>
        <CardContent>
          <div className="w-full flex items-center justify-center">
            <img src={`${imageBase}/Vulsecheal.png`} alt="Risk & Health Visualization" className="max-w-full object-contain metric-card" />
          </div>
        </CardContent>
      </Card>

      {/* Greenbone Scan Reports Section */}
      {isCompanyLLD && scanReports.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Greenbone Scan Reports</h3>
              <div className="flex gap-2">
                <Button
                  onClick={() => downloadScanReport(scanReports[0].id, 'pdf')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
                <Button
                  onClick={() => downloadScanReport(scanReports[0].id, 'excel')}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Excel
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {scanReports.map((report) => (
              <div key={report.id} className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">{report.name}</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Scan completed: {new Date(report.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {report.summary.totalVulnerabilities}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">Vulnerabilities</div>
                  </div>
                </div>

                {/* Scan Report Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-red-50 dark:bg-red-500/10 rounded-lg">
                    <div className="text-xl font-bold text-red-600 dark:text-red-400">
                      {report.summary.critical}
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300">Critical</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 dark:bg-orange-500/10 rounded-lg">
                    <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                      {report.summary.high}
                    </div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">High</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-500/10 rounded-lg">
                    <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                      {report.summary.medium}
                    </div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">Medium</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-500/10 rounded-lg">
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {report.summary.low}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300">Low</div>
                  </div>
                </div>

                {/* Scan Report Vulnerabilities */}
                {report.vulnerabilities.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium mb-2">Vulnerabilities Found:</h5>
                    <div className="space-y-2">
                      {report.vulnerabilities.slice(0, 5).map((vuln, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                          <div>
                            <div className="font-medium">{vuln.name}</div>
                            <div className="text-sm text-gray-600 dark:text-neutral-400">
                              {vuln.host} • {vuln.cve}
                            </div>
                          </div>
                          <span 
                            className="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"
                            style={{ 
                              backgroundColor: `${COLORS[vuln.riskLevel]}20`,
                              color: COLORS[vuln.riskLevel]
                            }}
                          >
                            {vuln.riskLevel}
                          </span>
                        </div>
                      ))}
                      {report.vulnerabilities.length > 5 && (
                        <div className="text-center text-sm text-gray-500 dark:text-neutral-400">
                          ... and {report.vulnerabilities.length - 5} more vulnerabilities
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

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