import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ExamList from './pages/ExamList';
import CreateExam from './pages/CreateExam';
import ExamDetail from './pages/ExamDetail';
import QuestionGrading from './pages/QuestionGrading';
import AccountProfile from './pages/AccountProfile';
import AccountSettings from './pages/AccountSettings';
import LoadingSpinner from './components/UI/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Bypass authentication - always allow access
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route 
        path="/auth" 
        element={<AuthPage />} 
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams"
        element={
          <ProtectedRoute>
            <ExamList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams/new"
        element={
          <ProtectedRoute>
            <CreateExam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exams/:id"
        element={
          <ProtectedRoute>
            <ExamDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/questions/:questionId/grade"
        element={
          <ProtectedRoute>
            <QuestionGrading />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/profile"
        element={
          <ProtectedRoute>
            <AccountProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/account/settings"
        element={
          <ProtectedRoute>
            <AccountSettings />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#000',
                color: '#fff',
                border: '4px solid #000',
                boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;