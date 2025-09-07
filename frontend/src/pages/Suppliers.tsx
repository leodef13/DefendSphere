import React, { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'
import { useAuth } from '../components/AuthProvider'
import { API_ENDPOINTS } from '../config/api'
import { Download, FileText, ArrowLeft, Plus, Trash2, Filter } from 'lucide-react'

type Supplier = {
  id: string
  name: string
  contactName?: string
  email?: string
  website?: string
  categoryAccess: 'With Access' | 'No Access'
  supplierType: 'Software Supplier' | 'Hardware Supplier' | 'Services Supplier (including cloud)' | 'Administrative/Economic Materials and Services' | 'Services Supplier'
  subGradation: string
  standards: string[]
  compliance: number
  lastAssessment: string
}

const Suppliers: React.FC = () => {
  const { token } = useAuth()
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [accessFilter, setAccessFilter] = useState<'All' | 'With Access' | 'No Access'>('All')
  const [typeFilter, setTypeFilter] = useState<'All' | Supplier['supplierType']>('All')
  const [stdFilter, setStdFilter] = useState<'All' | 'NIS2' | 'SOCv2' | 'GDPR' | 'DORA'>('All')
  const [levelFilter, setLevelFilter] = useState<'All' | 'High' | 'Medium' | 'Low'>('All')
  const [sortKey, setSortKey] = useState<'name' | 'compliance' | 'lastAssessment'>('lastAssessment')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const fetchSuppliers = async () => {
    setLoading(true)
    try {
      const res = await fetch(API_ENDPOINTS.SUPPLIERS, { headers: { Authorization: `Bearer ${token}` } })
      const dto = await res.json()
      setSuppliers(dto.suppliers || [])
    } catch (e: any) {
      setError(e.message || 'Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSuppliers() }, [token])

  const filtered = useMemo(() => {
    let rows = suppliers.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    if (accessFilter !== 'All') rows = rows.filter(s => s.categoryAccess === accessFilter)
    if (typeFilter !== 'All') rows = rows.filter(s => s.supplierType === typeFilter)
    if (stdFilter !== 'All') rows = rows.filter(s => s.standards.includes(stdFilter))
    if (levelFilter !== 'All') {
      rows = rows.filter(s => {
        if (levelFilter === 'High') return s.compliance > 85
        if (levelFilter === 'Medium') return s.compliance >= 40 && s.compliance <= 85
        return s.compliance < 40
      })
    }
    const sorted = [...rows].sort((a, b) => {
      let vA: any, vB: any
      if (sortKey === 'name') { vA = a.name.toLowerCase(); vB = b.name.toLowerCase() }
      if (sortKey === 'compliance') { vA = a.compliance; vB = b.compliance }
      if (sortKey === 'lastAssessment') { vA = new Date(a.lastAssessment).getTime(); vB = new Date(b.lastAssessment).getTime() }
      const base = vA < vB ? -1 : vA > vB ? 1 : 0
      return sortDir === 'asc' ? base : -base
    })
    return sorted
  }, [suppliers, search, accessFilter, typeFilter, stdFilter, levelFilter, sortKey, sortDir])

  const complianceClass = (val: number) => {
    if (val > 85) return 'text-green-700 bg-green-50'
    if (val >= 40) return 'text-yellow-700 bg-yellow-50'
    return 'text-red-700 bg-red-50'
  }

  const addSupplier = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget as HTMLFormElement & { [key: string]: any }
    const payload = {
      name: form.name.value,
      contactName: form.contactName.value,
      email: form.email.value,
      website: form.website.value,
      categoryAccess: form.categoryAccess.value,
      supplierType: form.supplierType.value,
      subGradation: form.subGradation.value,
      standards: Array.from(form.querySelectorAll('input[name="standards"]:checked')).map((i: any)=> i.value),
      compliance: Number(form.compliance.value || 0),
      lastAssessment: form.lastAssessment.value
    }
    const res = await fetch(API_ENDPOINTS.SUPPLIERS, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(payload) })
    if (res.ok) { await fetchSuppliers(); form.reset() }
  }

  const removeSupplier = async (id: string) => {
    if (!confirm('Delete this supplier?')) return
    const res = await fetch(`${API_ENDPOINTS.SUPPLIERS}/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    if (res.ok) fetchSuppliers()
  }

  const exportJson = (format: 'excel' | 'pdf') => {
    const payload = { filters: { search, accessFilter, typeFilter, stdFilter, levelFilter, sortKey, sortDir }, data: filtered }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `suppliers-${new Date().toISOString().slice(0,10)}.${format}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>
        <div className="flex items-center gap-2">
          <Button className="btn btn-secondary flex items-center gap-2" onClick={()=> exportJson('excel')}><Download className="h-4 w-4" /> Export Excel</Button>
          <Button className="btn btn-secondary flex items-center gap-2" onClick={()=> exportJson('pdf')}><FileText className="h-4 w-4" /> Export PDF</Button>
          <a href="/dashboard" className="btn btn-primary flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</a>
        </div>
      </div>

      {/* Filters */}
      <Card className="metric-card">
        <CardHeader>
          <div className="flex items-center gap-2 text-gray-700"><Filter className="h-4 w-4" /> Supplier Categories & Filters</div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <div className="form-label">Search</div>
              <input className="form-input" placeholder="Search by name" value={search} onChange={(e)=> setSearch(e.target.value)} />
            </div>
            <div>
              <div className="form-label">Access Level</div>
              <div className="flex flex-wrap gap-2">
                {(['With Access','No Access','All'] as const).map(v => (
                  <button key={v} className={`px-3 py-1 rounded border ${accessFilter===v?'bg-blue-600 text-white':'bg-white'}`} onClick={()=> setAccessFilter(v)}>{v==='All'?'All Suppliers':v}</button>
                ))}
              </div>
            </div>
            <div>
              <div className="form-label">Supplier Type</div>
              <select className="form-input" value={typeFilter} onChange={(e)=> setTypeFilter(e.target.value as any)}>
                {['All','Software Supplier','Hardware Supplier','Services Supplier (including cloud)','Administrative/Economic Materials and Services','Services Supplier'].map(o=> <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <div className="form-label">Standards</div>
              <select className="form-input" value={stdFilter} onChange={(e)=> setStdFilter(e.target.value as any)}>
                {['All','NIS2','SOCv2','GDPR','DORA'].map(o=> <option key={o} value={o}>{o==='All'?'All Standards':o}</option>)}
              </select>
            </div>
            <div>
              <div className="form-label">Compliance Level</div>
              <select className="form-input" value={levelFilter} onChange={(e)=> setLevelFilter(e.target.value as any)}>
                {['All','High','Medium','Low'].map(o=> <option key={o} value={o}>{o==='All'?'All Levels':o + (o==='High'?' (>85%)':o==='Medium'?' (40-85%)':o==='Low'?' (<40%)':'')}</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="metric-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="text-lg font-semibold">Supplier Assessments</div>
            <details>
              <summary className="cursor-pointer btn btn-secondary flex items-center gap-2"><Plus className="h-4 w-4" /> Add Supplier</summary>
              <form className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3" onSubmit={addSupplier}>
                <input name="name" className="form-input" placeholder="Supplier Name" required />
                <input name="contactName" className="form-input" placeholder="Responsible Full Name" />
                <input name="email" className="form-input" placeholder="Email" type="email" />
                <input name="website" className="form-input" placeholder="Website" />
                <select name="categoryAccess" className="form-input">
                  {['With Access','No Access'].map(o=> <option key={o} value={o}>{o}</option>)}
                </select>
                <select name="supplierType" className="form-input">
                  {['Software Supplier','Hardware Supplier','Services Supplier (including cloud)','Administrative/Economic Materials and Services','Services Supplier'].map(o=> <option key={o} value={o}>{o}</option>)}
                </select>
                <input name="subGradation" className="form-input" placeholder="Sub-Gradation" />
                <div className="col-span-1 md:col-span-2">
                  <div className="text-sm mb-1">Assigned Standards</div>
                  <div className="flex flex-wrap gap-3">
                    {['NIS2','SOCv2','GDPR','DORA'].map(s=> (
                      <label key={s} className="flex items-center gap-2 text-sm"><input type="checkbox" name="standards" value={s} /> {s}</label>
                    ))}
                  </div>
                </div>
                <input name="compliance" className="form-input" placeholder="Compliance %" type="number" min={0} max={100} />
                <input name="lastAssessment" className="form-input" type="date" />
                <div className="col-span-full flex justify-end">
                  <button className="btn btn-primary" type="submit">Save</button>
                </div>
              </form>
            </details>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading suppliers...</div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    {['Supplier Name','Category','Sub-Gradation','Assigned Standards','Compliance %','Last Assessment','Actions'].map((h, idx)=> (
                      <th key={h} className="px-4 py-2 text-left font-medium cursor-pointer" onClick={()=> {
                        const map: any = {0:'name',1:'categoryAccess',2:'subGradation',3:'name',4:'compliance',5:'lastAssessment'}
                        const k = map[idx] || 'name'
                        setSortKey(k)
                        setSortDir(d => d==='asc'?'desc':'asc')
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} className="border-t border-gray-100">
                      <td className="px-4 py-2">{s.name}</td>
                      <td className="px-4 py-2">{s.categoryAccess} • {s.supplierType}</td>
                      <td className="px-4 py-2">{s.subGradation}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-1">{s.standards.map(st => <span key={st} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700">{st}</span>)}</div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded ${complianceClass(s.compliance)}`}>{s.compliance}%</span>
                      </td>
                      <td className="px-4 py-2">{new Date(s.lastAssessment).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <button className="btn btn-secondary px-2 py-1 mr-2">View Assessment</button>
                        <button className="btn btn-danger px-2 py-1 inline-flex items-center gap-1" onClick={()=> removeSupplier(s.id)}><Trash2 className="h-4 w-4" /> Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Suppliers