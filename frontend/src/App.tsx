import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { RiderInterface } from './pages/RiderInterface';
import { CartPage } from './pages/CartPage';

function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactElement;
  roles?: string[];
}) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route
        path="/track/:orderId"
        element={
          <ProtectedRoute>
            <OrderTrackingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rider"
        element={
          <ProtectedRoute roles={['rider']}>
            <RiderInterface />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
