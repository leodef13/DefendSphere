import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui'
import { useAuth } from '../components/AuthProvider'
import { useI18n } from '../i18n'
import { API_ENDPOINTS } from '../config/api'
import { Server, Shield, AlertTriangle, CheckCircle, Clock, Globe, Database, Monitor } from 'lucide-react'

interface Asset {
  id: string
  name: string
  type: string
  environment: string
  ip: string
  assignedStandards: string[]
  compliancePercentage: number
  riskLevel: string
  lastAssessment: string
  vulnerabilities: {
    critical: number
    high: number
    medium: number
    low: number
  }
}

const Assets: React.FC = () => {
  const { t } = useI18n()
  const { token, user } = useAuth()
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user?.username === 'user1') {
      fetchAssets()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchAssets = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(API_ENDPOINTS.REPORTS_ASSETS, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch assets data')
      }

      const data = await response.json()
      setAssets(data.assets)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return 'text-red-800 bg-red-100'
      case 'high': return 'text-red-700 bg-red-50'
      case 'medium': return 'text-yellow-700 bg-yellow-50'
      case 'low': return 'text-green-700 bg-green-50'
      default: return 'text-gray-700 bg-gray-50'
    }
  }

  const getRiskLevelIcon = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />
      default: return <Shield className="h-4 w-4 text-gray-500" />
    }
  }

  const getVulnerabilityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return '#8B0000'
      case 'high': return '#DC2626'
      case 'medium': return '#F59E0B'
      case 'low': return '#10B981'
      default: return '#6B7280'
    }
  }

  if (loading) return <div className="p-6">Loading assets...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Server className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold">Assets - MyRockShows Infrastructure</h1>
      </div>

      {user?.username === 'user1' && assets.length > 0 ? (
        <div className="space-y-6">
          {assets.map((asset) => (
            <Card key={asset.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Globe className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{asset.name}</h3>
                      <p className="text-sm text-gray-600">{asset.type} • {asset.environment}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getRiskLevelIcon(asset.riskLevel)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevelColor(asset.riskLevel)}`}>
                      {asset.riskLevel} Risk
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Asset Details */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Asset Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-gray-500" />
                        <span className="text-sm"><strong>Type:</strong> {asset.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-gray-500" />
                        <span className="text-sm"><strong>Environment:</strong> {asset.environment}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm"><strong>IP Address:</strong> {asset.ip}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm"><strong>Last Assessment:</strong> {asset.lastAssessment}</span>
                      </div>
                    </div>
                  </div>

                  {/* Compliance */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Compliance</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Compliance Score</span>
                        <span className="font-semibold text-lg">{asset.compliancePercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${asset.compliancePercentage}%` }}
                        ></div>
                      </div>
                      <div className="space-y-2">
                        <span className="text-sm font-medium">Assigned Standards:</span>
                        <div className="flex flex-wrap gap-1">
                          {asset.assignedStandards.map((standard, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {standard}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Vulnerability Summary */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-800">Vulnerability Summary</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getVulnerabilityColor('critical') }}></div>
                          <span className="text-sm">Critical</span>
                        </div>
                        <span className="font-semibold">{asset.vulnerabilities.critical}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getVulnerabilityColor('high') }}></div>
                          <span className="text-sm">High</span>
                        </div>
                        <span className="font-semibold">{asset.vulnerabilities.high}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getVulnerabilityColor('medium') }}></div>
                          <span className="text-sm">Medium</span>
                        </div>
                        <span className="font-semibold">{asset.vulnerabilities.medium}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getVulnerabilityColor('low') }}></div>
                          <span className="text-sm">Low</span>
                        </div>
                        <span className="font-semibold">{asset.vulnerabilities.low}</span>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Total Vulnerabilities</span>
                          <span className="font-semibold text-lg">
                            {asset.vulnerabilities.critical + asset.vulnerabilities.high + asset.vulnerabilities.medium + asset.vulnerabilities.low}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <Server className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Asset Management</h3>
              <p className="text-gray-600 mb-4">
                Monitor and manage your IT assets, track compliance, and assess security vulnerabilities.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Asset data is currently available for user1. 
                  Contact your administrator to add your assets to the system.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Assets