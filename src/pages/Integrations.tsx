import React, { useState } from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { Plug, CheckCircle, AlertTriangle, Clock, Plus, Settings, Activity, Bot, Power, Wand2, X } from 'lucide-react'
import { useEffect } from 'react'

export default function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState('')
  const [aiStatus, setAiStatus] = useState<{ active: boolean; provider?: string } | null>(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const [configOpen, setConfigOpen] = useState(false)
  const [configProvider, setConfigProvider] = useState('openai')
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoadingAi(true)
        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
        const res = await fetch(`${base}/ai-assistant`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`
          }
        })
        if (res.ok) {
          const data = await res.json()
          setAiStatus(data)
        } else {
          setAiStatus({ active: false })
        }
      } catch {
        setAiStatus({ active: false })
      } finally {
        setLoadingAi(false)
      }
    }
    fetchStatus()
  }, [])

  const integrations = [
    {
      id: 'integration-1',
      name: 'SIEM System',
      type: 'Security Information and Event Management',
      provider: 'Splunk',
      status: 'active',
      health: 'healthy',
      lastSync: '2024-03-15 14:30',
      nextSync: '2024-03-15 15:00',
      dataVolume: '2.4 GB/day',
      alerts: 156
    },
    {
      id: 'integration-2',
      name: 'Threat Intelligence',
      type: 'External Threat Feeds',
      provider: 'CrowdStrike',
      status: 'active',
      health: 'healthy',
      lastSync: '2024-03-15 13:45',
      nextSync: '2024-03-15 14:45',
      dataVolume: '150 MB/day',
      alerts: 23
    },
    {
      id: 'integration-3',
      name: 'Vulnerability Scanner',
      type: 'Security Assessment',
      provider: 'Nessus',
      status: 'maintenance',
      health: 'warning',
      lastSync: '2024-03-14 18:00',
      nextSync: '2024-03-15 18:00',
      dataVolume: '500 MB/day',
      alerts: 89
    },
    {
      id: 'integration-4',
      name: 'Cloud Security',
      type: 'Cloud Provider Security',
      provider: 'AWS GuardDuty',
      status: 'active',
      health: 'healthy',
      lastSync: '2024-03-15 12:00',
      nextSync: '2024-03-15 13:00',
      dataVolume: '800 MB/day',
      alerts: 67
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'inactive':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'maintenance':
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h1>
          <p className="text-gray-600 dark:text-neutral-400">
            Manage external system integrations and data flows
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Integration
        </Button>
      </div>
      {configOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setConfigOpen(false)} />
          <div className="relative bg-white dark:bg-neutral-900 rounded-xl shadow-xl w-full max-w-lg border border-gray-200 dark:border-neutral-800">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-neutral-800">
              <div className="font-medium">Configure Provider: <span className="capitalize">{configProvider}</span></div>
              <button className="p-1" onClick={() => setConfigOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 space-y-3">
              {(() => {
                const fieldsByProvider = {
                  openai: [
                    { key: 'apiKey', label: 'API Key', type: 'password' },
                    { key: 'model', label: 'Model' },
                    { key: 'maxTokens', label: 'Max Tokens' }
                  ],
                  claude: [
                    { key: 'apiKey', label: 'API Key', type: 'password' },
                    { key: 'model', label: 'Model' },
                    { key: 'maxTokens', label: 'Max Tokens' }
                  ],
                  gemini: [
                    { key: 'apiKey', label: 'API Key', type: 'password' },
                    { key: 'model', label: 'Model' },
                    { key: 'temperature', label: 'Temperature' }
                  ],
                  azure: [
                    { key: 'apiKey', label: 'API Key', type: 'password' },
                    { key: 'endpoint', label: 'Endpoint' },
                    { key: 'model', label: 'Model' }
                  ],
                  mistral: [
                    { key: 'apiKey', label: 'API Key', type: 'password' },
                    { key: 'model', label: 'Model' }
                  ],
                  groq: [
                    { key: 'apiKey', label: 'API Key', type: 'password' },
                    { key: 'model', label: 'Model' }
                  ],
                  vertex: [
                    { key: 'apiKey', label: 'API Key', type: 'password' },
                    { key: 'project', label: 'Project' },
                    { key: 'location', label: 'Location' },
                    { key: 'model', label: 'Model' }
                  ],
                  ollama: [
                    { key: 'endpoint', label: 'Endpoint' },
                    { key: 'model', label: 'Model' }
                  ]
                } as Record<string, { key: string; label: string; type?: string }[]>
                const fields = fieldsByProvider[configProvider] || []
                return (
                  <div className="space-y-3">
                    {fields.map((f) => (
                      <div key={f.key} className="space-y-1">
                        <label className="text-sm text-gray-700 dark:text-neutral-300">{f.label}</label>
                        <input
                          type={f.type || 'text'}
                          className="w-full rounded-md border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-sm"
                          value={form[f.key] || ''}
                          placeholder={f.key.toLowerCase().includes('api') ? '••••••••' : ''}
                          onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                        />
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
            <div className="p-4 flex justify-end gap-2 border-t border-gray-100 dark:border-neutral-800">
              <Button className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200" onClick={() => setConfigOpen(false)}>Cancel</Button>
              <Button
                className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200"
                onClick={async () => {
                  try {
                    setTesting(true)
                    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                    const res = await fetch(`${base}/ai-assistant/${configProvider}/test`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ message: 'ping' })
                    })
                    const data = await res.json().catch(() => ({}))
                    alert(res.ok ? `Test OK: ${data.provider}` : `Test failed`)
                  } finally {
                    setTesting(false)
                  }
                }}
                disabled={testing}
              >{testing ? 'Testing…' : 'Проверить подключение'}</Button>
              <Button
                onClick={async () => {
                  try {
                    setSaving(true)
                    const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                    const res = await fetch(`${base}/ai-assistant/${configProvider}/config`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`,
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(form)
                    })
                    if (res.ok) {
                      alert('Configuration saved')
                    } else {
                      alert('Failed to save configuration')
                    }
                  } finally {
                    setSaving(false)
                  }
                }}
                disabled={saving}
              >{saving ? 'Saving…' : 'Сохранить в Дашборду'}</Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Plug className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Total Integrations</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-300">4</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">active connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Healthy</h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-300">3</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">integrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900">
              <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Warnings</h3>
            <p className="mt-2 text-3xl font-bold text-yellow-600 dark:text-yellow-300">1</p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">attention needed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Bot className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">AI Assistant</h3>
            <p className="mt-2 text-xl font-semibold text-purple-600 dark:text-purple-300">
              {loadingAi ? 'Loading…' : aiStatus?.active ? `Active · ${aiStatus.provider}` : 'Not Connected'}
            </p>
            <p className="text-sm text-gray-600 dark:text-neutral-400">status</p>
            <div className="mt-3 flex justify-center gap-2">
              <Button className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200" onClick={() => setSelectedIntegration('ai-assistant')}>
                <Settings className="h-4 w-4 mr-1" /> Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Integration Status</h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Integration</th>
                  <th className="text-left px-4 py-2 font-medium">Type</th>
                  <th className="text-left px-4 py-2 font-medium">Provider</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="text-left px-4 py-2 font-medium">Health</th>
                  <th className="text-left px-4 py-2 font-medium">Last Sync</th>
                  <th className="text-left px-4 py-2 font-medium">Data Volume</th>
                  <th className="text-left px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((integration) => (
                  <tr 
                    key={integration.id} 
                    className={`border-t border-gray-100 dark:border-neutral-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 ${
                      selectedIntegration === integration.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => setSelectedIntegration(integration.id)}
                  >
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Plug className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{integration.name}</div>
                          <div className="text-xs text-gray-500 dark:text-neutral-400">{integration.alerts} alerts today</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">{integration.type}</td>
                    <td className="px-4 py-2">{integration.provider}</td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                        {getStatusIcon(integration.status)}
                        {integration.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthColor(integration.health)}`}>
                        {integration.health}
                      </span>
                    </td>
                    <td className="px-4 py-2">{integration.lastSync}</td>
                    <td className="px-4 py-2">{integration.dataVolume}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedIntegration && selectedIntegration !== 'ai-assistant' && (
        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Integration Details</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Configuration</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">API Endpoint</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">https://api.provider.com/v1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Authentication</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">OAuth 2.0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Sync Interval</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">1 hour</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Data Retention</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">90 days</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Performance Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Uptime</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">99.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Response Time</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">120ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Error Rate</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">0.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-neutral-400">Last Error</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">None</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedIntegration === 'ai-assistant' && (
        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Assistant Integration</h3>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-sm text-gray-600 dark:text-neutral-400 mb-4">
              Manage external AI providers for the Security Assistant. Enable one provider at a time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['openai','claude','gemini','azure','mistral','groq','vertex','ollama'].map((p) => (
                <div key={p} className={`p-4 rounded-lg border ${aiStatus?.active && aiStatus.provider === p ? 'border-green-400' : 'border-gray-200 dark:border-neutral-800'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wand2 className="h-4 w-4 text-blue-600" />
                      <div className="font-medium capitalize">{p}</div>
                    </div>
                    {aiStatus?.active && aiStatus.provider === p ? (
                      <span className="text-xs inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Power className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="text-xs inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200"
                      onClick={async () => {
                        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                        const res = await fetch(`${base}/ai-assistant/${p}/enable`, {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}` }
                        })
                        if (res.ok) {
                          const data = await res.json()
                          setAiStatus({ active: data.active, provider: data.provider })
                        }
                      }}
                    >Enable</Button>
                    <Button className="bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200"
                      onClick={async () => {
                        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                        const res = await fetch(`${base}/ai-assistant/${p}/disable`, {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}` }
                        })
                        if (res.ok) {
                          setAiStatus({ active: false })
                        }
                      }}
                    >Disable</Button>
                    <Button
                      onClick={async () => {
                        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                        const res = await fetch(`${base}/ai-assistant/${p}/test`, {
                          method: 'POST',
                          headers: {
                            'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}`,
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({ message: 'ping' })
                        })
                        const data = await res.json().catch(() => ({}))
                        alert(res.ok ? `Test OK: ${data.provider}` : `Test failed`)
                      }}
                    >Test</Button>
                    <Button className="bg-blue-600 text-white"
                      onClick={async () => {
                        setConfigProvider(p)
                        setForm({})
                        setConfigOpen(true)
                        try {
                          const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
                          const res = await fetch(`${base}/ai-assistant/${p}/config`, {
                            headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken') || sessionStorage.getItem('authToken')}` }
                          })
                          if (res.ok) {
                            const data = await res.json()
                            if (data.config) setForm(data.config)
                          }
                        } catch {}
                      }}
                    >Configure</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Sync Activity</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800 dark:text-green-200">SIEM System sync completed</span>
                </div>
                <span className="text-xs text-green-600 dark:text-green-300">2 min ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800 dark:text-green-200">Threat Intelligence updated</span>
                </div>
                <span className="text-xs text-green-600 dark:text-green-300">15 min ago</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800 dark:text-yellow-200">Vulnerability Scanner maintenance</span>
                </div>
                <span className="text-xs text-yellow-600 dark:text-yellow-300">1 hour ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-0">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upcoming Tasks</h3>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">API Key Rotation</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300">Due in 3 days</p>
                </div>
                <span className="text-xs text-blue-600 dark:text-blue-300">High Priority</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Performance Review</p>
                  <p className="text-xs text-gray-700 dark:text-gray-300">Due in 1 week</p>
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-300">Medium Priority</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}