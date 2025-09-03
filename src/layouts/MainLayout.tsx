import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Shield, LayoutDashboard, Bell, AlertTriangle, Settings, User, Home, BookOpen, FileText, ShieldCheck, Heart, Truck, Database, Plug, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

function Sidebar() {
  const { user, logout } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  
  const navItems = [
    { to: '/home', label: t('nav.home'), icon: Home, permission: 'access.home' },
    { to: '/dashboard', label: t('nav.dashboard'), icon: LayoutDashboard, permission: 'access.dashboard' },
    { to: '/starter-guide', label: t('nav.starterGuide'), icon: BookOpen, permission: 'access.starterGuide' },
    { to: '/reports', label: t('nav.reports'), icon: FileText, permission: 'access.reports' },
    { to: '/compliance', label: t('nav.compliance'), icon: ShieldCheck, permission: 'access.compliance' },
    { to: '/customer-trust', label: t('nav.customerTrust'), icon: Heart, permission: 'access.customerTrust' },
    { to: '/suppliers', label: t('nav.suppliers'), icon: Truck, permission: 'access.suppliers' },
    { to: '/assets', label: t('nav.assets'), icon: Database, permission: 'access.assets' },
    { to: '/integrations', label: t('nav.integrations'), icon: Plug, permission: 'access.integrations' },
    { to: '/incidents', label: t('nav.incidents'), icon: AlertTriangle, permission: 'access.incidents' },
    { to: '/alerts', label: t('nav.alerts'), icon: Bell, permission: 'access.alerts' },
    { to: '/settings', label: t('nav.settings'), icon: Settings, permission: 'access.settings' },
  ]

  const filteredNavItems = navItems.filter(item => 
    !item.permission || user?.role === 'admin' || user?.permissions.includes(item.permission)
  )

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-200 dark:border-neutral-800">
        <Shield className="h-6 w-6 text-blue-600" />
        <span className="font-semibold">DefendSphere</span>
      </div>
      
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNavItems.map(({ to, label, icon: Icon, permission }) => (
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

      {/* Language Selector */}
      <div className="p-3 border-t border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 dark:text-neutral-400">{t('settings.language')}</span>
        </div>
        <div className="flex gap-1">
          {(['en', 'ru', 'es'] as const).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-2 py-1 text-xs rounded ${
                language === lang
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* User Profile & Logout */}
      <div className="p-3 border-t border-gray-200 dark:border-neutral-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.username || 'User'}
            </p>
            <p className="text-xs text-gray-500 dark:text-neutral-400 capitalize">
              {user?.role || 'user'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t('auth.logout')}
        </button>
      </div>
    </aside>
  )
}

function Header() {
  const location = useLocation()
  const { t } = useLanguage()
  const { user } = useAuth()
  
  const titleMap: Record<string, string> = {
    '/': t('nav.dashboard'),
    '/home': t('nav.home'),
    '/dashboard': t('nav.dashboard'),
    '/starter-guide': t('nav.starterGuide'),
    '/reports': t('nav.reports'),
    '/compliance': t('nav.compliance'),
    '/customer-trust': t('nav.customerTrust'),
    '/suppliers': t('nav.suppliers'),
    '/assets': t('nav.assets'),
    '/integrations': t('nav.integrations'),
    '/incidents': t('nav.incidents'),
    '/alerts': t('nav.alerts'),
    '/settings': t('nav.settings'),
    '/profile': t('nav.profile'),
  }
  
  const title = titleMap[location.pathname] ?? 'DefendSphere'
  
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <h1 className="text-lg font-semibold">{title}</h1>
      
      <div className="flex items-center gap-4">
        {user?.role === 'admin' && (
          <NavLink
            to="/admin"
            className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-neutral-700 px-3 py-1.5 text-sm bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/20"
          >
            <Shield className="h-4 w-4" />
            {t('nav.admin')}
          </NavLink>
        )}
        
        <NavLink
          to="/profile"
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 dark:border-neutral-700 px-3 py-1.5 text-sm bg-white dark:bg-neutral-900 hover:bg-gray-50 dark:hover:bg-neutral-800"
        >
          <User className="h-4 w-4" />
          {user?.username || 'User'}
        </NavLink>
      </div>
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
          <motion.div 
            initial={{ opacity: 0, y: 8 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}


