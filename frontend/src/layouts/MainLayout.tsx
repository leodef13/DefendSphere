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
      {/* Sidebar Container */}
      <div className="p-5 flex flex-col min-h-screen bg-[#003a6a]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white">DefendSphere</h2>
          <button 
            onClick={onMobileMenuToggle}
            className="md:hidden text-white hover:text-gray-300 transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {filteredNavItems.map(({ to, label, icon: Icon }) => (
              <li key={to} className="p-2 rounded">
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center p-2 rounded cursor-pointer text-white transition-all duration-200 hover:bg-[#134876] ${
                      isActive ? 'bg-[#134876]' : ''
                    }`
                  }
                >
                  <Icon className="h-5 w-5 mr-3 text-white" />
                  <span className="text-white">{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Block - Fixed at bottom */}
        <div className="mt-auto">
          <div className="flex items-center gap-2 p-2">
            {/* Avatar */}
            <div className="rounded-full bg-[#134876] w-8 h-8 flex items-center justify-center text-white font-bold">
              {(() => {
                function getInitials(name) {
                  if (!name) return 'U'
                  return name.split(/\s|_/).map((n) => n[0]).join('').slice(0,2).toUpperCase()
                }
                const full = (user as any)?.fullName as string | undefined
                return getInitials(full && full.trim().length > 0 ? full : (user?.username || ''))
              })()}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {(user as any)?.fullName || user?.username || 'User'}
              </p>
              <p className="text-xs text-white/70">
                {user?.role === 'admin' ? 'Security Admin' : 'User'}
              </p>
            </div>
          </div>
          
          {/* Logout Button */}
          <div className="mt-2">
            <button 
              onClick={logout} 
              className="text-xs text-white/80 hover:text-white transition-colors"
            >
              {t('auth.logout')}
            </button>
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
        <h1 className="text-3xl font-bold mb-6">{title}</h1>
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
