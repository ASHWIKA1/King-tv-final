import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { I18nProvider } from './context/I18nContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import KycManagement from './pages/admin/KycManagement';
import ProfanityFilter from './pages/admin/ProfanityFilter';
import SystemSettings from './pages/admin/SystemSettings';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import TaxonomyManager from './pages/admin/TaxonomyManager';
import RoleManagement from './pages/admin/RoleManagement';
import PushNotifications from './pages/admin/PushNotifications';
import HomeLayoutBuilder from './pages/admin/HomeLayoutBuilder';
import SurveyBuilder from './pages/admin/SurveyBuilder';
import AuditLogs from './pages/admin/AuditLogs';
import CommentsModeration from './pages/admin/CommentsModeration';
import MediaLibrary from './pages/admin/MediaLibrary';
import SeoConsole from './pages/admin/SeoConsole';
import ContentQueue from './pages/editor/ContentQueue';
import MyPosts from './pages/journalist/MyPosts';
import PostEditor from './pages/journalist/PostEditor';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Breadcrumbs from './components/layout/Breadcrumbs';
import NewsManagement from './pages/admin/NewsManagement';
import NewsEditor from './pages/admin/NewsEditor';
import BreakingNewsDashboard from './pages/admin/BreakingNewsDashboard';
import UgcQueue from './pages/admin/UgcQueue';
import EditorialCalendar from './pages/admin/EditorialCalendar';

import AdManagement from './pages/admin/AdManagement';
import RssManager from './pages/admin/RssManager';
import RewardSystem from './pages/admin/RewardSystem';
import SubscribersManagement from './pages/admin/SubscribersManagement';
import NotificationPreferences from './pages/admin/NotificationPreferences';
import Profile from './pages/admin/Profile';
import AiConfiguration from './pages/admin/AiConfiguration';
import CommunityModules from './pages/admin/CommunityModules';
import LanguageFontSettings from './pages/admin/LanguageFontSettings';
import EmployersManagement from './pages/admin/EmployersManagement';
import CandidatesManagement from './pages/admin/CandidatesManagement';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#fff', padding: '2rem' }}>
          <div style={{ maxWidth: '500px', width: '100%', background: '#1e293b', border: '1px solid #334155', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#f43f5e' }}>⚠️ Page Render Error</h2>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
            >
              🔄 Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const ProtectedLayout = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="app-container"><div className="glass-panel" style={{margin: 'auto', padding: '2rem'}}>Loading...</div></div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/admin/dashboard" replace />;

  return (
    <ErrorBoundary>
      <div className="app-container">
        <Sidebar />
        <Header />
        <main className="main-content">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <AuthProvider>
      <I18nProvider>
        <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/admin/login" element={<Login />} />
          
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          } />

          {/* Super Admin routes */}
          <Route path="/admin/users" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <UserManagement />
            </ProtectedLayout>
          } />
          
          <Route path="/admin/kyc" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <KycManagement />
            </ProtectedLayout>
          } />
          
           <Route path="/admin/settings" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <SystemSettings />
            </ProtectedLayout>
          } />

          <Route path="/admin/settings/ai" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <AiConfiguration />
            </ProtectedLayout>
          } />

          <Route path="/admin/community" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <CommunityModules />
            </ProtectedLayout>
          } />

          <Route path="/admin/jobs/employers" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <EmployersManagement />
            </ProtectedLayout>
          } />

          <Route path="/admin/jobs/candidates" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <CandidatesManagement />
            </ProtectedLayout>
          } />

          <Route path="/admin/settings/language" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <LanguageFontSettings />
            </ProtectedLayout>
          } />

          <Route path="/admin/profanity" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <ProfanityFilter />
            </ProtectedLayout>
          } />

          <Route path="/admin/analytics" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <AnalyticsDashboard />
            </ProtectedLayout>
          } />

          <Route path="/admin/taxonomy" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <TaxonomyManager />
            </ProtectedLayout>
          } />

          <Route path="/admin/push" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <PushNotifications />
            </ProtectedLayout>
          } />

          <Route path="/admin/layout" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <HomeLayoutBuilder />
            </ProtectedLayout>
          } />

          <Route path="/admin/news" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <NewsManagement />
            </ProtectedLayout>
          } />

          <Route path="/admin/news/create" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <NewsEditor />
            </ProtectedLayout>
          } />

          <Route path="/admin/breaking" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <BreakingNewsDashboard />
            </ProtectedLayout>
          } />

          <Route path="/admin/ugc-queue" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR', 'SUB_EDITOR']}>
              <UgcQueue />
            </ProtectedLayout>
          } />

          <Route path="/admin/editorial-calendar" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <EditorialCalendar />
            </ProtectedLayout>
          } />

          <Route path="/admin/ads" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <AdManagement />
            </ProtectedLayout>
          } />

          <Route path="/admin/subscribers" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <SubscribersManagement />
            </ProtectedLayout>
          } />

          <Route path="/admin/notifications" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <NotificationPreferences />
            </ProtectedLayout>
          } />

          <Route path="/admin/profile" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MODERATOR']}>
              <Profile />
            </ProtectedLayout>
          } />

          <Route path="/admin/rewards" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <RewardSystem />
            </ProtectedLayout>
          } />

          <Route path="/admin/rss" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <RssManager />
            </ProtectedLayout>
          } />

          <Route path="/admin/seo" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <SeoConsole />
            </ProtectedLayout>
          } />


          <Route path="/admin/news/:id/edit" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <NewsEditor />
            </ProtectedLayout>
          } />

          <Route path="/admin/surveys" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <SurveyBuilder />
            </ProtectedLayout>
          } />

          <Route path="/admin/roles" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <RoleManagement />
            </ProtectedLayout>
          } />

          <Route path="/admin/audit-logs" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN']}>
              <AuditLogs />
            </ProtectedLayout>
          } />

          <Route path="/admin/comments" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <CommentsModeration />
            </ProtectedLayout>
          } />

          <Route path="/admin/media" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <MediaLibrary />
            </ProtectedLayout>
          } />
          {/* Chief Editor routes */}
          <Route path="/admin/content" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR']}>
              <ContentQueue />
            </ProtectedLayout>
          } />

          {/* Journalist / Institution routes */}
          <Route path="/journalist/posts" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR', 'MOBILE_JOURNALIST', 'INSTITUTION_LOGIN']}>
              <MyPosts />
            </ProtectedLayout>
          } />
          <Route path="/journalist/create" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR', 'MOBILE_JOURNALIST', 'INSTITUTION_LOGIN']}>
              <PostEditor />
            </ProtectedLayout>
          } />
          <Route path="/journalist/edit/:id" element={
            <ProtectedLayout allowedRoles={['SUPER_ADMIN', 'CHIEF_EDITOR', 'MOBILE_JOURNALIST', 'INSTITUTION_LOGIN']}>
              <PostEditor />
            </ProtectedLayout>
          } />

          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
     </I18nProvider>
    </AuthProvider>
  );
}

export default App;
