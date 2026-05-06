import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, BookOpen, Code, ChevronRight, Zap, Target, Trophy } from 'lucide-react';
import { tests } from '../lib/testData';

const DIFFICULTY_COLOR = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Intermediate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function TestsListPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-4"
          >
            <Target size={13} />
            Practice Makes Perfect
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-3"
          >
            Mock Tests
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-lg mx-auto"
          >
            Challenge yourself with timed tests. Get instant feedback, detailed explanations, and track your performance.
          </motion.p>
        </div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 max-w-xl mx-auto mb-12"
        >
          {[
            { icon: Clock, label: '30 min timer', color: 'text-blue-400' },
            { icon: BookOpen, label: 'MCQ & Code', color: 'text-violet-400' },
            { icon: Trophy, label: 'Score review', color: 'text-amber-400' },
          ].map(f => (
            <div key={f.label} className="glass-card rounded-2xl p-4 border border-white/10 text-center">
              <f.icon size={20} className={`mx-auto mb-2 ${f.color}`} />
              <p className="text-xs text-slate-400 font-medium">{f.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Test Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {tests.map((test, i) => (
            <motion.div
              key={test.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.15 }}
              className="glass-card rounded-3xl p-7 border border-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-5">
                <div className={`p-3 rounded-2xl ${test.category === 'Programming' ? 'bg-blue-500/10' : 'bg-violet-500/10'}`}>
                  <Code size={22} className={test.category === 'Programming' ? 'text-blue-400' : 'text-violet-400'} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${DIFFICULTY_COLOR[test.difficulty]}`}>
                  {test.difficulty}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-2">{test.title}</h2>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">{test.description}</p>

              {/* Meta */}
              <div className="flex items-center gap-4 mb-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <BookOpen size={13} />
                  {test.questions.length} questions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} />
                  {test.duration} minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap size={13} />
                  {test.questions.filter(q => q.type === 'code').length} code block{test.questions.filter(q => q.type === 'code').length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-2 mb-6">
                {test.id === 'python-basics'
                  ? ['Syntax', 'range()', 'Indentation', 'List Slicing', 'Functions'].map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-xs">{t}</span>
                  ))
                  : ['Time Complexity', 'Stack/Queue', 'Linked Lists', 'Big O', 'Arrays'].map(t => (
                    <span key={t} className="px-2.5 py-1 rounded-lg bg-violet-500/10 text-violet-400 text-xs">{t}</span>
                  ))
                }
              </div>

              <Link
                to={`/tests/${test.id}`}
                className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold hover:from-blue-600 hover:to-violet-600 transition-all shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30"
              >
                Start Test
                <ChevronRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
