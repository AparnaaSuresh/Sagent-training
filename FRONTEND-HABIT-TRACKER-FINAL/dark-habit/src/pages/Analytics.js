import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getHabits, getTasks, getLogs } from '../api/api';
import './Analytics.css';

const CARD_COLORS = [
  '#7c3aed','#d946a8','#0891b2','#d97706','#059669','#6366f1','#f07800','#dc2626',
];
const colorOf = (name) => CARD_COLORS[name.charCodeAt(0) % CARD_COLORS.length];

const nd = (val) => {
  if (!val) return null;
  if (typeof val === 'string') return val.substring(0, 10);
  if (Array.isArray(val)) {
    const year  = val[0];
    const month = String(val[1]).padStart(2, '0');
    const day   = String(val[2]).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if (typeof val === 'object' && val.year) {
    return `${val.year}-${String(val.monthValue).padStart(2,'0')}-${String(val.dayOfMonth).padStart(2,'0')}`;
  }
  return String(val).substring(0, 10);
};

const getLast30 = () => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
};

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function Analytics() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [loading, setLoading]      = useState(true);
  const [habits,  setHabits]       = useState([]);
  const [dailyData,  setDailyData] = useState([]);
  const [dayOfWeek,  setDayOfWeek] = useState(Array(7).fill(0));
  const [habitComp,  setHabitComp] = useState([]);
  const [totals,     setTotals]    = useState({ done: 0, skipped: 0, missed: 0, rate: 0 });

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const hRes = await getHabits(user.userId);
      const habits = hRes.data || [];
      setHabits(habits);

      const last30 = getLast30();
      const dayMap = {};
      last30.forEach(d => { dayMap[d] = { done: 0, total: 0 }; });

      const dowDone  = Array(7).fill(0);
      const dowTotal = Array(7).fill(0);

      let grandDone = 0, grandSkipped = 0;
      const hComp = [];

      for (const habit of habits) {
        const col = colorOf(habit.habitName);
        const tRes = await getTasks(habit.habitId);
        const tasks = tRes.data || [];
        let hDone = 0, hTotal = 0;

        for (const task of tasks) {
          try {
            const lRes = await getLogs(task.taskId);
            const logs = lRes.data || [];

            for (const log of logs) {
              const ds = nd(log.date);
              if (!ds) continue;
              const dow = new Date(ds + 'T00:00:00').getDay();

              if (log.status === 'completed') {
                grandDone++;
                hDone++;
                if (dayMap[ds]) {
                  dayMap[ds].done++;
                  dayMap[ds].total++;
                }
                dowDone[dow]++;
              } else if (log.status === 'skipped') {
                grandSkipped++;
                if (dayMap[ds]) dayMap[ds].total++;
              }
              dowTotal[dow]++;
              hTotal++;
            }
          } catch (e) {
            console.error('Error fetching logs for task', task.taskId, e);
          }
        }

        const pct = hTotal > 0 ? Math.round((hDone / hTotal) * 100) : 0;
        hComp.push({ name: habit.habitName, pct, color: col, done: hDone, total: hTotal });
      }

      const grandRate = (grandDone + grandSkipped) > 0
        ? Math.round((grandDone / (grandDone + grandSkipped)) * 100) : 0;

      setDailyData(last30.map(d => ({ date: d, ...dayMap[d] })));
      setDayOfWeek(dowDone.map((d, i) => dowTotal[i] > 0 ? Math.round((d / dowTotal[i]) * 100) : 0));
      setHabitComp(hComp.sort((a, b) => b.pct - a.pct));
      setTotals({ done: grandDone, skipped: grandSkipped, missed: 0, rate: grandRate });

    } catch (e) {
      console.error('fetchAll error:', e);
    } finally {
      setLoading(false);
    }
  };

  const maxDaily = Math.max(...dailyData.map(d => d.done), 1);
  const maxDow   = Math.max(...dayOfWeek, 1);

  return (
    <div className="page">
      <Navbar />
      <div className="container">

        <div className="page-header animate-in">
          <div>
            <div className="page-title">Analytics</div>
            <div className="page-sub">Your habit performance at a glance</div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="an-summary animate-in">
          {[
            { icon: '✅', val: totals.done,       label: 'Total Completed', color: 'var(--green)'  },
            { icon: '⏭',  val: totals.skipped,    label: 'Total Skipped',   color: 'var(--gold)'   },
            { icon: '📈', val: `${totals.rate}%`, label: 'Completion Rate', color: 'var(--purple)' },
            { icon: '✨', val: habits.length,      label: 'Active Habits',   color: 'var(--teal)'   },
          ].map((s, i) => (
            <div key={i} className="an-summary-card" style={{ '--card-color': s.color }}>
              <div className="an-sum-icon">{s.icon}</div>
              <div className="an-sum-val" style={{ color: s.color }}>{s.val}</div>
              <div className="an-sum-label">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? <div className="loading">Loading analytics...</div> : (
          <>
            {/* 30-day bar chart */}
            <div className="an-card animate-in">
              <div className="an-card-title">📅 Daily Completions — Last 30 Days</div>
              <div className="an-bar-chart">
                {dailyData.map((d, i) => {
                  const h = d.done > 0 ? Math.max(Math.round((d.done / maxDaily) * 100), 6) : 2;
                  const day = new Date(d.date + 'T00:00:00').getDate();
                  const isToday = d.date === new Date().toISOString().split('T')[0];
                  return (
                    <div key={i} className="an-bar-col" title={`${d.date}: ${d.done} done`}>
                      <div className="an-bar-track">
                        <div
                          className="an-bar-fill"
                          style={{
                            height: `${h}%`,
                            background: isToday ? '#f97316' : 'rgba(249,115,22,0.55)'
                          }}
                        />
                      </div>
                      {(i % 5 === 0 || isToday) && (
                        <div className="an-bar-label" style={{ color: isToday ? '#f97316' : '' }}>
                          {day}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Day of week + Habit comparison */}
            <div className="an-row animate-in">
              <div className="an-card" style={{ flex: 1 }}>
                <div className="an-card-title">📆 Best Days of the Week</div>
                <div className="an-dow-chart">
                  {DAY_NAMES.map((name, i) => {
                    const pct  = dayOfWeek[i];
                    const barH = pct > 0 ? Math.max(Math.round((pct / maxDow) * 100), 6) : 2;
                    const best = pct > 0 && pct === Math.max(...dayOfWeek);
                    return (
                      <div key={i} className="an-dow-col">
                        <div className="an-dow-pct">{pct > 0 ? `${pct}%` : ''}</div>
                        <div className="an-dow-track">
                          <div
                            className="an-dow-fill"
                            style={{
                              height: `${barH}%`,
                              background: best ? '#f97316' : 'rgba(249,115,22,0.55)',
                              opacity: best ? 1 : 0.6
                            }}
                          />
                        </div>
                        <div className="an-dow-label" style={{ color: best ? '#f97316' : '' }}>
                          {name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Habit comparison */}
              <div className="an-card" style={{ flex: 1.4 }}>
                <div className="an-card-title">🏆 Habit Comparison</div>
                <div className="an-habit-list">
                  {habitComp.length === 0 ? (
                    <div style={{ color: 'var(--text3)', fontSize: 13 }}>No data yet</div>
                  ) : habitComp.map((h, i) => (
                    <div key={i} className="an-habit-row">
                      <div className="an-habit-name">{h.name}</div>
                      <div className="an-habit-bar-wrap">
                        <div className="an-habit-bar">
                          <div className="an-habit-fill" style={{ width: `${h.pct}%`, background: h.color }} />
                        </div>
                        <span className="an-habit-pct" style={{ color: h.color }}>{h.pct}%</span>
                      </div>
                      <div className="an-habit-sub">{h.done}/{h.total} logs</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}