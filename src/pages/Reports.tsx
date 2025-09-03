import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Eye, 
  Edit3,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  X,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Building
} from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: string;
  owner: string;
  department: string;
  createdDate: string;
  status: string;
  riskLevel: 'high' | 'medium' | 'low' | 'not-assessed';
  systemsChecked: number;
  incidentsFound: number;
  complianceScore: number;
  notes: string;
}

interface ReportFilters {
  reportType: string;
  dateRange: string;
  department: string;
  riskLevel: string;
}

const Reports: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [filters, setFilters] = useState<ReportFilters>({
    reportType: 'all',
    dateRange: 'all',
    department: 'all',
    riskLevel: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Report>('createdDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Sample data - replace with API calls
  const sampleReports: Report[] = [
    {
      id: '1',
      name: 'Q4 Security Assessment Report',
      type: 'Security Assessment',
      owner: 'John Smith',
      department: 'IT Security',
      createdDate: '2024-12-15',
      status: 'Completed',
      riskLevel: 'low',
      systemsChecked: 45,
      incidentsFound: 2,
      complianceScore: 94,
      notes: 'Overall security posture improved. Minor vulnerabilities identified and patched.'
    },
    {
      id: '2',
      name: 'GDPR Compliance Audit',
      type: 'Compliance Audit',
      owner: 'Sarah Johnson',
      department: 'Legal & Compliance',
      createdDate: '2024-12-10',
      status: 'In Progress',
      riskLevel: 'medium',
      systemsChecked: 23,
      incidentsFound: 5,
      complianceScore: 87,
      notes: 'Data processing activities identified. Recommendations for improvement provided.'
    },
    {
      id: '3',
      name: 'Vulnerability Scan Results',
      type: 'Vulnerability Scan',
      owner: 'Mike Brown',
      department: 'IT Security',
      createdDate: '2024-12-08',
      status: 'Completed',
      riskLevel: 'high',
      systemsChecked: 67,
      incidentsFound: 12,
      complianceScore: 76,
      notes: 'Critical vulnerabilities found in legacy systems. Immediate action required.'
    },
    {
      id: '4',
      name: 'Incident Response Report',
      type: 'Incident Report',
      owner: 'Lisa Davis',
      department: 'IT Security',
      createdDate: '2024-12-05',
      status: 'Completed',
      riskLevel: 'medium',
      systemsChecked: 12,
      incidentsFound: 1,
      complianceScore: 89,
      notes: 'Phishing attempt successfully contained. No data breach occurred.'
    },
    {
      id: '5',
      name: 'ISO 27001 Gap Analysis',
      type: 'Compliance Audit',
      owner: 'David Wilson',
      department: 'Quality Assurance',
      createdDate: '2024-12-01',
      status: 'Draft',
      riskLevel: 'low',
      systemsChecked: 34,
      incidentsFound: 0,
      complianceScore: 92,
      notes: 'Strong compliance foundation. Minor gaps identified for improvement.'
    }
  ];

  useEffect(() => {
    setReports(sampleReports);
    setFilteredReports(sampleReports);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, reports]);

  const applyFilters = () => {
    let filtered = [...reports];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply report type filter
    if (filters.reportType !== 'all') {
      filtered = filtered.filter(report => report.type === filters.reportType);
    }

    // Apply department filter
    if (filters.department !== 'all') {
      filtered = filtered.filter(report => report.department === filters.department);
    }

    // Apply risk level filter
    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(report => report.riskLevel === filters.riskLevel);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(report => {
        const reportDate = new Date(report.createdDate);
        switch (filters.dateRange) {
          case 'last30':
            return reportDate >= thirtyDaysAgo;
          case 'last90':
            return reportDate >= ninetyDaysAgo;
          case 'thisYear':
            return reportDate.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    setFilteredReports(filtered);
  };

  const handleSort = (field: keyof Report) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'text-green-600 bg-green-100';
      case 'In Progress':
        return 'text-yellow-600 bg-yellow-100';
      case 'Draft':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create download link
      const data = JSON.stringify(filteredReports, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reports-${format}-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddReport = async (reportData: Omit<Report, 'id'>) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString()
    };
    
    setReports(prev => [...prev, newReport]);
    setIsAddModalOpen(false);
  };

  const handleEditReport = async (reportData: Report) => {
    setReports(prev => prev.map(r => r.id === reportData.id ? reportData : r));
    setIsEditModalOpen(false);
    setSelectedReport(null);
  };

  const handleDeleteReport = async (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    setIsDeleteModalOpen(false);
    setSelectedReport(null);
  };

  // Summary calculations
  const totalSystems = filteredReports.reduce((sum, report) => sum + report.systemsChecked, 0);
  const totalIncidents = filteredReports.reduce((sum, report) => sum + report.incidentsFound, 0);
  const avgCompliance = filteredReports.length > 0 
    ? Math.round(filteredReports.reduce((sum, report) => sum + report.complianceScore, 0) / filteredReports.length)
    : 0;

  const riskLevelDistribution = {
    high: filteredReports.filter(r => r.riskLevel === 'high').length,
    medium: filteredReports.filter(r => r.riskLevel === 'medium').length,
    low: filteredReports.filter(r => r.riskLevel === 'low').length,
    'not-assessed': filteredReports.filter(r => r.riskLevel === 'not-assessed').length
  };

  const AddReportModal: React.FC = () => {
    const [formData, setFormData] = useState({
      name: '',
      type: 'Security Assessment',
      owner: '',
      department: '',
      createdDate: new Date().toISOString().split('T')[0],
      status: 'Draft',
      riskLevel: 'low' as 'high' | 'medium' | 'low' | 'not-assessed',
      systemsChecked: 0,
      incidentsFound: 0,
      complianceScore: 0,
      notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleAddReport(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add New Report</h2>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                >
                  <option>Security Assessment</option>
                  <option>Compliance Audit</option>
                  <option>Vulnerability Scan</option>
                  <option>Incident Report</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner *
                </label>
                <input
                  type="text"
                  required
                  value={formData.owner}
                  onChange={(e) => setFormData(prev => ({ ...prev, owner: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.createdDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, createdDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                >
                  <option>Draft</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Level *
                </label>
                <select
                  required
                  value={formData.riskLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, riskLevel: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="not-assessed">Not Assessed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Systems Checked
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.systemsChecked}
                  onChange={(e) => setFormData(prev => ({ ...prev, systemsChecked: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incidents Found
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.incidentsFound}
                  onChange={(e) => setFormData(prev => ({ ...prev, incidentsFound: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compliance Score (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.complianceScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, complianceScore: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                placeholder="Enter report notes and recommendations..."
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#56a3d9] text-white rounded-md hover:bg-[#134876] transition-colors"
              >
                Add Report
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-[#56a3d9]" />
            <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Export PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              Export Excel
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#56a3d9] text-white rounded-md hover:bg-[#134876] transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Report
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Systems Checked</h3>
            <p className="text-2xl font-bold text-blue-600">{totalSystems}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Incidents Found</h3>
            <p className="text-2xl font-bold text-red-600">{totalIncidents}</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Avg Compliance</h3>
            <p className="text-2xl font-bold text-green-600">{avgCompliance}%</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Total Reports</h3>
            <p className="text-2xl font-bold text-purple-600">{filteredReports.length}</p>
          </div>
        </div>

        {/* Risk Level Distribution */}
        <div className="mt-6">
          <h3 className="font-medium text-gray-900 mb-3">Risk Level Distribution</h3>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">High: {riskLevelDistribution.high}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">Medium: {riskLevelDistribution.medium}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Low: {riskLevelDistribution.low}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-gray-500 rounded"></div>
              <span className="text-sm text-gray-600">Not Assessed: {riskLevelDistribution['not-assessed']}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={filters.reportType}
              onChange={(e) => setFilters(prev => ({ ...prev, reportType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
            >
              <option value="all">All Types</option>
              <option value="Security Assessment">Security Assessment</option>
              <option value="Compliance Audit">Compliance Audit</option>
              <option value="Vulnerability Scan">Vulnerability Scan</option>
              <option value="Incident Report">Incident Report</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
            >
              <option value="all">All Time</option>
              <option value="last30">Last 30 Days</option>
              <option value="last90">Last 90 Days</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={filters.department}
              onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
            >
              <option value="all">All Departments</option>
              <option value="IT Security">IT Security</option>
              <option value="Legal & Compliance">Legal & Compliance</option>
              <option value="Quality Assurance">Quality Assurance</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Risk Level</label>
            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
            >
              <option value="all">All Levels</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="not-assessed">Not Assessed</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search reports by name, owner, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
            />
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Reports Table</h2>
          <div className="text-sm text-gray-600">
            {filteredReports.length} of {reports.length} reports
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>Report Name</span>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Owner</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('createdDate')}>
                  <div className="flex items-center space-x-1">
                    <span>Created Date</span>
                    {sortField === 'createdDate' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Risk Level</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map(report => (
                <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{report.name}</div>
                      <div className="text-sm text-gray-500">
                        {report.systemsChecked} systems, {report.incidentsFound} incidents
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{report.type}</td>
                  <td className="py-3 px-4 text-gray-700">{report.owner}</td>
                  <td className="py-3 px-4 text-gray-700">{report.department}</td>
                  <td className="py-3 px-4 text-gray-700">{report.createdDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskLevelColor(report.riskLevel)}`}>
                      {report.riskLevel.charAt(0).toUpperCase() + report.riskLevel.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          // Handle view summary
                        }}
                        className="p-1 text-[#56a3d9] hover:text-[#134876] transition-colors"
                        title="View Summary"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setIsEditModalOpen(true);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit Report"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setIsDeleteModalOpen(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reports found matching the current filters.
          </div>
        )}
      </div>

      {/* Modals */}
      {isAddModalOpen && <AddReportModal />}
    </div>
  );
};

export default Reports;