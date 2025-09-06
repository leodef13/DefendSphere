import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '../components/ui'
import { useI18n } from '../i18n'
import { useAuth } from '../components/AuthProvider'
import { API_ENDPOINTS } from '../config/api'
import { Shield, Plug, CheckCircle, XCircle, Settings, X, Wifi, WifiOff } from 'lucide-react'

interface IntegrationItem {
  id: string
  name: string
  description: string
  status: string
  category: string
  icon: string
  version: string
  author: string
  configured: boolean
  providers?: { key: string; title: string; params: string[] }[]
}

export default function Integrations() {
  const { t } = useI18n()
  const { token } = useAuth()
  const [integrations, setIntegrations] = useState<IntegrationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<IntegrationItem | null>(null)
  const [gbConfig, setGbConfig] = useState({ host: '217.65.144.232', port: 9392, username: '', password: '', useSSL: false })
  const [aiProvider, setAiProvider] = useState<string>('openai')
  const [aiConfig, setAiConfig] = useState<Record<string, string>>({ apiKey: '', model: 'gpt-4o-mini', endpoint: '' })
  const [testMsg, setTestMsg] = useState<string>('')
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.INTEGRATIONS_LIST, { headers: { 'Authorization': `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          setIntegrations(data.integrations || [])
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [token])

  const openIntegration = async (item: IntegrationItem) => {
    setSelected(item)
    if (item.id === 'scans_defendsphere_team') {
      try {
        const res = await fetch(API_ENDPOINTS.INTEGRATION_CONFIG(item.id), { headers: { 'Authorization': `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          if (data.config) {
            setGbConfig({
              host: data.config.host || '217.65.144.232',
              port: data.config.port || 9392,
              username: data.config.username || '',
              password: '',
              useSSL: data.config.useSSL || false
            })
          }
        }
      } catch {}
    }
    if (item.id === 'ai_providers' && item.providers && item.providers.length > 0) {
      setAiProvider(item.providers[0].key)
      setAiConfig({ apiKey: '', model: 'gpt-4o-mini', endpoint: '' })
    }
  }

  const saveGb = async () => {
    const res = await fetch(API_ENDPOINTS.INTEGRATION_CONFIG('scans_defendsphere_team'), {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(gbConfig)
    })
    if (res.ok) {
      setSelected(null)
      // refresh list
      const r = await fetch(API_ENDPOINTS.INTEGRATIONS_LIST, { headers: { 'Authorization': `Bearer ${token}` } })
      if (r.ok) {
        const data = await r.json()
        setIntegrations(data.integrations || [])
      }
    }
  }

  const testGb = async () => {
    try {
      setTesting(true)
      const res = await fetch(API_ENDPOINTS.INTEGRATION_TEST('scans_defendsphere_team'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(gbConfig)
      })
      const data = await res.json()
      setTestMsg(data.message || (data.success ? 'Connection successful' : 'Connection failed'))
    } finally {
      setTesting(false)
    }
  }

  const saveAi = async () => {
    const res = await fetch(`${API_ENDPOINTS.AI_ASSISTANT}/${aiProvider}/config`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(aiConfig)
    })
    if (res.ok) setSelected(null)
  }

  const enableAi = async () => {
    await fetch(`${API_ENDPOINTS.AI_ASSISTANT}/${aiProvider}/enable`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    })
  }

  if (loading) return <div className="p-6">Loading integrations...</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('nav.integrations')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openIntegration(integration)}>
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plug className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-lg">{integration.name}</h3>
                </div>
                <div className="flex items-center gap-1">
                  {integration.configured ? <Wifi className="h-4 w-4 text-green-600" /> : <WifiOff className="h-4 w-4 text-gray-400" />}
                  <span className={`text-xs px-2 py-1 rounded-full ${integration.configured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {integration.configured ? 'Configured' : 'Not Configured'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-2">{integration.description}</p>
              <div className="text-xs text-gray-500 flex gap-4">
                <span>{integration.category}</span>
                <span>v{integration.version}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Configure {selected.name}</h3>
              <button onClick={() => setSelected(null)} className="text-gray-500 hover:text-gray-700"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-4 space-y-4">
              {selected.id === 'scans_defendsphere_team' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Host / Endpoint</label>
                    <input className="mt-1 w-full border rounded-md px-3 py-2" value={gbConfig.host} onChange={(e) => setGbConfig({ ...gbConfig, host: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Port</label>
                    <input type="number" className="mt-1 w-full border rounded-md px-3 py-2" value={gbConfig.port} onChange={(e) => setGbConfig({ ...gbConfig, port: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Username</label>
                    <input className="mt-1 w-full border rounded-md px-3 py-2" value={gbConfig.username} onChange={(e) => setGbConfig({ ...gbConfig, username: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" className="mt-1 w-full border rounded-md px-3 py-2" value={gbConfig.password} onChange={(e) => setGbConfig({ ...gbConfig, password: e.target.value })} />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={gbConfig.useSSL} onChange={(e) => setGbConfig({ ...gbConfig, useSSL: e.target.checked })} />
                    <span className="text-sm">Use SSL/TLS</span>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={testGb} disabled={testing} className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200">{testing ? 'Testing...' : 'Test'}</button>
                    <button onClick={saveGb} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
                  </div>
                  {testMsg && (<div className="text-sm text-gray-700">{testMsg}</div>)}
                </>
              )}

              {selected.id === 'ai_providers' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <select className="mt-1 w-full border rounded-md px-3 py-2" value={aiProvider} onChange={(e) => setAiProvider(e.target.value)}>
                      {(selected.providers || []).map((p) => (
                        <option key={p.key} value={p.key}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">API Key</label>
                    <input className="mt-1 w-full border rounded-md px-3 py-2" value={aiConfig.apiKey || ''} onChange={(e) => setAiConfig({ ...aiConfig, apiKey: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model</label>
                    <input className="mt-1 w-full border rounded-md px-3 py-2" value={aiConfig.model || ''} onChange={(e) => setAiConfig({ ...aiConfig, model: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Endpoint (optional)</label>
                    <input className="mt-1 w-full border rounded-md px-3 py-2" value={aiConfig.endpoint || ''} onChange={(e) => setAiConfig({ ...aiConfig, endpoint: e.target.value })} />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={enableAi} className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200">Enable</button>
                    <button onClick={saveAi} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}