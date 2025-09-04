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
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  PieChart
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLanguage } from '../contexts/LanguageContext'

interface ComplianceRecord {
  id: string
  standard: string
  department: string
  status: 'Compliant' | 'Partial' | 'Non-Compliant' | 'Not Assessed'
  compliancePercentage: number
  lastAssessmentDate: string
  nextScheduledAssessment: string
  recommendations: string
}

interface ComplianceFilters {
  standard: string
  status: string
  department: string
  dateFrom: string
  dateTo: string
}

export default function Compliance() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [records, setRecords] = useState<ComplianceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<ComplianceRecord[]>([])
  const [filters, setFilters] = useState<ComplianceFilters>({
    standard: 'All Standards',
    status: 'All Statuses',
    department: 'All Departments',
    dateFrom: '',
    dateTo: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof ComplianceRecord>('lastAssessmentDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<ComplianceRecord | null>(null)

  // Mock data
  useEffect(() => {
    const mockData: ComplianceRecord[] = [
      {
        id: '1',
        standard: 'GDPR',
        department: 'IT Department',
        status: 'Compliant',
        compliancePercentage: 95,
        lastAssessmentDate: '2024-01-15',
        nextScheduledAssessment: '2025-01-15',
        recommendations: 'Continue current data protection measures. Consider implementing additional privacy controls for new features.'
      },
      {
        id: '2',
        standard: 'NIS2',
        department: 'Security Team',
        status: 'Partial',
        compliancePercentage: 78,
        lastAssessmentDate: '2024-02-20',
        nextScheduledAssessment: '2024-08-20',
        recommendations: 'Implement additional network security measures. Update incident response procedures.'
      },
      {
        id: '3',
        standard: 'ISO 27001',
        department: 'IT Department',
        status: 'Compliant',
        compliancePercentage: 92,
        lastAssessmentDate: '2024-03-10',
        nextScheduledAssessment: '2025-03-10',
        recommendations: 'Maintain current security management system. Schedule regular internal audits.'
      },
      {
        id: '4',
        standard: 'SOC2',
        department: 'Operations',
        status: 'Non-Compliant',
        compliancePercentage: 45,
        lastAssessmentDate: '2024-01-30',
        nextScheduledAssessment: '2024-07-30',
        recommendations: 'Urgent: Implement access controls and monitoring systems. Conduct security awareness training.'
      },
      {
        id: '5',
        standard: 'PCI DSS',
        department: 'Finance',
        status: 'Partial',
        compliancePercentage: 67,
        lastAssessmentDate: '2024-02-15',
        nextScheduledAssessment: '2024-08-15',
        recommendations: 'Update payment processing security. Implement additional encryption measures.'
      },
      {
        id: '6',
        standard: 'DORA',
        department: 'Risk Management',
        status: 'Not Assessed',
        compliancePercentage: 0,
        lastAssessmentDate: '',
        nextScheduledAssessment: '2024-12-31',
        recommendations: 'Schedule initial assessment. Prepare documentation for digital operational resilience requirements.'
      }
    ]
    setRecords(mockData)
    setFilteredRecords(mockData)
  }, [])

  // Apply filters
  useEffect(() => {
    let filtered = records.filter(record => {
      const matchesStandard = filters.standard === 'All Standards' || record.standard === filters.standard
      const matchesStatus = filters.status === 'All Statuses' || record.status === filters.status
      const matchesDepartment = filters.department === 'All Departments' || record.department === filters.department
      const matchesSearch = searchTerm === '' || 
        record.standard.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.status.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Date range filter
      let matchesDateRange = true
      if (filters.dateFrom && record.lastAssessmentDate) {
        matchesDateRange = matchesDateRange && new Date(record.lastAssessmentDate) >= new Date(filters.dateFrom)
      }
      if (filters.dateTo && record.lastAssessmentDate) {
        matchesDateRange = matchesDateRange && new Date(record.lastAssessmentDate) <= new Date(filters.dateTo)
      }
      
      return matchesStandard && matchesStatus && matchesDepartment && matchesSearch && matchesDateRange
    })

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

    setFilteredRecords(filtered)
  }, [records, filters, searchTerm, sortField, sortDirection])

  const handleSort = (field: keyof ComplianceRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant':
        return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900'
      case 'Partial':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900'
      case 'Non-Compliant':
        return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900'
      case 'Not Assessed':
        return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-900'
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-900'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Compliant':
        return <CheckCircle className="w-4 h-4" />
      case 'Partial':
        return <Clock className="w-4 h-4" />
      case 'Non-Compliant':
        return <XCircle className="w-4 h-4" />
      case 'Not Assessed':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const getComplianceColor = (percentage: number) => {
    if (percentage > 85) return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-900'
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-900'
    return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900'
  }

  // Calculate summary statistics
  const totalSystems = filteredRecords.length
  const totalIncidents = filteredRecords.filter(r => r.status === 'Non-Compliant').length
  const avgCompliance = filteredRecords.length > 0 
    ? Math.round(filteredRecords.reduce((sum, r) => sum + r.compliancePercentage, 0) / filteredRecords.length)
    : 0
  const riskLevelDistribution = {
    high: filteredRecords.filter(r => r.compliancePercentage < 40).length,
    medium: filteredRecords.filter(r => r.compliancePercentage >= 40 && r.compliancePercentage <= 85).length,
    low: filteredRecords.filter(r => r.compliancePercentage > 85).length,
    notAssessed: filteredRecords.filter(r => r.status === 'Not Assessed').length
  }

  const handleExport = (format: 'excel' | 'pdf') => {
    setIsLoading(true)
    setTimeout(() => {
      const data = filteredRecords.map(record => ({
        'Standard / Regulation': record.standard,
        'Department / Owner': record.department,
        'Status': record.status,
        'Compliance %': record.compliancePercentage,
        'Last Assessment Date': record.lastAssessmentDate,
        'Next Scheduled Assessment': record.nextScheduledAssessment,
        'Recommendations': record.recommendations
      }))
      
      if (format === 'excel') {
        console.log('Exporting Excel:', data)
      } else {
        console.log('Exporting PDF:', data)
      }
      
      setIsLoading(false)
    }, 1000)
  }

  const handleAddRecord = (newRecord: Omit<ComplianceRecord, 'id'>) => {
    const record: ComplianceRecord = {
      ...newRecord,
      id: Date.now().toString()
    }
    setRecords([...records, record])
    setIsAddModalOpen(false)
  }

  const handleEditRecord = (updatedRecord: ComplianceRecord) => {
    setRecords(records.map(record => record.id === updatedRecord.id ? updatedRecord : record))
    setIsEditModalOpen(false)
    setSelectedRecord(null)
  }

  const handleDeleteRecord = (id: string) => {
    setRecords(records.filter(record => record.id !== id))
    setIsDeleteModalOpen(false)
    setSelectedRecord(null)
  }

  const standards = ['All Standards', 'GDPR', 'NIS2', 'ISO 27001', 'SOC2', 'PCI DSS', 'DORA', 'Other']
  const statuses = ['All Statuses', 'Compliant', 'Partial', 'Non-Compliant', 'Not Assessed']
  const departments = ['All Departments', 'IT Department', 'Security Team', 'Operations', 'Finance', 'Risk Management', 'HR', 'Legal']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Compliance</h1>
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
            Add Compliance Record
          </button>
        </div>
      </div>

      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Checked Systems/Assets</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-300">{totalSystems}</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">total records</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Incidents</h3>
            <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-300">{totalIncidents}</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">non-compliant</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <ShieldCheck className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Compliance %</h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-300">{avgCompliance}%</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">average</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <PieChart className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Risk Distribution</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
              High: {riskLevelDistribution.high} | Med: {riskLevelDistribution.medium} | Low: {riskLevelDistribution.low}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Compliance Filters</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Standard Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Standard / Regulation
              </label>
              <select
                value={filters.standard}
                onChange={(e) => setFilters({...filters, standard: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {standards.map((standard) => (
                  <option key={standard} value={standard}>{standard}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status / Risk Level
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Department / Owner
              </label>
              <select
                value={filters.department}
                onChange={(e) => setFilters({...filters, department: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assessment Date Range
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  placeholder="To"
                />
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by standard, department, or status..."
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
                    onClick={() => handleSort('standard')}
                  >
                    Standard / Regulation
                    {sortField === 'standard' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('department')}
                  >
                    Department / Owner
                    {sortField === 'department' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('status')}
                  >
                    Status
                    {sortField === 'status' && (
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
                    onClick={() => handleSort('lastAssessmentDate')}
                  >
                    Last Assessment Date
                    {sortField === 'lastAssessmentDate' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleSort('nextScheduledAssessment')}
                  >
                    Next Scheduled Assessment
                    {sortField === 'nextScheduledAssessment' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {record.standard}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {record.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                        <span className="ml-1">{record.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getComplianceColor(record.compliancePercentage)}`}>
                        {record.compliancePercentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {record.lastAssessmentDate || 'Not assessed'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {record.nextScheduledAssessment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedRecord(record)
                            // Show details modal
                          }}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View Summary"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedRecord(record)
                            setIsEditModalOpen(true)
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Edit Record"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedRecord(record)
                            setIsDeleteModalOpen(true)
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Delete Record"
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

      {/* Add Compliance Record Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Compliance Record</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              handleAddRecord({
                standard: formData.get('standard') as string,
                department: formData.get('department') as string,
                status: formData.get('status') as 'Compliant' | 'Partial' | 'Non-Compliant' | 'Not Assessed',
                compliancePercentage: parseInt(formData.get('compliance') as string),
                lastAssessmentDate: formData.get('lastAssessment') as string,
                nextScheduledAssessment: formData.get('nextAssessment') as string,
                recommendations: formData.get('recommendations') as string
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Standard / Regulation *</label>
                  <select name="standard" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {standards.filter(s => s !== 'All Standards').map(standard => (
                      <option key={standard} value={standard}>{standard}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department / Owner *</label>
                  <select name="department" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {departments.filter(d => d !== 'All Departments').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select name="status" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {statuses.filter(s => s !== 'All Statuses').map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Compliance %</label>
                  <input type="number" name="compliance" min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Assessment Date</label>
                  <input type="date" name="lastAssessment" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Next Scheduled Assessment</label>
                  <input type="date" name="nextAssessment" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recommendations / Notes</label>
                  <textarea name="recommendations" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
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
                  Add Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Compliance Record Modal */}
      {isEditModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Edit Compliance Record</h3>
            <form onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.target as HTMLFormElement)
              handleEditRecord({
                ...selectedRecord,
                standard: formData.get('standard') as string,
                department: formData.get('department') as string,
                status: formData.get('status') as 'Compliant' | 'Partial' | 'Non-Compliant' | 'Not Assessed',
                compliancePercentage: parseInt(formData.get('compliance') as string),
                lastAssessmentDate: formData.get('lastAssessment') as string,
                nextScheduledAssessment: formData.get('nextAssessment') as string,
                recommendations: formData.get('recommendations') as string
              })
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Standard / Regulation *</label>
                  <select name="standard" defaultValue={selectedRecord.standard} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {standards.filter(s => s !== 'All Standards').map(standard => (
                      <option key={standard} value={standard}>{standard}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department / Owner *</label>
                  <select name="department" defaultValue={selectedRecord.department} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {departments.filter(d => d !== 'All Departments').map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select name="status" defaultValue={selectedRecord.status} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    {statuses.filter(s => s !== 'All Statuses').map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Compliance %</label>
                  <input type="number" name="compliance" defaultValue={selectedRecord.compliancePercentage} min="0" max="100" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Assessment Date</label>
                  <input type="date" name="lastAssessment" defaultValue={selectedRecord.lastAssessmentDate} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Next Scheduled Assessment</label>
                  <input type="date" name="nextAssessment" defaultValue={selectedRecord.nextScheduledAssessment} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Recommendations / Notes</label>
                  <textarea name="recommendations" defaultValue={selectedRecord.recommendations} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                    setSelectedRecord(null)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Compliance Record Modal */}
      {isDeleteModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Delete Compliance Record</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete the compliance record for "{selectedRecord.standard}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  setSelectedRecord(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteRecord(selectedRecord.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}