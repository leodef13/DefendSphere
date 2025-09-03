import React from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Shield, LayoutDashboard, Users, UserCheck, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

function AdminSidebar() {
  const { logout } = useAuth()
  const { t } = useLanguage()
  
  const navItems = [
    { to: '/admin', label: t('admin.dashboard'), icon: LayoutDashboard },
    { to: '/admin/users', label: t('nav.users'), icon: Users },
    { to: '/admin/roles', label: t('nav.roles'), icon: UserCheck },
  ]

  return (
    <aside className="hidden md:flex md:flex-col w-64 shrink-0 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <div className="h-16 flex items-center gap-3 px-5 border-b border-gray-200 dark:border-neutral-800">
        <Shield className="h-6 w-6 text-red-600" />
        <span className="font-semibold text-red-600">{t('admin.title')}</span>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
                  : 'text-gray-700 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Back to Main App */}
      <div className="p-3 border-t border-gray-200 dark:border-neutral-800">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-md transition-colors"
        >
          <Shield className="h-4 w-4" />
          Back to App
        </NavLink>
        
        <button
          onClick={logout}
          className="w-full mt-2 flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {t('auth.logout')}
        </button>
      </div>
    </aside>
  )
}

function AdminHeader() {
  const location = useLocation()
  const { t } = useLanguage()
  
  const titleMap: Record<string, string> = {
    '/admin': t('admin.dashboard'),
    '/admin/users': t('admin.userManagement'),
    '/admin/roles': t('admin.roleManagement'),
  }
  
  const title = titleMap[location.pathname] ?? 'Admin'
  
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <h1 className="text-lg font-semibold text-red-600">{title}</h1>
      
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-200">
          ADMIN
        </span>
      </div>
    </header>
  )
}

export default function AdminLayout() {
  return (
    <div className="min-h-full grid grid-rows-[auto,1fr] md:grid-rows-1 md:grid-cols-[16rem,1fr] bg-gray-50 dark:bg-neutral-950">
      <AdminSidebar />
      <div className="flex flex-col min-h-screen">
        <AdminHeader />
        <main className="p-4 md:p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}