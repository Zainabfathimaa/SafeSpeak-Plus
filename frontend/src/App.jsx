import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
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
import NotFoundPage from './pages/NotFoundPage';

function Layout() {
  const location = useLocation();
  // Define routes where the global Navbar and Footer should NOT appear
  const hideGlobalLayoutRoutes = [
    '/dashboard',
    '/report-incident',
    '/report-status',
    '/messages',
    '/escalate',
    '/stories'
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
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/report-incident" element={<NewReport />} />
          <Route path="/report-status" element={<ReportStatus />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/escalate" element={<EscalatePage />} />
          <Route path="/stories" element={<StoriesPage />} />
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
