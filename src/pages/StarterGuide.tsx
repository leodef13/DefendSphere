import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Edit3, 
  Save,
  Building,
  User,
  Mail,
  Phone,
  Shield,
  Database,
  Cloud,
  Server,
  Users,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

interface StarterGuideForm {
  sector: string;
  hasInformationSystems: boolean;
  systemLocation?: string;
  processesEUCitizenData: boolean;
  dataTypes?: string[];
  hasSecurityStrategy: string;
  hasSecurityResponsible: boolean;
  hasCybersecurityTeam: string;
  hasDisasterRecoveryPlan: string;
  testsVulnerabilities: string;
  wantsVulnerabilityReport: boolean;
  publicResources?: string;
  relevantStandards: string[];
  plansCertifiedAudit: string;
  interestedInPreAudit: boolean;
  wantsSelfAssessment: boolean;
  contactName: string;
  companyName: string;
  email: string;
  phone: string;
  privacyPolicyAccepted: boolean;
}

interface StarterGuideData extends StarterGuideForm {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const StarterGuide: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isFormMode, setIsFormMode] = useState(true);
  const [formData, setFormData] = useState<StarterGuideForm>({
    sector: '',
    hasInformationSystems: false,
    systemLocation: undefined,
    processesEUCitizenData: false,
    dataTypes: [],
    hasSecurityStrategy: 'no',
    hasSecurityResponsible: false,
    hasCybersecurityTeam: 'no',
    hasDisasterRecoveryPlan: 'no',
    testsVulnerabilities: 'no',
    wantsVulnerabilityReport: false,
    publicResources: undefined,
    relevantStandards: [],
    plansCertifiedAudit: 'no',
    interestedInPreAudit: false,
    wantsSelfAssessment: false,
    contactName: '',
    companyName: '',
    email: '',
    phone: '',
    privacyPolicyAccepted: false
  });

  const [savedData, setSavedData] = useState<StarterGuideData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Partial<StarterGuideForm>>({});

  const sectors = [
    'Banking',
    'Chemical industry',
    'Digital infrastructure',
    'Digital service providers',
    'Healthcare',
    'Transport',
    'Other'
  ];

  const standards = [
    'GDPR',
    'DORA',
    'NIS2',
    'SOC2',
    'ISO/IEC 27001',
    'PCI DSS'
  ];

  const dataTypes = [
    'Name',
    'Email',
    'Phone',
    'Financial data',
    'Address',
    'Other'
  ];

  useEffect(() => {
    loadStarterGuideData();
  }, []);

  const loadStarterGuideData = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/starter-guide`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSavedData(data);
        setIsFormMode(false);
      }
    } catch (error) {
      console.error('Error loading starter guide data:', error);
    }
  };

  const handleInputChange = (field: keyof StarterGuideForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleArrayChange = (field: keyof StarterGuideForm, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[] || []), value]
        : (prev[field] as string[] || []).filter(item => item !== value)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<StarterGuideForm> = {};

    if (!formData.sector) newErrors.sector = 'Sector is required';
    if (!formData.contactName) newErrors.contactName = 'Contact name is required';
    if (!formData.companyName) newErrors.companyName = 'Company name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.privacyPolicyAccepted) newErrors.privacyPolicyAccepted = 'Privacy Policy must be accepted';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/starter-guide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setSavedData(data);
        setIsFormMode(false);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!savedData) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/starter-guide/${savedData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        setSavedData(data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!savedData) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/starter-guide/${savedData.id}/export?format=${format}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `starter-guide-${savedData.companyName}-${format}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sector Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Which sector does your organization belong to? *
        </label>
        <select
          value={formData.sector}
          onChange={(e) => handleInputChange('sector', e.target.value)}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9] ${
            errors.sector ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select sector</option>
          {sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
        {errors.sector && <p className="text-red-500 text-sm mt-1">{errors.sector}</p>}
      </div>

      {/* Information Systems */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you operate any information systems within the selected sector(s)? *
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="hasInformationSystems"
              checked={formData.hasInformationSystems === true}
              onChange={() => handleInputChange('hasInformationSystems', true)}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasInformationSystems"
              checked={formData.hasInformationSystems === false}
              onChange={() => handleInputChange('hasInformationSystems', false)}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>

      {/* System Location */}
      {formData.hasInformationSystems && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Where are your systems located?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['On-premise', 'Rented', 'Cloud', 'Not sure'].map(location => (
              <label key={location} className="flex items-center">
                <input
                  type="radio"
                  name="systemLocation"
                  checked={formData.systemLocation === location}
                  onChange={() => handleInputChange('systemLocation', location)}
                  className="mr-2"
                />
                {location}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* EU Citizen Data */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you process personal data of EU citizens?
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="processesEUCitizenData"
              checked={formData.processesEUCitizenData === true}
              onChange={() => handleInputChange('processesEUCitizenData', true)}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="processesEUCitizenData"
              checked={formData.processesEUCitizenData === false}
              onChange={() => handleInputChange('processesEUCitizenData', false)}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>

      {/* Data Types */}
      {formData.processesEUCitizenData && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            What types of data do you process?
          </label>
          <div className="grid grid-cols-2 gap-2">
            {dataTypes.map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.dataTypes?.includes(type) || false}
                  onChange={(e) => handleArrayChange('dataTypes', type, e.target.checked)}
                  className="mr-2"
                />
                {type}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Security Strategy */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you have an information security strategy?
        </label>
        <div className="space-y-2">
          {['Yes', 'No', 'In development'].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="hasSecurityStrategy"
                checked={formData.hasSecurityStrategy === option}
                onChange={() => handleInputChange('hasSecurityStrategy', option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Security Responsible */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you have a person responsible for information security risks?
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="hasSecurityResponsible"
              checked={formData.hasSecurityResponsible === true}
              onChange={() => handleInputChange('hasSecurityResponsible', true)}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="hasSecurityResponsible"
              checked={formData.hasSecurityResponsible === false}
              onChange={() => handleInputChange('hasSecurityResponsible', false)}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>

      {/* Cybersecurity Team */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you have a cybersecurity officer or team?
        </label>
        <div className="space-y-2">
          {['Yes', 'No', 'External provider'].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="hasCybersecurityTeam"
                checked={formData.hasCybersecurityTeam === option}
                onChange={() => handleInputChange('hasCybersecurityTeam', option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Disaster Recovery Plan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you have a disaster recovery or incident response plan?
        </label>
        <div className="space-y-2">
          {['Yes', 'No', 'Not sure'].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="hasDisasterRecoveryPlan"
                checked={formData.hasDisasterRecoveryPlan === option}
                onChange={() => handleInputChange('hasDisasterRecoveryPlan', option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Vulnerability Testing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you test your systems for vulnerabilities or security gaps?
        </label>
        <div className="space-y-2">
          {['Yes', 'No', 'Sometimes'].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="testsVulnerabilities"
                checked={formData.testsVulnerabilities === option}
                onChange={() => handleInputChange('testsVulnerabilities', option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Vulnerability Report */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Would you like to receive a short vulnerability report for publicly accessible systems?
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="wantsVulnerabilityReport"
              checked={formData.wantsVulnerabilityReport === true}
              onChange={() => handleInputChange('wantsVulnerabilityReport', true)}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="wantsVulnerabilityReport"
              checked={formData.wantsVulnerabilityReport === false}
              onChange={() => handleInputChange('wantsVulnerabilityReport', false)}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>

      {/* Public Resources */}
      {formData.wantsVulnerabilityReport && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Please provide your public resources (e.g., domains or IP addresses)
          </label>
          <textarea
            value={formData.publicResources || ''}
            onChange={(e) => handleInputChange('publicResources', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
            rows={3}
            placeholder="Enter domains or IP addresses..."
          />
        </div>
      )}

      {/* Relevant Standards */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Which compliance or security standards are most relevant?
        </label>
        <div className="grid grid-cols-2 gap-2">
          {standards.map(standard => (
            <label key={standard} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.relevantStandards?.includes(standard) || false}
                onChange={(e) => handleArrayChange('relevantStandards', standard, e.target.checked)}
                className="mr-2"
              />
              {standard}
            </label>
          ))}
        </div>
      </div>

      {/* Certified Audit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Do you plan to undergo a certified audit in the next 12 months?
        </label>
        <div className="space-y-2">
          {['Yes', 'No', 'Not sure'].map(option => (
            <label key={option} className="flex items-center">
              <input
                type="radio"
                name="plansCertifiedAudit"
                checked={formData.plansCertifiedAudit === option}
                onChange={() => handleInputChange('plansCertifiedAudit', option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      {/* Pre-audit Checkup */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Interested in pre-audit checkup and recommendations?
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="interestedInPreAudit"
              checked={formData.interestedInPreAudit === true}
              onChange={() => handleInputChange('interestedInPreAudit', true)}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="interestedInPreAudit"
              checked={formData.interestedInPreAudit === false}
              onChange={() => handleInputChange('interestedInPreAudit', false)}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>

      {/* Self Assessment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Would you like to self-assess your systems using automated platform?
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="wantsSelfAssessment"
              checked={formData.wantsSelfAssessment === true}
              onChange={() => handleInputChange('wantsSelfAssessment', true)}
              className="mr-2"
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="wantsSelfAssessment"
              checked={formData.wantsSelfAssessment === false}
              onChange={() => handleInputChange('wantsSelfAssessment', false)}
              className="mr-2"
            />
            No
          </label>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Name *
            </label>
            <input
              type="text"
              value={formData.contactName}
              onChange={(e) => handleInputChange('contactName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9] ${
                errors.contactName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter contact name"
            />
            {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9] ${
                errors.companyName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter company name"
            />
            {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9] ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9] ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter phone number"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>
        </div>
      </div>

      {/* Privacy Policy */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.privacyPolicyAccepted}
            onChange={(e) => handleInputChange('privacyPolicyAccepted', e.target.checked)}
            className="mr-2"
          />
          <span className="text-sm text-gray-700">
            I accept the Privacy Policy and agree to the processing of my personal data *
          </span>
        </label>
        {errors.privacyPolicyAccepted && (
          <p className="text-red-500 text-sm mt-1">Privacy Policy must be accepted</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-[#56a3d9] text-white rounded-md hover:bg-[#134876] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Check My Systems
            </>
          )}
        </button>
      </div>
    </form>
  );

  const renderSummary = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#56a3d9] to-[#134876] text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Express Check-Up Results</h2>
        <p className="text-lg opacity-90">Your digital infrastructure assessment is complete</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <Building className="h-8 w-8 text-[#56a3d9]" />
            <div>
              <h3 className="font-semibold text-gray-900">Company</h3>
              <p className="text-gray-600">{savedData?.companyName}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-[#56a3d9]" />
            <div>
              <h3 className="font-semibold text-gray-900">Contact</h3>
              <p className="text-gray-600">{savedData?.contactName}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <Mail className="h-8 w-8 text-[#56a3d9]" />
            <div>
              <h3 className="font-semibold text-gray-900">Email</h3>
              <p className="text-gray-600">{savedData?.email}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <Phone className="h-8 w-8 text-[#56a3d9]" />
            <div>
              <h3 className="font-semibold text-gray-900">Phone</h3>
              <p className="text-gray-600">{savedData?.phone}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-[#56a3d9]" />
            <div>
              <h3 className="font-semibold text-gray-900">Systems</h3>
              <p className="text-gray-600">
                {savedData?.hasInformationSystems ? 'Yes' : 'No'}
                {savedData?.hasInformationSystems && savedData?.systemLocation && ` (${savedData.systemLocation})`}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-[#56a3d9]" />
            <div>
              <h3 className="font-semibold text-gray-900">Standards</h3>
              <p className="text-gray-600">
                {savedData?.relevantStandards?.length || 0} selected
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment Summary</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Sector</h4>
              <p className="text-gray-900">{savedData?.sector}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Information Systems</h4>
              <p className="text-gray-900">
                {savedData?.hasInformationSystems ? 'Yes' : 'No'}
                {savedData?.hasInformationSystems && savedData?.systemLocation && ` - ${savedData.systemLocation}`}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">EU Data Processing</h4>
              <p className="text-gray-900">
                {savedData?.processesEUCitizenData ? 'Yes' : 'No'}
                {savedData?.processesEUCitizenData && savedData?.dataTypes && (
                  <span className="block text-sm text-gray-600">
                    Types: {savedData.dataTypes.join(', ')}
                  </span>
                )}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Security Strategy</h4>
              <p className="text-gray-900">{savedData?.hasSecurityStrategy}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Security Officer</h4>
              <p className="text-gray-900">{savedData?.hasSecurityResponsible ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Cybersecurity Team</h4>
              <p className="text-gray-900">{savedData?.hasCybersecurityTeam}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Disaster Recovery</h4>
              <p className="text-gray-900">{savedData?.hasDisasterRecoveryPlan}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Vulnerability Testing</h4>
              <p className="text-gray-900">{savedData?.testsVulnerabilities}</p>
            </div>
          </div>

          {savedData?.relevantStandards && savedData.relevantStandards.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700">Relevant Standards</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {savedData.relevantStandards.map(standard => (
                  <span key={standard} className="px-3 py-1 bg-[#56a3d9] text-white rounded-full text-sm">
                    {standard}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700">Certified Audit Plans</h4>
              <p className="text-gray-900">{savedData?.plansCertifiedAudit}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Pre-audit Interest</h4>
              <p className="text-gray-900">{savedData?.interestedInPreAudit ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Self Assessment</h4>
              <p className="text-gray-900">{savedData?.wantsSelfAssessment ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Vulnerability Report</h4>
              <p className="text-gray-900">{savedData?.wantsVulnerabilityReport ? 'Yes' : 'No'}</p>
            </div>
          </div>

          {savedData?.publicResources && (
            <div>
              <h4 className="font-medium text-gray-700">Public Resources</h4>
              <p className="text-gray-900">{savedData.publicResources}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => handleExport('pdf')}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export PDF
        </button>
        <button
          onClick={() => handleExport('excel')}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          Export Excel
        </button>
        <button
          onClick={() => {
            setFormData(savedData as StarterGuideForm);
            setIsEditing(true);
            setIsFormMode(true);
          }}
          className="px-6 py-2 bg-[#56a3d9] text-white rounded-md hover:bg-[#134876] transition-colors flex items-center"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Information
        </button>
        <button
          onClick={() => setIsFormMode(true)}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center"
        >
          <FileText className="h-4 w-4 mr-2" />
          Fill New Form
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Starter Guide
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Fill out this Form to Get an Express Check-Up of your Digital Infrastructure
          </p>
          <p className="text-lg text-gray-600 mb-4">
            We'll scan for risks and give you quick feedback — no technical background required.
          </p>
          <p className="text-lg font-semibold text-[#56a3d9]">
            Fast & Confidential.
          </p>
        </div>
      </div>

      {/* Content */}
      {isFormMode ? (
        <div className="card p-6">
          {isEditing && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <span className="text-blue-800 font-medium">
                  Editing mode - Make changes and click "Update Information" to save
                </span>
              </div>
            </div>
          )}
          
          {renderForm()}
          
          {isEditing && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setIsFormMode(false);
                    setFormData(savedData as StarterGuideForm);
                  }}
                  className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="px-6 py-2 bg-[#56a3d9] text-white rounded-md hover:bg-[#134876] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Information
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        renderSummary()
      )}
    </div>
  );
};

export default StarterGuide;