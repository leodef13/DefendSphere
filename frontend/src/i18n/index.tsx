import { createContext, useContext, useState, ReactNode } from 'react'
import type { Language, Translations, I18nContextType } from './types'

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Language, Translations> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.assets': 'Assets',
    'nav.compliance': 'Compliance',
    'nav.customerTrust': 'Customer Trust',
    'nav.suppliers': 'Suppliers',
    'nav.reports': 'Reports',
    'nav.starterGuide': 'Starter Guide',
    'nav.integrations': 'Integrations',
    'nav.incidents': 'Incidents',
    'nav.alerts': 'Alerts',
    'nav.settings': 'Settings',
    'nav.admin': 'Admin Panel',
    
    // Auth
    'auth.login': 'Sign In',
    'auth.register': 'Sign Up',
    'auth.logout': 'Logout',
    'auth.username': 'Username',
    'auth.password': 'Password',
    'auth.email': 'Email',
    'auth.welcome': 'Welcome',
    'auth.signInToDashboard': 'Sign in to your security dashboard',
    'auth.defaultUsers': 'Default users:',
    'auth.signingIn': 'Signing in...',
    'auth.connectionError': 'Connection error. Please try again.',
    'auth.loginFailed': 'Login failed',
    
    // Dashboard
    'dashboard.title': 'Security Dashboard',
    'dashboard.threatsOverTime': 'Threats Over Time',
    'dashboard.threatTypes': 'Threat Types',
    'dashboard.recentIncidents': 'Recent Incidents',
    'dashboard.time': 'Time',
    'dashboard.type': 'Type',
    'dashboard.severity': 'Severity',
    'dashboard.status': 'Status',
    'dashboard.high': 'High',
    'dashboard.medium': 'Medium',
    'dashboard.low': 'Low',
    
    // Admin Panel
    'admin.title': 'Admin Panel',
    'admin.users': 'Users',
    'admin.addUser': 'Add User',
    'admin.editUser': 'Edit User',
    'admin.deleteUser': 'Delete User',
    'admin.userManagement': 'User Management',
    'admin.role': 'Role',
    'admin.permissions': 'Permissions',
    'admin.createdAt': 'Created At',
    'admin.lastLogin': 'Last Login',
    'admin.actions': 'Actions',
    'admin.admin': 'Admin',
    'admin.user': 'User',
    'admin.save': 'Save',
    'admin.cancel': 'Cancel',
    'admin.delete': 'Delete',
    'admin.confirmDelete': 'Are you sure you want to delete this user?',
    'admin.userCreated': 'User created successfully',
    'admin.userUpdated': 'User updated successfully',
    'admin.userDeleted': 'User deleted successfully',
    'admin.error': 'An error occurred',
    
    // Permissions
    'permissions.all': 'All Access',
    'permissions.dashboard': 'Dashboard Access',
    'permissions.assets': 'Assets Access',
    'permissions.compliance': 'Compliance Access',
    'permissions.customerTrust': 'Customer Trust Access',
    'permissions.suppliers': 'Suppliers Access',
    'permissions.reports': 'Reports Access',
    'permissions.integrations': 'Integrations Access',
    'permissions.incidents': 'Incidents Access',
    'permissions.alerts': 'Alerts Access',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.close': 'Close',
    'common.yes': 'Yes',
    'common.no': 'No',
  },
  ru: {
    // Navigation
    'nav.home': 'Главная',
    'nav.assets': 'Активы',
    'nav.compliance': 'Соответствие',
    'nav.customerTrust': 'Доверие клиентов',
    'nav.suppliers': 'Поставщики',
    'nav.reports': 'Отчеты',
    'nav.starterGuide': 'Руководство',
    'nav.integrations': 'Интеграции',
    'nav.incidents': 'Инциденты',
    'nav.alerts': 'Оповещения',
    'nav.settings': 'Настройки',
    'nav.admin': 'Панель администратора',
    
    // Auth
    'auth.login': 'Войти',
    'auth.register': 'Регистрация',
    'auth.logout': 'Выйти',
    'auth.username': 'Имя пользователя',
    'auth.password': 'Пароль',
    'auth.email': 'Email',
    'auth.welcome': 'Добро пожаловать',
    'auth.signInToDashboard': 'Войдите в панель безопасности',
    'auth.defaultUsers': 'Пользователи по умолчанию:',
    'auth.signingIn': 'Вход...',
    'auth.connectionError': 'Ошибка подключения. Попробуйте снова.',
    'auth.loginFailed': 'Ошибка входа',
    
    // Dashboard
    'dashboard.title': 'Панель безопасности',
    'dashboard.threatsOverTime': 'Угрозы по времени',
    'dashboard.threatTypes': 'Типы угроз',
    'dashboard.recentIncidents': 'Недавние инциденты',
    'dashboard.time': 'Время',
    'dashboard.type': 'Тип',
    'dashboard.severity': 'Серьезность',
    'dashboard.status': 'Статус',
    'dashboard.high': 'Высокая',
    'dashboard.medium': 'Средняя',
    'dashboard.low': 'Низкая',
    
    // Admin Panel
    'admin.title': 'Панель администратора',
    'admin.users': 'Пользователи',
    'admin.addUser': 'Добавить пользователя',
    'admin.editUser': 'Редактировать пользователя',
    'admin.deleteUser': 'Удалить пользователя',
    'admin.userManagement': 'Управление пользователями',
    'admin.role': 'Роль',
    'admin.permissions': 'Разрешения',
    'admin.createdAt': 'Создан',
    'admin.lastLogin': 'Последний вход',
    'admin.actions': 'Действия',
    'admin.admin': 'Администратор',
    'admin.user': 'Пользователь',
    'admin.save': 'Сохранить',
    'admin.cancel': 'Отмена',
    'admin.delete': 'Удалить',
    'admin.confirmDelete': 'Вы уверены, что хотите удалить этого пользователя?',
    'admin.userCreated': 'Пользователь успешно создан',
    'admin.userUpdated': 'Пользователь успешно обновлен',
    'admin.userDeleted': 'Пользователь успешно удален',
    'admin.error': 'Произошла ошибка',
    
    // Permissions
    'permissions.all': 'Полный доступ',
    'permissions.dashboard': 'Доступ к панели',
    'permissions.assets': 'Доступ к активам',
    'permissions.compliance': 'Доступ к соответствию',
    'permissions.customerTrust': 'Доступ к доверию клиентов',
    'permissions.suppliers': 'Доступ к поставщикам',
    'permissions.reports': 'Доступ к отчетам',
    'permissions.integrations': 'Доступ к интеграциям',
    'permissions.incidents': 'Доступ к инцидентам',
    'permissions.alerts': 'Доступ к оповещениям',
    
    // Common
    'common.loading': 'Загрузка...',
    'common.error': 'Ошибка',
    'common.success': 'Успешно',
    'common.save': 'Сохранить',
    'common.cancel': 'Отмена',
    'common.delete': 'Удалить',
    'common.edit': 'Редактировать',
    'common.add': 'Добавить',
    'common.close': 'Закрыть',
    'common.yes': 'Да',
    'common.no': 'Нет',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.assets': 'Activos',
    'nav.compliance': 'Cumplimiento',
    'nav.customerTrust': 'Confianza del Cliente',
    'nav.suppliers': 'Proveedores',
    'nav.reports': 'Informes',
    'nav.starterGuide': 'Guía de Inicio',
    'nav.integrations': 'Integraciones',
    'nav.incidents': 'Incidentes',
    'nav.alerts': 'Alertas',
    'nav.settings': 'Configuración',
    'nav.admin': 'Panel de Administración',
    
    // Auth
    'auth.login': 'Iniciar Sesión',
    'auth.register': 'Registrarse',
    'auth.logout': 'Cerrar Sesión',
    'auth.username': 'Nombre de Usuario',
    'auth.password': 'Contraseña',
    'auth.email': 'Email',
    'auth.welcome': 'Bienvenido',
    'auth.signInToDashboard': 'Inicia sesión en tu panel de seguridad',
    'auth.defaultUsers': 'Usuarios por defecto:',
    'auth.signingIn': 'Iniciando sesión...',
    'auth.connectionError': 'Error de conexión. Inténtalo de nuevo.',
    'auth.loginFailed': 'Error de inicio de sesión',
    
    // Dashboard
    'dashboard.title': 'Panel de Seguridad',
    'dashboard.threatsOverTime': 'Amenazas en el Tiempo',
    'dashboard.threatTypes': 'Tipos de Amenazas',
    'dashboard.recentIncidents': 'Incidentes Recientes',
    'dashboard.time': 'Tiempo',
    'dashboard.type': 'Tipo',
    'dashboard.severity': 'Severidad',
    'dashboard.status': 'Estado',
    'dashboard.high': 'Alta',
    'dashboard.medium': 'Media',
    'dashboard.low': 'Baja',
    
    // Admin Panel
    'admin.title': 'Panel de Administración',
    'admin.users': 'Usuarios',
    'admin.addUser': 'Agregar Usuario',
    'admin.editUser': 'Editar Usuario',
    'admin.deleteUser': 'Eliminar Usuario',
    'admin.userManagement': 'Gestión de Usuarios',
    'admin.role': 'Rol',
    'admin.permissions': 'Permisos',
    'admin.createdAt': 'Creado En',
    'admin.lastLogin': 'Último Acceso',
    'admin.actions': 'Acciones',
    'admin.admin': 'Administrador',
    'admin.user': 'Usuario',
    'admin.save': 'Guardar',
    'admin.cancel': 'Cancelar',
    'admin.delete': 'Eliminar',
    'admin.confirmDelete': '¿Estás seguro de que quieres eliminar este usuario?',
    'admin.userCreated': 'Usuario creado exitosamente',
    'admin.userUpdated': 'Usuario actualizado exitosamente',
    'admin.userDeleted': 'Usuario eliminado exitosamente',
    'admin.error': 'Ocurrió un error',
    
    // Permissions
    'permissions.all': 'Acceso Total',
    'permissions.dashboard': 'Acceso al Panel',
    'permissions.assets': 'Acceso a Activos',
    'permissions.compliance': 'Acceso a Cumplimiento',
    'permissions.customerTrust': 'Acceso a Confianza del Cliente',
    'permissions.suppliers': 'Acceso a Proveedores',
    'permissions.reports': 'Acceso a Informes',
    'permissions.integrations': 'Acceso a Integraciones',
    'permissions.incidents': 'Acceso a Incidentes',
    'permissions.alerts': 'Acceso a Alertas',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.add': 'Agregar',
    'common.close': 'Cerrar',
    'common.yes': 'Sí',
    'common.no': 'No',
  }
}

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language
    return saved || 'en'
  })

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  return (
    <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export const useI18n = () => {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}