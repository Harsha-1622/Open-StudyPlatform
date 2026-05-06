import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
                <BookOpen size={16} className="text-white" />
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                OpenStudy
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              An open platform for students to share, discover, and learn from each other. Free knowledge for everyone.
            </p>
            <div className="flex items-center gap-3 mt-4">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <button key={i} className="p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-all">
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Resources', path: '/resources' },
                { label: 'Community', path: '/community' },
                { label: 'Mock Tests', path: '/tests' },
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'About', path: '/about' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-slate-400 hover:text-slate-200 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="mailto:harshabhogaraju@gmail.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  <Mail size={14} />
                  harshabhogaraju@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919701526188" className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors">
                  <Phone size={14} />
                  +91 9701526188
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">© 2026 OpenStudy Platform. All rights reserved.</p>
          <p className="text-xs text-slate-500">Built with passion for learners everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
