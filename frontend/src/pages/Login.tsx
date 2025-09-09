import React, { useState } from 'react'
import { Shield, Eye, EyeOff, User, Lock } from 'lucide-react'
import { API_ENDPOINTS } from '../config/api'
import { useI18n } from '../i18n'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useAuth } from '../components/AuthProvider'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const { t } = useI18n()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Проверка полей на пустоту
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all required fields.')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        login(data.token, data.user)
        navigate('/dashboard', { replace: true })
      } else {
        setError('Invalid username or password. Please try again.')
      }
    } catch (err) {
      setError('Invalid username or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      {/* Квадратная карточка в центре экрана */}
      <div className="card p-8 w-full max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12" style={{ color: '#134876' }} />
            </div>
            <h1 className="text-3xl font-bold text-[#134876]">
              DefendSphere
            </h1>
            <p className="text-gray-600 mt-2">
              Security Compliance Dashboard
            </p>
          </div>

          {/* Форма входа */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username поле */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-gray-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9] text-gray-900 placeholder-gray-500"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Password поле */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="flex items-center relative">
                <Lock className="h-5 w-5 mr-2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9] text-gray-900 placeholder-gray-500"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Remember me и Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#56a3d9] focus:ring-[#56a3d9] border-gray-300 rounded"
                />
                <span className="ml-2 block text-sm text-gray-700">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-[#56a3d9] hover:text-[#134876] transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>

            {/* Сообщение об ошибке */}
            <div id="login-error" className={`text-red-500 text-sm text-center ${error ? 'block' : 'hidden'}`}>
              {error}
            </div>

            {/* Кнопка Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2 px-4 rounded-md text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#56a3d9] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: '#134876'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#0f3556'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#134876'
                }
              }}
            >
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          {/* Информация о пользователях по умолчанию */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center text-xs text-gray-500 mb-4">
              <p>Default users for testing:</p>
              <p className="font-mono">admin/admin, user1/user1, user2/user2, user3/user3</p>
            </div>
            
            {/* Переключатель языка */}
            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login