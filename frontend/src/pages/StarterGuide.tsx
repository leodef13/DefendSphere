import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, Button, PrimaryButton, SecondaryButton, DangerButton } from '../components/ui'
import { useAuth } from '../components/AuthProvider'
import { API_ENDPOINTS } from '../config/api'
import { FileText, Edit2, Save, X, HelpCircle } from 'lucide-react'

// SummaryRow component moved to top to avoid ReferenceError
function SummaryRow({ label, value, onSave, helper }: { label: string, value: string, onSave: (v: string)=>void, helper?: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)

  const handleSave = () => {
    onSave(editValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value)
    setIsEditing(false)
  }

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-700">{label}</span>
          {helper && (
            <div className="group relative">
              <HelpCircle className="w-4 h-4 text-gray-400 cursor-help" />
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {helper}
              </div>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="flex-1 px-2 py-1 border rounded text-sm"
              autoFocus
            />
            <Button size="sm" onClick={handleSave} className="p-1">
              <Save className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleCancel} className="p-1">
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-600">{value}</span>
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)} className="p-1">
              <Edit2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// Types for questionnaire data
interface StarterData {
  id?: string
  sector: string
  hasInformationSystems: boolean
  systemLocation?: string
  processesEUCitizenData: boolean
  dataTypes: string[]
  hasSecurityStrategy: 'Yes' | 'No' | 'In development'
  hasSecurityResponsible: boolean
  hasCybersecurityTeam: 'Yes' | 'No' | 'External provider'
  hasDisasterRecoveryPlan: 'Yes' | 'No' | 'Not sure'
  testsVulnerabilities: 'Yes' | 'No' | 'Sometimes'
  wantsVulnerabilityReport: boolean
  publicResources?: string
  relevantStandards: string[]
  plansCertifiedAudit: 'Yes' | 'No' | 'Not sure'
  interestedInPreAudit: boolean
  wantsSelfAssessment: boolean
  contactName: string
  companyName: string
  email: string
  phone: string
  privacyPolicyAccepted: boolean
}

const SECTORS = ['Banking', 'Chemical industry', 'Digital infrastructure', 'Digital service providers', 'Healthcare', 'Transport', 'Other']
const LOCATIONS = ['On-premise', 'Rented', 'Cloud', 'Not sure']
const DATATYPES = ['Name', 'Email', 'Phone', 'Financial data', 'Address', 'Other']
const STANDARDS = ['GDPR', 'DORA', 'NIS2', 'SOC2', 'ISO/IEC 27001', 'PCI DSS']

export default function StarterGuide() {
  const { token } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState<StarterData | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Load existing questionnaire if present
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        
        const res = await fetch(API_ENDPOINTS.STARTER_GUIDE, { 
          headers: { 'Authorization': `Bearer ${token}` } 
        })
        
        if (res.ok) {
          const dto = await res.json()
          setData({
            id: dto.id,
            sector: dto.sector,
            hasInformationSystems: !!dto.hasInformationSystems,
            systemLocation: dto.systemLocation || '',
            processesEUCitizenData: !!dto.processesEUCitizenData,
            dataTypes: dto.dataTypes || [],
            hasSecurityStrategy: dto.hasSecurityStrategy || 'No',
            hasSecurityResponsible: !!dto.hasSecurityResponsible,
            hasCybersecurityTeam: dto.hasCybersecurityTeam || 'No',
            hasDisasterRecoveryPlan: dto.hasDisasterRecoveryPlan || 'No',
            testsVulnerabilities: dto.testsVulnerabilities || 'No',
            wantsVulnerabilityReport: !!dto.wantsVulnerabilityReport,
            publicResources: dto.publicResources || '',
            relevantStandards: dto.relevantStandards || [],
            plansCertifiedAudit: dto.plansCertifiedAudit || 'Not sure',
            interestedInPreAudit: !!dto.interestedInPreAudit,
            wantsSelfAssessment: !!dto.wantsSelfAssessment,
            contactName: dto.contactName || '',
            companyName: dto.companyName || '',
            email: dto.email || '',
            phone: dto.phone || '',
            privacyPolicyAccepted: !!dto.privacyPolicyAccepted,
          })
        } else if (res.status === 404) {
          setData(null)
        } else if (res.status === 500) {
          setError('Server error occurred. Please try again later.')
        } else {
          setError(`Failed to load data (${res.status})`)
        }
      } catch (e: any) {
        console.error('StarterGuide load error:', e)
        setError(e.message || 'Failed to load starter guide data')
      } finally {
        setLoading(false)
      }
    }
    
    if (token) {
      load()
    } else {
      setLoading(false)
    }
  }, [token])

  // Validation
  const validate = (d: StarterData) => {
    if (!d.sector) return 'Sector is required'
    if (!d.contactName) return 'Name is required'
    if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return 'Valid email is required'
    if (!d.privacyPolicyAccepted) return 'You must accept Privacy Policy'
    return ''
  }

  // Submit handler (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!data) return
    
    const v = validate(data)
    if (v) { 
      setError(v)
      return 
    }
    
    setSubmitting(true)
    setError('')
    
    try {
      const body = { ...data }
      
      if (!data.id) {
        const res = await fetch(API_ENDPOINTS.STARTER_GUIDE, { 
          method: 'POST', 
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
          }, 
          body: JSON.stringify(body) 
        })
        
        if (!res.ok) {
          if (res.status === 500) {
            throw new Error('Server error occurred. Please try again later.')
          } else {
            throw new Error(`Failed to submit (${res.status})`)
          }
        }
        
        const dto = await res.json()
        setData({ ...data, id: dto.id })
      } else {
        const res = await fetch(`${API_ENDPOINTS.STARTER_GUIDE}/${data.id}`, { 
          method: 'PUT', 
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
          }, 
          body: JSON.stringify(body) 
        })
        
        if (!res.ok) {
          if (res.status === 500) {
            throw new Error('Server error occurred. Please try again later.')
          } else {
            throw new Error(`Failed to update (${res.status})`)
          }
        }
      }
      
      setEditMode(false)
    } catch (e: any) {
      console.error('StarterGuide submit error:', e)
      setError(e.message || 'Error saving form')
    } finally {
      setSubmitting(false)
    }
  }

  const exportData = async (format: 'pdf' | 'excel') => {
    if (!data?.id) return
    const res = await fetch(`${API_ENDPOINTS.STARTER_GUIDE}/${data.id}/export?format=${format}`, { headers: { 'Authorization': `Bearer ${token}` } })
    if (!res.ok) return
    const payload = await res.json()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `starter-guide.${format}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading starter guide...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold mb-6">Starter Guide</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
              <div className="mt-3">
                <DangerButton
                  onClick={() => window.location.reload()}
                  className="text-sm px-3 py-1"
                >
                  Reload Page
                </DangerButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* If no data yet or explicitly editing -> show form */}
      {!data || editMode ? (
        <Card>
          <CardHeader>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold mb-4">Fill out this Form to Get an Express Check-Up of your Digital Infrastructure</h2>
              <p className="text-gray-600">We’ll scan for risks and give you quick feedback — no technical background required.</p>
              <p className="text-gray-600">Fast & Confidential.</p>
            </div>
          </CardHeader>
          <CardContent>
            <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit}>
              <SelectField label="Sector*" value={data?.sector || ''} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), sector: v }))} options={['', ...SECTORS]} />
              <ToggleYN label="Operate information systems?*" value={!!data?.hasInformationSystems} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), hasInformationSystems: v, systemLocation: v ? (prev?.systemLocation || '') : '' }))} />
              {data?.hasInformationSystems && (
                <SelectField label="Where are systems located?" value={data?.systemLocation || ''} onChange={(v)=> setData(prev => ({ ...(prev as StarterData), systemLocation: v }))} options={['', ...LOCATIONS]} />
              )}
              <ToggleYN label="Process personal data of EU citizens?" value={!!data?.processesEUCitizenData} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), processesEUCitizenData: v, dataTypes: v ? (prev?.dataTypes || []) : [] }))} />
              {data?.processesEUCitizenData && (
                <CheckboxGroup label="Data types" options={DATATYPES} values={data?.dataTypes || []} onChange={(vals)=> setData(prev => ({ ...(prev as StarterData), dataTypes: vals }))} />
              )}
              <SelectField label="Information security strategy" value={data?.hasSecurityStrategy || 'No'} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), hasSecurityStrategy: v as any }))} options={['Yes','No','In development']} />
              <ToggleYN label="Responsible for information security risks" value={!!data?.hasSecurityResponsible} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), hasSecurityResponsible: v }))} />
              <SelectField label="Cybersecurity officer/team" value={data?.hasCybersecurityTeam || 'No'} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), hasCybersecurityTeam: v as any }))} options={['Yes','No','External provider']} />
              <SelectField label="Disaster recovery / incident plan" value={data?.hasDisasterRecoveryPlan || 'No'} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), hasDisasterRecoveryPlan: v as any }))} options={['Yes','No','Not sure']} />
              <SelectField label="Vulnerability testing" value={data?.testsVulnerabilities || 'No'} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), testsVulnerabilities: v as any }))} options={['Yes','No','Sometimes']} />
              <ToggleYN label="Receive short vulnerability report for public systems?" value={!!data?.wantsVulnerabilityReport} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), wantsVulnerabilityReport: v }))} />
              {data?.wantsVulnerabilityReport && (
                <TextAreaField label="Public resources (domains/IP)" value={data?.publicResources || ''} onChange={(v)=> setData(prev => ({ ...(prev as StarterData), publicResources: v }))} />
              )}
              <CheckboxGroup label="Relevant standards" options={STANDARDS} values={data?.relevantStandards || []} onChange={(vals)=> setData(prev => ({ ...(prev as StarterData), relevantStandards: vals }))} />
              <SelectField label="Certified audit in 12 months" value={data?.plansCertifiedAudit || 'Not sure'} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), plansCertifiedAudit: v as any }))} options={['Yes','No','Not sure']} />
              <ToggleYN label="Interested in pre-audit checkup" value={!!data?.interestedInPreAudit} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), interestedInPreAudit: v }))} />
              <ToggleYN label="Self-assess using automated platform" value={!!data?.wantsSelfAssessment} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), wantsSelfAssessment: v }))} />
              <TextField label="Name*" value={data?.contactName || ''} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), contactName: v }))} />
              <TextField label="Company name" value={data?.companyName || ''} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), companyName: v }))} />
              <TextField label="Email*" type="email" value={data?.email || ''} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), email: v }))} />
              <TextField label="Phone" value={data?.phone || ''} onChange={(v)=> setData(prev => ({ ...(prev || {} as StarterData), phone: v }))} />
              <label className="flex items-center gap-2 mt-2"><input type="checkbox" checked={!!data?.privacyPolicyAccepted} onChange={(e)=> setData(prev => ({ ...(prev || {} as StarterData), privacyPolicyAccepted: e.target.checked }))} /> Privacy Policy accepted</label>
              <div className="flex justify-end pt-2">
                <PrimaryButton type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Check My Systems'}</PrimaryButton>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h2 className="text-2xl font-semibold mb-4">Summary</h2>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SummaryRow label="Company Name" value={data?.companyName || '-'} onSave={(v)=> saveInline('companyName', v)} />
              <SummaryRow label="User Name" value={data?.contactName || '-'} onSave={(v)=> saveInline('contactName', v)} />
              <SummaryRow label="Email" value={data?.email || '-'} onSave={(v)=> saveInline('email', v)} />
              <SummaryRow label="Phone" value={data?.phone || '-'} onSave={(v)=> saveInline('phone', v)} />
              <SummaryRow label="Registered Systems" value={String(((data?.publicResources||'').split(/\s|,|;/).filter(Boolean)).length)} onSave={(v)=> saveInline('publicResources', v)} helper="Enter domains/IP comma or space-separated" />
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Recommended Standards</div>
              <div className="flex flex-wrap gap-2">
                {(data?.relevantStandards||[]).map(s => (
                  <span key={s} className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs">{s}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                {STANDARDS.map(opt => (
                  <label key={opt} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={data?.relevantStandards?.includes(opt)} onChange={() => toggleStandard(opt)} /> {opt}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center mt-6">
              <SecondaryButton onClick={()=> setEditMode(true)}>Edit Form</SecondaryButton>
              <div className="flex gap-2">
                <SecondaryButton onClick={()=> exportData('pdf')}>Export PDF</SecondaryButton>
                <PrimaryButton onClick={()=> exportData('excel')}>Export Excel</PrimaryButton>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  async function saveInline<K extends keyof StarterData>(key: K, value: any) {
    if (!data?.id) return
    const updated = { ...data, [key]: value }
    setData(updated)
    try {
      await fetch(`${API_ENDPOINTS.STARTER_GUIDE}/${data.id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(updated) })
    } catch {}
  }

  function toggleStandard(opt: string) {
    if (!data) return
    const set = new Set(data.relevantStandards || [])
    if (set.has(opt)) set.delete(opt); else set.add(opt)
    saveInline('relevantStandards', Array.from(set))
  }
}

function TextField({ label, value, onChange, type = 'text' }: { label: string, value: string, onChange: (v: string)=>void, type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input type={type} className="mt-1 w-full border rounded-md px-3 py-2" value={value} onChange={(e)=> onChange(e.target.value)} />
    </div>
  )
}

function TextAreaField({ label, value, onChange }: { label: string, value: string, onChange: (v: string)=>void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea className="mt-1 w-full border rounded-md px-3 py-2" rows={3} value={value} onChange={(e)=> onChange(e.target.value)} />
    </div>
  )
}

function ToggleYN({ label, value, onChange }: { label: string, value: boolean, onChange: (v: boolean)=>void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-4 mt-1">
        <label className="flex items-center gap-2"><input type="radio" checked={value} onChange={()=> onChange(true)} /> Yes</label>
        <label className="flex items-center gap-2"><input type="radio" checked={!value} onChange={()=> onChange(false)} /> No</label>
      </div>
    </div>
  )
}

function SelectField({ label, value, onChange, options }: { label: string, value: string, onChange: (v: string)=>void, options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select className="mt-1 w-full border rounded-md px-3 py-2" value={value} onChange={(e)=> onChange(e.target.value)}>
        {options.map(o => <option key={o} value={o}>{o || 'Select'}</option>)}
      </select>
    </div>
  )
}

function CheckboxGroup({ label, options, values, onChange }: { label: string, options: string[], values: string[], onChange: (vals: string[])=>void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="grid grid-cols-2 gap-2 mt-1">
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2">
            <input type="checkbox" checked={values.includes(opt)} onChange={() => {
              const set = new Set(values)
              if (set.has(opt)) set.delete(opt); else set.add(opt)
              onChange(Array.from(set))
            }} /> {opt}
          </label>
        ))}
      </div>
    </div>
  )
}
