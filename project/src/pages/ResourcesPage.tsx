import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Upload, X, FileText, Film, File, Bookmark,
  BookmarkCheck, Download, Trash2, AlertTriangle, Tag, ChevronDown,
  UploadCloud, CheckCircle
} from 'lucide-react';
import { supabase, Resource } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'resources';
const CATEGORIES = ['All', 'Class 11', 'Class 12', 'JEE', 'NEET', 'GATE', 'CUET', 'Programming', 'Finance'];
const FILE_TYPES = ['All', 'PDF', 'Video', 'Doc'];

const FILE_TYPE_ICON = {
  PDF: FileText,
  Video: Film,
  Doc: File,
};

const FILE_TYPE_COLOR = {
  PDF: 'text-red-400 bg-red-500/10',
  Video: 'text-blue-400 bg-blue-500/10',
  Doc: 'text-green-400 bg-green-500/10',
};

function ResourceCard({
  resource,
  saved,
  onSave,
  onDelete,
  onView,
  onDownload,
  isOwner,
}: {
  resource: Resource;
  saved: boolean;
  onSave: (id: string) => void;
  onDelete: (id: string) => void;
  onView: (resource: Resource) => void;
  onDownload: (resource: Resource) => void;
  isOwner: boolean;
}) {
  const Icon = FILE_TYPE_ICON[resource.file_type as keyof typeof FILE_TYPE_ICON] || File;
  const colorClass = FILE_TYPE_COLOR[resource.file_type as keyof typeof FILE_TYPE_COLOR] || 'text-slate-400 bg-slate-500/10';
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="glass-card rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all duration-200 group flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`p-2.5 rounded-xl ${colorClass} flex-shrink-0`}>
          <Icon size={20} />
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={() => onSave(resource.id)}
            className={`p-2 rounded-lg transition-all ${saved ? 'text-blue-400 bg-blue-500/10' : 'text-slate-500 hover:text-blue-400 hover:bg-blue-500/10'}`}
            title={saved ? 'Unsave' : 'Save'}
          >
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
          {isOwner && !confirmDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          )}
          {isOwner && confirmDelete && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertTriangle size={12} className="text-red-400" />
              <button
                onClick={() => onDelete(resource.id)}
                className="text-xs text-red-400 font-medium hover:text-red-300"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-slate-500 hover:text-slate-300 ml-1"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-white text-sm leading-tight mb-1.5 line-clamp-2">
          {resource.title}
        </h3>
        {resource.description && (
          <p className="text-xs text-slate-500 line-clamp-2 mb-2">{resource.description}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onView(resource)}
              disabled={!resource.file_url}
              className={`px-3 py-2 rounded-2xl text-xs font-medium transition-all ${resource.file_url ? 'bg-white/5 text-slate-200 hover:bg-white/10' : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-60'}`}
            >
              View
            </button>
            <button
              type="button"
              onClick={() => onDownload(resource)}
              disabled={!resource.file_url}
              className={`px-3 py-2 rounded-2xl text-xs font-medium transition-all ${resource.file_url ? 'bg-blue-500/10 text-blue-300 hover:bg-blue-500/20' : 'bg-white/5 text-slate-500 cursor-not-allowed opacity-60'}`}
            >
              Download
            </button>
          </div>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${colorClass}`}>
            {resource.file_type}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">{resource.uploader_name}</span>
            <div className="flex items-center gap-1 text-xs text-slate-600 mt-0.5">
              <Download size={11} />
              {resource.download_count} downloads
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const { user } = useAuth();
  const [dragging, setDragging] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Class 11', file_type: 'PDF', tags: '', file_url: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) simulateUpload(file);
  };

  const simulateUpload = (file: File) => {
    const maxMB = 50;
    if (file.size > maxMB * 1024 * 1024) {
      setError(`File too large. Max size is ${maxMB}MB.`);
      return;
    }
    const allowedTypes = ['application/pdf', 'video/mp4', 'video/webm', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setError('Unsupported file type. Please upload PDF, Video, or Doc files.');
      return;
    }
    setSelectedFile(file);
    setError('');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 10;
      });
    }, 80);
    const ext = file.name.split('.').pop()?.toUpperCase();
    if (ext === 'PDF') setForm(f => ({ ...f, file_type: 'PDF', title: f.title || file.name.replace(/\.pdf$/i, '') }));
    else if (['MP4', 'WEBM'].includes(ext || '')) setForm(f => ({ ...f, file_type: 'Video', title: f.title || file.name }));
    else setForm(f => ({ ...f, file_type: 'Doc', title: f.title || file.name }));
  };

  const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === 'string') resolve(result);
      else reject(new Error('Failed to read file.'));
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setError('You must be signed in to upload.'); return; }
    if (!selectedFile) { setError('Please select a file to upload.'); return; }
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setLoading(true);
    setError('');

    const tags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    const filePath = `${user.id}/${Date.now()}-${selectedFile.name.replace(/\s+/g, '_')}`;
    let fileUrl = '';

    const { error: uploadError } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, selectedFile);
    if (uploadError) {
      if (selectedFile.size > 15 * 1024 * 1024) {
        setLoading(false);
        setError(`Unable to upload file to storage: ${uploadError.message}. Create the bucket '${STORAGE_BUCKET}' or choose a file smaller than 15MB.`);
        return;
      }

      try {
        fileUrl = await fileToDataUrl(selectedFile);
      } catch (err) {
        setLoading(false);
        setError(`Unable to upload or inline-preview the file. Storage error: ${uploadError.message}`);
        return;
      }
    } else {
      const { data: publicUrlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath);
      fileUrl = publicUrlData?.publicUrl || '';
    }

    const { error: dbError } = await supabase.from('resources').insert({
      title: form.title,
      description: form.description,
      category: form.category,
      file_type: form.file_type,
      file_url: fileUrl,
      tags,
      uploader_id: user.id,
      uploader_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
    });

    setLoading(false);
    if (dbError) { setError(dbError.message); return; }
    onSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg glass-card rounded-2xl p-7 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          <X size={18} />
        </button>

        <h2 className="text-xl font-bold text-white mb-1">Upload Resource</h2>
        <p className="text-slate-400 text-sm mb-6">Share your study material with the community.</p>

        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-5 ${
            dragging ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'
          }`}
        >
          <input ref={fileRef} type="file" className="hidden" accept=".pdf,.mp4,.webm,.doc,.docx"
            onChange={e => e.target.files?.[0] && simulateUpload(e.target.files[0])} />
          <UploadCloud size={32} className="mx-auto mb-3 text-slate-500" />
          <p className="text-sm text-slate-400">Drop your file here or <span className="text-blue-400 font-medium">browse</span></p>
          <p className="text-xs text-slate-600 mt-1">PDF, Video (MP4), Doc — Max 50MB</p>
          {selectedFile && (
            <div className="mt-4 text-left text-xs text-slate-300">
              Selected file: <span className="font-medium text-white">{selectedFile.name}</span> — {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}
          {progress > 0 && progress < 100 && (
            <div className="mt-4 w-full bg-white/10 rounded-full h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}
          {progress === 100 && (
            <div className="mt-3 flex items-center justify-center gap-2 text-emerald-400 text-sm">
              <CheckCircle size={15} /> File ready
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Title *</label>
            <input
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g., Class 12 Physics - Wave Optics Notes"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description of the resource..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Category</label>
              <div className="relative">
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 text-sm appearance-none"
                >
                  {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">File Type</label>
              <div className="relative">
                <select
                  value={form.file_type}
                  onChange={e => setForm(f => ({ ...f, file_type: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-500 text-sm appearance-none"
                >
                  {FILE_TYPES.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              <Tag size={12} className="inline mr-1" />Tags (comma separated)
            </label>
            <input
              value={form.tags}
              onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="physics, waves, optics"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertTriangle size={14} /> {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold hover:from-blue-600 hover:to-violet-600 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-60 mt-2"
          >
            {loading ? 'Uploading...' : 'Upload Resource'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function ResourcesPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [fileType, setFileType] = useState('All');
  const [showUpload, setShowUpload] = useState(false);

  const fetchResources = async () => {
    setLoading(true);
    let query = supabase.from('resources').select('*').order('created_at', { ascending: false });
    const { data } = await query;
    setResources(data || []);
    setLoading(false);
  };

  const fetchSaved = async () => {
    if (!user) return;
    const { data } = await supabase.from('saved_resources').select('resource_id').eq('user_id', user.id);
    setSavedIds(new Set((data || []).map(s => s.resource_id)));
  };

  useEffect(() => { fetchResources(); }, []);
  useEffect(() => { fetchSaved(); }, [user]);

  const handleSave = async (resourceId: string) => {
    if (!user) return;
    if (savedIds.has(resourceId)) {
      await supabase.from('saved_resources').delete().eq('user_id', user.id).eq('resource_id', resourceId);
      setSavedIds(s => { const n = new Set(s); n.delete(resourceId); return n; });
    } else {
      await supabase.from('saved_resources').insert({ user_id: user.id, resource_id: resourceId });
      setSavedIds(s => new Set([...s, resourceId]));
    }
  };

  const handleDelete = async (resourceId: string) => {
    await supabase.from('resources').delete().eq('id', resourceId);
    setResources(r => r.filter(x => x.id !== resourceId));
  };

  const handleViewResource = (resource: Resource) => {
    if (!resource.file_url) return;
    window.open(resource.file_url, '_blank', 'noreferrer');
  };

  const handleDownloadResource = async (resource: Resource) => {
    if (!resource.file_url) return;

    const { error } = await supabase.from('resources').update({
      download_count: (resource.download_count || 0) + 1,
    }).eq('id', resource.id);

    if (!error) {
      setResources(r => r.map(item => item.id === resource.id ? { ...item, download_count: (item.download_count || 0) + 1 } : item));
    }

    const link = document.createElement('a');
    link.href = resource.file_url;
    link.download = resource.title || 'resource';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = resources.filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === 'All' || r.category === category;
    const matchType = fileType === 'All' || r.file_type === fileType;
    return matchSearch && matchCat && matchType;
  });

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Study Resources</h1>
            <p className="text-slate-400 text-sm">{filtered.length} resources available</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium hover:from-blue-600 hover:to-violet-600 transition-all shadow-lg shadow-blue-500/25 w-fit"
          >
            <Upload size={16} />
            Upload Resource
          </button>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-2xl p-4 border border-white/10 mb-6 flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search resources, tags..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={15} className="text-slate-500 hidden md:block" />
            <div className="flex gap-1 flex-wrap">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    category === c
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <div className="w-px h-5 bg-white/10 hidden md:block" />
            <div className="flex gap-1">
              {FILE_TYPES.map(t => (
                <button
                  key={t}
                  onClick={() => setFileType(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    fileType === t
                      ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-52 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Search size={40} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400 font-medium">No resources found</p>
            <p className="text-slate-600 text-sm mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            <AnimatePresence>
              {filtered.map(resource => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  saved={savedIds.has(resource.id)}
                  onSave={handleSave}
                  onDelete={handleDelete}
                  onView={handleViewResource}
                  onDownload={handleDownloadResource}
                  isOwner={user?.id === resource.uploader_id}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showUpload && (
          <UploadModal
            onClose={() => setShowUpload(false)}
            onSuccess={() => { setShowUpload(false); fetchResources(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
