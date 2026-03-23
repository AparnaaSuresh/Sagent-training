import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getHabits, createHabit, getTasks, getLogs, getUserById } from '../api/api';
import './Challenge.css';

/* ─── helpers ──────────────────────────────────────────────────── */
const nd = (val) => {
  if (!val) return null;
  if (typeof val === 'string') return val.substring(0, 10);
  if (Array.isArray(val))
    return `${val[0]}-${String(val[1]).padStart(2,'0')}-${String(val[2]).padStart(2,'0')}`;
  return String(val).substring(0, 10);
};

const TODAY = new Date().toISOString().split('T')[0];

const getLast7 = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

/* ─── CODE ENCODE / DECODE ──────────────────────────────────────*/
const encodeChallenge = ({ userId, habitId, habitName, frequency, userName }) => {
  const hn = (habitName || '').slice(0, 12).replace(/\|/g, '');
  const un = (userName  || '').slice(0, 12).replace(/\|/g, '');
  const fr = frequency === 'weekly' ? 'w' : 'd';
  const raw = [userId, habitId, hn, fr, un].join('|');
  return 'HBT-' + btoa(raw);
};

const decodeChallenge = (code) => {
  try {
    const trimmed = code.trim();
    const upper   = trimmed.toUpperCase();
    if (!upper.startsWith('HBT-')) return null;
    const b64  = trimmed.slice(4);
    const raw  = atob(b64);
    const parts = raw.split('|');
    if (parts.length < 5) return null;
    const [userId, habitId, habitName, fr, userName] = parts;
    return {
      userId:    parseInt(userId),
      habitId:   parseInt(habitId),
      habitName,
      frequency: fr === 'w' ? 'weekly' : 'daily',
      userName,
    };
  } catch {
    return null;
  }
};

/* ─── localStorage key scoped to current user ──────────────────*/
const storageKey = (userId) => `activeChallenges_${userId}`;

/* ─── Fetch stats for ONE specific habitName ────────────────── */
async function fetchPlayerData(userId, habitName) {
  const last7 = getLast7();
  let userName = `User ${userId}`;
  try { const r = await getUserById(userId); userName = r.data?.name || userName; } catch {}

  const hRes   = await getHabits(userId);
  const habits = (hRes.data || []).filter(
    h => h.habitName.trim().toLowerCase() === habitName.trim().toLowerCase()
  );

  let totalDone = 0, totalLogs = 0, bestStreak = 0, doneToday = false;
  const weekMap = {};
  last7.forEach(d => { weekMap[d] = false; });

  for (const habit of habits) {
    const tasks = (await getTasks(habit.habitId)).data || [];
    for (const task of tasks) {
      try {
        const logs = (await getLogs(task.taskId)).data || [];
        for (const log of logs) {
          const ds = nd(log.date);
          totalLogs++;
          if (log.status === 'completed') {
            totalDone++;
            if (ds === TODAY) doneToday = true;
            if (ds in weekMap) weekMap[ds] = true;
          }
        }
        let streak = 0;
        const doneSet = new Set(logs.filter(l => l.status === 'completed').map(l => nd(l.date)));
        const cur = new Date();
        while (true) {
          const ds = cur.toISOString().split('T')[0];
          if (doneSet.has(ds)) { streak++; cur.setDate(cur.getDate() - 1); } else break;
        }
        if (streak > bestStreak) bestStreak = streak;
      } catch {}
    }
  }

  const rate     = totalLogs > 0 ? Math.round((totalDone / totalLogs) * 100) : 0;
  const weekDone = Object.values(weekMap).filter(Boolean).length;
  return { userId, userName, habitName, totalDone, rate, bestStreak, doneToday, weekMap, weekDone };
}

/* ─── Auto-create habit if joiner doesn't have it ────────────── */
async function ensureHabit(userId, habitName, frequency) {
  const habits = (await getHabits(userId)).data || [];
  const exists = habits.some(h => h.habitName.trim().toLowerCase() === habitName.trim().toLowerCase());
  if (!exists) {
    await createHabit(userId, { habitName, frequency: frequency || 'daily' });
    return true;
  }
  return false;
}

/* ─── Player Card ──────────────────────────────────────────────*/
function PlayerCard({ data, isMe, winning }) {
  const last7     = getLast7();
  const dayLabels = ['S','M','T','W','T','F','S'];
  return (
    <div className={`ch-player-card ${isMe?'me':'them'} ${winning?'winning':''}`}>
      {winning && <div className="ch-winning-badge">👑 WINNING</div>}
      <div className="ch-player-header">
        <div className="ch-player-avatar">{data.userName?.[0]?.toUpperCase()}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div className="ch-player-name">
            {data.userName}{isMe && <span className="ch-you-tag">You</span>}
          </div>
          <div className="ch-player-habit">{data.habitName}</div>
        </div>
        <div className={`ch-today-dot ${data.doneToday?'done':'pending'}`}
          title={data.doneToday ? 'Done today ✓' : 'Not done yet'} />
      </div>
      <div className="ch-stats-row">
        <div className="ch-stat"><div className="ch-stat-num">{data.bestStreak}</div><div className="ch-stat-label">🔥 Streak</div></div>
        <div className="ch-stat"><div className="ch-stat-num">{data.rate}%</div><div className="ch-stat-label">📈 Rate</div></div>
        <div className="ch-stat"><div className="ch-stat-num">{data.weekDone}/7</div><div className="ch-stat-label">📅 This Week</div></div>
      </div>
      <div className="ch-week-row">
        {last7.map((day, i) => (
          <div key={i} className="ch-week-col">
            <div className={`ch-week-cell ${data.weekMap[day]?'done':'empty'} ${day===TODAY?'today':''}`} />
            <div className="ch-week-label">{dayLabels[new Date(day+'T00:00:00').getDay()]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Trash Talk ───────────────────────────────────────────────*/
function TrashTalk({ me, them }) {
  if (!me || !them) return null;
  const msgs = [];
  if (me.bestStreak > them.bestStreak) msgs.push(`🔥 Your streak (${me.bestStreak}) crushes theirs (${them.bestStreak})!`);
  else if (them.bestStreak > me.bestStreak) msgs.push(`😤 They're on a ${them.bestStreak}-day streak. You're at ${me.bestStreak}. Step it up!`);
  if (me.doneToday && !them.doneToday) msgs.push(`✅ You've done it today. They haven't. Stay ahead!`);
  else if (!me.doneToday && them.doneToday) msgs.push(`⚠️ They completed today's habit. You haven't yet!`);
  if (me.weekDone > them.weekDone) msgs.push(`📅 You've done ${me.weekDone} days this week vs their ${them.weekDone}. Dominating!`);
  else if (them.weekDone > me.weekDone) msgs.push(`😰 They completed ${them.weekDone} days this week. You only did ${me.weekDone}.`);
  if (me.rate > them.rate) msgs.push(`📈 Your completion rate (${me.rate}%) beats theirs (${them.rate}%)!`);
  if (!msgs.length) msgs.push(`⚔️ It's neck and neck! Don't blink.`);
  return (
    <div className="ch-trash-talk">
      {msgs.map((m, i) => <div key={i} className="ch-trash-line">{m}</div>)}
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────*/
export default function Challenge() {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || 'null');

  const [tab,              setTab]              = useState('create');
  const [myHabits,         setMyHabits]         = useState([]);
  const [selectedHabitId,  setSelectedHabitId]  = useState('');
  const [myCode,           setMyCode]           = useState('');
  const [joinCode,         setJoinCode]         = useState('');
  const [joinError,        setJoinError]        = useState('');
  const [joinPreview,      setJoinPreview]      = useState(null);
  const [loading,          setLoading]          = useState(false);
  const [meData,           setMeData]           = useState(null);
  const [themData,         setThemData]         = useState(null);
  const [activeChallenges, setActiveChallenges] = useState([]);
  const [copied,           setCopied]           = useState(false);
  const [autoCreated,      setAutoCreated]      = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchMyHabits();
    // Load only THIS user's challenges (scoped by userId)
    setActiveChallenges(JSON.parse(localStorage.getItem(storageKey(user.userId)) || '[]'));
    return () => clearInterval(intervalRef.current);
  }, []);

  const fetchMyHabits = async () => {
    try {
      const res = await getHabits(user.userId);
      const habits = res.data || [];
      setMyHabits(habits);
      if (habits.length) setSelectedHabitId(habits[0].habitId);
    } catch {}
  };

  // ✅ FIX: Save challenge to creator's active list immediately on code generation
  const generateCode = () => {
    const habit = myHabits.find(h => String(h.habitId) === String(selectedHabitId));
    if (!habit) return;

    const code = encodeChallenge({
      userId:    user.userId,
      habitId:   habit.habitId,
      habitName: habit.habitName,
      frequency: habit.frequency || 'daily',
      userName:  user.name || `User${user.userId}`,
    });
    setMyCode(code);

    // Save to creator's active challenges so they see it in the Active tab
    const saved = JSON.parse(localStorage.getItem(storageKey(user.userId)) || '[]');
    const alreadySaved = saved.find(c => c.code === code);
    if (!alreadySaved) {
      saved.push({
        code,
        habitName:      habit.habitName,
        opponentUserId: null,                    // unknown until opponent joins
        opponentName:   'Waiting for opponent...',
        joinedAt:       TODAY,
        isCreator:      true,                    // flag: this user created the challenge
      });
      localStorage.setItem(storageKey(user.userId), JSON.stringify(saved));
      setActiveChallenges(saved);
    }
  };

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(myCode); }
    catch {
      const el = document.createElement('textarea');
      el.value = myCode; document.body.appendChild(el);
      el.select(); document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const previewCode = () => {
    const code = joinCode.trim();
    if (!code) return;
    const decoded = decodeChallenge(code);
    if (!decoded) {
      setJoinPreview(null);
      setJoinError('Invalid code. Ask your friend to regenerate it from Create Code tab.');
    } else {
      setJoinError('');
      const alreadyHave = myHabits.some(
        h => h.habitName.trim().toLowerCase() === decoded.habitName.trim().toLowerCase()
      );
      setJoinPreview({ ...decoded, alreadyHave });
    }
  };

  const handleJoin = async () => {
    setJoinError('');
    const code = joinCode.trim();
    if (!code) { setJoinError('Enter a challenge code'); return; }
    const decoded = decodeChallenge(code);
    if (!decoded) { setJoinError('Invalid code. Ask your friend to regenerate it.'); return; }
    if (String(decoded.userId) === String(user.userId)) {
      setJoinError("That's your own challenge code! Share it with a friend.");
      return;
    }
    setLoading(true); setAutoCreated(false);
    try {
      const { habitName, frequency, userId: oppId, userName: oppName } = decoded;
      const created = await ensureHabit(user.userId, habitName, frequency);
      if (created) setAutoCreated(true);

      const [me, them] = await Promise.all([
        fetchPlayerData(user.userId, habitName),
        fetchPlayerData(oppId,       habitName),
      ]);
      setMeData(me); setThemData(them);

      // Save to joiner's active challenges (scoped to their userId)
      const saved   = JSON.parse(localStorage.getItem(storageKey(user.userId)) || '[]');
      const codeKey = code.trim();
      if (!saved.find(c => c.code === codeKey)) {
        saved.push({
          code:           codeKey,
          habitName,
          opponentUserId: oppId,
          opponentName:   oppName || `User ${oppId}`,
          joinedAt:       TODAY,
          isCreator:      false,
        });
        localStorage.setItem(storageKey(user.userId), JSON.stringify(saved));
        setActiveChallenges(saved);
      }
      setTab('active');
      startPolling(user.userId, oppId, habitName);
    } catch {
      setJoinError('Failed to load battle data. Check the code and try again.');
    }
    setLoading(false);
  };

  // ✅ FIX: Handle both creator (opponentUserId = null) and joiner
  const loadChallenge = async (c) => {
    // Creator whose opponent hasn't joined yet — can't show battle
    if (c.isCreator && !c.opponentUserId) {
      alert("Your opponent hasn't joined yet! Share your code and wait for them to join.");
      return;
    }

    setLoading(true);
    try {
      const oppId = c.opponentUserId;
      const [me, them] = await Promise.all([
        fetchPlayerData(user.userId, c.habitName),
        fetchPlayerData(oppId,       c.habitName),
      ]);
      setMeData(me); setThemData(them); setTab('active');
      startPolling(user.userId, oppId, c.habitName);
    } catch {}
    setLoading(false);
  };

  const startPolling = (myId, oppId, habitName) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(async () => {
      try {
        const [m, t] = await Promise.all([fetchPlayerData(myId, habitName), fetchPlayerData(oppId, habitName)]);
        setMeData(m); setThemData(t);
      } catch {}
    }, 60000);
  };

  const removeChallenge = (code) => {
    const saved = JSON.parse(localStorage.getItem(storageKey(user.userId)) || '[]').filter(c => c.code !== code);
    localStorage.setItem(storageKey(user.userId), JSON.stringify(saved));
    setActiveChallenges(saved);
    setMeData(null); setThemData(null);
    clearInterval(intervalRef.current);
  };

  const backToList = () => { setMeData(null); setThemData(null); clearInterval(intervalRef.current); };

  const meWinning = meData && themData && (
    meData.bestStreak > themData.bestStreak ||
    (meData.bestStreak === themData.bestStreak && meData.rate >= themData.rate)
  );

  const selectedHabitName = myHabits.find(h => String(h.habitId) === String(selectedHabitId))?.habitName || '';

  return (
    <div className="page">
      <Navbar />
      <div className="container">

        <div className="page-header animate-in">
          <div>
            <div className="page-title">⚔️ Challenge</div>
            <div className="page-sub">Battle a friend on the same habit!</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="ch-tabs animate-in">
          <button className={`ch-tab ${tab==='create'?'active':''}`} onClick={() => setTab('create')}>🎯 Create Code</button>
          <button className={`ch-tab ${tab==='join'?'active':''}`}   onClick={() => setTab('join')}>🔗 Join Challenge</button>
          {activeChallenges.length > 0 && (
            <button className={`ch-tab ${tab==='active'?'active':''}`}
              onClick={() => { backToList(); setTab('active'); }}>
              ⚔️ Active ({activeChallenges.length})
            </button>
          )}
        </div>

        {/* ══ CREATE ══ */}
        {tab === 'create' && (
          <div className="ch-panel animate-in">
            <div className="ch-panel-title">Generate your challenge code</div>
            <div className="ch-panel-sub">
              Pick <strong>one habit</strong> → share the short code → your friend joins →
              if they don't have that habit it's created automatically!
            </div>

            <div className="field" style={{ marginTop: 20 }}>
              <label className="label">Select Habit to Challenge On</label>
              <select className="input" value={selectedHabitId}
                onChange={e => { setSelectedHabitId(e.target.value); setMyCode(''); }}>
                {myHabits.length === 0
                  ? <option>No habits yet — create one on Dashboard first</option>
                  : myHabits.map(h => <option key={h.habitId} value={h.habitId}>{h.habitName}</option>)
                }
              </select>
            </div>

            <button className="btn btn-primary" style={{ marginTop: 8 }}
              onClick={generateCode} disabled={!selectedHabitId || !myHabits.length}>
              ⚡ Generate Code
            </button>

            {myCode && (
              <div className="ch-code-display">
                <div className="ch-code-label">Challenge Code — "{selectedHabitName}"</div>
                <div className="ch-code-value">{myCode}</div>
                <button className="ch-copy-btn" onClick={copyCode}>
                  {copied ? '✓ Copied!' : '📋 Copy Code'}
                </button>
                {copied && <div className="ch-copied-toast">✓ Copied to clipboard!</div>}
                <div className="ch-code-hint">
                  Send this to your friend. When they join, both of you battle on{' '}
                  <strong style={{ color: 'var(--orange)' }}>"{selectedHabitName}"</strong> only.
                  Their habit is auto-created if they don't have it yet.
                </div>
              </div>
            )}

            <div className="ch-how">
              <div className="ch-how-title">How it works</div>
              <div className="ch-how-steps">
                <div className="ch-how-step"><span className="ch-how-num">1</span>Pick one habit → generate code</div>
                <div className="ch-how-step"><span className="ch-how-num">2</span>Send code to your friend (WhatsApp, text…)</div>
                <div className="ch-how-step"><span className="ch-how-num">3</span>They paste it → habit auto-created if missing</div>
                <div className="ch-how-step"><span className="ch-how-num">4</span>Live scoreboard starts — refreshes every 60s</div>
              </div>
            </div>
          </div>
        )}

        {/* ══ JOIN ══ */}
        {tab === 'join' && (
          <div className="ch-panel animate-in">
            <div className="ch-panel-title">Join a friend's challenge</div>
            <div className="ch-panel-sub">Paste the code your friend shared with you</div>

            <div className="ch-join-row">
              <input className="input ch-join-input"
                placeholder="e.g. HBT-NXwxfGV4..."
                value={joinCode}
                onChange={e => { setJoinCode(e.target.value); setJoinPreview(null); setJoinError(''); }}
                onBlur={previewCode}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
              />
              <button className="btn ch-preview-btn" onClick={previewCode}>👁 Preview</button>
            </div>

            {joinPreview && !joinError && (
              <div className="ch-join-preview">
                <div className="ch-join-preview-row">
                  <span className="ch-join-preview-label">Challenger</span>
                  <span className="ch-join-preview-val">{joinPreview.userName}</span>
                </div>
                <div className="ch-join-preview-row">
                  <span className="ch-join-preview-label">Habit</span>
                  <span className="ch-join-preview-val" style={{ color:'var(--orange)' }}>{joinPreview.habitName}</span>
                </div>
                <div className="ch-join-preview-row">
                  <span className="ch-join-preview-label">Frequency</span>
                  <span className="ch-join-preview-val">{joinPreview.frequency}</span>
                </div>
                <div className={`ch-join-preview-note ${joinPreview.alreadyHave?'have':'create'}`}>
                  {joinPreview.alreadyHave
                    ? `✅ You already have "${joinPreview.habitName}" — battle starts immediately!`
                    : `✨ You don't have "${joinPreview.habitName}" — it will be auto-created when you join!`
                  }
                </div>
              </div>
            )}

            {joinError && <div className="error-msg" style={{ marginTop:12 }}>{joinError}</div>}

            <button className="btn btn-primary" style={{ marginTop:16 }}
              onClick={handleJoin} disabled={loading || !joinCode.trim()}>
              {loading ? '⏳ Starting Battle...' : '⚔️ Start Battle'}
            </button>

            {autoCreated && (
              <div className="ch-auto-created">
                🌱 Habit auto-created on your account — you're both on equal footing!
              </div>
            )}
          </div>
        )}

        {/* ══ ACTIVE LIST ══ */}
        {tab === 'active' && !meData && (
          <div className="ch-panel animate-in">
            <div className="ch-panel-title">Your active challenges</div>
            {activeChallenges.length === 0
              ? <div className="empty-state"><div className="empty-icon">⚔️</div><p>No active challenges yet. Join one!</p></div>
              : (
                <div className="ch-challenge-list">
                  {activeChallenges.map(c => (
                    <div key={c.code} className="ch-challenge-item">
                      <div>
                        <div className="ch-challenge-code">
                          vs {c.opponentName}
                          {/* ✅ Show waiting badge for creator whose opponent hasn't joined yet */}
                          {c.isCreator && !c.opponentUserId && (
                            <span className="ch-waiting-badge">⏳ Waiting for opponent</span>
                          )}
                        </div>
                        <div className="ch-challenge-since">
                          🏃 <strong style={{ color:'var(--orange)' }}>{c.habitName}</strong>{' · '}
                          {c.isCreator ? 'Created' : 'Joined'} {c.joinedAt}
                        </div>
                      </div>
                      <div style={{ display:'flex', gap:8 }}>
                        {/* Only show View Battle button once opponent is known */}
                        {(!c.isCreator || c.opponentUserId) ? (
                          <button className="btn btn-primary btn-sm" onClick={() => loadChallenge(c)} disabled={loading}>
                            {loading ? '...' : '⚔️ View Battle'}
                          </button>
                        ) : (
                          <button className="btn btn-secondary btn-sm" disabled>
                            ⏳ Awaiting opponent
                          </button>
                        )}
                        <button className="btn btn-danger btn-sm" onClick={() => removeChallenge(c.code)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* ══ BATTLE VIEW ══ */}
        {tab === 'active' && meData && themData && (
          <div className="animate-in">
            <div className="ch-live-bar">
              <span className="ch-live-dot" />
              <span>Live Battle — refreshes every 60 seconds</span>
              <button className="ch-back-btn" onClick={backToList}>← Back</button>
            </div>

            <div className="ch-habit-banner">
              🏃 Both competing on: <strong style={{ color:'var(--orange)' }}>{meData.habitName}</strong>
            </div>

            <div className={`ch-winner-banner ${meWinning?'you-win':'they-win'}`}>
              {meWinning
                ? `🏆 You're currently winning! Keep it up, ${meData.userName}!`
                : `😤 ${themData.userName} is ahead! Time to grind!`
              }
            </div>

            <div className="ch-battle-grid">
              <PlayerCard data={meData}   isMe={true}  winning={meWinning}  />
              <div className="ch-vs-divider"><div className="ch-vs-circle">VS</div></div>
              <PlayerCard data={themData} isMe={false} winning={!meWinning} />
            </div>

            <TrashTalk me={meData} them={themData} />

            <div className="ch-compare-table animate-in">
              <div className="ch-compare-title">📊 Head to Head</div>
              {[
                { label:'🔥 Best Streak',     me:meData.bestStreak, them:themData.bestStreak, unit:'days' },
                { label:'📈 Completion Rate', me:meData.rate,       them:themData.rate,       unit:'%'   },
                { label:'✅ Total Done',       me:meData.totalDone,  them:themData.totalDone,  unit:''    },
                { label:'📅 Days This Week',  me:meData.weekDone,   them:themData.weekDone,   unit:'/7'  },
              ].map((row, i) => (
                <div key={i} className="ch-compare-row">
                  <div className={`ch-compare-val ${row.me>row.them?'winner':''}`}>{row.me}{row.unit}</div>
                  <div className="ch-compare-label">{row.label}</div>
                  <div className={`ch-compare-val right ${row.them>row.me?'winner':''}`}>{row.them}{row.unit}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}