import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function AuthModal({ isOpen, onClose }: Props) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setEmail(''); setPassword(''); setName(''); setError(''); setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        onClose(); reset();
      }
    } else {
      if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
      const { error } = await signUp(email, password, name);
      if (error) {
        setError(error);
      } else {
        setSuccess('Account created! You are now signed in.');
        setTimeout(() => { onClose(); reset(); }, 1500);
      }
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={e => { if (e.target === e.currentTarget) { onClose(); reset(); } }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-md glass-card rounded-2xl p-8 border border-white/10 shadow-2xl"
          >
            <button
              onClick={() => { onClose(); reset(); }}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/10 transition-all"
            >
              <X size={18} />
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-1">
                {mode === 'signin' ? 'Welcome back' : 'Join OpenStudy'}
              </h2>
              <p className="text-slate-400 text-sm">
                {mode === 'signin'
                  ? 'Sign in to access your dashboard and resources.'
                  : 'Create an account to upload and save resources.'}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-6">
              {(['signin', 'signup'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => { setMode(m); reset(); }}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === m
                      ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm"
                    />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition-all text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  <AlertCircle size={15} />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                  <CheckCircle size={15} />
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold hover:from-blue-600 hover:to-violet-600 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
