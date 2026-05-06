import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Plus, X, Heart, Reply, Trash2, AlertTriangle, Send
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type ForumComment = {
  id: string;
  thread_id: string;
  parent_comment_id?: string;
  user_id: string;
  author_name: string;
  content: string;
  likes: number;
  created_at: string;
  replies?: ForumComment[];
};

type ForumThread = {
  id: string;
  title: string;
  content: string;
  category: string;
  user_id: string;
  author_name: string;
  likes: number;
  comments_count: number;
  created_at: string;
  comments?: ForumComment[];
};

const CATEGORIES = ['General', 'Study Tips', 'Exams', 'Resources', 'Discussions', 'Help'];

function NestedComment({
  comment,
  threadId,
  onReply,
  onDelete,
  currentUserId,
}: {
  comment: ForumComment;
  threadId: string;
  onReply: (comment: ForumComment) => void;
  onDelete: (commentId: string) => void;
  currentUserId?: string;
}) {
  const [liked, setLiked] = useState(false);
  const isOwner = currentUserId === comment.user_id;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="ml-4 md:ml-8 border-l-2 border-white/10 pl-4 md:pl-6 py-3"
    >
      <div className="glass-card rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-300">{comment.author_name}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {new Date(comment.created_at).toLocaleDateString()}
            </p>
          </div>
          {isOwner && (
            <button
              onClick={() => onDelete(comment.id)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        <p className="text-sm text-slate-300 leading-relaxed mb-3">{comment.content}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all ${
              liked
                ? 'text-red-400 bg-red-500/10'
                : 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
            }`}
          >
            <Heart size={12} fill={liked ? 'currentColor' : 'none'} />
            {comment.likes + (liked ? 1 : 0)}
          </button>
          <button
            onClick={() => onReply(comment)}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
          >
            <Reply size={12} />
            Reply
          </button>
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 space-y-2">
          {comment.replies.map(reply => (
            <NestedComment
              key={reply.id}
              comment={reply}
              threadId={threadId}
              onReply={onReply}
              onDelete={onDelete}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ThreadDetail({
  thread,
  onClose,
  onCommentAdded,
}: {
  thread: ForumThread;
  onClose: () => void;
  onCommentAdded: () => void;
}) {
  const { user } = useAuth();
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<ForumComment | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [thread.id]);

  const fetchComments = async () => {
    const { data } = await supabase
      .from('forum_comments')
      .select('*')
      .eq('thread_id', thread.id)
      .is('parent_comment_id', null)
      .order('created_at', { ascending: false });
    setComments(data || []);
  };

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;
    setLoading(true);

    const { error } = await supabase.from('forum_comments').insert({
      thread_id: thread.id,
      parent_comment_id: replyingTo?.id || null,
      user_id: user.id,
      author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      content: newComment,
    });

    setLoading(false);
    if (!error) {
      setNewComment('');
      setReplyingTo(null);
      fetchComments();
      onCommentAdded();
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    await supabase.from('forum_comments').delete().eq('id', commentId);
    fetchComments();
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
        className="relative w-full max-w-2xl glass-card rounded-2xl p-7 border border-white/10 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          <X size={18} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">{thread.title}</h2>
          <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
            <span>{thread.author_name}</span>
            <span>•</span>
            <span>{new Date(thread.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{thread.content}</p>
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Comments ({comments.length})</h3>

          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
            {comments.map(comment => (
              <NestedComment
                key={comment.id}
                comment={comment}
                threadId={thread.id}
                onReply={setReplyingTo}
                onDelete={handleDeleteComment}
                currentUserId={user?.id}
              />
            ))}
          </div>

          {!user && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm mb-4">
              Sign in to add comments.
            </div>
          )}

          {user && (
            <div className="space-y-2">
              {replyingTo && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-500/20 border border-slate-500/30 text-xs">
                  <span className="flex-1">Replying to <span className="font-medium">{replyingTo.author_name}</span></span>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder={replyingTo ? 'Reply to comment...' : 'Add a comment...'}
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm resize-none"
                />
                <button
                  onClick={handleAddComment}
                  disabled={loading || !newComment.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CommunityForumPage() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<ForumThread[]>([
    {
      id: '1',
      title: 'Best tips for JEE 2024',
      content: 'What are your top strategies for cracking JEE 2024? Share your experiences!',
      category: 'Study Tips',
      user_id: 'demo',
      author_name: 'Rohan K.',
      likes: 15,
      comments_count: 8,
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Doubts in Organic Chemistry',
      content: 'Can someone explain reaction mechanisms? I am struggling with SN1 and SN2.',
      category: 'Help',
      user_id: 'demo',
      author_name: 'Priya V.',
      likes: 7,
      comments_count: 5,
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Recommended resources for NEET',
      content: 'Has anyone found good study materials? Please share your recommendations.',
      category: 'Resources',
      user_id: 'demo',
      author_name: 'Aditya M.',
      likes: 12,
      comments_count: 9,
      created_at: new Date().toISOString(),
    },
  ]);
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null);
  const [showNewThread, setShowNewThread] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [newThreadForm, setNewThreadForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchThreads();
  }, [selectedCategory]);

  const fetchThreads = async () => {
    try {
      let query = supabase.from('forum_threads').select('*').order('created_at', { ascending: false });
      if (selectedCategory !== 'All') {
        query = query.eq('category', selectedCategory);
      }
      const { data } = await query;
      if (data) {
        setThreads(data);
      }
    } catch (err) {
      console.log('Using demo threads (database may not be set up yet)');
    }
  };

  const handleCreateThread = async () => {
    if (!user || !newThreadForm.title.trim() || !newThreadForm.content.trim()) return;
    setLoading(true);

    try {
      const { error } = await supabase.from('forum_threads').insert({
        title: newThreadForm.title,
        content: newThreadForm.content,
        category: selectedCategory,
        user_id: user.id,
        author_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
      });

      setLoading(false);
      if (!error) {
        setNewThreadForm({ title: '', content: '' });
        setShowNewThread(false);
        fetchThreads();
      } else {
        alert('Error creating thread. Please ensure the "forum_threads" table exists in Supabase. Check the database migration.');
      }
    } catch (err) {
      setLoading(false);
      alert('Error: Please ensure Supabase forum tables are created. Run the migration in your Supabase project.');
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Community Forum</h1>
            <p className="text-slate-400 text-sm">Join discussions, ask questions, and share knowledge</p>
          </div>
          <button
            onClick={() => setShowNewThread(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-medium hover:from-blue-600 hover:to-violet-600 transition-all shadow-lg shadow-blue-500/25 w-fit"
          >
            <Plus size={16} />
            New Thread
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['All', ...CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Threads List */}
        <div className="space-y-3">
          {threads.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare size={40} className="mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 font-medium">No threads yet</p>
              <p className="text-slate-600 text-sm mt-1">Start a new conversation!</p>
            </div>
          ) : (
            threads.map(thread => (
              <motion.button
                key={thread.id}
                onClick={() => setSelectedThread(thread)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full glass-card rounded-2xl p-5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{thread.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-2 mb-3">{thread.content}</p>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>{thread.author_name}</span>
                      <span>•</span>
                      <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                      <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-300">
                        {thread.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-sm font-semibold text-white">{thread.comments_count || 0}</div>
                    <div className="text-xs text-slate-500">comments</div>
                  </div>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      {/* New Thread Modal */}
      <AnimatePresence>
        {showNewThread && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget) setShowNewThread(false); }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg glass-card rounded-2xl p-7 border border-white/10 shadow-2xl"
            >
              <button onClick={() => setShowNewThread(false)} className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <X size={18} />
              </button>

              <h2 className="text-xl font-bold text-white mb-1">Start a New Thread</h2>
              <p className="text-slate-400 text-sm mb-6">Share your thoughts and start a discussion.</p>

              {!user && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm mb-4 flex items-center gap-2">
                  <AlertTriangle size={14} />
                  Sign in to create a thread.
                </div>
              )}

              {user && (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleCreateThread();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Title *</label>
                    <input
                      value={newThreadForm.title}
                      onChange={e => setNewThreadForm(f => ({ ...f, title: e.target.value }))}
                      placeholder="What's your thread about?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Description *</label>
                    <textarea
                      value={newThreadForm.content}
                      onChange={e => setNewThreadForm(f => ({ ...f, content: e.target.value }))}
                      placeholder="Share your thoughts..."
                      rows={4}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold hover:from-blue-600 hover:to-violet-600 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-60"
                  >
                    {loading ? 'Creating...' : 'Create Thread'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Thread Detail Modal */}
      <AnimatePresence>
        {selectedThread && (
          <ThreadDetail
            thread={selectedThread}
            onClose={() => setSelectedThread(null)}
            onCommentAdded={fetchThreads}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
