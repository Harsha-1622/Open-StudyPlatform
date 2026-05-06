import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle, XCircle, RotateCcw, ArrowRight, Home } from 'lucide-react';
import { Test } from '../lib/testData';

type ResultsState = {
  answers: Record<number, string | number>;
  score: number;
  total: number;
  timeTaken: number;
  test: Test;
};

function CircleScore({ score, total }: { score: number; total: number }) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 70 ? '#22c55e' : pct >= 40 ? '#f59e0b' : '#ef4444';
  const label = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good Work!' : pct >= 40 ? 'Keep Trying!' : 'Needs Practice';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
          <motion.circle
            cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-white">{pct}%</span>
          <span className="text-xs text-slate-400">{score}/{total}</span>
        </div>
      </div>
      <p className="text-lg font-bold mt-3" style={{ color }}>{label}</p>
    </div>
  );
}

export default function TestResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsState | null;

  if (!state) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-400 mb-4">No results found.</p>
          <Link to="/tests" className="text-blue-400 hover:text-blue-300 underline">Back to Tests</Link>
        </div>
      </div>
    );
  }

  const { answers, score, total, timeTaken, test } = state;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  const isCorrect = (q: typeof test.questions[0]) => {
    const ans = answers[q.id];
    if (q.type === 'mcq') return ans === q.correctAnswer;
    if (q.type === 'code') return typeof ans === 'string' && ans.trim().toLowerCase() === (q.correctAnswer as string).toLowerCase();
    return false;
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
            <Trophy size={13} />
            Test Complete!
          </div>

          <CircleScore score={score} total={total} />

          <div className="flex items-center justify-center gap-6 mt-6 text-sm text-slate-400">
            <span className="flex items-center gap-2">
              <CheckCircle size={15} className="text-emerald-400" />
              {score} Correct
            </span>
            <span className="flex items-center gap-2">
              <XCircle size={15} className="text-red-400" />
              {total - score} Incorrect
            </span>
            <span className="flex items-center gap-2">
              <Clock size={15} className="text-blue-400" />
              {minutes}m {seconds}s
            </span>
          </div>
        </motion.div>

        {/* Score Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-5 border border-white/10 mb-8"
        >
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-slate-400 font-medium">{test.title}</span>
            <span className="text-white font-bold">{pct}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3">
            <motion.div
              className={`h-3 rounded-full ${pct >= 70 ? 'bg-gradient-to-r from-emerald-500 to-blue-500' : pct >= 40 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-red-500 to-orange-500'}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 mb-10"
        >
          <button
            onClick={() => navigate(`/tests/${test.id}`)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold hover:from-blue-600 hover:to-violet-600 transition-all shadow-lg shadow-blue-500/25"
          >
            <RotateCcw size={16} /> Retake Test
          </button>
          <Link
            to="/tests"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-semibold hover:bg-white/10 transition-all"
          >
            <ArrowRight size={16} /> Other Tests
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
          >
            <Home size={16} />
          </Link>
        </motion.div>

        {/* Detailed Review */}
        <div>
          <h2 className="text-xl font-bold text-white mb-5">Detailed Review</h2>
          <div className="space-y-4">
            {test.questions.map((q, i) => {
              const correct = isCorrect(q);
              const userAns = answers[q.id];
              return (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={`rounded-2xl border p-5 ${correct ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`mt-0.5 flex-shrink-0 ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
                      {correct ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-1">
                        <span className="text-slate-500 text-xs mr-2">Q{i + 1}.</span>
                        {q.question}
                      </p>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs ${q.type === 'code' ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'}`}>
                        {q.type === 'code' ? 'Complete the Code' : 'MCQ'}
                      </span>
                    </div>
                  </div>

                  {q.type === 'mcq' && q.options && (
                    <div className="space-y-1.5 mb-3 ml-7">
                      {q.options.map((opt, idx) => (
                        <div key={idx} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${
                          idx === q.correctAnswer ? 'bg-emerald-500/10 text-emerald-400' :
                          idx === userAns && !correct ? 'bg-red-500/10 text-red-400' :
                          'text-slate-500'
                        }`}>
                          <span className="font-medium w-4">{String.fromCharCode(65 + idx)}.</span>
                          {opt}
                          {idx === q.correctAnswer && <CheckCircle size={12} className="ml-auto text-emerald-400" />}
                          {idx === userAns && !correct && <XCircle size={12} className="ml-auto text-red-400" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'code' && (
                    <div className="ml-7 space-y-2 mb-3">
                      <div className="flex gap-2 text-xs">
                        <span className="text-slate-500 w-24">Your answer:</span>
                        <code className={`font-mono ${correct ? 'text-emerald-400' : 'text-red-400'}`}>
                          {userAns !== undefined ? String(userAns) : '(no answer)'}
                        </code>
                      </div>
                      {!correct && (
                        <div className="flex gap-2 text-xs">
                          <span className="text-slate-500 w-24">Correct answer:</span>
                          <code className="font-mono text-emerald-400">{String(q.correctAnswer)}</code>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="ml-7 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <span className="font-semibold text-slate-300">Explanation: </span>
                      {q.explanation}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
