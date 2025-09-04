import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { allIncidents, type Incident } from '../data/mockData'

const PAGE_SIZE = 10

export default function Incidents() {
  const [severity, setSeverity] = useState<'All' | Incident['severity']>('All')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    return severity === 'All' ? allIncidents : allIncidents.filter(i => i.severity === severity)
  }, [severity])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goTo(p: number) {
    setPage(Math.min(totalPages, Math.max(1, p)))
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap items-center gap-2 p-4">
          <span className="text-sm text-gray-600 dark:text-neutral-300">Severity:</span>
          {(['All', 'High', 'Medium', 'Low'] as const).map(s => (
            <button
              key={s}
              onClick={() => { setPage(1); setSeverity(s as any) }}
              className={`text-sm rounded-md px-3 py-1.5 border ${
                (severity === s)
                  ? 'bg-blue-600 text-white border-transparent'
                  : 'bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'
              }`}
            >
              {s}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">All Incidents</h3>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Time</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-left px-4 py-2 font-medium">Severity</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((row, i) => (
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
                      {row.severity}
                    </span>
                  </td>
                  <td className="px-4 py-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 dark:border-neutral-800">
            <span className="text-xs text-gray-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <Button onClick={() => goTo(page - 1)} disabled={page <= 1} className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700">Prev</Button>
              <Button onClick={() => goTo(page + 1)} disabled={page >= totalPages}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


