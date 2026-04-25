import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Login        from './pages/auth/Login';
import Register     from './pages/auth/Register';
import JobList      from './pages/user/JobList';
import JobDetail    from './pages/user/JobDetail';
import MyApplications from './pages/user/MyApplications';
import SavedJobs    from './pages/user/SavedJobs';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob      from './pages/recruiter/PostJob';
import ViewApplicants from './pages/recruiter/ViewApplicants';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers  from './pages/admin/ManageUsers';
import ReferralPage from './pages/user/ReferralPage';
import Leaderboard  from './pages/user/Leaderboard';
import Notifications from './pages/user/Notifications';
import Layout       from './components/common/Layout';

// Route guards
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner" />;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-spinner" />;
  if (user) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'RECRUITER') return <Navigate to="/recruiter" replace />;
    return <Navigate to="/jobs" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* User routes */}
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/jobs" replace />} />
        <Route path="jobs"               element={<JobList />} />
        <Route path="jobs/:id"           element={<JobDetail />} />
        <Route path="my-applications"    element={<ProtectedRoute roles={['USER']}><MyApplications /></ProtectedRoute>} />
        <Route path="saved-jobs"         element={<ProtectedRoute roles={['USER']}><SavedJobs /></ProtectedRoute>} />
        <Route path="referrals"          element={<ReferralPage />} />
        <Route path="leaderboard"        element={<Leaderboard />} />
        <Route path="notifications"      element={<Notifications />} />

        {/* Recruiter routes */}
        <Route path="recruiter"          element={<ProtectedRoute roles={['RECRUITER','ADMIN']}><RecruiterDashboard /></ProtectedRoute>} />
        <Route path="recruiter/post-job" element={<ProtectedRoute roles={['RECRUITER','ADMIN']}><PostJob /></ProtectedRoute>} />
        <Route path="recruiter/applicants/:jobId" element={<ProtectedRoute roles={['RECRUITER','ADMIN']}><ViewApplicants /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="admin"              element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="admin/users"        element={<ProtectedRoute roles={['ADMIN']}><ManageUsers /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
