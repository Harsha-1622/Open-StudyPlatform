import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Heart, Users, BookOpen, Target, Send, CheckCircle } from 'lucide-react';
import { useState } from 'react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.5 },
});

export default function AboutPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', message: '' });
  };

  const values = [
    { icon: BookOpen, title: 'Free Education', desc: 'Every resource on OpenStudy is free. Knowledge should never be behind a paywall.', color: 'text-blue-400 bg-blue-500/10' },
    { icon: Users, title: 'Community First', desc: 'Students learn best from each other. We foster peer-to-peer knowledge sharing.', color: 'text-violet-400 bg-violet-500/10' },
    { icon: Target, title: 'Exam Focused', desc: 'Curated content for JEE, NEET, GATE, CUET, and board exams — nothing generic.', color: 'text-emerald-400 bg-emerald-500/10' },
    { icon: Heart, title: 'Student Wellbeing', desc: 'We believe in progress over perfection. Everyone\'s journey is valid and unique.', color: 'text-rose-400 bg-rose-500/10' },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center mb-16">
          <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-5">
            <Heart size={13} className="fill-blue-400" />
            Our Mission
          </motion.div>
          <motion.h1 {...fadeUp(0.1)} className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
            Education Without{' '}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Boundaries</span>
          </motion.h1>
          <motion.p {...fadeUp(0.2)} className="text-slate-400 max-w-2xl mx-auto leading-relaxed">
            OpenStudy was born from a simple belief — every student in India deserves access to quality study materials,
            regardless of where they are or how much they can afford. We built this platform to change that.
          </motion.p>
        </div>

        {/* Story */}
        <motion.div {...fadeUp(0.3)} className="glass-card rounded-3xl p-8 md:p-10 border border-white/10 mb-12 relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-4">The Story Behind OpenStudy</h2>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                It started with a frustration familiar to millions of Indian students — having to pay for study materials
                that should be freely available, or relying on scattered, unverified sources across the internet.
              </p>
              <p>
                OpenStudy is an open platform where students can upload notes, PDFs, and video links they've found useful,
                and the community benefits together. It's built on the idea that when we share knowledge, we all grow.
              </p>
              <p>
                From Class 11 board prep to cracking GATE CS — we want every student to find what they need here, for free.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-16">
          <motion.h2 {...fadeUp(0.1)} className="text-2xl font-bold text-white mb-6 text-center">What We Stand For</motion.h2>
          <div className="grid md:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 border border-white/10 flex gap-4"
              >
                <div className={`w-11 h-11 rounded-xl ${v.color} flex items-center justify-center flex-shrink-0`}>
                  <v.icon size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{v.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Get in Touch</h2>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Have a suggestion, a resource to contribute, or want to collaborate? We'd love to hear from you.
            </p>

            <div className="space-y-4">
              <a href="mailto:harshabhogaraju@gmail.com" className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Email</p>
                  <p className="text-sm text-white font-medium">harshabhogaraju@gmail.com</p>
                </div>
              </a>

              <a href="tel:+919701526188" className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Phone</p>
                  <p className="text-sm text-white font-medium">+91 9701526188</p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Location</p>
                  <p className="text-sm text-white font-medium">India</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl p-6 border border-white/10"
          >
            <h3 className="font-bold text-white mb-4">Send a Message</h3>
            {sent ? (
              <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle size={28} className="text-emerald-400" />
                </div>
                <p className="text-white font-semibold">Message Sent!</p>
                <p className="text-slate-400 text-sm">Thanks for reaching out. We'll get back to you soon.</p>
                <button onClick={() => setSent(false)} className="text-sm text-blue-400 hover:text-blue-300 mt-2">Send another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Arjun Kumar"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">Message</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="Tell us what's on your mind..."
                    rows={4}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold hover:from-blue-600 hover:to-violet-600 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
