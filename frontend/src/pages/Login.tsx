import React, { useState } from 'react'
import { Shield, Eye, EyeOff } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      {/* Квадратная карточка в центре экрана */}
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12" style={{ color: '#134876' }} />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#134876' }}>
              DefendSphere
            </h1>
            <p className="text-gray-600 text-sm">
              Security Compliance Dashboard
            </p>
          </div>

          {/* Форма входа */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username поле */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
                placeholder="Enter your username"
              />
            </div>

            {/* Password поле */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500"
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
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                onMouseEnter={(e) => e.currentTarget.style.color = '#134876'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#56a3d9'}
              >
                Forgot password?
              </a>
            </div>

            {/* Сообщение об ошибке */}
            {error && (
              <div className="text-center">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Кнопка Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: '#56a3d9',
                ':hover': { backgroundColor: '#134876' }
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#134876'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#56a3d9'
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