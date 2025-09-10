import React, { useState } from 'react'
import { API_ENDPOINTS } from '../config/api'
import { useAuth } from '../components/AuthProvider'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('') // Очищаем предыдущие ошибки

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
    }
  }

  return (
    <div id="login-page" className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="card p-8 w-full max-w-md mx-auto">
          {/* Заголовок */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#134876]">
              DefendSphere
            </h1>
            <p className="text-gray-600 mt-2">
              Security Compliance Dashboard
            </p>
          </div>

          {/* Форма входа */}
          <form id="login-form" onSubmit={handleSubmit} className="space-y-6">
            {/* Username поле */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
              />
            </div>

            {/* Password поле */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#56a3d9]"
              />
            </div>

            {/* Remember me и Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember-me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#56a3d9] focus:ring-[#56a3d9] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-[#56a3d9] hover:text-[#134876]"
              >
                Forgot password?
              </a>
            </div>

            {/* Сообщение об ошибке */}
            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}

            {/* Кнопка Login */}
            <button
              type="submit"
              className="w-full py-2 px-4 rounded-md text-white font-medium btn-primary"
            >
              Login
            </button>
          </form>
      </div>
    </div>
  )
}

export default Login