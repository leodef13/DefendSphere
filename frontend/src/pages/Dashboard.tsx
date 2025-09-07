import React, { useState, useEffect } from 'react'
import MetricCard from '../components/MetricCard'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { metrics, threatsOverTime, threatTypes, recentIncidents } from '../data/mockData'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useI18n } from '../i18n'
import { useAuth } from '../components/AuthProvider'
import { API_ENDPOINTS } from '../config/api'
import scanService, { type ScanStatus } from '../services/scanService'
import { Play, CheckCircle, AlertCircle, Clock, X, Shield, Server, Users, Building2 } from 'lucide-react'

const PIE_COLORS = ['#2563eb', '#16a34a', '#ef4444', '#f59e0b']

export default function Dashboard() {
  const { t } = useI18n()
  const { token, user } = useAuth()
  const [reportData, setReportData] = useState<any>(null)
  const [adminSummary, setAdminSummary] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [userAssets, setUserAssets] = useState<any[]>([])
  const [activeScan, setActiveScan] = useState<ScanStatus | null>(null)
  const [scanning, setScanning] = useState(false)
  const [scanStatus, setScanStatus] = useState<string | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanMessage, setScanMessage] = useState('')
  const [hasAssets, setHasAssets] = useState(false)
  const imageBase = '/reports/organizations/CompanyLLDL'

  const isCompanyLLD = Array.isArray(user?.organizations) && user!.organizations!.includes('Company LLD')

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminSummary()
    }
    if (isCompanyLLD) {
      fetchReportData()
      fetchUserAssets()
      checkActiveScan()
    } else {
      setLoading(false)
    }
  }, [user])
  const fetchAdminSummary = async () => {
    try {
      const res = await fetch(API_ENDPOINTS.ADMIN_SUMMARY, { headers: { 'Authorization': `Bearer ${token}` } })
      if (res.ok) {
        const data = await res.json()
        setAdminSummary(data)
      }
    } catch (e) {}
  }


  const fetchReportData = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.REPORTS_SUMMARY, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setReportData(data.summary)
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserAssets = async () => {
    try {
      const result = await scanService.getUserAssets()
      if (result.success && result.assets) {
        setUserAssets(result.assets)
        setHasAssets(result.assets.length > 0)
      } else {
        // Fallback to mock assets for user1
        setUserAssets([{
          id: '1',
          name: 'company.ltd',
          domain: 'company.ltd',
          ip: '116.203.242.207',
          type: 'Web Server',
          environment: 'Production'
        }])
        setHasAssets(true)
      }
    } catch (error) {
      console.error('Failed to fetch user assets:', error)
      // Fallback to mock assets for user1
      setUserAssets([{
        id: '1',
        name: 'company.ltd',
        domain: 'company.ltd',
        ip: '116.203.242.207',
        type: 'Web Server',
        environment: 'Production'
      }])
      setHasAssets(true)
    }
  }

  const checkActiveScan = async () => {
    // For now, we'll skip checking active scans as we don't have that endpoint yet
    // This can be implemented later when we add scan persistence
  }

  const startScan = async () => {
    try {
      setScanning(true)
      setScanStatus('starting')
      setScanProgress(0)
      setScanMessage('Starting scan...')

      const result = await scanService.startScan(userAssets)
      
      if (result.success && result.scanId) {
        setActiveScan({
          scanId: result.scanId,
          userId: user?.id || '',
          taskId: '',
          targetId: '',
          status: 'queued',
          startTime: new Date().toISOString(),
          progress: 0,
          assets: userAssets
        })
        setScanStatus('running')
        setScanMessage('Scan started successfully')
        // Start polling for status
        pollScanStatus(result.scanId)
      } else {
        setScanStatus('error')
        setScanMessage(result.error || result.message || 'Failed to start scan')
      }
    } catch (error) {
      console.error('Failed to start scan:', error)
      setScanStatus('error')
      setScanMessage('Failed to start scan')
    } finally {
      setScanning(false)
    }
  }

  const pollScanStatus = async (scanId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        const result = await scanService.getScanStatus(scanId)
        
        if (result.success && result.scan) {
          const scan = result.scan
          setActiveScan(scan)
          setScanStatus(scan.status)
          setScanProgress(scan.progress)
          setScanMessage(`Scan ${scan.status} - ${scan.progress}%`)

          if (scan.status === 'completed' || scan.status === 'failed') {
            clearInterval(pollInterval)
            if (scan.status === 'completed') {
              // Update user assets with scan results
              await scanService.updateUserAssets(scanId)
              // Refresh report data with new scan results
              fetchReportData()
              setScanMessage('Scan completed successfully')
            } else {
              setScanMessage('Scan failed')
            }
          }
        } else {
          console.error('Failed to get scan status:', result.error)
          clearInterval(pollInterval)
          setScanStatus('error')
          setScanMessage('Failed to get scan status')
        }
      } catch (error) {
        console.error('Failed to poll scan status:', error)
        clearInterval(pollInterval)
        setScanStatus('error')
        setScanMessage('Failed to get scan status')
      }
    }, 10000) // Poll every 10 seconds
  }


  // Security Health data for user1
  const securityHealthData = reportData ? [
    { name: 'Secure', value: reportData.securityHealth, color: '#10B981' },
    { name: 'At Risk', value: 100 - reportData.securityHealth, color: '#EF4444' }
  ] : []

  // Problem distribution data
  const problemData = reportData ? [
    { name: 'Critical', value: reportData.riskDistribution.critical, color: '#8B0000' },
    { name: 'High', value: reportData.riskDistribution.high, color: '#DC2626' },
    { name: 'Medium', value: reportData.riskDistribution.medium, color: '#F59E0B' },
    { name: 'Low', value: reportData.riskDistribution.low, color: '#10B981' }
  ] : []

  if (loading) return <div className="p-6">Loading dashboard...</div>
  
  return (
    <div className="space-y-6">
      {/* Scan Control Section for Company LLD users */}
      {isCompanyLLD && hasAssets && (
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-900">Запустить скан активов</h3>
                  <p className="text-sm text-blue-700">
                    {userAssets.length} актив(ов) доступно для сканирования
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {scanStatus && (
                  <div className="flex items-center gap-2">
                    {scanStatus === 'completed' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {scanStatus === 'running' && <Clock className="h-5 w-5 text-blue-600 animate-spin" />}
                    {scanStatus === 'error' && <AlertCircle className="h-5 w-5 text-red-600" />}
                    {scanStatus === 'cancelled' && <X className="h-5 w-5 text-gray-600" />}
                    <span className="text-sm font-medium">
                      {scanStatus === 'completed' && 'Завершено'}
                      {scanStatus === 'running' && 'Выполняется'}
                      {scanStatus === 'error' && 'Ошибка'}
                      {scanStatus === 'cancelled' && 'Отменено'}
                      {scanStatus === 'starting' && 'Запуск'}
                    </span>
                  </div>
                )}
                <Button
                  onClick={startScan}
                  disabled={scanning || scanStatus === 'running' || activeScan !== null}
                  className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  {scanning ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Запуск...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Запустить скан активов
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {/* Scan Progress */}
            {scanStatus && (scanStatus === 'running' || scanStatus === 'starting') && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-blue-700 mb-2">
                  <span>{scanMessage}</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {/* Scan Status Message */}
            {scanMessage && scanStatus !== 'running' && scanStatus !== 'starting' && (
              <div className="mt-4 p-3 rounded-lg bg-blue-100">
                <p className="text-sm text-blue-800">{scanMessage}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Security Health Section for Company LLD users */}
      {isCompanyLLD && reportData && (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4 metric-card">
          <Card className="col-span-2">
            <CardHeader className="p-4 pb-0">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">Total Security Health</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-40">
                <img src={`${imageBase}/total_security_health.png`} alt="Total Security Health" className="max-h-40 object-contain" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-0">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">Assets Monitoring</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-40">
                <img src={`${imageBase}/assets_monitoring.png`} alt="Assets Monitoring" className="max-h-40 object-contain" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-0">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">Critical Problems</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-40">
                <img src={`${imageBase}/critical_problems.png`} alt="Critical Problems" className="max-h-40 object-contain" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-0">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">High Problems</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-40">
                <img src={`${imageBase}/high_problems.png`} alt="High Problems" className="max-h-40 object-contain" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-0">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">Medium Problems</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-40">
                <img src={`${imageBase}/medium_problems.png`} alt="Medium Problems" className="max-h-40 object-contain" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-0">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">Low Problems</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-40">
                <img src={`${imageBase}/low_problems.png`} alt="Low Problems" className="max-h-40 object-contain" />
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Admin Home: metrics, table and charts */}
      {user?.role === 'admin' && adminSummary && (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
            <MetricCard title="Organizations" value={adminSummary.organizations} icon={Shield} />
            <MetricCard title="Total Users" value={Object.values(adminSummary.usersPerOrganization).reduce((a: any, b: any) => (a as number) + (b as number), 0)} icon={Users} />
            <MetricCard title="Total Assets" value={adminSummary.totalAssets} icon={Server} />
            <MetricCard title="Total Suppliers" value={adminSummary.totalSuppliers} icon={Building2} />
            <MetricCard title="Orgs with Assets" value={Object.keys(adminSummary.assetsPerOrganization).length} icon={Building2} />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <Card>
              <CardHeader className="p-4 pb-0"><h3 className="text-sm font-medium">Users per Organization</h3></CardHeader>
              <CardContent className="p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={Object.entries(adminSummary.usersPerOrganization).map(([name, value]: any) => ({ name, value }))} dataKey="value" nameKey="name" outerRadius={90}>
                      {Object.keys(adminSummary.usersPerOrganization).map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4 pb-0"><h3 className="text-sm font-medium">Assets per Organization</h3></CardHeader>
              <CardContent className="p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={Object.entries(adminSummary.assetsPerOrganization).map(([name, value]: any) => ({ name, value }))} dataKey="value" nameKey="name" outerRadius={90}>
                      {Object.keys(adminSummary.assetsPerOrganization).map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="p-4 pb-0"><h3 className="text-sm font-medium">Suppliers per Organization</h3></CardHeader>
              <CardContent className="p-4 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={Object.entries(adminSummary.suppliersPerOrganization || {}).map(([name, value]: any) => ({ name, value }))} dataKey="value" nameKey="name" outerRadius={90}>
                      {Object.keys(adminSummary.suppliersPerOrganization || {}).map((_, idx) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader className="p-4 pb-0"><h3 className="text-sm font-medium">Organizations Summary</h3></CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Organization</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Assets</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Suppliers</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.keys(adminSummary.usersPerOrganization).map((org) => (
                        <tr key={org} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{org}</td>
                          <td className="px-4 py-2">{adminSummary.usersPerOrganization[org]}</td>
                          <td className="px-4 py-2">{adminSummary.assetsPerOrganization[org] || 0}</td>
                          <td className="px-4 py-2">{(adminSummary.suppliersPerOrganization || {})[org] || 0}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50 font-semibold">
                        <td className="px-4 py-2">Total</td>
                        <td className="px-4 py-2">{Object.values(adminSummary.usersPerOrganization).reduce((a: any, b: any) => (a as number) + (b as number), 0)}</td>
                        <td className="px-4 py-2">{adminSummary.totalAssets}</td>
                        <td className="px-4 py-2">{adminSummary.totalSuppliers}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        </>
      )}

      {/* Threats/Incidents sections removed as requested */}
    </div>
  )
}


