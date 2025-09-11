import React, { useState } from 'react'
import { API_ENDPOINTS } from '../config/api'
import { useAuth } from '../components/AuthProvider'
import { useNavigate } from 'react-router-dom'

const Login: React.FC = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
    <div id="login-page" className="login-page">
      <div className="login-card">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-6" style={{ color: '#111827' }}>
              Sign in to your account
            </h2>
          </div>

          <form id="login-form" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="login-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="login-input"
                autoComplete="username"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="login-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="login-error text-sm text-center mb-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-button w-full mt-2 mb-4"
            >
              Sign in
            </button>

            <div className="text-center">
              <a href="#" className="text-sm login-link">Forgot your password?</a>
            </div>
            <div className="text-center mt-2">
              <p className="text-sm login-secondary">
                Don’t have an account? <a href="#" className="login-link">Sign up</a>
              </p>
            </div>
          </form>
      </div>
    </div>
  )
}

export default Login