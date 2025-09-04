import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui'
import { 
  Download, 
  FileText, 
  ArrowLeft, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Server,
  Cloud,
  Database,
  Smartphone,
  Wifi,
  Monitor,
  Cpu,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'

interface Asset {
  id: string
  name: string
  type: string
  environment: string
  assignedStandards: string[]
  compliancePercentage: number
  riskLevel: 'High' | 'Medium' | 'Low' | 'Not Assessed'
  lastAssessment: string
  owner: string
  description: string
  ipUrl: string
}

interface AssetFilters {
  assetType: string
  environment: string
  standards: string
  riskLevel: string
  owner: string
}

export default function Assets() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [assets, setAssets] = useState<Asset[]>([])
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([])
  const [filters, setFilters] = useState<AssetFilters>({
    assetType: 'All Types',
    environment: 'All Environments',
    standards: 'All Standards',
    riskLevel: 'All Risk Levels',
    owner: 'All Owners'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof Asset>('lastAssessment')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)

  // Mock data
  useEffect(() => {
    const mockData: Asset[] = [
      {
        id: '1',
        name: 'Web Application Server',
        type: 'Servers',
        environment: 'Production',
        assignedStandards: ['GDPR', 'NIS2'],
        compliancePercentage: 85,
        riskLevel: 'Low',
        lastAssessment: '2 days ago',
        owner: 'John Smith',
        description: 'Main web application server hosting customer portal',
        ipUrl: '192.168.1.100'
      },
      {
        id: '2',
        name: 'Customer Database',
        type: 'Databases',
        environment: 'Production',
        assignedStandards: ['GDPR', 'ISO 27001'],
        compliancePercentage: 92,
        riskLevel: 'Low',
        lastAssessment: '1 week ago',
        owner: 'Maria Garcia',
        description: 'Primary customer data storage system',
        ipUrl: 'db.company.com'
      },
      {
        id: '3',
        name: 'Development Environment',
        type: 'Cloud Resources',
        environment: 'Development',
        assignedStandards: ['SOC2'],
        compliancePercentage: 45,
        riskLevel: 'High',
        lastAssessment: '3 weeks ago',
        owner: 'David Johnson',
        description: 'Development and testing environment',
        ipUrl: 'dev.company.com'
      },
      {
        id: '4',
        name: 'Network Firewall',
        type: 'Network Devices',
        environment: 'Production',
        assignedStandards: ['NIS2', 'PCI DSS'],
        compliancePercentage: 78,
        riskLevel: 'Medium',
        lastAssessment: '1 week ago',
        owner: 'Sarah Wilson',
        description: 'Primary network security firewall',
        ipUrl: '192.168.1.1'
      },
      {
        id: '5',
        name: 'Mobile App Backend',
        type: 'Applications',
        environment: 'Staging',
        assignedStandards: ['GDPR', 'SOC2'],
        compliancePercentage: 67,
        riskLevel: 'Medium',
        lastAssessment: '2 weeks ago',
        owner: 'Michael Brown',
        description: 'Backend API for mobile applications',
        ipUrl: 'api-staging.company.com'
      },
      {
        id: '6',
        name: 'IoT Sensors Network',
        type: 'IoT',
        environment: 'Production',
        assignedStandards: ['NIS2'],
        compliancePercentage: 23,
        riskLevel: 'High',
        lastAssessment: '1 month ago',
        owner: 'Lisa Anderson',
        description: 'Industrial IoT sensor network',
        ipUrl: 'iot.company.com'
      }
    ]
    setAssets(mockData)
    setFilteredAssets(mockData)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = assets.filter(asset => {
      const matchesType = filters.assetType === 'All Types' || asset.type === filters.assetType
      const matchesEnvironment = filters.environment === 'All Environments' || asset.environment === filters.environment
      const matchesStandards = filters.standards === 'All Standards' || asset.assignedStandards.includes(filters.standards)
      const matchesRiskLevel = filters.riskLevel === 'All Risk Levels' || asset.riskLevel === filters.riskLevel
      const matchesOwner = filters.owner === 'All Owners' || asset.owner === filters.owner
      const matchesSearch = searchTerm === '' || 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.ipUrl.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesType && matchesEnvironment && matchesStandards && matchesRiskLevel && matchesOwner && matchesSearch
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      if (sortField === 'assignedStandards') {
        aValue = a.assignedStandards.join(', ')
        bValue = b.assignedStandards.join(', ')
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

    setFilteredAssets(filtered)
  }, [assets, filters, searchTerm, sortField, sortDirection])

  const handleSort = (field: keyof Asset) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900'
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900'
      case 'Low':
        return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900'
      case 'Not Assessed':
        return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-900'
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-900'
    }
  }

  const getComplianceColor = (percentage: number) => {
    if (percentage > 85) return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900'
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900'
    return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900'
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'Servers':
        return <Server className="w-4 h-4" />
      case 'Cloud Resources':
        return <Cloud className="w-4 h-4" />
      case 'Databases':
        return <Database className="w-4 h-4" />
      case 'Network Devices':
        return <Wifi className="w-4 h-4" />
      case 'Applications':
        return <Monitor className="w-4 h-4" />
      case 'IoT':
        return <Cpu className="w-4 h-4" />
      default:
        return <Database className="w-4 h-4" />
    }
  }

  const handleExport = (format: 'excel' | 'pdf') => {
    setIsLoading(true)
    setTimeout(() => {
      const data = filteredAssets.map(asset => ({
        'Asset Name': asset.name,
        'Asset Type': asset.type,
        'Environment': asset.environment,
        'Assigned Standards': asset.assignedStandards.join(', '),
        'Compliance %': asset.compliancePercentage,
        'Risk Level': asset.riskLevel,
        'Last Assessment': asset.lastAssessment,
        'Owner': asset.owner,
        'IP/URL': asset.ipUrl
      }))
      
      if (format === 'excel') {
        console.log('Exporting Excel:', data)
      } else {
        console.log('Exporting PDF:', data)
      }
      
      setIsLoading(false)
    }, 1000)
  }

  const handleAddAsset = (newAsset: Omit<Asset, 'id'>) => {
    const asset: Asset = {
      ...newAsset,
      id: Date.now().toString()
    }
    setAssets([...assets, asset])
    setIsAddModalOpen(false)
  }

  const handleEditAsset = (updatedAsset: Asset) => {
    setAssets(assets.map(asset => asset.id === updatedAsset.id ? updatedAsset : asset))
    setIsEditModalOpen(false)
    setSelectedAsset(null)
  }

  const handleDeleteAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id))
    setIsDeleteModalOpen(false)
    setSelectedAsset(null)
  }

  const handleScanAsset = (id: string) => {
    // Simulate scanning
    setIsLoading(true)
    setTimeout(() => {
      setAssets(assets.map(asset => 
        asset.id === id 
          ? { ...asset, lastAssessment: 'Just now', compliancePercentage: Math.floor(Math.random() * 100) }
          : asset
      ))
      setIsLoading(false)
    }, 2000)
  }

  const assetTypes = ['All Types', 'Servers', 'Cloud Resources', 'Network Devices', 'Applications', 'Databases', 'IoT', 'Other']
  const environments = ['All Environments', 'Production', 'Staging', 'Development', 'Test']
  const standards = ['All Standards', 'GDPR', 'NIS2', 'ISO 27001', 'SOC2', 'PCI DSS']
  const riskLevels = ['All Risk Levels', 'High', 'Medium', 'Low', 'Not Assessed']
  const owners = ['All Owners', 'John Smith', 'Maria Garcia', 'David Johnson', 'Sarah Wilson', 'Michael Brown', 'Lisa Anderson']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assets</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => handleExport('excel')}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={isLoading}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Export PDF
          </button>
          <button
            onClick={() => window.history.back()}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Asset
          </button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Asset Filters</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Asset Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Asset Type
              </label>
              <select
                value={filters.assetType}
                onChange={(e) => setFilters({...filters, assetType: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {assetTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Environment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Environment
              </label>
              <select
                value={filters.environment}
                onChange={(e) => setFilters({...filters, environment: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {environments.map((env) => (
                  <option key={env} value={env}>{env}</option>
                ))}
              </select>
            </div>

            {/* Standards Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Compliance / Standards
              </label>
              <select
                value={filters.standards}
                onChange={(e) => setFilters({...filters, standards: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {standards.map((standard) => (
                  <option key={standard} value={standard}>{standard}</option>
                ))}
              </select>
            </div>

            {/* Risk Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Risk Level
              </label>
              <select
                value={filters.riskLevel}
                onChange={(e) => setFilters({...filters, riskLevel: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {riskLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            {/* Owner Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Owner / Responsible
              </label>
              <select
                value={filters.owner}
                onChange={(e) => setFilters({...filters, owner: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {owners.map((owner) => (
                  <option key={owner} value={owner}>{owner}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or IP/URL..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('name')}
                  >
                    Asset Name
                    {sortField === 'name' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('type')}
                  >
                    Asset Type
                    {sortField === 'type' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('environment')}
                  >
                    Environment
                    {sortField === 'environment' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('assignedStandards')}
                  >
                    Assigned Standards
                    {sortField === 'assignedStandards' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('compliancePercentage')}
                  >
                    Compliance %
                    {sortField === 'compliancePercentage' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('riskLevel')}
                  >
                    Risk Level
                    {sortField === 'riskLevel' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('lastAssessment')}
                  >
                    Last Assessment / Scan
                    {sortField === 'lastAssessment' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('owner')}
                  >
                    Owner / Responsible
                    {sortField === 'owner' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAssets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        {getAssetIcon(asset.type)}
                        <span className="ml-2">{asset.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {asset.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        asset.environment === 'Production' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          : asset.environment === 'Staging'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      }`}>
                        {asset.environment}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {asset.assignedStandards.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(asset.compliancePercentage)}`}>
                        {asset.compliancePercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(asset.riskLevel)}`}>
                        {asset.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {asset.lastAssessment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {asset.owner}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleScanAsset(asset.id)}
                          disabled={isLoading}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Scan Asset"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedAsset(asset)
                            setIsEditModalOpen(true)
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Edit Asset"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedAsset(asset)
                            setIsDeleteModalOpen(true)
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Remove Asset"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Asset Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Asset</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              handleAddAsset({
                name: formData.get('name') as string,
                type: formData.get('type') as string,
                environment: formData.get('environment') as string,
                assignedStandards: (formData.get('standards') as string).split(',').map(s => s.trim()),
                compliancePercentage: parseInt(formData.get('compliance') as string),
                riskLevel: formData.get('riskLevel') as 'High' | 'Medium' | 'Low' | 'Not Assessed',
                lastAssessment: formData.get('assessment') as string,
                owner: formData.get('owner') as string,
                description: formData.get('description') as string,
                ipUrl: formData.get('ipUrl') as string
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Name *</label>
                  <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Type *</label>
                  <select name="type" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {assetTypes.filter(t => t !== 'All Types').map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Environment</label>
                  <select name="environment" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {environments.filter(e => e !== 'All Environments').map(env => (
                      <option key={env} value={env}>{env}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Standards (comma-separated)</label>
                  <input type="text" name="standards" placeholder="GDPR, NIS2, SOC2" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Compliance %</label>
                  <input type="number" name="compliance" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Risk Level</label>
                  <select name="riskLevel" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {riskLevels.filter(r => r !== 'All Risk Levels').map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Assessment</label>
                  <input type="text" name="assessment" placeholder="e.g., 2 weeks ago" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Owner / Responsible</label>
                  <select name="owner" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {owners.filter(o => o !== 'All Owners').map(owner => (
                      <option key={owner} value={owner}>{owner}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description / Notes</label>
                  <textarea name="description" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">IP / URL / Location</label>
                  <input type="text" name="ipUrl" placeholder="192.168.1.100 or example.com" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Asset Modal */}
      {isEditModalOpen && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Asset</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              handleEditAsset({
                ...selectedAsset,
                name: formData.get('name') as string,
                type: formData.get('type') as string,
                environment: formData.get('environment') as string,
                assignedStandards: (formData.get('standards') as string).split(',').map(s => s.trim()),
                compliancePercentage: parseInt(formData.get('compliance') as string),
                riskLevel: formData.get('riskLevel') as 'High' | 'Medium' | 'Low' | 'Not Assessed',
                lastAssessment: formData.get('assessment') as string,
                owner: formData.get('owner') as string,
                description: formData.get('description') as string,
                ipUrl: formData.get('ipUrl') as string
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Name *</label>
                  <input type="text" name="name" defaultValue={selectedAsset.name} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Asset Type *</label>
                  <select name="type" defaultValue={selectedAsset.type} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {assetTypes.filter(t => t !== 'All Types').map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Environment</label>
                  <select name="environment" defaultValue={selectedAsset.environment} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {environments.filter(e => e !== 'All Environments').map(env => (
                      <option key={env} value={env}>{env}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Standards (comma-separated)</label>
                  <input type="text" name="standards" defaultValue={selectedAsset.assignedStandards.join(', ')} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Compliance %</label>
                  <input type="number" name="compliance" defaultValue={selectedAsset.compliancePercentage} min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Risk Level</label>
                  <select name="riskLevel" defaultValue={selectedAsset.riskLevel} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {riskLevels.filter(r => r !== 'All Risk Levels').map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Assessment</label>
                  <input type="text" name="assessment" defaultValue={selectedAsset.lastAssessment} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Owner / Responsible</label>
                  <select name="owner" defaultValue={selectedAsset.owner} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {owners.filter(o => o !== 'All Owners').map(owner => (
                      <option key={owner} value={owner}>{owner}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description / Notes</label>
                  <textarea name="description" defaultValue={selectedAsset.description} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">IP / URL / Location</label>
                  <input type="text" name="ipUrl" defaultValue={selectedAsset.ipUrl} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setSelectedAsset(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Update Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Asset Modal */}
      {isDeleteModalOpen && selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Remove Asset</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove "{selectedAsset.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setSelectedAsset(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAsset(selectedAsset.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}