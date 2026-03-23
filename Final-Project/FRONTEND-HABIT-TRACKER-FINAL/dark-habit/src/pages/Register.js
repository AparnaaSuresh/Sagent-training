import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/api';
import './Auth.css';

function Mascot({ size = 180, emoji1 = '🔥', emoji2 = '⚡', delay = 0 }) {
  return (
    <div className="mascot-wrap" style={{ '--delay': `${delay}s` }}>
      <div className="mascot-body" style={{ width: size, height: size * 1.15 }}>
        <div className="mascot-floaters">
          <span className="mascot-float f1">{emoji1}</span>
          <span className="mascot-float f2">{emoji2}</span>
        </div>
        <div className="mascot-antenna">
          <div className="mascot-waves">
            <div className="mascot-wave" />
            <div className="mascot-wave" />
            <div className="mascot-wave" />
          </div>
          <div className="mascot-antenna-ball" />
          <div className="mascot-antenna-stick" />
        </div>
        <div className="mascot-shape" />
        <div className="mascot-face">
          <div className="mascot-eyes">
            <div className="mascot-eye"><div className="mascot-pupil" /></div>
            <div className="mascot-eye"><div className="mascot-pupil" /></div>
          </div>
          <div className="mascot-smile" />
        </div>
      </div>
    </div>
  );
}

function Celebration({ name, onDone }) {
  const confetti = Array.from({ length: 60 }, (_, i) => i);
  const colors = ['#f97316','#fbbf24','#34d399','#60a5fa','#f472b6','#a78bfa','#fff','#fb7185'];

  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="celebration-overlay">
      <div className="confetti-container">
        {confetti.map(i => (
          <div key={i} className="confetti-piece" style={{
            left: `${Math.random() * 100}%`,
            background: colors[i % colors.length],
            animationDelay: `${Math.random() * 0.8}s`,
            animationDuration: `${1.2 + Math.random() * 1.4}s`,
            width:  `${6 + Math.random() * 8}px`,
            height: `${6 + Math.random() * 8}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${Math.random() * 360}deg)`,
          }} />
        ))}
      </div>
      <div className="celebration-card">
        <div className="celeb-emoji">🎉</div>
        <div className="celeb-title">Account created!</div>
        <div className="celeb-name">{name}</div>
        <div className="celeb-sub">Let's build some habits 🔥</div>
        <div className="celeb-bar"><div className="celeb-bar-fill" /></div>
      </div>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]           = useState({ name: '', email: '', password: '' });
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [celebrate, setCelebrate] = useState(null);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await registerUser(form);
      // auto-login after register
      localStorage.setItem('user', JSON.stringify(res.data));
      setCelebrate(res.data?.name || form.name || 'Friend');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try a different email.');
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg">
      {celebrate && <Celebration name={celebrate} onDone={() => navigate('/')} />}

      <div className="bg-orb orb1" />
      <div className="bg-orb orb2" />
      <div className="bg-orb orb3" />
      <div className="bg-orb orb4" />

      <div className="mascots-left">
        <Mascot size={100} emoji1="🌱" emoji2="✨" delay={0}   />
        <Mascot size={85}  emoji1="🎯" emoji2="💪" delay={0.4} />
        <Mascot size={75}  emoji1="🏆" emoji2="🔥" delay={0.8} />
      </div>

      <div className="mascots-right">
        <Mascot size={100} emoji1="🚀" emoji2="🌟" delay={0.3} />
        <Mascot size={85}  emoji1="🧘" emoji2="🎵" delay={0.6} />
        <Mascot size={75}  emoji1="💡" emoji2="🎉" delay={1.0} />
      </div>

      <div className="auth-layout">
        <div className="auth-tagline">
          Start your journey.<br />Build habits. Win.
        </div>

        <div className="auth-box">
          <div className="auth-welcome">CREATE ACCOUNT</div>
          <div className="auth-brand">
            <div className="auth-diamond">◆</div>
            <span className="auth-brand-name">HabitTrack</span>
          </div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={submit}>
            <div className="field">
              <label className="label">Name</label>
              <input className="input" name="name" type="text"
                placeholder="Your name"
                value={form.name} onChange={handle} required />
            </div>
            <div className="field">
              <label className="label">Email</label>
              <input className="input" name="email" type="email"
                placeholder="you@example.com"
                value={form.email} onChange={handle} required />
            </div>
            <div className="field">
              <label className="label">Password</label>
              <input className="input" name="password" type="password"
                placeholder="••••••••"
                value={form.password} onChange={handle} required />
            </div>
            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? <span className="btn-spinner" /> : 'SIGN UP'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <span onClick={() => navigate('/register')}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}