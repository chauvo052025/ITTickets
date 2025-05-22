import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import NewTicketPage from './pages/NewTicketPage';
import TicketDetailPage from './pages/TicketDetailPage';
import KnowledgeBasePage from './pages/KnowledgeBasePage';
import KnowledgeArticlePage from './pages/KnowledgeArticlePage';
import ReportsPage from './pages/ReportsPage';
import SearchPage from './pages/SearchPage';
import StaffPage from './pages/StaffPage';
import SettingsPage from './pages/SettingsPage';
import { useAuthStore } from './store/auth';
import { UserRole } from './types';

// Protected route wrapper
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="tickets" element={<TicketsPage />} />
          <Route path="tickets/new" element={<NewTicketPage />} />
          <Route path="tickets/:id" element={<TicketDetailPage />} />
          <Route path="knowledge" element={<KnowledgeBasePage />} />
          <Route path="knowledge/:id" element={<KnowledgeArticlePage />} />
          <Route path="search" element={<SearchPage />} />
          
          <Route 
            path="reports" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.SUPERVISOR, UserRole.MANAGER]}>
                <ReportsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="staff" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.SUPERVISOR, UserRole.MANAGER]}>
                <StaffPage />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="settings" 
            element={
              <ProtectedRoute allowedRoles={[UserRole.MANAGER]}>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;