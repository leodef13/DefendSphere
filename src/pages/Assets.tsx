import React, { useState } from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { Database, Server, Laptop, Smartphone, Cloud, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

export default function Assets() {
  const [selectedAsset, setSelectedAsset] = useState('')

  const assets = [
    {
      id: 'asset-1',
      name: 'Web Application Server',
      type: 'Server',
      category: 'Infrastructure',
      status: 'active',
      riskLevel: 'Low',
      lastScan: '2024-03-15',
      nextScan: '2024-04-15',
      vulnerabilities: 2,
      location: 'Data Center A'
    },
    {
      id: 'asset-2',
      name: 'Customer Database',
      type: 'Database',
      category: 'Data',
      status: 'active',
      riskLevel: 'High',
      lastScan: '2024-03-10',
      nextScan: '2024-03-25',
      vulnerabilities: 5,
      location: 'Cloud - AWS'
    },
    {
      id: 'asset-3',
      name: 'Admin Workstations',
      type: 'Endpoint',
      category: 'Workstation',
      status: 'active',
      riskLevel: 'Medium',
      lastScan: '2024-03-12',
      nextScan: '2024-03-26',
      vulnerabilities: 3,
      location: 'Office Network'
    },
    {
      id: 'asset-4',
      name: 'Mobile Devices',
      type: 'Mobile',
      category: 'Endpoint',
      status: 'active',
      riskLevel: 'Medium',
      lastScan: '2024-03-08',
      nextScan: '2024-03-22',
      vulnerabilities: 4,
      location: 'Field Operations'
    }
  ]

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'Server':
        return <Server className="h-5 w-5" />
      case 'Database':
        return <Database className="h-5 w-5" />
      case 'Endpoint':
        return <Laptop className="h-5 w-5" />
      case 'Mobile':
        return <Smartphone className="h-5 w-5" />
      case 'Cloud':
        return <Cloud className="h-5 w-5" />
      default:
        return <Database className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
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

  const getVulnerabilityColor = (count: number) => {
    if (count === 0) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (count <= 3) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Asset Management</h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Monitor and manage digital assets and their security posture
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Add Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Database className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Total Assets</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-300">4</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">managed assets</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Active Assets</h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-300">4</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Vulnerabilities</h3>
            <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-300">14</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">total found</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Security Score</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600 dark:text-purple-300">78%</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">overall rating</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Asset Inventory</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Asset</th>
                  <th className="text-left px-4 py-2 font-medium">Type</th>
                  <th className="text-left px-4 py-2 font-medium">Category</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="text-left px-4 py-2 font-medium">Risk Level</th>
                  <th className="text-left px-4 py-2 font-medium">Vulnerabilities</th>
                  <th className="text-left px-4 py-2 font-medium">Next Scan</th>
                  <th className="text-left px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset) => (
                  <tr 
                    key={asset.id} 
                    className={`border-t border-gray-100 dark:border-neutral-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 ${
                      selectedAsset === asset.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => setSelectedAsset(asset.id)}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        {getAssetIcon(asset.type)}
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{asset.name}</div>
                          <div className="text-xs text-gray-500 dark:text-neutral-400">{asset.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">{asset.type}</td>
                    <td className="px-4 py-2">{asset.category}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(asset.status)}`}>
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(asset.riskLevel)}`}>
                        {asset.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVulnerabilityColor(asset.vulnerabilities)}`}>
                        {asset.vulnerabilities}
                      </span>
                    </td>
                    <td className="px-4 py-2">{asset.nextScan}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Scan</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedAsset && (
        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Asset Details</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Security Assessment</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Patch Level</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Up to date</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Access Controls</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Enabled</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Monitoring</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Active</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Backup Status</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Configured</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recent Activities</h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600 dark:text-neutral-400">
                    <span className="font-medium">Security Scan</span> completed on {assets.find(a => a.id === selectedAsset)?.lastScan}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-neutral-400">
                    <span className="font-medium">Vulnerability Assessment</span> scheduled for next week
                  </div>
                  <div className="text-sm text-gray-600 dark:text-neutral-400">
                    <span className="font-medium">Access Review</span> due in 2 weeks
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