import MetricCard from '../components/MetricCard'
import { Card, CardContent, CardHeader } from '../components/ui'
import { metrics, threatsOverTime, threatTypes, recentIncidents } from '../data/mockData'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useI18n } from '../i18n'

const PIE_COLORS = ['#2563eb', '#16a34a', '#ef4444', '#f59e0b']

export default function Dashboard() {
  const { t } = useI18n()
  
  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.title} title={m.title} value={m.value} icon={m.icon} />)
        )}
      </section>

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


