import React, { useState } from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { Truck, Shield, AlertTriangle, CheckCircle, Clock, Plus } from 'lucide-react'

export default function Suppliers() {
  const [selectedSupplier, setSelectedSupplier] = useState('')

  const suppliers = [
    {
      id: 'supplier-1',
      name: 'TechCorp Solutions',
      category: 'Software Development',
      status: 'approved',
      securityScore: 92,
      lastAssessment: '2024-02-15',
      nextAssessment: '2024-08-15',
      riskLevel: 'Low',
      contact: 'security@techcorp.com'
    },
    {
      id: 'supplier-2',
      name: 'CloudNet Services',
      category: 'Cloud Infrastructure',
      status: 'pending',
      securityScore: 78,
      lastAssessment: '2024-01-20',
      nextAssessment: '2024-07-20',
      riskLevel: 'Medium',
      contact: 'compliance@cloudnet.com'
    },
    {
      id: 'supplier-3',
      name: 'DataSecure Inc',
      category: 'Data Processing',
      status: 'approved',
      securityScore: 95,
      lastAssessment: '2024-03-01',
      nextAssessment: '2024-09-01',
      riskLevel: 'Low',
      contact: 'security@datasecure.com'
    },
    {
      id: 'supplier-4',
      name: 'NetworkPro',
      category: 'Network Services',
      status: 'review',
      securityScore: 65,
      lastAssessment: '2024-02-28',
      nextAssessment: '2024-08-28',
      riskLevel: 'High',
      contact: 'compliance@networkpro.com'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'review':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'review':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'High':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Supplier Management</h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Monitor and manage third-party supplier security and compliance
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Approved</h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-300">2</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Pending</h3>
            <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-300">1</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Under Review</h3>
            <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-300">1</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">suppliers</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Avg Security Score</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-300">82.5%</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">across all suppliers</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Supplier Directory</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Supplier</th>
                  <th className="text-left px-4 py-2 font-medium">Category</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="text-left px-4 py-2 font-medium">Security Score</th>
                  <th className="text-left px-4 py-2 font-medium">Risk Level</th>
                  <th className="text-left px-4 py-2 font-medium">Next Assessment</th>
                  <th className="text-left px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suppliers.map((supplier) => (
                  <tr 
                    key={supplier.id} 
                    className={`border-t border-gray-100 dark:border-neutral-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 ${
                      selectedSupplier === supplier.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => setSelectedSupplier(supplier.id)}
                  >
                    <td className="px-4 py-2">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{supplier.name}</div>
                        <div className="text-xs text-gray-500 dark:text-neutral-400">{supplier.contact}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2">{supplier.category}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(supplier.status)}`}>
                        {getStatusIcon(supplier.status)}
                        {supplier.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{supplier.securityScore}%</span>
                        <div className="w-16 bg-gray-200 dark:bg-neutral-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${supplier.securityScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(supplier.riskLevel)}`}>
                        {supplier.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-2">{supplier.nextAssessment}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Assess</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedSupplier && (
        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Supplier Details</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Security Assessment</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Data Protection</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">95%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Access Controls</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">88%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Incident Response</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Compliance</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">85%</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Activities</h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-neutral-400">
                    <span className="font-medium">Security Assessment</span> completed on {suppliers.find(s => s.id === selectedSupplier)?.lastAssessment}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-neutral-400">
                    <span className="font-medium">Risk Review</span> scheduled for next week
                  </div>
                  <div className="text-sm text-gray-600 dark:text-neutral-400">
                    <span className="font-medium">Contract Renewal</span> due in 3 months
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}