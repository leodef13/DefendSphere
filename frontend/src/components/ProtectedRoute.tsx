import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, initialized } = useAuth()

  if (!initialized) return null
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

export default ProtectedRoute