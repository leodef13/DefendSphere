import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ChatWidget from '../components/ChatWidget';
import { 
  Home, 
  BookOpen, 
  FileText, 
  Shield, 
  Heart, 
  Users, 
  HardDrive, 
  Link as LinkIcon,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ReactNode;
  permission?: string;
}

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const navItems: NavItem[] = [
    { name: t('nav.home'), path: '/home', icon: <Home className="h-5 w-5" /> },
    { name: t('nav.starterGuide'), path: '/starter-guide', icon: <BookOpen className="h-5 w-5" /> },
    { name: t('nav.reports'), path: '/reports', icon: <FileText className="h-5 w-5" />, permission: 'reports' },
    { name: t('nav.compliance'), path: '/compliance', icon: <Shield className="h-5 w-5" />, permission: 'compliance' },
    { name: t('nav.customerTrust'), path: '/customer-trust', icon: <Heart className="h-5 w-5" />, permission: 'customer_trust' },
    { name: t('nav.suppliers'), path: '/suppliers', icon: <Users className="h-5 w-5" />, permission: 'suppliers' },
    { name: t('nav.assets'), path: '/assets', icon: <HardDrive className="h-5 w-5" />, permission: 'assets' },
    { name: t('nav.integrations'), path: '/integrations', icon: <LinkIcon className="h-5 w-5" />, permission: 'integrations' },
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  const filteredNavItems = navItems.filter(item => {
    if (!item.permission) return true;
    return user?.permissions?.includes(item.permission);
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleLanguageDropdown = () => {
    setIsLanguageDropdownOpen(!isLanguageDropdownOpen);
    setIsUserDropdownOpen(false);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsLanguageDropdownOpen(false);
  };

  const changeLanguage = (langCode: string) => {
    setLanguage(langCode);
    setIsLanguageDropdownOpen(false);
  };

  // Функция для получения инициалов пользователя
  const getUserInitials = (username: string) => {
    if (!username) return 'U';
    const parts = username.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  // Закрытие мобильного меню при изменении маршрута
  useEffect(() => {
    closeMobileMenu();
  }, [location.pathname]);

  // Закрытие дропдаунов при клике вне их
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown')) {
        setIsLanguageDropdownOpen(false);
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="flex items-center justify-between p-5">
          <h2 className="text-xl font-bold text-white">DefendSphere</h2>
          <button
            onClick={toggleMobileMenu}
            className="mobile-menu-toggle text-white lg:hidden"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 flex-1">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#134876] text-white'
                        : 'text-gray-300 hover:bg-[#134876] hover:text-white'
                    }`}
                    onClick={closeMobileMenu}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Section - внизу sidebar */}
        <div className="p-4 border-t border-[#134876]">
          <div className="flex items-center space-x-3">
            {/* Круглешок с инициалами */}
            <div className="w-10 h-10 bg-[#56a3d9] rounded-full flex items-center justify-center text-white font-bold text-sm">
              {getUserInitials(user.username)}
            </div>
            
            {/* Информация о пользователе */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.username}
              </p>
              <p className="text-xs text-gray-300 capitalize">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-toggle text-gray-600 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Left Section */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Admin Panel Link */}
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-[#56a3d9] hover:bg-[#134876] transition-colors"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin Panel
                </Link>
              )}

              {/* Language Selector */}
              <div className="relative dropdown">
                <button
                  onClick={toggleLanguageDropdown}
                  className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                >
                  <span>{languages.find(lang => lang.code === language)?.flag}</span>
                  <span className="hidden sm:inline">
                    {languages.find(lang => lang.code === language)?.code.toUpperCase()}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isLanguageDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center space-x-2 ${
                            language === lang.code ? 'bg-[#56a3d9] text-white' : 'text-gray-700'
                          }`}
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative dropdown">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-3 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
                >
                  <div className="w-8 h-8 bg-[#56a3d9] rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden sm:block text-gray-700 font-medium">
                    {user.username}
                  </span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
};

export default MainLayout;


