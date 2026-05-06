import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, Variants } from 'framer-motion';
import {
  ArrowRight, Upload, Users, BookOpen, Code, FlaskConical,
  GraduationCap, TrendingUp, Zap, Star, ChevronRight
} from 'lucide-react';

const categories = [
  { label: 'Class 11', icon: BookOpen, color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20', text: 'text-blue-400', count: '240+ resources' },
  { label: 'Class 12', icon: GraduationCap, color: 'from-violet-500/20 to-violet-600/10', border: 'border-violet-500/20', text: 'text-violet-400', count: '310+ resources' },
  { label: 'JEE', icon: Zap, color: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/20', text: 'text-amber-400', count: '180+ resources' },
  { label: 'NEET', icon: FlaskConical, color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20', text: 'text-emerald-400', count: '150+ resources' },
  { label: 'GATE', icon: TrendingUp, color: 'from-sky-500/20 to-sky-600/10', border: 'border-sky-500/20', text: 'text-sky-400', count: '120+ resources' },
  { label: 'Programming', icon: Code, color: 'from-rose-500/20 to-rose-600/10', border: 'border-rose-500/20', text: 'text-rose-400', count: '200+ resources' },
];

const stats = [
  { value: '12,000+', label: 'Students' },
  { value: '3,400+', label: 'Resources' },
  { value: '50+', label: 'Mock Tests' },
  { value: '98%', label: 'Free Content' },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  })
};

function AnimatedSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  return (
    <div className="pt-24 pb-16">
      {/* Hero */}
      <section className="relative min-h-[88vh] flex items-center">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-40 right-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
          >
            <Star size={13} className="fill-blue-400" />
            Open Platform for Students, by Students
          </motion.div>

          <motion.h1
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6"
          >
            Learn Together,{' '}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent bg-size-200 animate-gradient">
              Grow Without Limits
            </span>
          </motion.h1>

          <motion.p
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Access thousands of free study materials, practice with mock tests, and connect with students
            preparing for JEE, NEET, GATE, and more.
          </motion.p>

          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/resources"
              className="group flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold hover:from-blue-600 hover:to-violet-600 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5"
            >
              Start Learning
              <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/resources"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-semibold hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <Upload size={17} />
              Upload Resource
            </Link>
            <Link
              to="/tests"
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-semibold hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <Users size={17} />
              Join Community
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              Browse by Category
            </h2>
            <p className="text-slate-400">Find resources tailored to your exam and subject.</p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <Link
                to={`/resources?category=${encodeURIComponent(cat.label)}`}
                className={`group flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.border} hover:scale-105 hover:shadow-lg transition-all duration-200`}
              >
                <div className={`p-2.5 rounded-xl bg-white/5 ${cat.text}`}>
                  <cat.icon size={22} />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-white text-sm">{cat.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{cat.count}</div>
                </div>
                <ChevronRight size={14} className={`${cat.text} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <AnimatedSection>
          <div className="glass-card rounded-3xl p-8 md:p-12 border border-white/10 overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl" />
            <div className="relative grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: BookOpen, title: 'Free Resources', color: 'text-blue-400', bg: 'bg-blue-500/10',
                  desc: 'Access thousands of PDFs, videos, and notes shared by top students across India.'
                },
                {
                  icon: Code, title: 'Mock Tests', color: 'text-violet-400', bg: 'bg-violet-500/10',
                  desc: 'Timed tests with instant feedback, code challenges, and detailed answer reviews.'
                },
                {
                  icon: TrendingUp, title: 'Track Progress', color: 'text-emerald-400', bg: 'bg-emerald-500/10',
                  desc: 'Monitor your test scores, saved materials, and learning milestones over time.'
                },
              ].map(f => (
                <div key={f.title} className="flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center`}>
                    <f.icon size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                  <Link
                    to={f.title === 'Mock Tests' ? '/tests' : f.title === 'Track Progress' ? '/dashboard' : '/resources'}
                    className={`inline-flex items-center gap-1.5 text-sm font-medium ${f.color} hover:gap-2.5 transition-all`}
                  >
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <AnimatedSection>
          <div className="text-center py-16 px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to start your journey?
            </h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Join thousands of students already learning smarter on OpenStudy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/resources"
                className="group flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold hover:from-blue-600 hover:to-violet-600 transition-all duration-300 shadow-lg shadow-blue-500/30"
              >
                Browse Resources
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/tests"
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 font-semibold hover:bg-white/10 transition-all"
              >
                Take a Mock Test
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
