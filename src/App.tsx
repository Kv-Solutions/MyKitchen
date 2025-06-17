import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useThemeStore } from './stores/themeStore';

// Layouts
import { AuthLayout } from './components/auth/AuthLayout';
import { MainLayout } from './components/layout/MainLayout';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { KitchenPage } from './pages/KitchenPage';
import PosPage from './pages/PosPage';
import OptionsPage from './pages/OptionsPage';
import MenuPage from './pages/MenuPage';
import InventoryPage from './pages/InventoryPage';
import SalesPage from './pages/SalesPage';

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Algo salió mal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ha ocurrido un error inesperado. Por favor, recarga la página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Recargar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading Spinner Component
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Cargando...</p>
    </div>
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Main App Component
const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();
  const { theme } = useThemeStore();
  
  React.useEffect(() => {
    document.title = 'RestaurantOS - Plataforma de Gestión Integral';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />
      
      <Route path="/" element={<AuthLayout />}>
        <Route path="login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
      </Route>
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="kitchen" element={<KitchenPage />} />
        <Route path="pos" element={<PosPage />} />
        <Route path="salespage" element={<SalesPage />} />
        
        {/* Add placeholder pages for other routes */}
        <Route path="accounts" element={<div className="p-6"><h1 className="text-2xl font-bold">Cuentas (En desarrollo)</h1></div>} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="reports" element={<div className="p-6"><h1 className="text-2xl font-bold">Reportes (En desarrollo)</h1></div>} />
        <Route path="orders" element={<div className="p-6"><h1 className="text-2xl font-bold">Órdenes (En desarrollo)</h1></div>} />
        <Route path="settings" element={<OptionsPage />} />
        <Route path="businesses" element={<div className="p-6"><h1 className="text-2xl font-bold">Negocios (En desarrollo)</h1></div>} />
      </Route>
      
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-color)',
              },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;