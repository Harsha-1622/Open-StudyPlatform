import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ResourcesPage from './pages/ResourcesPage';
import DashboardPage from './pages/DashboardPage';
import TestsListPage from './pages/TestsListPage';
import TestInterfacePage from './pages/TestInterfacePage';
import TestResultsPage from './pages/TestResultsPage';
import AboutPage from './pages/AboutPage';
import CommunityForumPage from './pages/CommunityForumPage';

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isTestInterface = /^\/tests\/[^/]+$/.test(location.pathname);

  return (
    <>
      {!isTestInterface && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/resources" element={<PageTransition><ResourcesPage /></PageTransition>} />
          <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
          <Route path="/tests" element={<PageTransition><TestsListPage /></PageTransition>} />
          <Route path="/tests/:testId" element={<TestInterfacePage />} />
          <Route path="/tests/:testId/results" element={<PageTransition><TestResultsPage /></PageTransition>} />
          <Route path="/community" element={<PageTransition><CommunityForumPage /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
      {!isTestInterface && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-slate-950 text-white">
            <AppRoutes />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
