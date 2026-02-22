import { useState } from 'react';
import { api } from '../api/api';

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', mobileNo: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleLogin = async () => {
    setError('');
    if (!form.email || !form.password) return setError('Please enter email and password.');
    setLoading(true);
    try {
      const users = await api.users.getAll();
      const user = users.find(
        u => u.email === form.email && u.password === form.password
      );
      if (!user) {
        setError('Invalid email or password.');
      } else {
        onLogin(user);
      }
    } catch {
      setError('Cannot connect to backend. Make sure the server is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!form.name || !form.email || !form.password) return setError('Name, email and password are required.');
    if (form.password.length < 4) return setError('Password must be at least 4 characters.');
    setLoading(true);
    try {
      const newUser = await api.users.create({
        name: form.name,
        email: form.email,
        password: form.password,
        mobileNo: form.mobileNo || null,
      });
      onLogin(newUser);
    } catch {
      setError('Registration failed. Email may already be taken or backend is unreachable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* Left panel */}
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.bigIcon}>💼</div>
          <h1 style={styles.appName}>BudgetManager</h1>
          <p style={styles.tagline}>Take control of your finances.</p>
          <div style={styles.features}>
            {[
              ['💰', 'Track Income', 'Log salary, freelance & more'],
              ['🧾', 'Log Expenses', 'Categorize every rupee spent'],
              ['📋', 'Set Budgets', 'Monthly limits per category'],
              ['🎯', 'Savings Goals', 'Plan for vacations & emergencies'],
              ['📊', 'Visual Dashboard', 'See your balance at a glance'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={styles.feature}>
                <span style={styles.featureIcon}>{icon}</span>
                <div>
                  <div style={styles.featureTitle}>{title}</div>
                  <div style={styles.featureDesc}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div style={styles.right}>
        <div style={styles.card}>
          {/* Tabs */}
          <div style={styles.tabs}>
            <button
              style={{ ...styles.tab, ...(mode === 'login' ? styles.activeTab : {}) }}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Login
            </button>
            <button
              style={{ ...styles.tab, ...(mode === 'register' ? styles.activeTab : {}) }}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Register
            </button>
          </div>

          <h2 style={styles.formTitle}>
            {mode === 'login' ? 'Welcome back 👋' : 'Create account 🚀'}
          </h2>
          <p style={styles.formSub}>
            {mode === 'login'
              ? 'Sign in to access your dashboard'
              : 'Start managing your budget today'}
          </p>

          {error && <div style={styles.error}>{error}</div>}

          <div style={styles.fields}>
            {mode === 'register' && (
              <Field label="Full Name *" icon="👤">
                <input
                  style={styles.input}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                />
              </Field>
            )}

            <Field label="Email Address *" icon="✉️">
              <input
                style={styles.input}
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && mode === 'login' && handleLogin()}
              />
            </Field>

            <Field label="Password *" icon="🔒">
              <input
                style={styles.input}
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleRegister())}
              />
            </Field>

            {mode === 'register' && (
              <Field label="Mobile Number" icon="📱">
                <input
                  style={styles.input}
                  placeholder="+91 98765 43210"
                  value={form.mobileNo}
                  onChange={e => set('mobileNo', e.target.value)}
                />
              </Field>
            )}
          </div>

          <button
            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
            onClick={mode === 'login' ? handleLogin : handleRegister}
            disabled={loading}
          >
            {loading
              ? '⏳ Please wait...'
              : mode === 'login' ? '🔑 Sign In' : '✅ Create Account'}
          </button>

          <p style={styles.switchText}>
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <span
              style={styles.switchLink}
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            >
              {mode === 'login' ? 'Register here' : 'Login here'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={styles.label}>{icon} {label}</label>
      {children}
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    fontFamily: "'Inter', -apple-system, sans-serif",
    background: '#0f172a',
  },
  left: {
    flex: 1,
    background: 'linear-gradient(135deg, #1a1a3e 0%, #16213e 50%, #0f3460 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 48,
    position: 'relative',
    overflow: 'hidden',
  },
  leftContent: { position: 'relative', zIndex: 1, maxWidth: 420 },
  bigIcon: { fontSize: 56, marginBottom: 16 },
  appName: { color: '#e2e8f0', fontSize: 36, fontWeight: 800, margin: '0 0 8px' },
  tagline: { color: '#94a3b8', fontSize: 18, margin: '0 0 40px' },
  features: { display: 'flex', flexDirection: 'column', gap: 20 },
  feature: { display: 'flex', alignItems: 'flex-start', gap: 14 },
  featureIcon: { fontSize: 24, flexShrink: 0, marginTop: 2 },
  featureTitle: { color: '#e2e8f0', fontWeight: 600, fontSize: 15, marginBottom: 2 },
  featureDesc: { color: '#64748b', fontSize: 13 },

  right: {
    width: 460,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    background: '#0f172a',
  },
  card: { width: '100%', maxWidth: 380 },
  tabs: {
    display: 'flex',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    padding: 4,
    marginBottom: 28,
  },
  tab: {
    flex: 1,
    padding: '10px 0',
    background: 'transparent',
    border: 'none',
    color: '#64748b',
    cursor: 'pointer',
    borderRadius: 7,
    fontSize: 14,
    fontWeight: 600,
    transition: 'all 0.2s',
  },
  activeTab: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    color: '#fff',
  },
  formTitle: { color: '#e2e8f0', fontSize: 24, fontWeight: 800, margin: '0 0 6px' },
  formSub: { color: '#64748b', fontSize: 14, margin: '0 0 24px' },
  error: {
    background: 'rgba(239,68,68,0.1)',
    border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171',
    padding: '10px 14px',
    borderRadius: 8,
    fontSize: 13,
    marginBottom: 16,
  },
  fields: {},
  label: { display: 'block', color: '#94a3b8', fontSize: 13, fontWeight: 500, marginBottom: 6 },
  input: {
    width: '100%',
    padding: '11px 14px',
    background: '#1e293b',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 8,
    color: '#e2e8f0',
    fontSize: 14,
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  submitBtn: {
    width: '100%',
    padding: '13px 0',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none',
    borderRadius: 10,
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: 8,
    marginBottom: 20,
    letterSpacing: 0.3,
    transition: 'opacity 0.2s',
  },
  switchText: { color: '#64748b', fontSize: 13, textAlign: 'center', margin: 0 },
  switchLink: { color: '#818cf8', cursor: 'pointer', fontWeight: 600 },
};
