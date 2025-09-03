import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Очищаем ошибку при вводе
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password, rememberMe);
      navigate('/home');
    } catch (err) {
      setError(t('auth.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8f9fa] to-[#e9ecef] p-4">
      <div className="card p-8 w-full max-w-md fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#56a3d9] to-[#134876] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-[#134876] mb-2">DefendSphere</h1>
          <p className="text-gray-600">{t('auth.loginSubtitle')}</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.username')}
            </label>
            <div className="relative">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56a3d9] focus:border-transparent transition-all duration-200"
                placeholder={t('auth.usernamePlaceholder')}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {t('auth.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#56a3d9] focus:border-transparent transition-all duration-200"
                placeholder={t('auth.passwordPlaceholder')}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#56a3d9] focus:ring-[#56a3d9] border-gray-300 rounded transition-colors"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                {t('auth.rememberMe')}
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-[#56a3d9] hover:text-[#134876] transition-colors"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary py-3 px-4 rounded-lg text-white font-medium text-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {t('auth.loggingIn')}
              </div>
            ) : (
              t('auth.login')
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {t('auth.noAccount')}{' '}
            <Link
              to="/register"
              className="text-[#56a3d9] hover:text-[#134876] font-medium transition-colors"
            >
              {t('auth.createAccount')}
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 text-center mb-2">
            {t('auth.demoCredentials')}
          </p>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Admin:</span>
              <span className="font-mono text-gray-800">admin / admin</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">User 1:</span>
              <span className="font-mono text-gray-800">user1 / user1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">User 2:</span>
              <span className="font-mono text-gray-800">user2 / user2</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;