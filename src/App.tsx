import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Main Pages
import Home from './pages/Home';
import StarterGuide from './pages/StarterGuide';
import Reports from './pages/Reports';
import Compliance from './pages/Compliance';
import CustomerTrust from './pages/CustomerTrust';
import Suppliers from './pages/Suppliers';
import Assets from './pages/Assets';
import Integrations from './pages/Integrations';
import Profile from './pages/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import RoleManagement from './pages/admin/RoleManagement';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={
                <AuthLayout>
                  <Login />
                </AuthLayout>
              } />
              <Route path="/register" element={
                <AuthLayout>
                  <Register />
                </AuthLayout>
              } />

              {/* Protected Main Routes */}
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Home />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/starter-guide" element={
                <ProtectedRoute>
                  <MainLayout>
                    <StarterGuide />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Reports />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/compliance" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Compliance />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/customer-trust" element={
                <ProtectedRoute>
                  <MainLayout>
                    <CustomerTrust />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/suppliers" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Suppliers />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/assets" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Assets />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/integrations" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Integrations />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/users" element={
                <AdminRoute>
                  <AdminLayout>
                    <UserManagement />
                  </AdminLayout>
                </AdminRoute>
              } />
              <Route path="/admin/roles" element={
                <AdminRoute>
                  <AdminLayout>
                    <RoleManagement />
                  </AdminLayout>
                </AdminRoute>
              } />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;

