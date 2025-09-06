import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui'
import { useAuth } from '../components/AuthProvider'
import { useI18n } from '../i18n'
import { API_ENDPOINTS } from '../config/api'
import scanService, { type ScanStatus } from '../services/scanService'
import { Server, Shield, AlertTriangle, CheckCircle, Clock, Globe, Database, Monitor, RefreshCw } from 'lucide-react'

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
  const [activeScan, setActiveScan] = useState<ScanStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isCompanyLLD = Array.isArray(user?.organizations) && user!.organizations!.includes('Company LLD')

  useEffect(() => {
    if (isCompanyLLD) {
      fetchAssets()
      checkActiveScan()
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

  const checkActiveScan = async () => {
    try {
      const history = await scanService.getScanHistory()
      if (history.length > 0) {
        const latestScan = history[0]
        setActiveScan(latestScan)
        
        // Update asset information based on scan results
        if (latestScan.status === 'completed') {
          const report = await scanService.getScanReport(latestScan.scanId)
          if (report) {
            updateAssetsFromScan([report])
          }
        }
      }
    } catch (error) {
      console.error('Failed to check active scan:', error)
    }
  }

  const updateAssetsFromScan = (reports: any[]) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => {
        // Find reports for this asset
        const assetReports = reports.filter(report => 
          report.host === asset.ip || report.host === asset.name
        )
        
        if (assetReports.length > 0) {
          // Calculate new risk level based on scan results
          const criticalCount = assetReports.filter(r => r.riskLevel === 'Critical').length
          const highCount = assetReports.filter(r => r.riskLevel === 'High').length
          const mediumCount = assetReports.filter(r => r.riskLevel === 'Medium').length
          const lowCount = assetReports.filter(r => r.riskLevel === 'Low').length
          
          let newRiskLevel = 'Low'
          let newCompliance = 100
          
          if (criticalCount > 0) {
            newRiskLevel = 'Critical'
            newCompliance = 25
          } else if (highCount > 0) {
            newRiskLevel = 'High'
            newCompliance = 50
          } else if (mediumCount > 0) {
            newRiskLevel = 'Medium'
            newCompliance = 75
          }
          
          return {
            ...asset,
            riskLevel: newRiskLevel,
            compliancePercentage: newCompliance,
            vulnerabilities: {
              critical: criticalCount,
              high: highCount,
              medium: mediumCount,
              low: lowCount
            },
            lastAssessment: new Date().toLocaleDateString()
          }
        }
        
        return asset
      })
    )
  }

  if (loading) return <div className="p-6">Loading assets...</div>
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Server className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Assets - Company LLD Infrastructure</h1>
        </div>
        
        {/* Scan Status Indicator */}
        {isCompanyLLD && activeScan && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
            {activeScan.status === 'running' && <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />}
            {activeScan.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
            {activeScan.status === 'failed' && <AlertTriangle className="h-4 w-4 text-red-600" />}
            <span className="text-sm font-medium text-blue-800">
              {activeScan.status === 'running' && `Scanning... ${activeScan.progress}%`}
              {activeScan.status === 'completed' && 'Scan Completed'}
              {activeScan.status === 'failed' && 'Scan Failed'}
            </span>
          </div>
        )}
      </div>

      {isCompanyLLD && assets.length > 0 ? (
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