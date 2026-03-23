import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getHabits, getTasks, getLogs, getStreak } from '../api/api';
import './Profile.css';

const SKINS        = ['#FDDBB4','#F0C27F','#D4915A','#A0522D','#5C2E00'];
const HAIRCS       = ['#2C1B18','#8B4513','#DAA520','#FF6347','#C0C0C0'];
const SHIRT_COLORS = ['#f07800','#0891b2','#059669','#d97706','#dc2626','#d946a8','#1a1a2e'];
const HAIR_SHAPES  = [
  'M30,55 Q70,20 110,55 Q105,30 70,25 Q35,30 30,55Z',
  'M28,55 Q70,18 112,55 L115,100 Q70,85 25,100Z',
  'M30,58 Q50,15 90,18 Q115,20 110,58 Q90,25 70,22 Q50,25 30,58Z',
  null,
  'M26,56 Q70,16 114,56 Q110,90 100,120 Q70,110 40,120 Q30,90 26,56Z',
];
const HAIR_LABELS = ['Short','Long','Curly','Bald','Wavy'];
const EYE_LABELS  = ['Normal','Happy','Cool','Star'];
const ACC_LABELS  = ['None','Glasses','Hat','Crown','Headphones'];

const ICONS = ['🏃','📚','🧘','💪','🎯','🌿','✍️','🎨','💧','🌅','🎵','🛌','🥗','🧠','🚴'];
const CARD_COLORS = [
  { bg: 'rgba(124,58,237,0.1)',  color: '#7c3aed' },
  { bg: 'rgba(217,70,168,0.1)',  color: '#d946a8' },
  { bg: 'rgba(8,145,178,0.1)',   color: '#0891b2' },
  { bg: 'rgba(217,119,6,0.1)',   color: '#d97706' },
  { bg: 'rgba(5,150,105,0.1)',   color: '#059669' },
  { bg: 'rgba(99,102,241,0.1)',  color: '#6366f1' },
];

const XP_PER_TASK = 10;
const XP_PER_STREAK_DAY = 5;
const LEVELS = [
  { name: 'Habit Seedling',  min: 0,    icon: '🌱' },
  { name: 'Habit Sprout',    min: 100,  icon: '🌿' },
  { name: 'Habit Explorer',  min: 300,  icon: '🧭' },
  { name: 'Habit Builder',   min: 600,  icon: '🏗️' },
  { name: 'Habit Champion',  min: 1000, icon: '🏅' },
  { name: 'Habit Master',    min: 1500, icon: '⚡' },
  { name: 'Habit Legend',    min: 2500, icon: '🏆' },
];
const ALL_BADGES = [
  { id: 'first_habit',  icon: '🎯', name: 'First Step',     desc: 'Created your first habit',  check: s => s.totalHabits >= 1 },
  { id: 'streak_7',     icon: '🔥', name: 'Week Warrior',   desc: '7-day streak',              check: s => s.bestStreak >= 7 },
  { id: 'streak_30',    icon: '💥', name: 'Month Master',   desc: '30-day streak',             check: s => s.bestStreak >= 30 },
  { id: 'tasks_10',     icon: '✅', name: 'Getting Started',desc: 'Completed 10 tasks',        check: s => s.totalDone >= 10 },
  { id: 'tasks_50',     icon: '🌟', name: 'Half Century',   desc: 'Completed 50 tasks',        check: s => s.totalDone >= 50 },
  { id: 'tasks_100',    icon: '💯', name: 'Century Club',   desc: 'Completed 100 tasks',       check: s => s.totalDone >= 100 },
  { id: 'habits_3',     icon: '🎪', name: 'Multi-Tracker',  desc: 'Tracking 3+ habits',        check: s => s.totalHabits >= 3 },
  { id: 'habits_5',     icon: '🚀', name: 'Power User',     desc: 'Tracking 5+ habits',        check: s => s.totalHabits >= 5 },
  { id: 'xp_500',       icon: '⚡', name: 'XP Hunter',      desc: 'Earned 500 XP',             check: s => s.xp >= 500 },
];

function getLevel(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.min) level = l; else break; }
  const idx  = LEVELS.indexOf(level);
  const next = LEVELS[idx + 1];
  const pct  = next ? Math.round(((xp - level.min) / (next.min - level.min)) * 100) : 100;
  return { ...level, next, pct, idx };
}

// ── Avatar SVG builder ──
function drawEyes(style, x, y) {
  switch(style) {
    case 0: return `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="white"/><circle cx="${x}" cy="${y}" r="3.5" fill="#1a1a2e"/><circle cx="${x+2}" cy="${y-1}" r="1" fill="white"/>`;
    case 1: return `<path d="M${x-6},${y+2} Q${x},${y-5} ${x+6},${y+2}" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round"/>`;
    case 2: return `<rect x="${x-8}" y="${y-4}" width="16" height="10" rx="4" fill="#1a1a2e" opacity=".85"/>`;
    case 3: return `<text x="${x}" y="${y+4}" text-anchor="middle" font-size="14">⭐</text>`;
    default: return '';
  }
}

function drawAccessory(style) {
  switch(style) {
    case 1: return `<rect x="30" y="72" width="28" height="20" rx="10" fill="none" stroke="#333" stroke-width="2.5"/><rect x="82" y="72" width="28" height="20" rx="10" fill="none" stroke="#333" stroke-width="2.5"/><line x1="58" y1="82" x2="82" y2="82" stroke="#333" stroke-width="2"/>`;
    case 2: return `<rect x="30" y="30" width="80" height="12" rx="4" fill="#1a1a2e"/><rect x="42" y="14" width="56" height="20" rx="6" fill="#1a1a2e"/>`;
    case 3: return `<path d="M38,38 L50,20 L70,32 L90,20 L102,38 Z" fill="#DAA520"/><circle cx="70" cy="34" r="4" fill="#FF4444"/>`;
    case 4: return `<path d="M28,80 Q28,42 70,42 Q112,42 112,80" fill="none" stroke="#333" stroke-width="4"/><rect x="20" y="78" width="16" height="24" rx="8" fill="#333"/><rect x="104" y="78" width="16" height="24" rx="8" fill="#333"/>`;
    default: return '';
  }
}

function buildAvatarSVG(av, size = 100) {
  const sc = SKINS[av.skin ?? 0];
  const hc = HAIRCS[av.hairc ?? 0];
  const hp = HAIR_SHAPES[av.hair ?? 0];
  const shirt = av.shirt ?? SHIRT_COLORS[0];
  const browColor = hc === '#2C1B18' ? '#2C1B18' : '#5a3e28';
  let inner = '';
  if (hp && av.hair !== 3) inner += `<path d="${hp}" fill="${hc}" opacity="0.95"/>`;
  inner += `<rect x="58" y="115" width="24" height="20" rx="4" fill="${sc}"/>`;
  inner += `<path d="M20,155 Q30,130 58,128 L82,128 Q110,130 120,155Z" fill="${shirt}" opacity=".9"/>`;
  inner += `<ellipse cx="70" cy="80" rx="42" ry="48" fill="${sc}"/>`;
  if (hp && (av.hair === 0 || av.hair === 2)) inner += `<path d="${hp}" fill="${hc}"/>`;
  inner += `<path d="M42,65 Q50,60 58,65" fill="none" stroke="${browColor}" stroke-width="2.5" stroke-linecap="round"/>`;
  inner += `<path d="M82,65 Q90,60 98,65" fill="none" stroke="${browColor}" stroke-width="2.5" stroke-linecap="round"/>`;
  inner += drawEyes(av.eyes ?? 0, 50, 78) + drawEyes(av.eyes ?? 0, 90, 78);
  inner += `<path d="M68,88 Q65,96 70,98 Q75,96 72,88" fill="none" stroke="${sc === '#FDDBB4' ? '#e8a87c' : '#7a4a2a'}" stroke-width="1.5" stroke-linecap="round"/>`;
  inner += `<path d="M56,108 Q70,118 84,108" fill="none" stroke="#c0696b" stroke-width="2.5" stroke-linecap="round"/>`;
  inner += drawAccessory(av.acc ?? 0);
  if (hp && (av.hair === 1 || av.hair === 4)) inner += `<path d="${hp}" fill="${hc}" opacity=".7"/>`;
  return `<svg width="${size}" height="${Math.round(size * 1.14)}" viewBox="0 0 140 160" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

const DEFAULT_AV = { skin: 0, hair: 0, hairc: 0, eyes: 0, acc: 0, shirt: 0 };

// ── Swatch button ──
function Swatch({ color, selected, onClick }) {
  return (
    <button className={`av-swatch ${selected ? 'sel' : ''}`}
      style={{ background: color }} onClick={onClick} />
  );
}

// ── Chip button ──
function Chip({ label, selected, onClick }) {
  return (
    <button className={`av-chip ${selected ? 'sel' : ''}`}
      onClick={onClick}>{label}</button>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [loading,    setLoading]    = useState(true);
  const [stats,      setStats]      = useState({});
  const [habitStats, setHabitStats] = useState([]);
  const [av,         setAv]         = useState(() => {
    const saved = localStorage.getItem('userAvatar');
    return saved ? JSON.parse(saved) : DEFAULT_AV;
  });
  const [avSaved,    setAvSaved]    = useState(false);

  const setAvKey = (key, val) => {
    setAvSaved(false);
    setAv(p => ({ ...p, [key]: val }));
  };

  const saveAvatar = () => {
    const toSave = { ...av, shirt: SHIRT_COLORS[av.shirt ?? 0] };
    localStorage.setItem('userAvatar', JSON.stringify(toSave));
    setAvSaved(true);
    setTimeout(() => setAvSaved(false), 2000);
  };

  useEffect(() => { if (user) fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const hRes = await getHabits(user.userId);
      const habits = hRes.data || [];
      let totalDone = 0, bestStreak = 0, totalTasks = 0;
      const weekMap = {};
      const hStats = [];

      for (const h of habits) {
        const tRes = await getTasks(h.habitId);
        const tasks = tRes.data || [];
        let hDone = 0, hBest = 0;
        for (const t of tasks) {
          totalTasks++;
          try {
            const lRes = await getLogs(t.taskId);
            const logs = lRes.data || [];
            const done = logs.filter(l => l.status === 'completed').length;
            hDone += done; totalDone += done;
            logs.filter(l => l.status === 'completed').forEach(l => {
              const ds = Array.isArray(l.date)
                ? `${l.date[0]}-${String(l.date[1]).padStart(2,'0')}-${String(l.date[2]).padStart(2,'0')}`
                : String(l.date).substring(0, 10);
              const d = new Date(ds + 'T00:00:00');
              const wk = `${d.getFullYear()}-W${Math.ceil(d.getDate() / 7)}`;
              weekMap[wk] = (weekMap[wk] || 0) + 1;
            });
          } catch {}
          try {
            const sRes = await getStreak(t.taskId);
            if ((sRes.data?.streak || 0) > hBest) hBest = sRes.data.streak;
          } catch {}
        }
        if (hBest > bestStreak) bestStreak = hBest;
        hStats.push({ habit: h, taskCount: tasks.length, done: hDone, streak: hBest });
      }

      const maxWeekDone = Math.max(0, ...Object.values(weekMap));
      const xp = (totalDone * XP_PER_TASK) + (bestStreak * XP_PER_STREAK_DAY);
      setStats({ totalDone, bestStreak, totalTasks, totalHabits: habits.length, maxWeekDone, xp });
      setHabitStats(hStats);
    } catch {}
    finally { setLoading(false); }
  };

  const iconOf  = n => ICONS[n.charCodeAt(0) % ICONS.length];
  const colorOf = n => CARD_COLORS[n.charCodeAt(0) % CARD_COLORS.length];

  const xp      = stats.xp || 0;
  const level   = getLevel(xp);
  const badges  = ALL_BADGES.map(b => ({ ...b, unlocked: b.check(stats) }));
  const unlocked = badges.filter(b => b.unlocked).length;

  const svgMarkup = buildAvatarSVG({ ...av, shirt: SHIRT_COLORS[av.shirt ?? 0] }, 110);

  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' })
    : null;

  return (
    <div className="page">
      <Navbar />
      <div className="container">

        {/* ── TOP: Avatar Builder + Info side by side ── */}
        <div className="prof-top animate-in">

          {/* Avatar Builder Card */}
          <div className="prof-avatar-card">
            <div className="prof-av-title">Your Avatar</div>

            {/* Live preview */}
            <div className="prof-av-preview">
              <div className="prof-av-ring"
                dangerouslySetInnerHTML={{ __html: svgMarkup }} />
              <div className="prof-av-username">{user?.name}</div>
              <div className="prof-av-level">{level.icon} {level.name}</div>
            </div>

            {/* Skin */}
            <div className="prof-av-section">
              <div className="prof-av-label">Skin Tone</div>
              <div className="prof-av-row">
                {SKINS.map((c, i) => (
                  <Swatch key={i} color={c} selected={av.skin === i} onClick={() => setAvKey('skin', i)} />
                ))}
              </div>
            </div>

            {/* Hair style */}
            <div className="prof-av-section">
              <div className="prof-av-label">Hair Style</div>
              <div className="prof-av-chips">
                {HAIR_LABELS.map((l, i) => (
                  <Chip key={i} label={l} selected={av.hair === i} onClick={() => setAvKey('hair', i)} />
                ))}
              </div>
            </div>

            {/* Hair color */}
            {av.hair !== 3 && (
              <div className="prof-av-section">
                <div className="prof-av-label">Hair Color</div>
                <div className="prof-av-row">
                  {HAIRCS.map((c, i) => (
                    <Swatch key={i} color={c} selected={av.hairc === i} onClick={() => setAvKey('hairc', i)} />
                  ))}
                </div>
              </div>
            )}

            {/* Eyes */}
            <div className="prof-av-section">
              <div className="prof-av-label">Eyes</div>
              <div className="prof-av-chips">
                {EYE_LABELS.map((l, i) => (
                  <Chip key={i} label={l} selected={av.eyes === i} onClick={() => setAvKey('eyes', i)} />
                ))}
              </div>
            </div>

            {/* Accessory */}
            <div className="prof-av-section">
              <div className="prof-av-label">Accessory</div>
              <div className="prof-av-chips">
                {ACC_LABELS.map((l, i) => (
                  <Chip key={i} label={l} selected={av.acc === i} onClick={() => setAvKey('acc', i)} />
                ))}
              </div>
            </div>

            {/* Shirt */}
            <div className="prof-av-section">
              <div className="prof-av-label">Shirt Color</div>
              <div className="prof-av-row">
                {SHIRT_COLORS.map((c, i) => (
                  <Swatch key={i} color={c} selected={av.shirt === i} onClick={() => setAvKey('shirt', i)} />
                ))}
              </div>
            </div>

            {/* Save */}
            <button className={`btn btn-primary prof-av-save ${avSaved ? 'saved' : ''}`}
              onClick={saveAvatar}>
              {avSaved ? '✓ Saved!' : 'Save Avatar'}
            </button>
          </div>

          {/* Profile Info + Stats */}
          <div className="prof-right">

            {/* Info card */}
            <div className="prof-info-card">
              <div className="prof-info-top">
                <div>
                  <div className="profile-name">{user?.name}</div>
                  <div className="profile-email">{user?.email}</div>
                  {joinDate && <div className="profile-badge" style={{ marginTop: 8 }}>🗓 Joined {joinDate}</div>}
                </div>
                <button className="btn btn-ghost btn-sm"
                  onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}>
                  Logout
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="prof-stats-grid">
              {[
                { icon: '✅', num: stats.totalDone   || 0, label: 'Tasks Done',   color: 'var(--green)'  },
                { icon: '🔥', num: stats.bestStreak  || 0, label: 'Best Streak',  color: 'var(--purple)' },
                { icon: '⚡', num: xp,                     label: 'Total XP',     color: 'var(--gold)'   },
                { icon: '🏅', num: `${unlocked}/${badges.length}`, label: 'Badges', color: 'var(--pink)' },
              ].map((s, i) => (
                <div key={i} className="prof-stat-card">
                  <div className="psc-icon">{s.icon}</div>
                  <div className="psc-num" style={{ color: s.color }}>{s.num}</div>
                  <div className="psc-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* XP Level Bar */}
            <div className="profile-section">
              <div className="profile-section-title">⚡ Level Progress</div>
              <div className="xp-level-row">
                <div className="xp-level-icon">{level.icon}</div>
                <div className="xp-level-body">
                  <div className="xp-level-top">
                    <span className="xp-level-name">{level.name}</span>
                    {level.next && (
                      <span className="xp-level-next">{level.next.icon} {level.next.name} in {level.next.min - xp} XP</span>
                    )}
                  </div>
                  <div className="xp-bar-wrap">
                    <div className="xp-bar">
                      <div className="xp-bar-fill" style={{ width: `${level.pct}%` }} />
                    </div>
                    <span className="xp-bar-label">{xp} XP</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Badges ── */}
        <div className="profile-section animate-in">
          <div className="profile-section-title">🏅 Badges — {unlocked}/{badges.length} Unlocked</div>
          <div className="badges-grid">
            {badges.map(b => (
              <div key={b.id} className={`badge-card ${b.unlocked ? 'unlocked' : 'locked'}`}>
                <div className="badge-icon">{b.unlocked ? b.icon : '🔒'}</div>
                <div className="badge-name">{b.name}</div>
                <div className="badge-desc">{b.desc}</div>
                {b.unlocked && <div className="badge-earned">✓ Earned</div>}
              </div>
            ))}
          </div>
        </div>

        {/* ── Habit Breakdown ── */}
        <div className="profile-section animate-in">
          <div className="profile-section-title">📊 Habit Breakdown</div>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : habitStats.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📭</div><p>No habits yet</p></div>
          ) : (
            <div className="profile-habit-list">
              {habitStats.map(({ habit, taskCount, done, streak }) => {
                const col  = colorOf(habit.habitName);
                const icon = iconOf(habit.habitName);
                const pct  = taskCount > 0 ? Math.round((done / taskCount) * 100) : 0;
                return (
                  <div key={habit.habitId} className="phb-row"
                    onClick={() => navigate(`/habit/${habit.habitId}`)}>
                    <div className="phb-icon" style={{ background: col.bg, color: col.color }}>{icon}</div>
                    <div className="phb-body">
                      <div className="phb-name">{habit.habitName}</div>
                      <div className="phb-bar-wrap">
                        <div className="phb-bar">
                          <div className="phb-bar-fill" style={{ width: `${pct}%`, background: col.color }} />
                        </div>
                        <span className="phb-pct" style={{ color: col.color }}>{pct}%</span>
                      </div>
                    </div>
                    <div className="phb-right">
                      <div className="phb-streak">🔥 {streak}</div>
                      <div className="phb-tasks">{done}/{taskCount} tasks</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}