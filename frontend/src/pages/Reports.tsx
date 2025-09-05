import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { API_ENDPOINTS } from '../config/api'
import { useAuth } from '../components/AuthProvider'
import { useI18n } from '../i18n'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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
  const { token } = useAuth()
  const [summary, setSummary] = useState<ReportSummary | null>(null)
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReportData()
  }, [])

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