import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Auth Pages
import AuthPage from './pages/AuthPage';

// Teacher Pages
import Dashboard from './pages/Dashboard';
import CreateExam from './pages/CreateExam';
import ExamList from './pages/ExamList';
import ExamDetail from './pages/ExamDetail';
import QuestionGrading from './pages/QuestionGrading';
import ExamGrading from './pages/ExamGrading';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import StudentExamView from './pages/StudentExamView';

// Shared Pages
import AccountProfile from './pages/AccountProfile';
import AccountSettings from './pages/AccountSettings';

// Route Guard Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: ('teacher' | 'student')[] }> = ({ 
  children, 
  allowedRoles 
}) => {
  const { user, token } = useAuth();
  
  if (!token || !user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={user.role === 'teacher' ? '/dashboard' : '/student-dashboard'} replace />;
  }
  
  return <>{children}</>;
};

// Dashboard Route Component - redirects to appropriate dashboard
const DashboardRoute: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === 'student') {
    return <Navigate to="/student-dashboard" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              {/* Public Routes */}
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Root redirect to appropriate dashboard */}
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardRoute />
                </ProtectedRoute>
              } />

              {/* Teacher Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/create-exam" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <CreateExam />
                </ProtectedRoute>
              } />
              
              <Route path="/exams/:examId/grade" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <ExamGrading />
                </ProtectedRoute>
              } />
              
              <Route path="/questions/:questionId/grade" element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <QuestionGrading />
                </ProtectedRoute>
              } />

              {/* Student Routes */}
              <Route path="/student-dashboard" element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              } />

              {/* Shared Routes - Different views based on role */}
              <Route path="/exams" element={
                <ProtectedRoute>
                  <ExamList />
                </ProtectedRoute>
              } />
              
              <Route path="/exams/:examId" element={
                <ProtectedRoute>
                  <ExamViewRoute />
                </ProtectedRoute>
              } />

              {/* Account Routes */}
              <Route path="/account/profile" element={
                <ProtectedRoute>
                  <AccountProfile />
                </ProtectedRoute>
              } />
              
              <Route path="/account/settings" element={
                <ProtectedRoute>
                  <AccountSettings />
                </ProtectedRoute>
              } />

              {/* Catch all - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                style: {
                  background: '#fff',
                  color: '#000',
                  border: '4px solid #000',
                  boxShadow: '8px 8px 0px 0px rgba(0,0,0,1)',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  fontSize: '14px'
                }
              }}
            />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Component to route to appropriate exam view based on user role
const ExamViewRoute: React.FC = () => {
  const { user } = useAuth();
  
  if (user?.role === 'student') {
    return <StudentExamView />;
  }
  
  return <ExamDetail />;
};

export default App;