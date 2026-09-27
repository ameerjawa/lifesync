import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Check, ChevronDown, Sparkles, Target, Calendar,
  TrendingUp, Brain, Wallet, Briefcase, Heart, Zap, Clock,
  ListTodo, BarChart3, AlertCircle, PlayCircle, Star, Menu, X,
} from 'lucide-react';
import { NextLogo } from '../components/brand/NextLogo';
import { useGuestStore } from '../store/guestStore';
import { useNavigate } from 'react-router-dom';

/* ---------- Navbar ---------- */
function LandingNav({ onAuth }: { onAuth: (mode: 'signin' | 'signup') => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 dark:bg-ink-950/90 backdrop-blur-md border-b border-ink-100 dark:border-ink-800' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <NextLogo />
          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-ink-600 dark:text-ink-300">
            <a href="#problem" className="hover:text-ink-900 dark:hover:text-white transition-colors">Why NEXT</a>
            <a href="#how" className="hover:text-ink-900 dark:hover:text-white transition-colors">How it works</a>
            <a href="#product" className="hover:text-ink-900 dark:hover:text-white transition-colors">Product</a>
            <a href="#pricing" className="hover:text-ink-900 dark:hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-ink-900 dark:hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => onAuth('signin')} className="hidden sm:block btn-ghost">Sign in</button>
            <button onClick={() => onAuth('signup')} className="btn-primary">
              Start Free
              <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-ink-100 dark:hover:bg-ink-800">
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-ink-100 dark:border-ink-800"
            >
              <div className="py-3 space-y-1">
                {['problem', 'how', 'product', 'pricing', 'faq'].map(s => (
                  <a key={s} href={`#${s}`} onClick={() => setMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800 capitalize">
                    {s === 'problem' ? 'Why NEXT' : s}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

/* ---------- Hero ---------- */
function Hero({ onAuth, onDemo }: { onAuth: (m: 'signin' | 'signup') => void; onDemo: () => void }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-grid-dark opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-ink-950" />
      <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-primary-500/5 blur-3xl" />
      <div className="absolute top-20 -left-40 h-[400px] w-[400px] rounded-full bg-accent-500/5 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-ink-200 dark:border-ink-700 bg-white/60 dark:bg-ink-900/60 backdrop-blur-sm text-xs font-semibold text-ink-600 dark:text-ink-300"
          >
            <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse" />
            AI Life Execution Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-heading text-balance sm:text-6xl"
          >
            Stop managing tasks.<br />
            <span className="text-primary-600">Start executing your life.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-lg text-body text-balance sm:text-xl"
          >
            NEXT connects your goals, schedule, habits, projects, money, and career into one
            intelligent system — and tells you exactly what deserves your attention next.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-col sm:flex-row gap-3"
          >
            <button onClick={() => onAuth('signup')} className="btn-primary text-base px-6 py-3.5">
              Start Free
              <ArrowRight className="h-5 w-5" />
            </button>
            <button onClick={onDemo} className="btn-outline text-base px-6 py-3.5">
              <PlayCircle className="h-5 w-5" />
              Explore Live Demo
            </button>
          </motion.div>

          <p className="mt-4 text-sm text-muted">No credit card required.</p>
        </div>

        {/* Product preview — NEXT Move card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="mt-16 max-w-4xl"
        >
          <NextMovePreview />
        </motion.div>
      </div>
    </section>
  );
}

function NextMovePreview() {
  return (
    <div className="rounded-2xl border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-900 shadow-2xl shadow-ink-950/10 overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-ink-100 dark:border-ink-800 bg-ink-50 dark:bg-ink-950/50">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-error-400" />
          <div className="h-3 w-3 rounded-full bg-warning-400" />
          <div className="h-3 w-3 rounded-full bg-success-400" />
        </div>
        <span className="ml-3 text-xs text-muted font-medium">NEXT — Today</span>
      </div>

      <div className="p-6 space-y-5">
        {/* NEXT Move */}
        <div className="rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-950/30 dark:to-accent-950/20 border border-primary-200 dark:border-primary-900/50 p-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-700 dark:text-primary-400 uppercase tracking-wide">
            <Zap className="h-3.5 w-3.5" />
            Your NEXT Move
          </div>
          <p className="mt-2 text-lg font-bold text-heading">
            Complete your TypeScript interview preparation
          </p>
          <p className="mt-1.5 text-sm text-body">
            You have 75 minutes before work. Interview tomorrow. Career is your #1 priority.
            Estimated duration: 60 min.
          </p>
          <div className="mt-4 flex gap-2">
            <button className="btn-primary text-xs px-4 py-2">Start now</button>
            <button className="btn-ghost text-xs px-4 py-2">Why this?</button>
          </div>
        </div>

        {/* Big 3 */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-heading">Today's Big 3</span>
            <span className="text-xs text-muted">2 of 3 done</span>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Finish portfolio site copy', done: true },
              { label: 'TypeScript interview prep', done: false },
              { label: '30-min run', done: true },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-800/50">
                <div className={`h-5 w-5 rounded-full flex items-center justify-center ${
                  item.done ? 'bg-success-500' : 'border-2 border-ink-300 dark:border-ink-600'
                }`}>
                  {item.done && <Check className="h-3 w-3 text-white" />}
                </div>
                <span className={`text-sm ${item.done ? 'text-muted line-through' : 'text-heading font-medium'}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Problem Section ---------- */
function ProblemSection() {
  const fragments = [
    { icon: ListTodo, label: 'Tasks' },
    { icon: Calendar, label: 'Calendar' },
    { icon: Target, label: 'Goals' },
    { icon: Wallet, label: 'Finance' },
    { icon: Brain, label: 'Notes' },
    { icon: Heart, label: 'Fitness' },
    { icon: Sparkles, label: 'AI Chats' },
  ];

  return (
    <section id="problem" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="section-label">The Problem</span>
          <h2 className="mt-3 text-3xl font-bold text-heading text-balance sm:text-4xl">
            Your life is fragmented across tools that don't talk to each other.
          </h2>
          <p className="mt-4 text-lg text-body">
            None understands the whole picture. So you spend more time managing your systems
            than actually moving forward.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {fragments.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-4 flex flex-col items-center gap-2 text-center"
            >
              <f.icon className="h-6 w-6 text-muted" />
              <span className="text-xs font-medium text-body">{f.label}</span>
              <span className="text-[10px] text-error-500 font-semibold">Disconnected</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-3 text-sm text-body">
          <AlertCircle className="h-5 w-5 text-error-500 shrink-0" />
          None of these tools knows what your goals are, what your schedule looks like, or what actually matters today.
        </div>
      </div>
    </section>
  );
}

/* ---------- How It Works ---------- */
function HowItWorks() {
  const steps = [
    { icon: Target, title: 'Set your ambition', desc: 'Describe what you want. NEXT breaks it into goals, phases, and milestones.' },
    { icon: Calendar, title: 'Plan your week', desc: 'NEXT proposes weekly priorities that fit your real capacity and constraints.' },
    { icon: Zap, title: 'Execute today', desc: 'Your Big 3 and NEXT Move keep you focused on what actually moves the needle.' },
    { icon: BarChart3, title: 'Review & adapt', desc: 'Compare planned vs actual. NEXT surfaces patterns and adjusts your plan.' },
  ];

  return (
    <section id="how" className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="section-label">How It Works</span>
          <h2 className="mt-3 text-3xl font-bold text-heading text-balance sm:text-4xl">
            From ambition to action — one connected loop.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative"
            >
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
                    <s.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="text-2xl font-extrabold text-ink-200 dark:text-ink-700">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="font-semibold text-heading">{s.title}</h3>
                <p className="mt-2 text-sm text-body">{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                  <ArrowRight className="h-5 w-5 text-ink-200 dark:text-ink-700" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- NEXT Move Section ---------- */
function NextMoveSection() {
  return (
    <section className="py-24 bg-ink-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">
              The Signature Feature
            </span>
            <h2 className="mt-3 text-3xl font-bold text-balance sm:text-4xl">
              What should I do next?
            </h2>
            <p className="mt-4 text-lg text-ink-300">
              NEXT analyzes your goals, deadlines, available time, and energy to recommend
              the single most useful action you can take right now.
            </p>
            <div className="mt-6 space-y-3">
              {[
                'Considers goal priority, deadlines, and dependencies',
                'Respects your real time and capacity constraints',
                'Every recommendation is explainable — you see the why',
                'You always have final control. Start or choose another.',
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary-400 shrink-0 mt-0.5" />
                  <span className="text-ink-200">{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-ink-900 border border-ink-700 p-6 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary-400 uppercase tracking-wide mb-4">
              <Zap className="h-3.5 w-3.5" />
              NEXT Move Recommendation
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-ink-400">Context detected</p>
                <p className="text-base font-medium text-white">You have 75 minutes available before work.</p>
              </div>
              <div className="rounded-xl bg-ink-800 border border-ink-700 p-4">
                <p className="text-sm text-ink-400">Recommended action</p>
                <p className="text-xl font-bold text-white mt-1">Complete your TypeScript interview preparation</p>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-ink-400">Why</span><span className="text-ink-200">Interview tomorrow</span></div>
                <div className="flex justify-between"><span className="text-ink-400">Priority</span><span className="text-ink-200">Career is #1 goal</span></div>
                <div className="flex justify-between"><span className="text-ink-400">Estimated time</span><span className="text-ink-200">60 minutes</span></div>
              </div>
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg transition-colors">
                Start now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Product Screens ---------- */
function ProductScreens() {
  const screens = [
    { id: 'today', name: 'Today', icon: Zap, desc: 'Your daily command center — Big 3, schedule, habits, and your NEXT Move in one view.' },
    { id: 'goals', name: 'Goals', icon: Target, desc: 'Connect ambition to execution. Track milestones, projects, and progress across life areas.' },
    { id: 'ai', name: 'Ask NEXT', icon: Brain, desc: 'AI that knows your context. Ask about your schedule, priorities, or what to stop doing.' },
    { id: 'progress', name: 'Progress', icon: BarChart3, desc: 'Planned vs actual. Execution patterns, goal movement, and momentum over time.' },
    { id: 'finance', name: 'Money', icon: Wallet, desc: 'Accounts, budgets, savings goals, and investments — connected to what you want to achieve.' },
    { id: 'career', name: 'Career', icon: Briefcase, desc: 'Track applications, interviews, skills, and learning — connected to activity and outcomes.' },
  ];

  const [active, setActive] = useState(0);

  return (
    <section id="product" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="section-label">Product</span>
          <h2 className="mt-3 text-3xl font-bold text-heading text-balance sm:text-4xl">
            One system. Every part of your life, connected.
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {screens.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              onMouseEnter={() => setActive(i)}
              className="card-hover p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary-50 dark:bg-primary-950/40 flex items-center justify-center">
                  <s.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-heading text-lg">{s.name}</h3>
              </div>
              <p className="text-sm text-body">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Adaptive Planning ---------- */
function AdaptivePlanning() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="section-label">Reality-Aware Planning</span>
            <h2 className="mt-3 text-3xl font-bold text-heading text-balance sm:text-4xl">
              NEXT knows what you can actually do.
            </h2>
            <p className="mt-4 text-lg text-body">
              No more scheduling eight hours of work when you only have two. NEXT tracks your
              real capacity and warns you before you overload.
            </p>
            <div className="mt-6 space-y-3">
              <div className="card p-4 border-error-200 dark:border-error-900/40 bg-error-50 dark:bg-error-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-error-600" />
                  <span className="text-sm font-semibold text-error-700 dark:text-error-400">Overloaded Day</span>
                </div>
                <p className="text-sm text-body">Planned discretionary work: <strong className="text-heading">5h 40m</strong></p>
                <p className="text-sm text-body">Available time: <strong className="text-heading">2h 15m</strong></p>
              </div>
              <div className="card p-4 border-success-200 dark:border-success-900/40 bg-success-50 dark:bg-success-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-success-600" />
                  <span className="text-sm font-semibold text-success-700 dark:text-success-400">NEXT Suggests</span>
                </div>
                <p className="text-sm text-body">Move 2 tasks to Thursday. Keep the interview prep today.</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-heading mb-4">This Week</h3>
            <div className="space-y-2">
              {[
                { day: 'Mon', load: 85, status: 'overload' },
                { day: 'Tue', load: 60, status: 'ok' },
                { day: 'Wed', load: 70, status: 'ok' },
                { day: 'Thu', load: 45, status: 'light' },
                { day: 'Fri', load: 90, status: 'overload' },
                { day: 'Sat', load: 30, status: 'light' },
                { day: 'Sun', load: 15, status: 'rest' },
              ].map(d => (
                <div key={d.day} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-muted w-8">{d.day}</span>
                  <div className="flex-1 h-6 rounded-md bg-ink-100 dark:bg-ink-800 overflow-hidden">
                    <div
                      className={`h-full rounded-md transition-all ${
                        d.status === 'overload' ? 'bg-error-500' :
                        d.status === 'ok' ? 'bg-primary-500' :
                        d.status === 'light' ? 'bg-success-400' :
                        'bg-ink-200 dark:bg-ink-700'
                      }`}
                      style={{ width: `${d.load}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted w-8 text-right">{d.load}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Pricing ---------- */
function Pricing({ onAuth }: { onAuth: (m: 'signin' | 'signup') => void }) {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: 'Free',
      price: 0,
      annual: 0,
      tagline: 'Organize your execution.',
      features: [
        '3 active goals',
        'Core tasks & projects',
        'Today dashboard',
        'Manual Big 3',
        'Basic habits',
        'Limited AI usage',
      ],
      cta: 'Start Free',
      highlight: false,
    },
    {
      name: 'Pro',
      price: 12,
      annual: 99,
      tagline: 'Let NEXT actively plan, analyze, and adapt with you.',
      features: [
        'Unlimited goals & projects',
        'NEXT Move intelligence',
        'AI Goal Engine',
        'Smart Replanning',
        'Execution Intelligence',
        'Weekly AI Review',
        'Decision Lab',
        'Career & Finance Hub',
        'Personal context memory',
        'Higher AI allowance',
      ],
      cta: 'Start 14-Day Trial',
      highlight: true,
    },
    {
      name: 'Business',
      price: 29,
      annual: 290,
      tagline: 'Connect personal execution with business operations.',
      features: [
        'Everything in Pro',
        'Business workspace',
        'CRM & clients',
        'Invoicing',
        'Business finance',
        'Time tracking',
        'Team capabilities',
        'Business analytics',
        'Business AI context',
      ],
      cta: 'Start 14-Day Trial',
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="section-label">Pricing</span>
          <h2 className="mt-3 text-3xl font-bold text-heading text-balance sm:text-4xl">
            Choose your level of execution.
          </h2>
          <p className="mt-4 text-body">Free forever. Upgrade when you're ready. No credit card to start.</p>

          <div className="mt-8 inline-flex items-center gap-3 p-1 rounded-lg bg-ink-100 dark:bg-ink-800">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${!annual ? 'bg-white dark:bg-ink-700 text-heading shadow-sm' : 'text-muted'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${annual ? 'bg-white dark:bg-ink-700 text-heading shadow-sm' : 'text-muted'}`}
            >
              Annual
              <span className="ml-2 text-xs text-success-600 font-semibold">Save ~30%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map(p => (
            <div
              key={p.name}
              className={`card p-6 relative ${p.highlight ? 'border-primary-300 dark:border-primary-700 shadow-lg ring-1 ring-primary-200 dark:ring-primary-800' : ''}`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="badge-primary px-3 py-1 text-xs">Most Popular</span>
                </div>
              )}
              <h3 className="text-lg font-bold text-heading">{p.name}</h3>
              <p className="mt-1 text-sm text-body min-h-[40px]">{p.tagline}</p>
              <div className="mt-4">
                <span className="text-4xl font-extrabold text-heading">
                  ${annual ? p.annual : p.price}
                </span>
                <span className="text-sm text-muted ml-1">
                  {annual ? '/year' : p.price === 0 ? '' : '/month'}
                </span>
              </div>
              <button
                onClick={() => onAuth('signup')}
                className={`w-full mt-5 ${p.highlight ? 'btn-primary' : 'btn-outline'}`}
              >
                {p.cta}
              </button>
              <ul className="mt-6 space-y-2.5">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm text-body">
                    <Check className="h-4 w-4 text-success-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    {
      q: 'Is NEXT really free?',
      a: 'Yes. The Free plan is yours forever with up to 3 goals, core tasks, projects, and basic habits. You only pay when you want advanced AI features like NEXT Move, Smart Replanning, and the Weekly AI Review.',
    },
    {
      q: 'Do I need a credit card to try Pro?',
      a: 'No. You can start a 14-day Pro trial without a credit card. Your data stays even if you decide not to upgrade after the trial.',
    },
    {
      q: 'How is NEXT different from a task manager?',
      a: 'Task managers store lists. NEXT connects your tasks to goals, projects, schedule, finances, and habits — then uses that context to recommend what you should actually do next. It understands your whole life, not just your to-do list.',
    },
    {
      q: 'Does NEXT work on mobile?',
      a: 'Yes. NEXT is a web-first app that works on any device. It\'s fully responsive and installable as a PWA on your phone.',
    },
    {
      q: 'Is my data safe?',
      a: 'Your data is protected with row-level security on every table. AI keys are never exposed in the browser. Sensitive operations run server-side with proper authorization.',
    },
    {
      q: 'Can I use NEXT for my business too?',
      a: 'Yes. The Business plan adds a full workspace with CRM, invoicing, business finance, time tracking, and team capabilities — while keeping your personal life and business in one connected system.',
    },
  ];

  return (
    <section id="faq" className="py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="section-label">FAQ</span>
          <h2 className="mt-3 text-3xl font-bold text-heading text-balance sm:text-4xl">
            Questions, answered.
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-medium text-heading">{f.q}</span>
                <ChevronDown className={`h-5 w-5 text-muted shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-4 pb-4 text-sm text-body">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Final CTA ---------- */
function FinalCTA({ onAuth, onDemo }: { onAuth: (m: 'signin' | 'signup') => void; onDemo: () => void }) {
  return (
    <section className="py-24 bg-ink-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-dark opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-extrabold text-balance sm:text-5xl">
          What's your <span className="text-primary-400">next</span> move?
        </h2>
        <p className="mt-4 text-lg text-ink-300">
          Stop managing tasks. Start executing your life.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => onAuth('signup')} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors inline-flex items-center justify-center gap-2">
            Start Free
            <ArrowRight className="h-5 w-5" />
          </button>
          <button onClick={onDemo} className="border border-ink-700 text-white font-semibold px-6 py-3.5 rounded-lg hover:bg-ink-800 transition-colors inline-flex items-center justify-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Explore Live Demo
          </button>
        </div>
        <p className="mt-4 text-sm text-ink-400">No credit card required.</p>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="border-t border-ink-100 dark:border-ink-800 py-12 bg-base">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <NextLogo />
            <p className="text-sm text-body max-w-xs">
              An AI-powered life execution platform. Your life. Your goals. Your next move.
            </p>
          </div>
          {[
            { title: 'Product', links: ['Today', 'Goals', 'Tasks', 'Finance', 'Career', 'Business'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Status'] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-heading mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}>
                    <a href="#" className="text-sm text-body hover:text-heading transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-8 border-t border-ink-100 dark:border-ink-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted">© 2026 NEXT. All rights reserved.</p>
          <p className="text-sm text-muted">Built for execution.</p>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Main Landing Page ---------- */
export default function LandingPage({ onAuth }: { onAuth: (mode: 'signin' | 'signup') => void }) {
  const startGuestSession = useGuestStore(s => s.startGuestSession);
  const navigate = useNavigate();

  const handleDemo = () => {
    startGuestSession();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-base">
      <LandingNav onAuth={onAuth} />
      <Hero onAuth={onAuth} onDemo={handleDemo} />
      <ProblemSection />
      <HowItWorks />
      <NextMoveSection />
      <ProductScreens />
      <AdaptivePlanning />
      <Pricing onAuth={onAuth} />
      <FAQ />
      <FinalCTA onAuth={onAuth} onDemo={handleDemo} />
      <Footer />
    </div>
  );
}
