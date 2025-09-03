import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'ru' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.starterGuide': 'Starter Guide',
    'nav.reports': 'Reports',
    'nav.compliance': 'Compliance',
    'nav.customerTrust': 'Customer Trust',
    'nav.suppliers': 'Suppliers',
    'nav.assets': 'Assets',
    'nav.integrations': 'Integrations',
    'nav.incidents': 'Incidents',
    'nav.alerts': 'Alerts',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.users': 'Users',
    'nav.roles': 'Roles',

    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.logout': 'Logout',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.email': 'Email',
    'auth.confirmPassword': 'Confirm Password',
    'auth.loginButton': 'Sign In',
    'auth.registerButton': 'Sign Up',
    'auth.noAccount': "Don't have an account?",
    'auth.hasAccount': 'Already have an account?',
    'auth.loginLink': 'Sign in',
    'auth.registerLink': 'Sign up',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.create': 'Create',
    'common.update': 'Update',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.actions': 'Actions',
    'common.status': 'Status',
    'common.type': 'Type',
    'common.severity': 'Severity',
    'common.time': 'Time',
    'common.name': 'Name',
    'common.role': 'Role',
    'common.permissions': 'Permissions',
    'common.createdAt': 'Created At',
    'common.lastLogin': 'Last Login',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.activeDefenses': 'Active Defenses',
    'dashboard.blockedThreats': 'Blocked Threats',
    'dashboard.systemUptime': 'System Uptime',
    'dashboard.pendingAlerts': 'Pending Alerts',
    'dashboard.threatsOverTime': 'Threats Over Time',
    'dashboard.threatTypes': 'Threat Types',
    'dashboard.recentIncidents': 'Recent Incidents',

    // Admin
    'admin.title': 'Administration',
    'admin.dashboard': 'Admin Dashboard',
    'admin.userManagement': 'User Management',
    'admin.roleManagement': 'Role Management',
    'admin.createUser': 'Create User',
    'admin.editUser': 'Edit User',
    'admin.deleteUser': 'Delete User',
    'admin.createRole': 'Create Role',
    'admin.editRole': 'Edit Role',
    'admin.deleteRole': 'Delete Role',

    // Settings
    'settings.title': 'Settings',
    'settings.profile': 'Profile',
    'settings.appearance': 'Appearance',
    'settings.notifications': 'Notifications',
    'settings.theme': 'Theme',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.language': 'Language',
    'settings.english': 'English',
    'settings.russian': 'Russian',
    'settings.spanish': 'Spanish',

    // Messages
    'message.settingsSaved': 'Settings saved!',
    'message.userCreated': 'User created successfully',
    'message.userUpdated': 'User updated successfully',
    'message.userDeleted': 'User deleted successfully',
    'message.roleCreated': 'Role created successfully',
    'message.roleUpdated': 'Role updated successfully',
    'message.roleDeleted': 'Role deleted successfully',
    'message.confirmDelete': 'Are you sure you want to delete this item?',
    'message.operationFailed': 'Operation failed. Please try again.',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.dashboard': 'Панель управления',
    'nav.starterGuide': 'Руководство',
    'nav.reports': 'Отчеты',
    'nav.compliance': 'Соответствие',
    'nav.customerTrust': 'Доверие клиентов',
    'nav.suppliers': 'Поставщики',
    'nav.assets': 'Активы',
    'nav.integrations': 'Интеграции',
    'nav.incidents': 'Инциденты',
    'nav.alerts': 'Оповещения',
    'nav.settings': 'Настройки',
    'nav.profile': 'Профиль',
    'nav.admin': 'Администрирование',
    'nav.users': 'Пользователи',
    'nav.roles': 'Роли',

    // Auth
    'auth.login': 'Вход',
    'auth.register': 'Регистрация',
    'auth.logout': 'Выход',
    'auth.username': 'Имя пользователя',
    'auth.password': 'Пароль',
    'auth.email': 'Email',
    'auth.confirmPassword': 'Подтвердите пароль',
    'auth.loginButton': 'Войти',
    'auth.registerButton': 'Зарегистрироваться',
    'auth.noAccount': 'Нет аккаунта?',
    'auth.hasAccount': 'Уже есть аккаунт?',
    'auth.loginLink': 'Войти',
    'auth.registerLink': 'Зарегистрироваться',

    // Common
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.edit': 'Редактировать',
    'common.delete': 'Удалить',
    'common.create': 'Создать',
    'common.update': 'Обновить',
    'common.search': 'Поиск',
    'common.filter': 'Фильтр',
    'common.actions': 'Действия',
    'common.status': 'Статус',
    'common.type': 'Тип',
    'common.severity': 'Важность',
    'common.time': 'Время',
    'common.name': 'Имя',
    'common.role': 'Роль',
    'common.permissions': 'Разрешения',
    'common.createdAt': 'Создан',
    'common.lastLogin': 'Последний вход',

    // Dashboard
    'dashboard.title': 'Панель управления',
    'dashboard.activeDefenses': 'Активные защиты',
    'dashboard.blockedThreats': 'Блокированные угрозы',
    'dashboard.systemUptime': 'Время работы системы',
    'dashboard.pendingAlerts': 'Ожидающие оповещения',
    'dashboard.threatsOverTime': 'Угрозы по времени',
    'dashboard.threatTypes': 'Типы угроз',
    'dashboard.recentIncidents': 'Последние инциденты',

    // Admin
    'admin.title': 'Администрирование',
    'admin.dashboard': 'Админ панель',
    'admin.userManagement': 'Управление пользователями',
    'admin.roleManagement': 'Управление ролями',
    'admin.createUser': 'Создать пользователя',
    'admin.editUser': 'Редактировать пользователя',
    'admin.deleteUser': 'Удалить пользователя',
    'admin.createRole': 'Создать роль',
    'admin.editRole': 'Редактировать роль',
    'admin.deleteRole': 'Удалить роль',

    // Settings
    'settings.title': 'Настройки',
    'settings.profile': 'Профиль',
    'settings.appearance': 'Внешний вид',
    'settings.notifications': 'Уведомления',
    'settings.theme': 'Тема',
    'settings.light': 'Светлая',
    'settings.dark': 'Темная',
    'settings.language': 'Язык',
    'settings.english': 'Английский',
    'settings.russian': 'Русский',
    'settings.spanish': 'Испанский',

    // Messages
    'message.settingsSaved': 'Настройки сохранены!',
    'message.userCreated': 'Пользователь успешно создан',
    'message.userUpdated': 'Пользователь успешно обновлен',
    'message.userDeleted': 'Пользователь успешно удален',
    'message.roleCreated': 'Роль успешно создана',
    'message.roleUpdated': 'Роль успешно обновлена',
    'message.roleDeleted': 'Роль успешно удалена',
    'message.confirmDelete': 'Вы уверены, что хотите удалить этот элемент?',
    'message.operationFailed': 'Операция не удалась. Попробуйте еще раз.',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel de control',
    'nav.starterGuide': 'Guía de inicio',
    'nav.reports': 'Informes',
    'nav.compliance': 'Cumplimiento',
    'nav.customerTrust': 'Confianza del cliente',
    'nav.suppliers': 'Proveedores',
    'nav.assets': 'Activos',
    'nav.integrations': 'Integraciones',
    'nav.incidents': 'Incidentes',
    'nav.alerts': 'Alertas',
    'nav.settings': 'Configuración',
    'nav.profile': 'Perfil',
    'nav.admin': 'Administración',
    'nav.users': 'Usuarios',
    'nav.roles': 'Roles',

    // Auth
    'auth.login': 'Iniciar sesión',
    'auth.register': 'Registrarse',
    'auth.logout': 'Cerrar sesión',
    'auth.username': 'Nombre de usuario',
    'auth.password': 'Contraseña',
    'auth.email': 'Email',
    'auth.confirmPassword': 'Confirmar contraseña',
    'auth.loginButton': 'Iniciar sesión',
    'auth.registerButton': 'Registrarse',
    'auth.noAccount': '¿No tienes cuenta?',
    'auth.hasAccount': '¿Ya tienes cuenta?',
    'auth.loginLink': 'Iniciar sesión',
    'auth.registerLink': 'Registrarse',

    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.create': 'Crear',
    'common.update': 'Actualizar',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.actions': 'Acciones',
    'common.status': 'Estado',
    'common.type': 'Tipo',
    'common.severity': 'Severidad',
    'common.time': 'Tiempo',
    'common.name': 'Nombre',
    'common.role': 'Rol',
    'common.permissions': 'Permisos',
    'common.createdAt': 'Creado en',
    'common.lastLogin': 'Último acceso',

    // Dashboard
    'dashboard.title': 'Panel de control',
    'dashboard.activeDefenses': 'Defensas activas',
    'dashboard.blockedThreats': 'Amenazas bloqueadas',
    'dashboard.systemUptime': 'Tiempo de actividad del sistema',
    'dashboard.pendingAlerts': 'Alertas pendientes',
    'dashboard.threatsOverTime': 'Amenazas a lo largo del tiempo',
    'dashboard.threatTypes': 'Tipos de amenazas',
    'dashboard.recentIncidents': 'Incidentes recientes',

    // Admin
    'admin.title': 'Administración',
    'admin.dashboard': 'Panel de administración',
    'admin.userManagement': 'Gestión de usuarios',
    'admin.roleManagement': 'Gestión de roles',
    'admin.createUser': 'Crear usuario',
    'admin.editUser': 'Editar usuario',
    'admin.deleteUser': 'Eliminar usuario',
    'admin.createRole': 'Crear rol',
    'admin.editRole': 'Editar rol',
    'admin.deleteRole': 'Eliminar rol',

    // Settings
    'settings.title': 'Configuración',
    'settings.profile': 'Perfil',
    'settings.appearance': 'Apariencia',
    'settings.notifications': 'Notificaciones',
    'settings.theme': 'Tema',
    'settings.light': 'Claro',
    'settings.dark': 'Oscuro',
    'settings.language': 'Idioma',
    'settings.english': 'Inglés',
    'settings.russian': 'Ruso',
    'settings.spanish': 'Español',

    // Messages
    'message.settingsSaved': '¡Configuración guardada!',
    'message.userCreated': 'Usuario creado exitosamente',
    'message.userUpdated': 'Usuario actualizado exitosamente',
    'message.userDeleted': 'Usuario eliminado exitosamente',
    'message.roleCreated': 'Rol creado exitosamente',
    'message.roleUpdated': 'Rol actualizado exitosamente',
    'message.roleDeleted': 'Rol eliminado exitosamente',
    'message.confirmDelete': '¿Estás seguro de que quieres eliminar este elemento?',
    'message.operationFailed': 'La operación falló. Inténtalo de nuevo.',
  }
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language
    return saved && ['en', 'ru', 'es'].includes(saved) ? saved : 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const value: LanguageContextType = {
    language,
    setLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}