// MainLayout.tsx
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Shield, LayoutDashboard, Settings, User, Server, FileCheck, Users, Building2, FileText, HelpCircle, Plug } from 'lucide-react'
import { motion } from 'framer-motion'
import AssistantButton from '../components/AssistantButton'
import { useAuth } from '../components/AuthProvider'
import { useI18n } from '../i18n'
import LanguageSwitcher from '../components/LanguageSwitcher'

function Sidebar() {
  const { t } = useI18n()
  const { user, logout } = useAuth()
  
  // Fixed order of sections; only these sections are shown
  const navItems = [
    { to: '/dashboard', label: t('nav.home'), icon: LayoutDashboard, permission: 'access.dashboard' },
    { to: '/starter-guide', label: t('nav.starterGuide'), icon: HelpCircle, permission: 'access.dashboard' },
    { to: '/assets', label: t('nav.assets'), icon: Server, permission: 'access.assets' },
    { to: '/reports', label: t('nav.reports'), icon: FileText, permission: 'access.reports' },
    { to: '/compliance', label: t('nav.compliance'), icon: FileCheck, permission: 'access.compliance' },
    { to: '/customer-trust', label: t('nav.customerTrust'), icon: Users, permission: 'access.customerTrust' },
    { to: '/suppliers', label: t('nav.suppliers'), icon: Building2, permission: 'access.suppliers' },
    { to: '/integrations', label: t('nav.integrations'), icon: Plug, permission: 'access.integrations' },
    // New sections appended at the end
    { to: '/admin', label: 'Admin Panel', icon: Settings, permission: 'access.admin' },
    { to: '/user-dashboard', label: 'User Dashboard', icon: User, permission: 'access.dashboard' },
  ]

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter(item => {
    if (!user) return false
    // Integrations is visible only for admin
    if (item.to === '/integrations') return user.role === 'admin'
    // Admin Panel is visible only for admin
    if (item.to === '/admin') return user.role === 'admin'
    // User Dashboard visible to all authenticated users
    if (item.to === '/user-dashboard') return true
    if (user.role === 'admin') return true
    return user.permissions.includes(item.permission) || user.permissions.includes('all')
  })
  return (
    <aside className="sidebar">
      <div className="h-16 flex items-center gap-3 px-5" style={{borderBottom: '1px solid #134876'}}>
        <Shield className="h-6 w-6" color="#fff" />
        <span className="font-semibold" style={{color: '#fff'}}>DefendSphere</span>
      </div>
      <nav className="p-3" style={{display: 'grid', rowGap: '4px'}}>
        {filteredNavItems.map(({ to, label }) => (
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
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-0 left-0 w-full p-5" style={{borderTop: '1px solid #134876'}}>
        <div className="space-y-3">
          <div className="flex items-center gap-3" style={{color: 'rgba(255,255,255,.9)'}}>
            <div className="w-8 h-8 rounded-full bg-white" style={{color: '#003a6a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700}}>
              {(() => {
                function getInitials(name) {
                  if (!name) return 'U'
                  return name.split(/\s|_/).map((n) => n[0]).join('').slice(0,2).toUpperCase()
                }
                return getInitials(user?.username || '')
              })()}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.username || 'User'}</p>
              <p className="text-xs" style={{opacity: .8}}>{user?.email || ''}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <LanguageSwitcher />
            <button onClick={logout} className="text-xs text-white/70 hover:text-white transition-colors">Выход</button>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Header() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const { t } = useI18n()
  
  const titleMap: Record<string, string> = {
    '/': t('dashboard.title'),
    '/dashboard': t('dashboard.title'),
    '/assets': t('nav.assets'),
    '/compliance': t('nav.compliance'),
    '/customer-trust': t('nav.customerTrust'),
    '/suppliers': t('nav.suppliers'),
    '/reports': t('nav.reports'),
    '/starter-guide': t('nav.starterGuide'),
    '/integrations': t('nav.integrations'),
    '/incidents': t('nav.incidents'),
    '/alerts': t('nav.alerts'),
    '/settings': t('nav.settings'),
    '/admin': t('nav.admin'),
    '/user-dashboard': 'User Dashboard',
  }
  const title = titleMap[location.pathname] ?? 'DefendSphere'
  
  return (
    <header className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">{title}</h1>
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
      <AssistantButton />
    </>
  )
}
