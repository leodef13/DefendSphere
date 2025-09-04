// MainLayout.tsx
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Shield, LayoutDashboard, Bell, AlertTriangle, Settings, User } from 'lucide-react'
import { motion } from 'framer-motion'

function Sidebar() {
  const navItems = [
    { to: '/dashboard', label: 'Home (Security Dashboard)', icon: LayoutDashboard },
    { to: '/incidents', label: 'Incidents', icon: AlertTriangle },
    { to: '/alerts', label: 'Alerts', icon: Bell },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]
  return (
    <aside className="sidebar">
      <div className="h-16 flex items-center gap-3 px-5" style={{borderBottom: '1px solid #134876'}}>
        <Shield className="h-6 w-6" color="#fff" />
        <span className="font-semibold" style={{color: '#fff'}}>DefendSphere</span>
      </div>
      <nav className="p-3" style={{display: 'grid', rowGap: '4px'}}>
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive ? 'text-white' : 'text-white/90'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? '#134876' : 'transparent'
            })}
          >
            <Icon className="h-4 w-4" color="#fff" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 w-full p-5" style={{borderTop: '1px solid #134876'}}>
        <div className="flex items-center gap-3" style={{color: 'rgba(255,255,255,.9)'}}>
          <div className="w-8 h-8 rounded-full bg-white" style={{color: '#003a6a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700}}>AD</div>
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs" style={{opacity: .8}}>Security Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Header() {
  const location = useLocation()
  const titleMap: Record<string, string> = {
    '/': 'Security Dashboard',
    '/dashboard': 'Security Dashboard',
    '/incidents': 'Incidents',
    '/alerts': 'Alerts',
    '/settings': 'Settings',
  }
  const title = titleMap[location.pathname] ?? 'DefendSphere'
  return (
    <header className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <button className="btn-primary inline-flex items-center gap-2 px-3 py-2 rounded-md">
        <User className="h-4 w-4" color="#fff" />
        admin
      </button>
    </header>
  )
}

export default function MainLayout() {
  return (
    <>
      <Sidebar />
      <div className="main-content">
        <Header />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <Outlet />
        </motion.div>
      </div>
    </>
  )
}
