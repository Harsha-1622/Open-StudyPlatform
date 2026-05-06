import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, AlertCircle } from 'lucide-react';
import { tests, Question } from '../lib/testData';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type AnswerMap = Record<number, string | number>;
type FlagSet = Set<number>;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function QuestionPanel({
  question,
  answer,
  onAnswer,
}: {
  question: Question;
  answer: string | number | undefined;
  onAnswer: (val: string | number) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
            question.type === 'code'
              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {question.type === 'code' ? 'Complete the Code' : 'MCQ'}
          </span>
        </div>
        <h2 className="text-lg font-semibold text-white leading-relaxed">{question.question}</h2>
      </div>

      {question.type === 'mcq' && question.options && (
        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => onAnswer(idx)}
              className={`w-full text-left px-5 py-4 rounded-2xl border transition-all duration-200 text-sm font-medium ${
                answer === idx
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mr-3 ${
                answer === idx ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-400'
              }`}>
                {String.fromCharCode(65 + idx)}
              </span>
              {opt}
            </button>
          ))}
        </div>
      )}

      {question.type === 'code' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/5 bg-white/5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
              <span className="ml-2 text-xs text-slate-500 font-mono">python</span>
            </div>
            <div className="p-4 font-mono text-sm">
              <span className="text-slate-300">{question.codePrefix}</span>
              <span className="inline-block">
                <input
                  type="text"
                  value={typeof answer === 'string' ? answer : ''}
                  onChange={e => onAnswer(e.target.value)}
                  placeholder="your code here"
                  className="bg-blue-500/20 border-b-2 border-blue-500 text-blue-300 px-2 py-0.5 rounded font-mono text-sm focus:outline-none min-w-[120px]"
                  style={{ width: `${Math.max(120, ((typeof answer === 'string' ? answer.length : 0) + 5) * 8)}px` }}
                />
              </span>
              <span className="text-slate-300">{question.codeSuffix}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <AlertCircle size={12} />
            Fill in the blank with valid Python code
          </p>
        </div>
      )}
    </div>
  );
}

export default function TestInterfacePage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const test = tests.find(t => t.id === testId);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [flagged, setFlagged] = useState<FlagSet>(new Set());
  const [timeLeft, setTimeLeft] = useState(test ? test.duration * 60 : 1800);
  const [startTime] = useState(Date.now());

  const submitTest = useCallback(async () => {
    if (!test) return;
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    let score = 0;
    test.questions.forEach(q => {
      const ans = answers[q.id];
      if (q.type === 'mcq' && ans === q.correctAnswer) score++;
      else if (q.type === 'code' && typeof ans === 'string' && ans.trim().toLowerCase() === (q.correctAnswer as string).toLowerCase()) score++;
    });

    if (user) {
      await supabase.from('user_progress').insert({
        user_id: user.id,
        test_id: test.id,
        score,
        total: test.questions.length,
        time_taken: timeTaken,
      });
    }

    navigate(`/tests/${testId}/results`, {
      state: { answers, score, total: test.questions.length, timeTaken, test }
    });
  }, [answers, test, testId, navigate, user, startTime]);

  useEffect(() => {
    if (timeLeft <= 0) { submitTest(); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitTest]);

  if (!test) {
    return (
      <div className="pt-24 flex items-center justify-center min-h-screen">
        <p className="text-slate-400">Test not found.</p>
      </div>
    );
  }

  const question = test.questions[currentQ];
  const answered = Object.keys(answers).length;
  const progressPct = (answered / test.questions.length) * 100;
  const isUrgent = timeLeft < 300;

  const handleAnswer = (val: string | number) => {
    setAnswers(a => ({ ...a, [question.id]: val }));
  };

  const toggleFlag = () => {
    setFlagged(f => {
      const n = new Set(f);
      n.has(question.id) ? n.delete(question.id) : n.add(question.id);
      return n;
    });
  };

  return (
    <div className="pt-16 min-h-screen flex flex-col">
      {/* Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-40 glass-nav border-b border-white/10">
        {/* Progress bar */}
        <div className="h-0.5 bg-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-violet-500"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => navigate('/tests')} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0">
              <ChevronLeft size={18} />
            </button>
            <div className="min-w-0">
              <h1 className="font-bold text-white text-sm truncate">{test.title}</h1>
              <p className="text-xs text-slate-500">{answered}/{test.questions.length} answered</p>
            </div>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-sm font-bold transition-all ${
            isUrgent ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' : 'bg-white/5 text-white'
          }`}>
            <Clock size={15} />
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={submitTest}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-semibold hover:from-blue-600 hover:to-violet-600 transition-all shadow-lg shadow-blue-500/25"
          >
            <CheckCircle size={15} />
            <span className="hidden sm:inline">Submit</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-1 max-w-7xl mx-auto w-full mt-[72px] gap-0 md:gap-0">
        {/* Question Panel */}
        <div className="flex-1 flex flex-col">
          <QuestionPanel question={question} answer={answers[question.id]} onAnswer={handleAnswer} />

          {/* Navigation */}
          <div className="px-6 md:px-8 pb-6 flex items-center justify-between gap-4 border-t border-white/5 pt-5">
            <button
              onClick={toggleFlag}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                flagged.has(question.id)
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'
              }`}
            >
              <Flag size={14} />
              {flagged.has(question.id) ? 'Flagged' : 'Mark for Review'}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
                disabled={currentQ === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 text-sm font-medium hover:bg-white/10 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              {currentQ < test.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQ(q => Math.min(test.questions.length - 1, q + 1))}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white text-sm font-medium hover:from-blue-600 hover:to-violet-600 transition-all shadow-lg shadow-blue-500/20"
                >
                  Next <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  onClick={submitTest}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 text-white text-sm font-semibold hover:from-emerald-600 hover:to-blue-600 transition-all shadow-lg"
                >
                  <CheckCircle size={16} /> Finish
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Question Navigator */}
        <div className="md:w-64 border-t md:border-t-0 md:border-l border-white/5 p-5 flex flex-col gap-4">
          <div>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Questions</h3>
            <div className="grid grid-cols-5 md:grid-cols-4 gap-2">
              {test.questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQ(i)}
                  className={`aspect-square rounded-xl text-xs font-bold transition-all ${
                    i === currentQ
                      ? 'bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/25'
                      : answers[q.id] !== undefined
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : flagged.has(q.id)
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-white/5 text-slate-500 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-emerald-500/20 border border-emerald-500/30" />
              Answered
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-amber-500/20 border border-amber-500/30" />
              Flagged
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-md bg-white/5 border border-white/10" />
              Unattempted
            </div>
          </div>

          <div className="mt-auto">
            <div className="text-xs text-slate-500 mb-1">Progress</div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="text-xs text-slate-500 mt-1">{answered} of {test.questions.length} answered</div>
          </div>
        </div>
      </div>
    </div>
  );
}
