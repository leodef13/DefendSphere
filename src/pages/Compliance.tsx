import React from 'react'
import { Card, CardContent, CardHeader } from '../components/ui'
import { ShieldCheck, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

export default function Compliance() {
  const frameworks = [
    {
      name: 'ISO 27001',
      status: 'compliant',
      lastAudit: '2024-01-15',
      nextAudit: '2025-01-15',
      score: 95,
      description: 'Information Security Management System'
    },
    {
      name: 'SOC 2 Type II',
      status: 'compliant',
      lastAudit: '2024-03-20',
      nextAudit: '2025-03-20',
      score: 92,
      description: 'Security, Availability, and Confidentiality'
    },
    {
      name: 'GDPR',
      status: 'compliant',
      lastAudit: '2024-02-10',
      nextAudit: '2024-08-10',
      score: 88,
      description: 'General Data Protection Regulation'
    },
    {
      name: 'PCI DSS',
      status: 'in-progress',
      lastAudit: '2024-01-30',
      nextAudit: '2024-07-30',
      score: 75,
      description: 'Payment Card Industry Data Security Standard'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'in-progress':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'non-compliant':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'non-compliant':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Compliance Management
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-neutral-400">
          Monitor and manage compliance with security standards and regulations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Compliant Frameworks</h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-300">3</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">out of 4 total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <ShieldCheck className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Overall Score</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-300">87.5%</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">compliance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Next Audit</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600 dark:text-orange-300">30</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">days away</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Compliance Frameworks</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Framework</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="text-left px-4 py-2 font-medium">Score</th>
                  <th className="text-left px-4 py-2 font-medium">Last Audit</th>
                  <th className="text-left px-4 py-2 font-medium">Next Audit</th>
                  <th className="text-left px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {frameworks.map((framework, index) => (
                  <tr key={index} className="border-t border-gray-100 dark:border-neutral-800">
                    <td className="px-4 py-2 font-medium">{framework.name}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(framework.status)}`}>
                        {getStatusIcon(framework.status)}
                        {framework.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{framework.score}%</span>
                        <div className="w-16 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${framework.score}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">{framework.lastAudit}</td>
                    <td className="px-4 py-2">{framework.nextAudit}</td>
                    <td className="px-4 py-2 text-gray-600 dark:text-neutral-400">{framework.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Findings</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800 dark:text-green-200">Access Control Updated</p>
                  <p className="text-xs text-green-700 dark:text-green-300">Multi-factor authentication implemented for all admin accounts</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Data Retention Policy</p>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">Policy review scheduled for next quarter</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Actions</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">PCI DSS Assessment</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Due in 30 days</p>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-300">High Priority</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Annual Security Review</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Due in 60 days</p>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">Medium Priority</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}