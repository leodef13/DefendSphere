import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { LanguageProvider } from './contexts/LanguageContext'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import AuthLayout from './layouts/AuthLayout'
import Dashboard from './pages/Dashboard'
import Incidents from './pages/Incidents'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import Home from './pages/Home'
import StarterGuide from './pages/StarterGuide'
import Reports from './pages/Reports'
import Compliance from './pages/Compliance'
import CustomerTrust from './pages/CustomerTrust'
import Suppliers from './pages/Suppliers'
import Assets from './pages/Assets'
import Integrations from './pages/Integrations'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/Dashboard'
import UserManagement from './pages/admin/UserManagement'
import RoleManagement from './pages/admin/RoleManagement'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Routes>
          {/* Auth routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Main app routes */}
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/starter-guide" element={<StarterGuide />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/customer-trust" element={<CustomerTrust />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/roles" element={<RoleManagement />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App

