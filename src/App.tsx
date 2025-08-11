import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useGuestStore } from './store/guestStore';
import { ToastProvider } from './components/ToastProvider';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SetupPage from './pages/SetupPage';
import UpgradePage from './pages/UpgradePage';
import { AdminDashboard } from './pages/AdminDashboard';

function App() {
  const { user, profile, isLoading, loadUser } = useAuthStore();
  const { isGuest } = useGuestStore();

  React.useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={user || isGuest ? <Navigate to="/dashboard" /> : <LandingPage />} />
          <Route path="/dashboard/*" element={user || isGuest ? <Dashboard /> : <Navigate to="/" />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
          <Route 
            path="/admin" 
            element={
              profile?.role === 'admin' ? 
                <AdminDashboard /> : 
                <Navigate to="/dashboard" />
            } 
          />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;