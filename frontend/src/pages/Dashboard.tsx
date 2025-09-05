import React, { useState, useEffect } from 'react'
import MetricCard from '../components/MetricCard'
import { Card, CardContent, CardHeader } from '../components/ui'
import { metrics, threatsOverTime, threatTypes, recentIncidents } from '../data/mockData'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useI18n } from '../i18n'
import { useAuth } from '../components/AuthProvider'
import { API_ENDPOINTS } from '../config/api'

const PIE_COLORS = ['#2563eb', '#16a34a', '#ef4444', '#f59e0b']

export default function Dashboard() {
  const { t } = useI18n()
  const { token, user } = useAuth()
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.username === 'user1') {
      fetchReportData()
    } else {
      setLoading(false)
    }
  }, [user])

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
      {/* Security Health Section for user1 */}
      {user?.username === 'user1' && reportData && (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
          <Card className="col-span-2">
            <CardHeader className="p-4 pb-0">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">Total Security Health</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={securityHealthData}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                      startAngle={90}
                      endAngle={450}
                    >
                      {securityHealthData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold">
                      {reportData.securityHealth}%
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-0">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">Assets Monitoring</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ name: 'Monitored', value: reportData.totalAssets, color: '#10B981' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                    >
                      <Cell fill="#10B981" />
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold">
                      {reportData.totalAssets}
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-0">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">Critical Problems</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ name: 'Critical', value: reportData.riskDistribution.critical, color: '#8B0000' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                    >
                      <Cell fill="#8B0000" />
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold">
                      {reportData.riskDistribution.critical}
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-0">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">High Problems</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ name: 'High', value: reportData.riskDistribution.high, color: '#DC2626' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                    >
                      <Cell fill="#DC2626" />
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold">
                      {reportData.riskDistribution.high}
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-0">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">Medium Problems</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ name: 'Medium', value: reportData.riskDistribution.medium, color: '#F59E0B' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                    >
                      <Cell fill="#F59E0B" />
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold">
                      {reportData.riskDistribution.medium}
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="p-4 pb-0">
              <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">Low Problems</h3>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-center h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ name: 'Low', value: reportData.riskDistribution.low, color: '#10B981' }]}
                      cx="50%"
                      cy="50%"
                      innerRadius={30}
                      outerRadius={50}
                      dataKey="value"
                    >
                      <Cell fill="#10B981" />
                    </Pie>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-lg font-bold">
                      {reportData.riskDistribution.low}
                    </text>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Default metrics for other users */}
      {user?.username !== 'user1' && (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <MetricCard key={m.title} title={m.title} value={m.value} icon={m.icon} />)
          )}
        </section>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">{t('dashboard.threatsOverTime')}</h3>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={threatsOverTime} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">{t('dashboard.threatTypes')}</h3>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={threatTypes} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={4}>
                  {threatTypes.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">{t('dashboard.recentIncidents')}</h3>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">{t('dashboard.time')}</th>
                  <th className="text-left px-4 py-2 font-medium">{t('dashboard.type')}</th>
                  <th className="text-left px-4 py-2 font-medium">{t('dashboard.severity')}</th>
                  <th className="text-left px-4 py-2 font-medium">{t('dashboard.status')}</th>
                </tr>
              </thead>
              <tbody>
                {recentIncidents.map((row, i) => (
                  <tr key={i} className="border-t border-gray-100 dark:border-neutral-800">
                    <td className="px-4 py-2">{row.time}</td>
                    <td className="px-4 py-2">{row.type}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${
                        row.severity === 'High'
                          ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
                          : row.severity === 'Medium'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                      }`}>
                        {row.severity === 'High' ? t('dashboard.high') : 
                         row.severity === 'Medium' ? t('dashboard.medium') : 
                         t('dashboard.low')}
                      </span>
                    </td>
                    <td className="px-4 py-2">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}


