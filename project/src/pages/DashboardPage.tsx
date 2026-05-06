import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload, Bookmark, TrendingUp, Trophy, Clock, Target,
  FileText, Film, File, ChevronRight, Trash2, AlertTriangle, X
} from 'lucide-react';
import { supabase, Resource, UserProgress } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const FILE_TYPE_ICON = { PDF: FileText, Video: Film, Doc: File };
const FILE_TYPE_COLOR = {
  PDF: 'text-red-400 bg-red-500/10',
  Video: 'text-blue-400 bg-blue-500/10',
  Doc: 'text-green-400 bg-green-500/10',
};

function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const r = 30;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative inline-flex items-center justify-center w-20 h-20">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <span className="absolute text-sm font-bold text-white">{pct}%</span>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<Resource[]>([]);
  const [saved, setSaved] = useState<Resource[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'uploads' | 'saved' | 'progress'>('uploads');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const [uploadsRes, savedRes, progressRes] = await Promise.all([
        supabase.from('resources').select('*').eq('uploader_id', user.id).order('created_at', { ascending: false }),
        supabase.from('saved_resources').select('resource_id, resources(*)').eq('user_id', user.id),
        supabase.from('user_progress').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }),
      ]);
      setUploads(uploadsRes.data || []);
      const savedData = (savedRes.data || []).map((s: { resource_id: string; resources: Resource | Resource[] | null }) => {
        const r = s.resources;
        return Array.isArray(r) ? r[0] : r;
      }).filter(Boolean) as Resource[];
      setSaved(savedData);
      setProgress(progressRes.data || []);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleDeleteUpload = async (id: string) => {
    await supabase.from('resources').delete().eq('id', id);
    setUploads(u => u.filter(r => r.id !== id));
    setDeleteConfirm(null);
  };

  const handleUnsave = async (id: string) => {
    await supabase.from('saved_resources').delete().eq('user_id', user!.id).eq('resource_id', id);
    setSaved(s => s.filter(r => r.id !== id));
  };

  if (!user) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Target size={48} className="mx-auto text-slate-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Sign in to access your Dashboard</h2>
          <p className="text-slate-400 text-sm">Track your progress, uploads, and saved resources.</p>
        </div>
      </div>
    );
  }

  const avgScore = progress.length > 0
    ? Math.round(progress.reduce((a, p) => a + (p.total > 0 ? (p.score / p.total) * 100 : 0), 0) / progress.length)
    : 0;

  const stats = [
    { label: 'My Uploads', value: uploads.length, icon: Upload, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Saved Resources', value: saved.length, icon: Bookmark, color: 'text-violet-400', bg: 'bg-violet-500/10' },
    { label: 'Tests Taken', value: progress.length, icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Avg Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  ];

  const tabs = [
    { id: 'uploads' as const, label: 'My Uploads', icon: Upload, count: uploads.length },
    { id: 'saved' as const, label: 'Saved', icon: Bookmark, count: saved.length },
    { id: 'progress' as const, label: 'Test Progress', icon: TrendingUp, count: progress.length },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/25">
              {(user.user_metadata?.full_name || user.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user.user_metadata?.full_name || user.email?.split('@')[0]}
              </h1>
              <p className="text-slate-400 text-sm">{user.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-4 border border-white/10"
              >
                <div className={`w-9 h-9 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
                  <stat.icon size={18} />
                </div>
                <div className="text-2xl font-bold text-white">{loading ? '—' : stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-violet-500 text-white shadow-lg'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id ? 'bg-white/20' : 'bg-white/10'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-40 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Uploads Tab */}
            {activeTab === 'uploads' && (
              uploads.length === 0 ? (
                <EmptyState icon={Upload} title="No uploads yet" desc="Share your study materials with the community." action={{ label: 'Upload Resource', path: '/resources' }} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploads.map(r => {
                    const Icon = FILE_TYPE_ICON[r.file_type as keyof typeof FILE_TYPE_ICON] || File;
                    const colorClass = FILE_TYPE_COLOR[r.file_type as keyof typeof FILE_TYPE_COLOR] || 'text-slate-400 bg-slate-500/10';
                    return (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-5 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-xl ${colorClass}`}><Icon size={18} /></div>
                          {deleteConfirm === r.id ? (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
                              <AlertTriangle size={12} className="text-red-400" />
                              <button onClick={() => handleDeleteUpload(r.id)} className="text-xs text-red-400 font-medium">Delete</button>
                              <button onClick={() => setDeleteConfirm(null)} className="text-slate-500 ml-1"><X size={12} /></button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirm(r.id)} className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2">{r.title}</h3>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{r.category}</span>
                          <span>{r.download_count} downloads</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )
            )}

            {/* Saved Tab */}
            {activeTab === 'saved' && (
              saved.length === 0 ? (
                <EmptyState icon={Bookmark} title="No saved resources" desc="Bookmark resources while browsing to find them here." action={{ label: 'Browse Resources', path: '/resources' }} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {saved.map(r => {
                    const Icon = FILE_TYPE_ICON[r.file_type as keyof typeof FILE_TYPE_ICON] || File;
                    const colorClass = FILE_TYPE_COLOR[r.file_type as keyof typeof FILE_TYPE_COLOR] || 'text-slate-400 bg-slate-500/10';
                    return (
                      <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card rounded-2xl p-5 border border-white/10"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className={`p-2 rounded-xl ${colorClass}`}><Icon size={18} /></div>
                          <button onClick={() => handleUnsave(r.id)} className="p-1.5 rounded-lg text-violet-400 hover:text-slate-400 hover:bg-white/10 transition-all">
                            <Bookmark size={15} className="fill-violet-400" />
                          </button>
                        </div>
                        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2">{r.title}</h3>
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>{r.category}</span>
                          <span className={`px-2 py-0.5 rounded-full ${colorClass} text-xs`}>{r.file_type}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              progress.length === 0 ? (
                <EmptyState icon={TrendingUp} title="No test attempts yet" desc="Take a mock test to see your performance tracked here." action={{ label: 'Take a Mock Test', path: '/tests' }} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {progress.map(p => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-card rounded-2xl p-5 border border-white/10 flex items-center gap-5"
                    >
                      <ScoreRing score={p.score} total={p.total} />
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-sm capitalize mb-1">
                          {p.test_id.replace(/-/g, ' ')}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Trophy size={12} /> {p.score}/{p.total} correct</span>
                          <span className="flex items-center gap-1"><Clock size={12} /> {Math.floor(p.time_taken / 60)}m {p.time_taken % 60}s</span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">
                          {new Date(p.completed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon, title, desc, action
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  action: { label: string; path: string };
}) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
        <Icon size={28} className="text-slate-600" />
      </div>
      <h3 className="text-white font-semibold mb-2">{title}</h3>
      <p className="text-slate-500 text-sm mb-6">{desc}</p>
      <Link
        to={action.path}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-medium hover:from-blue-600 hover:to-violet-600 transition-all shadow-lg shadow-blue-500/25"
      >
        {action.label} <ChevronRight size={15} />
      </Link>
    </div>
  );
}
