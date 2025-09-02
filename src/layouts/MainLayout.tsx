import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Shield, LayoutDashboard, Bell, AlertTriangle, Settings, User } from 'lucide-react'
import { motion } from 'framer-motion'

function Sidebar() {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/incidents', label: 'Incidents', icon: AlertTriangle },
    { to: '/alerts', label: 'Alerts', icon: Bell },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]
  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-200 dark:border-neutral-800">
        <Shield className="h-6 w-6 text-blue-600" />
        <span className="font-semibold">DefendSphere</span>
      </div>
      <nav className="p-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}

function Header() {
  const location = useLocation()
  const titleMap: Record<string, string> = {
    '/': 'Dashboard',
    '/dashboard': 'Dashboard',
    '/incidents': 'Incidents',
    '/alerts': 'Alerts',
    '/settings': 'Settings',
  }
  const title = titleMap[location.pathname] ?? 'DefendSphere'
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <h1 className="text-lg font-semibold">{title}</h1>
      <button className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-neutral-700 px-3 py-1.5 text-sm bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800">
        <User className="h-4 w-4" />
        admin
      </button>
    </header>
  )
}

export default function MainLayout() {
  return (
    <div className="min-h-full grid grid-rows-[auto,1fr] md:grid-rows-1 md:grid-cols-[16rem,1fr] bg-gray-50 dark:bg-neutral-950">
      <Sidebar />
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="p-4 md:p-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}


