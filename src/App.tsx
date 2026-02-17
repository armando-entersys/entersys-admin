import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { PostsListPage } from './pages/PostsListPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { EditPostPage } from './pages/EditPostPage';
import { EmailDashboardPage } from './pages/EmailDashboardPage';
import { EmailProjectsPage } from './pages/EmailProjectsPage';
import { EmailProjectDetailPage } from './pages/EmailProjectDetailPage';
import { EmailLogsPage } from './pages/EmailLogsPage';
import { EmailEscalationPage } from './pages/EmailEscalationPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts"
          element={
            <ProtectedRoute>
              <PostsListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/new"
          element={
            <ProtectedRoute>
              <CreatePostPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:id/edit"
          element={
            <ProtectedRoute>
              <EditPostPage />
            </ProtectedRoute>
          }
        />

        {/* Email Service Routes */}
        <Route
          path="/email"
          element={
            <ProtectedRoute>
              <EmailDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/email/projects"
          element={
            <ProtectedRoute>
              <EmailProjectsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/email/projects/:id"
          element={
            <ProtectedRoute>
              <EmailProjectDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/email/logs"
          element={
            <ProtectedRoute>
              <EmailLogsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/email/escalation"
          element={
            <ProtectedRoute>
              <EmailEscalationPage />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
