import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Users, 
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
  Building,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  category: string;
  subGradation: string;
  assignedStandards: string[];
  complianceLevel: number;
  lastAssessment: string;
  responsiblePerson: string;
  email: string;
  website: string;
  accessLevel: 'with-access' | 'no-access';
  supplierType: string;
}

interface SupplierFilters {
  accessLevel: string;
  supplierType: string;
  standards: string;
  complianceLevel: string;
}

const Suppliers: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [filters, setFilters] = useState<SupplierFilters>({
    accessLevel: 'all',
    supplierType: 'all',
    standards: 'all',
    complianceLevel: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Supplier>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  // Sample data - replace with API calls
  const sampleSuppliers: Supplier[] = [
    {
      id: '1',
      name: 'Alfa SL',
      category: 'Cloud Infrastructure Provider',
      subGradation: 'With Access',
      assignedStandards: ['NIS2', 'GDPR'],
      complianceLevel: 92,
      lastAssessment: '2 weeks ago',
      responsiblePerson: 'John Smith',
      email: 'john.smith@alfasl.com',
      website: 'https://alfasl.com',
      accessLevel: 'with-access',
      supplierType: 'Services Supplier'
    },
    {
      id: '2',
      name: 'Gamma Systems',
      category: 'Hardware Infrastructure',
      subGradation: 'With Access',
      assignedStandards: ['NIS2', 'DORA'],
      complianceLevel: 34,
      lastAssessment: '3 weeks ago',
      responsiblePerson: 'Sarah Johnson',
      email: 'sarah.johnson@gammasystems.com',
      website: 'https://gammasystems.com',
      accessLevel: 'with-access',
      supplierType: 'Hardware Supplier'
    },
    {
      id: '3',
      name: 'Delta Analytics',
      category: 'Business Intelligence Services',
      subGradation: 'With Access',
      assignedStandards: ['GDPR', 'SOC2'],
      complianceLevel: 89,
      lastAssessment: '1 week ago',
      responsiblePerson: 'Mike Brown',
      email: 'mike.brown@deltaanalytics.com',
      website: 'https://deltaanalytics.com',
      accessLevel: 'with-access',
      supplierType: 'Services Supplier'
    },
    {
      id: '4',
      name: 'Epsilon Security',
      category: 'Cybersecurity Services',
      subGradation: 'With Access',
      assignedStandards: ['NIS2', 'SOC2', 'DORA'],
      complianceLevel: 78,
      lastAssessment: '2 months ago',
      responsiblePerson: 'Lisa Davis',
      email: 'lisa.davis@epsilonsecurity.com',
      website: 'https://epsilonsecurity.com',
      accessLevel: 'with-access',
      supplierType: 'Services Supplier'
    },
    {
      id: '5',
      name: 'Eta Cloud Services',
      category: 'Cloud Storage Provider',
      subGradation: 'With Access',
      assignedStandards: ['NIS2', 'GDPR', 'SOC2'],
      complianceLevel: 91,
      lastAssessment: '1 week ago',
      responsiblePerson: 'David Wilson',
      email: 'david.wilson@etacloud.com',
      website: 'https://etacloud.com',
      accessLevel: 'with-access',
      supplierType: 'Services Supplier'
    },
    {
      id: '6',
      name: 'Iota Financial Services',
      category: 'Payment Processing',
      subGradation: 'With Access',
      assignedStandards: ['DORA', 'GDPR'],
      complianceLevel: 88,
      lastAssessment: '2 weeks ago',
      responsiblePerson: 'Emma Taylor',
      email: 'emma.taylor@iotafinancial.com',
      website: 'https://iotafinancial.com',
      accessLevel: 'with-access',
      supplierType: 'Services Supplier'
    }
  ];

  useEffect(() => {
    setSuppliers(sampleSuppliers);
    setFilteredSuppliers(sampleSuppliers);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, searchTerm, suppliers]);

  const applyFilters = () => {
    let filtered = [...suppliers];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.responsiblePerson.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply access level filter
    if (filters.accessLevel !== 'all') {
      filtered = filtered.filter(supplier => supplier.accessLevel === filters.accessLevel);
    }

    // Apply supplier type filter
    if (filters.supplierType !== 'all') {
      filtered = filtered.filter(supplier => supplier.supplierType === filters.supplierType);
    }

    // Apply standards filter
    if (filters.standards !== 'all') {
      filtered = filtered.filter(supplier => 
        supplier.assignedStandards.includes(filters.standards)
      );
    }

    // Apply compliance level filter
    if (filters.complianceLevel !== 'all') {
      filtered = filtered.filter(supplier => {
        const level = supplier.complianceLevel;
        switch (filters.complianceLevel) {
          case 'high':
            return level > 85;
          case 'medium':
            return level >= 40 && level <= 85;
          case 'low':
            return level < 40;
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

    setFilteredSuppliers(filtered);
  };

  const handleSort = (field: keyof Supplier) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getComplianceColor = (level: number) => {
    if (level > 85) return 'text-green-600 bg-green-100';
    if (level >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getComplianceText = (level: number) => {
    if (level > 85) return 'High';
    if (level >= 40) return 'Medium';
    return 'Low';
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create download link
      const data = JSON.stringify(filteredSuppliers, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `suppliers-${format}-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSupplier = async (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Date.now().toString()
    };
    
    setSuppliers(prev => [...prev, newSupplier]);
    setIsAddModalOpen(false);
  };

  const handleRemoveSupplier = async (supplierId: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== supplierId));
    setIsRemoveModalOpen(false);
    setSelectedSupplier(null);
  };

  const AddSupplierModal: React.FC = () => {
    const [formData, setFormData] = useState({
      name: '',
      category: '',
      subGradation: 'With Access',
      assignedStandards: [] as string[],
      complianceLevel: 0,
      responsiblePerson: '',
      email: '',
      website: '',
      accessLevel: 'with-access' as 'with-access' | 'no-access',
      supplierType: 'Services Supplier'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleAddSupplier(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Add New Supplier</h2>
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
                  Supplier Name *
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
                  Category *
                </label>
                <input
                  type="text"
                  required
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub-Gradation
                </label>
                <select
                  value={formData.subGradation}
                  onChange={(e) => setFormData(prev => ({ ...prev, subGradation: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                >
                  <option>With Access</option>
                  <option>No Access</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Type
                </label>
                <select
                  value={formData.supplierType}
                  onChange={(e) => setFormData(prev => ({ ...prev, supplierType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                >
                  <option>Software Supplier</option>
                  <option>Hardware Supplier</option>
                  <option>Services Supplier</option>
                  <option>Administrative/Economic Materials and Services</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Level
                </label>
                <select
                  value={formData.accessLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, accessLevel: e.target.value as 'with-access' | 'no-access' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                >
                  <option value="with-access">With Access to Infrastructure/Data</option>
                  <option value="no-access">No Access (Basic Services)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Compliance Level (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.complianceLevel}
                  onChange={(e) => setFormData(prev => ({ ...prev, complianceLevel: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Responsible Person *
                </label>
                <input
                  type="text"
                  required
                  value={formData.responsiblePerson}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsiblePerson: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assigned Standards
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['NIS2', 'SOC2', 'DORA', 'GDPR', 'ISO/IEC 27001', 'PCI DSS'].map(standard => (
                  <label key={standard} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.assignedStandards.includes(standard)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            assignedStandards: [...prev.assignedStandards, standard]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            assignedStandards: prev.assignedStandards.filter(s => s !== standard)
                          }));
                        }
                      }}
                      className="mr-2"
                    />
                    {standard}
                  </label>
                ))}
              </div>
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
                Add Supplier
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const RemoveSupplierModal: React.FC = () => {
    const [supplierName, setSupplierName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedSupplier && supplierName === selectedSupplier.name) {
        handleRemoveSupplier(selectedSupplier.id);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-red-600">Remove Supplier</h2>
            <button
              onClick={() => setIsRemoveModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              You are about to remove the supplier: <strong>{selectedSupplier?.name}</strong>
            </p>
            <p className="text-sm text-gray-600">
              This action cannot be undone. Please type the supplier name to confirm.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier Name
              </label>
              <input
                type="text"
                required
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Enter supplier name to confirm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsRemoveModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={supplierName !== selectedSupplier?.name}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Remove Supplier
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
            <Users className="h-8 w-8 text-[#56a3d9]" />
            <h1 className="text-3xl font-bold text-gray-900">Suppliers</h1>
          </div>
          <div className="flex items-center space-x-3">
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
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Supplier Categories & Filters</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-[#56a3d9] text-white rounded-md hover:bg-[#134876] transition-colors flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Supplier
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Access Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
            <div className="space-y-2">
              {['all', 'with-access', 'no-access'].map(level => (
                <label key={level} className="flex items-center">
                  <input
                    type="radio"
                    name="accessLevel"
                    checked={filters.accessLevel === level}
                    onChange={() => setFilters(prev => ({ ...prev, accessLevel: level }))}
                    className="mr-2"
                  />
                  {level === 'all' ? 'All Suppliers' : 
                   level === 'with-access' ? 'With Access to Infrastructure/Data' : 
                   'No Access (Basic Services)'}
                </label>
              ))}
            </div>
          </div>

          {/* Supplier Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier Type</label>
            <select
              value={filters.supplierType}
              onChange={(e) => setFilters(prev => ({ ...prev, supplierType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
            >
              <option value="all">All Types</option>
              <option value="Software Supplier">Software Supplier</option>
              <option value="Hardware Supplier">Hardware Supplier</option>
              <option value="Services Supplier">Services Supplier (including cloud)</option>
              <option value="Administrative/Economic Materials and Services">Administrative/Economic Materials and Services</option>
            </select>
          </div>

          {/* Standards */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Standards</label>
            <select
              value={filters.standards}
              onChange={(e) => setFilters(prev => ({ ...prev, standards: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
            >
              <option value="all">All Standards</option>
              <option value="NIS2">NIS 2</option>
              <option value="SOC2">SOC v2</option>
              <option value="GDPR">GDPR</option>
              <option value="DORA">DORA</option>
            </select>
          </div>

          {/* Compliance Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Level</label>
            <select
              value={filters.complianceLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, complianceLevel: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
            >
              <option value="all">All Levels</option>
              <option value="high">High (&gt;85%)</option>
              <option value="medium">Medium (40-85%)</option>
              <option value="low">Low (&lt;40%)</option>
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search suppliers by name, category, or responsible person..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
            />
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Supplier Assessments</h2>
          <div className="text-sm text-gray-600">
            {filteredSuppliers.length} of {suppliers.length} suppliers
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('name')}>
                  <div className="flex items-center space-x-1">
                    <span>Supplier Name</span>
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Sub-Gradation</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Assigned Standards</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('complianceLevel')}>
                  <div className="flex items-center space-x-1">
                    <span>Compliance %</span>
                    {sortField === 'complianceLevel' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('lastAssessment')}>
                  <div className="flex items-center space-x-1">
                    <span>Last Assessment</span>
                    {sortField === 'lastAssessment' && (
                      sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map(supplier => (
                <tr key={supplier.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-900">{supplier.name}</div>
                      <div className="text-sm text-gray-500">{supplier.supplierType}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{supplier.category}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      supplier.subGradation === 'With Access' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {supplier.subGradation}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {supplier.assignedStandards.map(standard => (
                        <span key={standard} className="px-2 py-1 bg-[#56a3d9] text-white text-xs rounded">
                          {standard}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplianceColor(supplier.complianceLevel)}`}>
                      {supplier.complianceLevel}% ({getComplianceText(supplier.complianceLevel)})
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{supplier.lastAssessment}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          // Handle view assessment
                        }}
                        className="p-1 text-[#56a3d9] hover:text-[#134876] transition-colors"
                        title="View Assessment"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          // Handle edit
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                        title="Edit Supplier"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedSupplier(supplier);
                          setIsRemoveModalOpen(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 transition-colors"
                        title="Remove Supplier"
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

        {filteredSuppliers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No suppliers found matching the current filters.
          </div>
        )}
      </div>

      {/* Modals */}
      {isAddModalOpen && <AddSupplierModal />}
      {isRemoveModalOpen && <RemoveSupplierModal />}
    </div>
  );
};

export default Suppliers;