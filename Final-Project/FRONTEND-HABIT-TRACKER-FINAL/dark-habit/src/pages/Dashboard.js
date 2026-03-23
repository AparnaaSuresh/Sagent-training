import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getHabits, createHabit, deleteHabit, getTasks, getStreak, getLogs } from '../api/api';
import './Dashboard.css';

const CARD_COLORS = [
  { bg: 'rgba(124,58,237,0.1)',  color: '#7c3aed' },
  { bg: 'rgba(217,70,168,0.1)',  color: '#d946a8' },
  { bg: 'rgba(8,145,178,0.1)',   color: '#0891b2' },
  { bg: 'rgba(217,119,6,0.1)',   color: '#d97706' },
  { bg: 'rgba(5,150,105,0.1)',   color: '#059669' },
  { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
];

const ICONS = ['🏃','📚','🧘','💪','🎯','🌿','✍️','🎨','💧','🌅','🎵','🛌','🥗','🧠','🚴'];

const getLast30Days = () => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

// ══════════════════════════════════════════════════
// CARTOON DECORATIONS — balanced left + right
// ══════════════════════════════════════════════════
function CartoonDecorations() {
  return (
    <div className="cartoon-layer" aria-hidden="true">

      {/* ══ LEFT SIDE ══ */}

      {/* L1 — Wizard Owl (top left) */}
      <div className="cartoon-item cartoon-owl">
        <div style={{ position: 'relative' }}>
          <div className="cowl-hat">🎩</div>
          <div className="cowl-body">🦉</div>
        </div>
        <div className="cowl-book">📖</div>
        <div className="cowl-speech">Study mode! 📚</div>
      </div>

      {/* L2 — Yoga Cat (upper-mid left) */}
      <div className="cartoon-item cartoon-cat">
        <div className="ccat-body">🐱</div>
        <div className="ccat-pose">🧘</div>
        <div className="ccat-label">In the zone!</div>
      </div>

      {/* L3 — Bouncing Frog (lower-mid left) */}
      <div className="cartoon-item cartoon-frog">
        <div className="cfrog-body">🐸</div>
        <div className="cfrog-bubbles">
          <span className="cfrog-bubble fb1">+1</span>
          <span className="cfrog-bubble fb2">🔥</span>
          <span className="cfrog-bubble fb3">✨</span>
        </div>
      </div>

      {/* L4 — Sparkle Fairy (bottom left) */}
      <div className="cartoon-item cartoon-fairy">
        <div className="cfairy-body">🧚</div>
        <div className="cfairy-shadow" />
        <div className="cfairy-trail">
          <span className="cft cft1">✨</span>
          <span className="cft cft2">⭐</span>
          <span className="cft cft3">✨</span>
        </div>
      </div>

      {/* ══ RIGHT SIDE ══ */}

      {/* R1 — Star Character (top right) */}
      <div className="cartoon-item cartoon-star-char">
        <div style={{ position: 'relative' }}>
          <div className="cartoon-face-star">
            <div className="cface-eyes"><span /><span /></div>
            <div className="cface-smile" />
          </div>
          <div className="cartoon-star-body">⭐</div>
        </div>
        <div className="cartoon-speech">Keep it up! 🔥</div>
      </div>

      {/* R2 — Daily Goal Badge (upper-mid right) */}
      <div className="cartoon-item cartoon-badge">
        <div className="cbadge-inner">
          <div className="cbadge-icon">🎯</div>
          <div className="cbadge-text">Daily<br />Goal!</div>
        </div>
      </div>

      {/* R3 — Trophy (middle right) */}
      <div className="cartoon-item cartoon-trophy">
        <div className="ctrophy-glow">🏆</div>
        <div className="ctrophy-label">Champion!</div>
      </div>

      {/* R4 — Orbiting Planets (lower-mid right) */}
      <div className="cartoon-item cartoon-planets">
        <div className="cplanets-wrap">
          <div className="cplanets-center">🪐</div>
          <div className="cplanet-orbit cpo1">🌙</div>
          <div className="cplanet-orbit cpo2">⭐</div>
        </div>
        <div className="cplanets-label">Shoot for stars!</div>
      </div>

      {/* R5 — Busy Bee (bottom right) */}
      <div className="cartoon-item cartoon-bee">
        <div className="cbee-body">🐝</div>
        <div className="cbee-trail">
          <span className="cbt cbt1">·</span>
          <span className="cbt cbt2">·</span>
          <span className="cbt cbt3">·</span>
        </div>
        <div className="cbee-label">Busy bee!</div>
      </div>

      {/* ══ BOTTOM CENTRE — Sparkles ══ */}
      <div className="cartoon-item cartoon-sparkles">
        <span className="csparkle s1">✨</span>
        <span className="csparkle s2">⚡</span>
        <span className="csparkle s3">🌟</span>
        <span className="csparkle s4">⚡</span>
        <span className="csparkle s5">✨</span>
      </div>

    </div>
  );
}

// ══════════════════════════════════════════════════
// PROGRESS RING
// ══════════════════════════════════════════════════
function ProgressRing({ pct, color, size = 58 }) {
  const r = (size - 7) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="var(--border)" strokeWidth="5.5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="5.5"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(.4,0,.2,1)' }} />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle"
        fill={color} fontSize="11" fontWeight="800"
        style={{ transform: 'rotate(90deg)', transformOrigin: 'center', fontFamily: 'Outfit, sans-serif' }}>
        {pct}%
      </text>
    </svg>
  );
}

// ══════════════════════════════════════════════════
// TODAY'S FOCUS WIDGET
// ══════════════════════════════════════════════════
function TodaysFocus({ habits, habitMeta, onNavigate }) {
  const pending = habits.filter(h => {
    const meta = habitMeta[h.habitId] || {};
    return (meta.taskCount || 0) > 0 && (meta.doneCount || 0) < (meta.taskCount || 0);
  });

  if (habits.length === 0) return null;

  if (pending.length === 0) return (
    <div className="focus-widget animate-in">
      <div className="focus-all-done">
        <span style={{ fontSize: 28 }}>🎉</span>
        <span>All habits on track today — great work!</span>
      </div>
    </div>
  );

  return (
    <div className="focus-widget animate-in">
      <div className="focus-header">
        <div className="focus-title">🎯 Today's Focus</div>
        <div className="focus-sub">{pending.length} habit{pending.length > 1 ? 's' : ''} need attention</div>
      </div>
      <div className="focus-list">
        {pending.slice(0, 4).map(h => {
          const col  = CARD_COLORS[h.habitName.charCodeAt(0) % CARD_COLORS.length];
          const icon = ICONS[h.habitName.charCodeAt(0) % ICONS.length];
          const meta = habitMeta[h.habitId] || {};
          const pct  = meta.taskCount > 0 ? Math.round((meta.doneCount / meta.taskCount) * 100) : 0;
          return (
            <div key={h.habitId} className="focus-item"
              onClick={() => onNavigate(`/habit/${h.habitId}`)}>
              <div className="focus-icon" style={{ background: col.bg, color: col.color }}>{icon}</div>
              <div className="focus-body">
                <div className="focus-name">{h.habitName}</div>
                <div className="focus-progress-bar">
                  <div className="focus-progress-fill"
                    style={{ width: `${pct}%`, background: col.color }} />
                </div>
              </div>
              <div className="focus-arrow" style={{ color: col.color }}>→</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// MAIN DASHBOARD
// ══════════════════════════════════════════════════
export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [habits,    setHabits]    = useState([]);
  const [habitMeta, setHabitMeta] = useState({});
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState({ habitName: '', frequency: 'daily' });
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(true);
  const [viewMode,  setViewMode]  = useState('grid');

  const days30  = getLast30Days();
  const dayNums = days30.map(d => new Date(d).getDate());
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => { fetchHabits(); }, []);

  const fetchHabits = async () => {
    try {
      const res = await getHabits(user.userId);
      setHabits(res.data);
      res.data.forEach(h => loadMeta(h.habitId));
    } catch {
      setError('Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const loadMeta = async (habitId) => {
    try {
      const tasksRes = await getTasks(habitId);
      const tasks = tasksRes.data;
      let maxStreak = 0, doneCount = 0;
      const completedDates = new Set();

      for (const task of tasks) {
        try {
          const s = await getStreak(task.taskId);
          if (s.data.streak > maxStreak) maxStreak = s.data.streak;
        } catch {}
        if (task.status === 'done') doneCount++;
        try {
          const logsRes = await getLogs(task.taskId);
          logsRes.data.forEach(log => {
            if (log.status === 'completed') completedDates.add(log.date);
          });
        } catch {}
      }

      const pct = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
      setHabitMeta(p => ({
        ...p,
        [habitId]: { taskCount: tasks.length, doneCount, maxStreak, completedDates, pct }
      }));
    } catch {}
  };

  const addHabit = async e => {
    e.preventDefault();
    try {
      await createHabit(user.userId, form);
      setForm({ habitName: '', frequency: 'daily' });
      setShowForm(false);
      fetchHabits();
    } catch {
      setError('Failed to create habit');
    }
  };

  const removeHabit = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this habit and all its tasks?')) return;
    try { await deleteHabit(id); fetchHabits(); }
    catch { setError('Failed to delete'); }
  };

  const colorOf = name => CARD_COLORS[name.charCodeAt(0) % CARD_COLORS.length];
  const iconOf  = name => ICONS[name.charCodeAt(0) % ICONS.length];

  const totalStreak = Object.values(habitMeta).reduce((a, h) => a + (h.maxStreak || 0), 0);
  const totalTasks  = Object.values(habitMeta).reduce((a, h) => a + (h.taskCount || 0), 0);
  const totalDone   = Object.values(habitMeta).reduce((a, h) => a + (h.doneCount || 0), 0);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="page">
      <Navbar />

      {/* Cartoon decorations — balanced left & right */}
      <CartoonDecorations />

      <div className="container">

        {/* ── Header ── */}
        <div className="dash-header animate-in">
          <div>
            <div className="dash-greeting">{greeting} ✦</div>
            <h1 className="dash-name">{user?.name} 👋</h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="view-toggle">
              <button
                className={`vt-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}>
                ⊞ Cards
              </button>
              <button
                className={`vt-btn ${viewMode === 'streak' ? 'active' : ''}`}
                onClick={() => setViewMode('streak')}>
                ▦ Streak
              </button>
            </div>
            <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '+ New Habit'}
            </button>
          </div>
        </div>

        {/* ── Stats Bar ── */}
        {habits.length > 0 && (
          <div className="stats-bar animate-in">
            <div className="stat-pill">
              <span className="stat-pill-icon">🔥</span>
              <div>
                <div className="stat-pill-num">{totalStreak}</div>
                <div className="stat-pill-label">Streak Days</div>
              </div>
            </div>
            <div className="stat-pill">
              <span className="stat-pill-icon">✨</span>
              <div>
                <div className="stat-pill-num">{habits.length}</div>
                <div className="stat-pill-label">Active Habits</div>
              </div>
            </div>
            <div className="stat-pill">
              <span className="stat-pill-icon">✅</span>
              <div>
                <div className="stat-pill-num">{totalDone}/{totalTasks}</div>
                <div className="stat-pill-label">Tasks Done</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Today's Focus ── */}
        <TodaysFocus habits={habits} habitMeta={habitMeta} onNavigate={navigate} />

        {/* ── Error ── */}
        {error && <div className="error-msg">{error}</div>}

        {/* ── New Habit Form ── */}
        {showForm && (
          <div className="card form-card animate-in">
            <h3 className="form-title">Create New Habit</h3>
            <form onSubmit={addHabit}>
              <div className="form-row">
                <div className="field" style={{ flex: 2 }}>
                  <label className="label">Habit Name</label>
                  <input
                    className="input"
                    placeholder="e.g. Morning Exercise"
                    value={form.habitName}
                    onChange={e => setForm({ ...form, habitName: e.target.value })}
                    required
                  />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label className="label">Frequency</label>
                  <select
                    className="input"
                    value={form.frequency}
                    onChange={e => setForm({ ...form, frequency: e.target.value })}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" type="submit">Create Habit</button>
            </form>
          </div>
        )}

        {/* ── Content ── */}
        {loading ? (
          <div className="loading">Loading your habits...</div>

        ) : habits.length === 0 ? (
          <div className="empty-state animate-in">
            <div className="empty-icon">🎯</div>
            <h3>No habits yet</h3>
            <p>Click "+ New Habit" to start building your streak</p>
          </div>

        ) : viewMode === 'streak' ? (

          /* ── Streak Table View ── */
          <div className="streak-table-wrap animate-in">
            <div className="streak-table">
              <div className="streak-header-row">
                <div className="streak-habit-col">Habit</div>
                <div className="streak-days-col">
                  {dayNums.map((n, i) => (
                    <div key={i}
                      className={`streak-day-num ${days30[i] === todayStr ? 'today' : ''}`}>
                      {n}
                    </div>
                  ))}
                </div>
                <div className="streak-pct-col">Progress</div>
              </div>

              {habits.map(habit => {
                const col       = colorOf(habit.habitName);
                const icon      = iconOf(habit.habitName);
                const meta      = habitMeta[habit.habitId] || {};
                const completed = meta.completedDates || new Set();
                const doneThisMonth = days30.filter(d => completed.has(d)).length;
                const pct = Math.round((doneThisMonth / days30.length) * 100);

                return (
                  <div key={habit.habitId} className="streak-row"
                    onClick={() => navigate(`/habit/${habit.habitId}`)}>
                    <div className="streak-habit-col">
                      <span className="streak-icon" style={{ color: col.color }}>{icon}</span>
                      <span className="streak-habit-name">{habit.habitName}</span>
                    </div>
                    <div className="streak-days-col">
                      {days30.map((day, i) => {
                        const isDone  = completed.has(day);
                        const isToday = day === todayStr;
                        return (
                          <div key={i}
                            className={`streak-cell ${isDone ? 'done' : 'empty'} ${isToday ? 'today-cell' : ''}`}
                            style={isDone ? { background: col.color, boxShadow: `0 0 8px ${col.color}88` } : {}} />
                        );
                      })}
                    </div>
                    <div className="streak-pct-col">
                      <div className="streak-pct-bar">
                        <div className="streak-pct-fill" style={{ width: `${pct}%`, background: col.color }} />
                      </div>
                      <span className="streak-pct-text" style={{ color: col.color }}>{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        ) : (

          /* ── Cards Grid View ── */
          <div className="habits-grid">
            {habits.map(habit => {
              const col  = colorOf(habit.habitName);
              const icon = iconOf(habit.habitName);
              const meta = habitMeta[habit.habitId] || {};
              return (
                <div key={habit.habitId} className="habit-card animate-in"
                  onClick={() => navigate(`/habit/${habit.habitId}`)}>

                  <div className="hc-top">
                    <div className="hc-icon" style={{ background: col.bg, color: col.color, fontSize: 32, width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {icon}
                    </div>
                    <button className="hc-delete" onClick={e => removeHabit(habit.habitId, e)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14H6L5 6" />
                        <path d="M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  </div>

                  <div className="hc-name">{habit.habitName}</div>

                  <div className="hc-ring-row">
                    <div className="hc-streak-block">
                      <div className="hc-streak-fire-num">
                        <span className="hc-streak-fire">🔥</span>
                        <span className="hc-streak-num" style={{ color: col.color }}>{meta.maxStreak || 0}</span>
                      </div>
                      <div className="hc-streak-label">day streak</div>
                    </div>
                    <ProgressRing pct={meta.pct || 0} color={col.color} />
                  </div>

                  <div className="hc-bottom">
                    <span className={`badge badge-${habit.frequency}`}>{habit.frequency}</span>
                    <div className="hc-tasks">
                      {meta.taskCount > 0 && (
                        <span className="hc-task-count">{meta.doneCount}/{meta.taskCount}</span>
                      )}
                      <span className="hc-arrow" style={{ color: col.color }}>→</span>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}