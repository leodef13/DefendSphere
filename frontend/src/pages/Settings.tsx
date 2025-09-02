import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, Button } from '../components/ui'

export default function Settings() {
  const [name, setName] = useState('Admin')
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('')
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    alert('Settings saved!')
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <Card>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">Profile</h3>
        </CardHeader>
        <CardContent>
          <form className="space-y-3" onSubmit={submit}>
            <div className="grid gap-1.5">
              <label className="text-sm">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="rounded-md border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-sm" />
            </div>
            <Button type="submit">Save</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 pb-0">
          <h3 className="text-sm font-medium text-gray-600 dark:text-neutral-300">Appearance</h3>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Theme</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs ${!dark ? 'font-semibold' : 'text-gray-500'}`}>Light</span>
              <button
                aria-label="Toggle theme"
                onClick={() => setDark(v => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full ${dark ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${dark ? 'translate-x-5' : 'translate-x-1'}`} />
              </button>
              <span className={`text-xs ${dark ? 'font-semibold' : 'text-gray-500'}`}>Dark</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


