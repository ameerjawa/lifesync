import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useGuestStore } from './store/guestStore';
import { ToastProvider } from './components/ToastProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthModal } from './components/AuthModal';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SetupPage from './pages/SetupPage';
import UpgradePage from './pages/UpgradePage';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  const { user, profile, isLoading, loadUser } = useAuthStore();
  const { isGuest } = useGuestStore();
  const [authModal, setAuthModal] = useState<{ open: boolean; mode: 'signin' | 'signup' }>({
    open: false,
    mode: 'signin',
  });

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  const openAuth = (mode: 'signin' | 'signup') => setAuthModal({ open: true, mode });
  const closeAuth = () => setAuthModal(prev => ({ ...prev, open: false }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ToastProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                user || isGuest
                  ? <Navigate to="/dashboard" />
                  : <LandingPage onAuth={openAuth} />
              }
            />
            <Route path="/dashboard/*" element={user || isGuest ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/setup" element={<SetupPage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            <Route
              path="/admin"
              element={profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/dashboard" />}
            />
          </Routes>

          <AuthModal
            isOpen={authModal.open}
            onClose={closeAuth}
            initialMode={authModal.mode}
          />
        </Router>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
