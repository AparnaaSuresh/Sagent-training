import React, { useState, useRef, useEffect } from 'react';
import { getHabits, getTasks, getLogs, getStreak, getUserHistory } from '../api/api';
import './Chatbot.css';

const GEMINI_API_KEY = 'AIzaSyAc5Rq-0wfqRjlL75jZMWXgcoSP09yKL2w'; 

const nd = (val) => {
  if (!val) return null;
  if (typeof val === 'string') return val.substring(0, 10);
  if (Array.isArray(val)) {
    const [y, m, d] = val;
    return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  }
  return String(val).substring(0, 10);
};

const TODAY = (() => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
})();

function calcCurrentStreak(logs) {
  const doneSet = new Set(
    (logs || []).filter(l => l.status === 'completed').map(l => nd(l.date))
  );
  let streak = 0;
  const [ty, tm, td] = TODAY.split('-').map(Number);
  let cur = new Date(ty, tm - 1, td);
  while (true) {
    const ds = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`;
    if (doneSet.has(ds)) { streak++; cur.setDate(cur.getDate() - 1); }
    else break;
  }
  return streak;
}

function calcBestStreak(logs) {
  const sorted = [...new Set(
    (logs || []).filter(l => l.status === 'completed').map(l => nd(l.date))
  )].filter(Boolean).sort();
  if (!sorted.length) return 0;
  let best = 1, cur = 1;
  for (let i = 1; i < sorted.length; i++) {
    const [ay, am, ad] = sorted[i - 1].split('-').map(Number);
    const [by, bm, bd] = sorted[i].split('-').map(Number);
    const diff = (new Date(by, bm - 1, bd) - new Date(ay, am - 1, ad)) / 86400000;
    cur = diff === 1 ? cur + 1 : 1;
    if (cur > best) best = cur;
  }
  return best;
}

async function fetchHabitContext(userId) {
  try {
    const habitsRes = await getHabits(userId);
    const habits = habitsRes.data || [];

    let historyLogs = [];
    try {
      const histRes = await getUserHistory(userId);
      historyLogs = histRes.data || [];
    } catch {}

    const habitDetails = [];

    for (const habit of habits) {
      let tasks = [];
      try {
        const tRes = await getTasks(habit.habitId);
        tasks = tRes.data || [];
      } catch {}

      const taskDetails = [];
      let habitTotalDone = 0, habitTotalSkipped = 0, habitTotalMissed = 0;
      let habitBestStreak = 0, habitCurrentStreak = 0;

      for (const task of tasks) {
        let logs = [];
        try {
          const lRes = await getLogs(task.taskId);
          logs = lRes.data || [];
        } catch {}
        try {
          await getStreak(task.taskId);
        } catch {}

        const done    = logs.filter(l => l.status === 'completed').length;
        const skipped = logs.filter(l => l.status === 'skipped').length;
        const best    = calcBestStreak(logs);
        const current = calcCurrentStreak(logs);

        habitTotalDone    += done;
        habitTotalSkipped += skipped;
        habitBestStreak    = Math.max(habitBestStreak, best);
        habitCurrentStreak = Math.max(habitCurrentStreak, current);

        const startDate = nd(task.startDate) || nd(task.dueDate);
        const endDate   = nd(task.endDate)   || nd(task.dueDate);
        let totalExpected = logs.length;
        if (startDate && endDate) {
          const s = new Date(startDate), e = new Date(endDate < TODAY ? endDate : TODAY);
          totalExpected = Math.max(0, Math.floor((e - s) / 86400000) + 1);
        }
        const missed = Math.max(0, totalExpected - done - skipped);
        habitTotalMissed += missed;

        taskDetails.push(
          `  • Task "${task.taskTitle || task.title || task.taskId}" | ` +
          `Status: ${task.status} | ` +
          `Range: ${startDate || '?'} → ${endDate || '?'} | ` +
          `Done: ${done} | Skipped: ${skipped} | Missed: ${missed} | ` +
          `Current streak: ${current} | Best streak: ${best}`
        );
      }

      const completionRate = (habitTotalDone + habitTotalSkipped + habitTotalMissed) > 0
        ? Math.round((habitTotalDone / (habitTotalDone + habitTotalSkipped + habitTotalMissed)) * 100)
        : 0;

      habitDetails.push(
        `\nHABIT: "${habit.habitName}" | Frequency: ${habit.frequency} | ` +
        `Tasks: ${tasks.length} | Done: ${habitTotalDone} | Skipped: ${habitTotalSkipped} | ` +
        `Missed: ${habitTotalMissed} | Completion rate: ${completionRate}% | ` +
        `Current streak: ${habitCurrentStreak} days | Best streak: ${habitBestStreak} days\n` +
        taskDetails.join('\n')
      );
    }

    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const dayLogs = historyLogs.filter(l => nd(l.date) === ds);
      const done    = dayLogs.filter(l => l.status === 'completed').length;
      const skipped = dayLogs.filter(l => l.status === 'skipped').length;
      last7.push(`  ${ds}: ${done} done, ${skipped} skipped`);
    }

    const sorted = [...habits].map((h, idx) => {
      const detail = habitDetails[idx] || '';
      const match  = detail.match(/Completion rate: (\d+)%/);
      return { name: h.habitName, rate: match ? parseInt(match[1]) : 0 };
    }).sort((a, b) => a.rate - b.rate);

    const weakest   = sorted[0];
    const strongest = sorted[sorted.length - 1];

    return `
You are a smart, friendly habit coach assistant inside the HabitTracker app.
Today's date: ${TODAY}
User has ${habits.length} habit(s) total.

${habitDetails.join('\n---\n')}

LAST 7 DAYS ACTIVITY:
${last7.join('\n')}

WEAKEST HABIT: "${weakest?.name}" (${weakest?.rate}% completion)
STRONGEST HABIT: "${strongest?.name}" (${strongest?.rate}% completion)

YOUR ROLE:
- Analyze the user's habit data and give personalized, data-driven recommendations.
- Be encouraging but honest — mention what's going well AND what needs work.
- When recommending, reference actual habit names, streaks, and completion rates from the data above.
- If a habit has a low completion rate, suggest strategies: time blocking, smaller task sizes, linking habits together, etc.
- If they ask for best time to do a habit, suggest morning routines for discipline-based habits.
- Keep replies concise, friendly, and actionable. Use emojis sparingly.
- If the user asks what to focus on today, look at which habits have been missed most recently.
- Do NOT make up data — only use what's provided above.
-Do NOT use markdown formatting like **, *, ##, or bullet symbols. Write in plain conversational text only.
    `;
  } catch (err) {
    console.error('Context fetch error:', err);
    return `You are a habit coach assistant. The user's habit data could not be loaded right now. Offer general habit-building advice.`;
  }
}

const QUICK_QUESTIONS = [
  ' How am I doing overall?',
  ' What should I focus on today?',
  ' Which habit am I best at?',
  ' Which habit needs most work?',
  ' How can I build a longer streak?',
];

export default function Chatbot() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: `👋 Hi${user?.name ? ` ${user.name}` : ''}! I'm your Habit Coach.\n\nI can look at your actual habit data and give you personalised advice on:\n📊 Your progress & completion rates\n🔥 How to build longer streaks\n⚠️ Which habits need attention\n💡 What to focus on today\n\nAsk me anything!`
    }
  ]);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [contextCache, setContextCache] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && !contextCache && user?.userId) {
      fetchHabitContext(user.userId).then(ctx => setContextCache(ctx));
    }
  }, [open]);

  const sendMessage = async (text) => {
    const userMsg = (text || input).trim();
    if (!userMsg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const context = contextCache || await fetchHabitContext(user?.userId);
      if (!contextCache) setContextCache(context);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY,
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${context}\n\nUser message: ${userMsg}` }]
              }
            ],
            generationConfig: {
              temperature: 0.75,
              maxOutputTokens: 400,
            }
          })
        }
      );

      if (!response.ok) {
        const err = await response.json();
        setMessages(prev => [...prev, {
          role: 'bot',
          text: `❌ API Error: ${err?.error?.message || 'Something went wrong. Please try again.'}`
        }]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
        || "I couldn't generate a response. Please try again!";

      setMessages(prev => [...prev, { role: 'bot', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: `❌ Error: ${err.message}`
      }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleQuick = (q) => {
    setInput(q);
    sendMessage(q);
  };

  const handleRefresh = () => {
    setContextCache(null);
    if (user?.userId) {
      fetchHabitContext(user.userId).then(ctx => setContextCache(ctx));
    }
  };

  return (
    <>
      <button className="cht-toggle" onClick={() => setOpen(!open)} title="Habit Coach">
        {open ? '✕' : '🤖'}
      </button>

      {open && (
        <div className="cht-window">
          <div className="cht-header">
            <div className="cht-header-left">
              <div className="cht-avatar">🤖</div>
              <div>
                <div className="cht-name">Habit Coach</div>
                <div className="cht-status">
                  <span className="cht-dot" />
                  {contextCache ? 'Data loaded' : 'Loading your data...'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="cht-icon-btn" onClick={handleRefresh} title="Refresh data">↻</button>
              <button className="cht-icon-btn" onClick={() => setOpen(false)}>✕</button>
            </div>
          </div>

          <div className="cht-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`cht-msg ${msg.role}`}>
                {msg.role === 'bot' && <div className="cht-msg-avatar">🤖</div>}
                <div className="cht-bubble">
                  {msg.text.split('\n').map((line, j) => (
                    <span key={j}>{line}{j < msg.text.split('\n').length - 1 && <br />}</span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="cht-msg bot">
                <div className="cht-msg-avatar">🤖</div>
                <div className="cht-bubble cht-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="cht-quick">
              <div className="cht-quick-label">Quick questions</div>
              {QUICK_QUESTIONS.map((q, i) => (
                <button key={i} className="cht-quick-btn" onClick={() => handleQuick(q)}>
                  {q}
                </button>
              ))}
            </div>
          )}

          <div className="cht-input-area">
            <input
              className="cht-input"
              placeholder="Ask your habit coach..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              disabled={loading}
            />
            <button
              className="cht-send"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}