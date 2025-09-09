// MainLayout.tsx
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Shield, LayoutDashboard, Settings, User, Server, FileCheck, Users, Building2, FileText, HelpCircle, Plug, Menu, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import AssistantButton from '../components/AssistantButton'
import { useAuth } from '../components/AuthProvider'
import { useI18n } from '../i18n'
import LanguageSwitcher from '../components/LanguageSwitcher'

function Sidebar({ isMobileMenuOpen, onMobileMenuToggle }: { isMobileMenuOpen: boolean, onMobileMenuToggle: () => void }) {
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
    { to: '/admin', label: t('nav.admin'), icon: Settings, permission: 'access.admin' },
    { to: '/user-dashboard', label: t('nav.userDashboard'), icon: User, permission: 'access.dashboard' },
    { to: '/integrations', label: t('nav.integrations'), icon: Plug, permission: 'access.integrations' },
  ]

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter(item => {
    if (!user) return false
    // Admin-only restriction: only admin sees Integrations and Admin Panel
    if ((item.to === '/integrations' || item.to === '/admin') && user.role !== 'admin') return false
    // For admin: Home, User Dashboard, Integrations, Admin Panel
    if (user.role === 'admin') return item.to === '/dashboard' || item.to === '/user-dashboard' || item.to === '/integrations' || item.to === '/admin'
    // User Dashboard visible to all authenticated users
    if (item.to === '/user-dashboard') return true
    return user.permissions?.includes(item.permission) || user.permissions?.includes('all')
  })
  return (
    <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
      <div className="px-5 py-4 flex items-center justify-between" style={{borderBottom: '1px solid #134876'}}>
        <h2 className="text-xl font-bold mb-8" style={{color: '#fff'}}>DefendSphere</h2>
        <button 
          onClick={onMobileMenuToggle}
          className="md:hidden text-white hover:text-gray-300 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="p-5">
        <ul className="space-y-2">
          {filteredNavItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded cursor-pointer text-sm transition-all duration-200 ease-in-out hover:bg-[#134876] hover:scale-[1.02] hover:shadow-md relative ${
                    isActive ? 'text-white bg-[#134876] shadow-lg' : 'text-white/90'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>
                    )}
                    <span className={isActive ? 'ml-2' : ''}>{label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="absolute bottom-0 left-0 w-full p-5" style={{borderTop: '1px solid #134876'}}>
        <div className="space-y-2" style={{color: 'rgba(255,255,255,.9)'}}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white" style={{color: '#003a6a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700}}>
              {(() => {
                function getInitials(name) {
                  if (!name) return 'U'
                  return name.split(/\s|_/).map((n) => n[0]).join('').slice(0,2).toUpperCase()
                }
                const full = (user as any)?.fullName as string | undefined
                return getInitials(full && full.trim().length > 0 ? full : (user?.username || ''))
              })()}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.username || 'User'}</p>
            </div>
          </div>
          <div>
            <button onClick={logout} className="text-xs text-white/80 hover:text-white transition-colors">{t('auth.logout')}</button>
          </div>
        </div>
      </div>
    </aside>
  )
}

function Header({ onMobileMenuToggle }: { onMobileMenuToggle: () => void }) {
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
    '/settings': t('nav.settings'),
    '/admin': t('nav.admin'),
    '/user-dashboard': t('nav.userDashboard'),
  }
  const title = titleMap[location.pathname] ?? 'DefendSphere'
  
  return (
    <header className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMobileMenuToggle}
          className="md:hidden text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </header>
  )
}

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }
  
  return (
    <>
      <Sidebar isMobileMenuOpen={isMobileMenuOpen} onMobileMenuToggle={toggleMobileMenu} />
      <div className="main-content">
        <Header onMobileMenuToggle={toggleMobileMenu} />
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
