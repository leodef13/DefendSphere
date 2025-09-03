import React, { useState } from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { FileText, Download, Calendar, Filter, BarChart3, TrendingUp, Shield } from 'lucide-react'

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState('')
  const [dateRange, setDateRange] = useState('7d')

  const reportTypes = [
    {
      id: 'security-overview',
      title: 'Security Overview',
      description: 'Comprehensive security status and metrics',
      icon: Shield,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
    },
    {
      id: 'threat-analysis',
      title: 'Threat Analysis',
      description: 'Detailed threat intelligence and patterns',
      icon: TrendingUp,
      color: 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300'
    },
    {
      id: 'incident-summary',
      title: 'Incident Summary',
      description: 'Security incidents and response metrics',
      icon: BarChart3,
      color: 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300'
    },
    {
      id: 'compliance-report',
      title: 'Compliance Report',
      description: 'Regulatory compliance status and findings',
      icon: FileText,
      color: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
    }
  ]

  const generateReport = () => {
    if (!selectedReport) return
    // Simulate report generation
    console.log(`Generating ${selectedReport} report for ${dateRange}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Generate and download security reports
          </p>
        </div>
        <Button
          onClick={generateReport}
          disabled={!selectedReport}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Generate Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon
          return (
            <Card
              key={report.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedReport === report.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedReport(report.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`mx-auto h-12 w-12 rounded-full ${report.color} flex items-center justify-center mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  {report.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-neutral-400">
                  {report.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedReport && (
        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Report Configuration</h3>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Date Range
                </label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-gray-900 dark:text-white"
                >
                  <option value="1d">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                  <option value="custom">Custom range</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Report Format
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-900 text-gray-900 dark:text-white">
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                onClick={generateReport}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Generate Report
              </Button>
              <Button variant="outline" onClick={() => setSelectedReport('')}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Reports</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Report Name</th>
                  <th className="text-left px-4 py-2 font-medium">Generated</th>
                  <th className="text-left px-4 py-2 font-medium">Format</th>
                  <th className="text-left px-4 py-2 font-medium">Size</th>
                  <th className="text-left px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-100 dark:border-neutral-800">
                  <td className="px-4 py-2">Security Overview - Q1 2024</td>
                  <td className="px-4 py-2">2 days ago</td>
                  <td className="px-4 py-2">PDF</td>
                  <td className="px-4 py-2">2.4 MB</td>
                  <td className="px-4 py-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </td>
                </tr>
                <tr className="border-t border-gray-100 dark:border-neutral-800">
                  <td className="px-4 py-2">Threat Analysis - March 2024</td>
                  <td className="px-4 py-2">1 week ago</td>
                  <td className="px-4 py-2">Excel</td>
                  <td className="px-4 py-2">1.8 MB</td>
                  <td className="px-4 py-2">
                    <Button size="sm" variant="outline" className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}