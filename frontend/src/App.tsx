import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './components/AuthProvider'
import { I18nProvider } from './i18n'
import ProtectedRoute from './components/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Assets from './pages/Assets'
import Compliance from './pages/Compliance'
import CustomerTrust from './pages/CustomerTrust'
import Suppliers from './pages/Suppliers'
import Reports from './pages/Reports'
import StarterGuide from './pages/StarterGuide'
import Integrations from './pages/Integrations'
import Incidents from './pages/Incidents'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import AdminPanel from './pages/AdminPanel'
import UserDashboard from './pages/UserDashboard'

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/customer-trust" element={<CustomerTrust />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/starter-guide" element={<StarterGuide />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </I18nProvider>
  )
}

export default App

