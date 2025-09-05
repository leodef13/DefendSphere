import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui'
import { useI18n } from '../i18n'
import { 
  Shield, 
  Database, 
  Cloud, 
  Zap, 
  CheckCircle, 
  XCircle, 
  Settings,
  Plus,
  ExternalLink
} from 'lucide-react'

interface Integration {
  id: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'error'
  type: 'security' | 'monitoring' | 'cloud' | 'database'
  lastSync?: string
  configurable: boolean
}

const mockIntegrations: Integration[] = [
  {
    id: '1',
    name: 'SIEM Integration',
    description: 'Security Information and Event Management system',
    status: 'active',
    type: 'security',
    lastSync: '2024-01-15T10:30:00Z',
    configurable: true
  },
  {
    id: '2',
    name: 'AWS CloudTrail',
    description: 'Amazon Web Services CloudTrail logging',
    status: 'active',
    type: 'cloud',
    lastSync: '2024-01-15T10:25:00Z',
    configurable: true
  },
  {
    id: '3',
    name: 'Microsoft Sentinel',
    description: 'Microsoft Azure Sentinel SIEM',
    status: 'inactive',
    type: 'security',
    configurable: true
  },
  {
    id: '4',
    name: 'Splunk Enterprise',
    description: 'Splunk Enterprise Security platform',
    status: 'error',
    type: 'monitoring',
    lastSync: '2024-01-14T15:45:00Z',
    configurable: true
  },
  {
    id: '5',
    name: 'PostgreSQL Database',
    description: 'PostgreSQL database monitoring',
    status: 'active',
    type: 'database',
    lastSync: '2024-01-15T10:20:00Z',
    configurable: false
  }
]

const getStatusIcon = (status: Integration['status']) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-5 w-5 text-green-500" />
    case 'inactive':
      return <XCircle className="h-5 w-5 text-gray-400" />
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />
    default:
      return <XCircle className="h-5 w-5 text-gray-400" />
  }
}

const getStatusText = (status: Integration['status'], t: (key: string) => string) => {
  switch (status) {
    case 'active':
      return t('common.active') || 'Active'
    case 'inactive':
      return t('common.inactive') || 'Inactive'
    case 'error':
      return t('common.error') || 'Error'
    default:
      return t('common.unknown') || 'Unknown'
  }
}

const getTypeIcon = (type: Integration['type']) => {
  switch (type) {
    case 'security':
      return <Shield className="h-5 w-5 text-blue-500" />
    case 'monitoring':
      return <Zap className="h-5 w-5 text-yellow-500" />
    case 'cloud':
      return <Cloud className="h-5 w-5 text-purple-500" />
    case 'database':
      return <Database className="h-5 w-5 text-green-500" />
    default:
      return <Settings className="h-5 w-5 text-gray-500" />
  }
}

export default function Integrations() {
  const { t } = useI18n()
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations)
  const [selectedType, setSelectedType] = useState<string>('all')

  const filteredIntegrations = selectedType === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.type === selectedType)

  const handleToggleStatus = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { 
            ...integration, 
            status: integration.status === 'active' ? 'inactive' : 'active',
            lastSync: integration.status === 'active' ? undefined : new Date().toISOString()
          }
        : integration
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('nav.integrations')}</h1>
        <button className="btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-md">
          <Plus className="h-4 w-4" />
          {t('common.add')} {t('nav.integrations')}
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedType === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSelectedType('security')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedType === 'security' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Security
        </button>
        <button
          onClick={() => setSelectedType('monitoring')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedType === 'monitoring' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Monitoring
        </button>
        <button
          onClick={() => setSelectedType('cloud')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedType === 'cloud' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cloud
        </button>
        <button
          onClick={() => setSelectedType('database')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            selectedType === 'database' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Database
        </button>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIntegrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(integration.type)}
                  <div>
                    <h3 className="font-semibold text-lg">{integration.name}</h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                {getStatusIcon(integration.status)}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    integration.status === 'active' ? 'text-green-600' :
                    integration.status === 'error' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {getStatusText(integration.status, t)}
                  </span>
                </div>
                
                {integration.lastSync && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Sync:</span>
                    <span className="text-gray-900">
                      {new Date(integration.lastSync).toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleToggleStatus(integration.id)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      integration.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {integration.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                  
                  {integration.configurable && (
                    <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                      <Settings className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIntegrations.length === 0 && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations found</h3>
          <p className="text-gray-600">Try adjusting your filter or add a new integration.</p>
        </div>
      )}
    </div>
  )
}