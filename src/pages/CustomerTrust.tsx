import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui'
import { 
  Download, 
  FileText, 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2,
  X,
  Check,
  AlertCircle
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../hooks/useLanguage'

interface CustomerTrust {
  id: string
  name: string
  category: 'Client' | 'Partner'
  sector: string
  assignedStandards: string[]
  compliancePercentage: number
  lastAssessment: string
  responsiblePerson: string
  email: string
  website: string
}

interface CustomerTrustFilters {
  levelType: string
  sector: string
  standards: string
  complianceLevel: string
}

export default function CustomerTrust() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [customerTrusts, setCustomerTrusts] = useState<CustomerTrust[]>([])
  const [filteredCustomerTrusts, setFilteredCustomerTrusts] = useState<CustomerTrust[]>([])
  const [filters, setFilters] = useState<CustomerTrustFilters>({
    levelType: 'All Customer Trust',
    sector: 'All Types',
    standards: 'All Standards',
    complianceLevel: 'All Levels'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof CustomerTrust>('lastAssessment')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCustomerTrust, setSelectedCustomerTrust] = useState<CustomerTrust | null>(null)

  // Mock data
  useEffect(() => {
    const mockData: CustomerTrust[] = [
      {
        id: '1',
        name: 'Alfa SL',
        category: 'Partner',
        sector: 'Financial services',
        assignedStandards: ['NIS2', 'GDPR'],
        compliancePercentage: 92,
        lastAssessment: '2 weeks ago',
        responsiblePerson: 'John Smith',
        email: 'john.smith@alfasl.com',
        website: 'https://alfasl.com'
      },
      {
        id: '2',
        name: 'Gamma Systems',
        category: 'Client',
        sector: 'Oil industry',
        assignedStandards: ['NIS2', 'DORA'],
        compliancePercentage: 34,
        lastAssessment: '3 weeks ago',
        responsiblePerson: 'Maria Garcia',
        email: 'maria.garcia@gammasystems.com',
        website: 'https://gammasystems.com'
      },
      {
        id: '3',
        name: 'Delta Analytics',
        category: 'Partner',
        sector: 'Healthcare',
        assignedStandards: ['GDPR', 'SOCv2'],
        compliancePercentage: 89,
        lastAssessment: '1 week ago',
        responsiblePerson: 'David Johnson',
        email: 'david.johnson@deltaanalytics.com',
        website: 'https://deltaanalytics.com'
      },
      {
        id: '4',
        name: 'Epsilon Security',
        category: 'Client',
        sector: 'Pharmaceutical industry',
        assignedStandards: ['NIS2', 'SOCv2', 'DORA'],
        compliancePercentage: 78,
        lastAssessment: '2 months ago',
        responsiblePerson: 'Sarah Wilson',
        email: 'sarah.wilson@epsilonsecurity.com',
        website: 'https://epsilonsecurity.com'
      },
      {
        id: '5',
        name: 'Eta Cloud Services',
        category: 'Partner',
        sector: 'Motor industry',
        assignedStandards: ['NIS2', 'GDPR', 'SOCv2'],
        compliancePercentage: 91,
        lastAssessment: '1 week ago',
        responsiblePerson: 'Michael Brown',
        email: 'michael.brown@etacloud.com',
        website: 'https://etacloud.com'
      },
      {
        id: '6',
        name: 'Iota Financial Services',
        category: 'Client',
        sector: 'Construction industry',
        assignedStandards: ['DORA', 'GDPR'],
        compliancePercentage: 88,
        lastAssessment: '2 weeks ago',
        responsiblePerson: 'Lisa Anderson',
        email: 'lisa.anderson@iotafinancial.com',
        website: 'https://iotafinancial.com'
      }
    ]
    setCustomerTrusts(mockData)
    setFilteredCustomerTrusts(mockData)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = customerTrusts.filter(trust => {
      const matchesLevelType = filters.levelType === 'All Customer Trust' || 
        (filters.levelType === 'Client' && trust.category === 'Client') ||
        (filters.levelType === 'Partner' && trust.category === 'Partner')
      
      const matchesSector = filters.sector === 'All Types' || trust.sector === filters.sector
      
      const matchesStandards = filters.standards === 'All Standards' || 
        trust.assignedStandards.includes(filters.standards)
      
      const matchesCompliance = filters.complianceLevel === 'All Levels' ||
        (filters.complianceLevel === 'High (>85%)' && trust.compliancePercentage > 85) ||
        (filters.complianceLevel === 'Medium (40-85%)' && trust.compliancePercentage >= 40 && trust.compliancePercentage <= 85) ||
        (filters.complianceLevel === 'Low (<40%)' && trust.compliancePercentage < 40)
      
      const matchesSearch = searchTerm === '' || 
        trust.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trust.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase())
      
      return matchesLevelType && matchesSector && matchesStandards && matchesCompliance && matchesSearch
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

    setFilteredCustomerTrusts(filtered)
  }, [customerTrusts, filters, searchTerm, sortField, sortDirection])

  const handleSort = (field: keyof CustomerTrust) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getComplianceColor = (percentage: number) => {
    if (percentage > 85) return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900'
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900'
    return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900'
  }

  const getComplianceText = (percentage: number) => {
    if (percentage > 85) return 'High'
    if (percentage >= 40) return 'Medium'
    return 'Low'
  }

  const handleExport = (format: 'excel' | 'pdf') => {
    setIsLoading(true)
    // Simulate export
    setTimeout(() => {
      const data = filteredCustomerTrusts.map(trust => ({
        'Customer Trust Name': trust.name,
        'Category': trust.category,
        'Sector': trust.sector,
        'Assigned Standards': trust.assignedStandards.join(', '),
        'Compliance %': trust.compliancePercentage,
        'Last Assessment': trust.lastAssessment,
        'Responsible Person': trust.responsiblePerson,
        'Email': trust.email,
        'Website': trust.website
      }))
      
      if (format === 'excel') {
        console.log('Exporting Excel:', data)
        // In real implementation, use a library like xlsx
      } else {
        console.log('Exporting PDF:', data)
        // In real implementation, use a library like jsPDF
      }
      
      setIsLoading(false)
    }, 1000)
  }

  const handleAddCustomerTrust = (newTrust: Omit<CustomerTrust, 'id'>) => {
    const trust: CustomerTrust = {
      ...newTrust,
      id: Date.now().toString()
    }
    setCustomerTrusts([...customerTrusts, trust])
    setIsAddModalOpen(false)
  }

  const handleRemoveCustomerTrust = (id: string) => {
    setCustomerTrusts(customerTrusts.filter(trust => trust.id !== id))
    setIsRemoveModalOpen(false)
    setSelectedCustomerTrust(null)
  }

  const sectors = [
    'All Types',
    'Healthcare',
    'Pharmaceutical industry',
    'Motor industry',
    'Oil industry',
    'Construction industry',
    'Engineering',
    'Financial services'
  ]

  const standards = ['All Standards', 'NIS 2', 'SOC v2', 'GDPR', 'DORA']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Customer Trust</h1>
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
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customer Trust Categories & Filters</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Level Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Level Type (Category)
            </label>
            <div className="flex flex-wrap gap-2">
              {['All Customer Trust', 'Client', 'Partner'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters({...filters, levelType: type})}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filters.levelType === type
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Sector Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Customer Trust Sector
            </label>
            <select
              value={filters.sector}
              onChange={(e) => setFilters({...filters, sector: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              {sectors.map((sector) => (
                <option key={sector} value={sector}>{sector}</option>
              ))}
            </select>
          </div>

          {/* Standards Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Standards
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

          {/* Compliance Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Compliance Level
            </label>
            <div className="flex flex-wrap gap-2">
              {['All Levels', 'High (>85%)', 'Medium (40-85%)', 'Low (<40%)'].map((level) => (
                <button
                  key={level}
                  onClick={() => setFilters({...filters, complianceLevel: level})}
                  className={`px-3 py-1 text-sm rounded-md ${
                    filters.complianceLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name or responsible person..."
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
                    Customer Trust Name
                    {sortField === 'name' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('category')}
                  >
                    Category
                    {sortField === 'category' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('sector')}
                  >
                    Customer Trust Sector
                    {sortField === 'sector' && (
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
                    onClick={() => handleSort('lastAssessment')}
                  >
                    Last Assessment
                    {sortField === 'lastAssessment' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCustomerTrusts.map((trust) => (
                  <tr key={trust.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {trust.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        trust.category === 'Client' 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      }`}>
                        {trust.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {trust.sector}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {trust.assignedStandards.join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(trust.compliancePercentage)}`}>
                        {trust.compliancePercentage}% ({getComplianceText(trust.compliancePercentage)})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {trust.lastAssessment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedCustomerTrust(trust)
                            setIsRemoveModalOpen(true)
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
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

      {/* Add Customer Trust Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Customer Trust</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              handleAddCustomerTrust({
                name: formData.get('name') as string,
                category: formData.get('category') as 'Client' | 'Partner',
                sector: formData.get('sector') as string,
                assignedStandards: (formData.get('standards') as string).split(',').map(s => s.trim()),
                compliancePercentage: parseInt(formData.get('compliance') as string),
                lastAssessment: formData.get('assessment') as string,
                responsiblePerson: formData.get('responsible') as string,
                email: formData.get('email') as string,
                website: formData.get('website') as string
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Trust Name</label>
                  <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                  <select name="category" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="Client">Client</option>
                    <option value="Partner">Partner</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sector</label>
                  <select name="sector" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {sectors.filter(s => s !== 'All Types').map(sector => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned Standards (comma-separated)</label>
                  <input type="text" name="standards" placeholder="NIS2, GDPR, SOCv2" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Compliance %</label>
                  <input type="number" name="compliance" min="0" max="100" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Assessment</label>
                  <input type="text" name="assessment" placeholder="e.g., 2 weeks ago" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Responsible Person</label>
                  <input type="text" name="responsible" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input type="email" name="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Website</label>
                  <input type="url" name="website" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
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
                  Add Customer Trust
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Customer Trust Modal */}
      {isRemoveModalOpen && selectedCustomerTrust && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Remove Customer Trust</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove "{selectedCustomerTrust.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsRemoveModalOpen(false)
                  setSelectedCustomerTrust(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveCustomerTrust(selectedCustomerTrust.id)}
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