import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import VerificationPage from './pages/VerificationPage';
import ForgotCodePage from './pages/ForgotCodePage';
import UserDashboard from './pages/UserDashboard';
import NewReport from './pages/NewReport';
import ReportStatus from './pages/ReportStatus';
import Messages from './pages/Messages';
import EscalatePage from './pages/EscalatePage';
import StoriesPage from './pages/StoriesPage';
import SettingsPage from './pages/SettingsPage';
import AdminDashboard from './pages/AdminDashboard';
import CounsellorDashboard from './pages/CounsellorDashboard';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import ComplianceOfficerDashboard from './pages/ComplianceOfficerDashboard';
import NotFoundPage from './pages/NotFoundPage';

function Layout() {
  const location = useLocation();
  // Define routes where the global Navbar and Footer should NOT appear
  const hideGlobalLayoutRoutes = [
    '/dashboard',
    '/admin-dashboard',
    '/counsellor-dashboard',
    '/executive-dashboard',
    '/compliance-officer-dashboard',
    '/report-incident',
    '/report-status',
    '/messages',
    '/escalate',
    '/stories',
    '/settings'
  ];
  const shouldHideGlobalLayout = hideGlobalLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-text-primary">
      {!shouldHideGlobalLayout && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerificationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-code" element={<ForgotCodePage />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<UserDashboard />} />} />
          <Route path="/admin-dashboard" element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />} />
          <Route path="/counsellor-dashboard" element={<ProtectedRoute element={<CounsellorDashboard />} requiredRole="counsellor" />} />
          <Route path="/executive-dashboard" element={<ProtectedRoute element={<ExecutiveDashboard />} requiredRole="executive" />} />
          <Route path="/compliance-officer-dashboard" element={<ProtectedRoute element={<ComplianceOfficerDashboard />} requiredRole="compliance-officer" />} />
          <Route path="/report-incident" element={<ProtectedRoute element={<NewReport />} />} />
          <Route path="/report-status" element={<ReportStatus />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/escalate" element={<EscalatePage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!shouldHideGlobalLayout && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
