import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sun, Moon, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Resources', path: '/resources' },
  { label: 'Community', path: '/community' },
  { label: 'Mock Tests', path: '/tests' },
  { label: 'About', path: '/about' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="glass-nav rounded-2xl px-6 py-3 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                OpenStudy
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold">
                      {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <span className="hidden sm:block max-w-24 truncate">
                      {user.user_metadata?.full_name || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={14} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 glass-card rounded-xl py-2 shadow-xl border border-white/10"
                      >
                        <Link
                          to="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10 transition-colors"
                        >
                          <User size={15} /> Dashboard
                        </Link>
                        <button
                          onClick={() => { signOut(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                  Sign In
                </button>
              )}

              <button
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
                onClick={() => setMobileOpen(v => !v)}
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-2 glass-nav rounded-2xl px-4 py-4 flex flex-col gap-1"
              >
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <button
                    onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                    className="mt-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-500 to-violet-500 text-white"
                  >
                    Sign In
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
