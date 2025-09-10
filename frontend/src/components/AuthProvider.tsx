import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { API_ENDPOINTS } from '../config/api'

interface User {
  id: string
  username: string
  email: string
  role: string
  permissions: string[]
  organization?: string
  organizations?: string[]
  fullName?: string
  phone?: string
  position?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
  initialized: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser)
      console.log('AuthProvider - Initialization user:', parsedUser)
      console.log('AuthProvider - Initialization organizations:', parsedUser.organizations)
      setToken(storedToken)
      setUser(parsedUser)
      setIsAuthenticated(true)
    }
    setInitialized(true)
  }, [])

  const login = (newToken: string, newUser: User) => {
    console.log('AuthProvider - Login user:', newUser)
    console.log('AuthProvider - User organizations:', newUser.organizations)
    setToken(newToken)
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const refreshUser = async () => {
    try {
      const authToken = localStorage.getItem('token')
      if (!authToken) return
      const res = await fetch(API_ENDPOINTS.ME, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      })
      if (res.ok) {
        const data = await res.json()
        console.log('AuthProvider - Refresh user data:', data.user)
        console.log('AuthProvider - Refresh user organizations:', data.user?.organizations)
        if (data.user) {
          setUser(data.user as any)
          localStorage.setItem('user', JSON.stringify(data.user))
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      console.error('AuthProvider - Refresh error:', error)
    }
  }

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    initialized,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}