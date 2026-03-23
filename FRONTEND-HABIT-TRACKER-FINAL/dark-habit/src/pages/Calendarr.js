import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getHabits, getTasks, getLogs } from '../api/api';
import './Calendarr.css';

const CARD_COLORS = [
  { bg: 'rgba(124,58,237,0.15)',  color: '#7c3aed' },
  { bg: 'rgba(217,70,168,0.15)',  color: '#d946a8' },
  { bg: 'rgba(8,145,178,0.15)',   color: '#0891b2' },
  { bg: 'rgba(217,119,6,0.15)',   color: '#d97706' },
  { bg: 'rgba(5,150,105,0.15)',   color: '#059669' },
  { bg: 'rgba(99,102,241,0.15)',  color: '#6366f1' },
];
const colorOf = (name) => CARD_COLORS[name.charCodeAt(0) % CARD_COLORS.length];

const fmt = (y, m, d) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export default function Calendar() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const today = new Date();

  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selected, setSelected] = useState(fmt(today.getFullYear(), today.getMonth(), today.getDate()));
  const [dayMap,   setDayMap]   = useState({});   // { 'YYYY-MM-DD': [{taskTitle, habitName, status, color}] }
  const [loading,  setLoading]  = useState(true);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const hRes = await getHabits(user.userId);
      const habits = hRes.data || [];
      const map = {};

      for (const habit of habits) {
        const col = colorOf(habit.habitName);
        const tRes = await getTasks(habit.habitId);
        const tasks = tRes.data || [];

        for (const task of tasks) {
          try {
            const lRes = await getLogs(task.taskId);
            for (const log of lRes.data || []) {
              const dateStr = Array.isArray(log.date)
                ? fmt(log.date[0], log.date[1] - 1, log.date[2])
                : String(log.date).substring(0, 10);
              if (!map[dateStr]) map[dateStr] = [];
              map[dateStr].push({
                taskTitle: task.taskTitle || task.title || 'Task',
                habitName: habit.habitName,
                status:    log.status,
                color:     col.color,
                bg:        col.bg,
              });
            }
          } catch {}
        }
      }
      setDayMap(map);
    } catch {}
    finally { setLoading(false); }
  };

  // ── Calendar grid ──
  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth  = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth  = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

  const todayStr = fmt(today.getFullYear(), today.getMonth(), today.getDate());
  const selectedTasks = dayMap[selected] || [];

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="page">
      <Navbar />
      <div className="container">

        <div className="page-header animate-in">
          <div>
            <div className="page-title">Calendar</div>
            <div className="page-sub">Your habit activity by day</div>
          </div>
        </div>

        <div className="cal-layout animate-in">

          {/* ── Left: Calendar grid ── */}
          <div className="cal-card">
            <div className="cal-nav">
              <button className="cal-nav-btn" onClick={prevMonth}>‹</button>
              <span className="cal-month-label">{MONTHS[month]} {year}</span>
              <button className="cal-nav-btn" onClick={nextMonth}>›</button>
            </div>

            <div className="cal-weekdays">
              {DAYS.map(d => <div key={d} className="cal-weekday">{d}</div>)}
            </div>

            <div className="cal-grid">
              {cells.map((d, i) => {
                if (!d) return <div key={`e${i}`} className="cal-cell empty" />;
                const ds = fmt(year, month, d);
                const logs = dayMap[ds] || [];
                const done    = logs.filter(l => l.status === 'completed').length;
                const skipped = logs.filter(l => l.status === 'skipped').length;
                const isToday    = ds === todayStr;
                const isSelected = ds === selected;
                const hasDone    = done > 0;
                const hasSkipped = skipped > 0 && done === 0;

                return (
                  <div key={ds}
                    className={`cal-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${hasDone ? 'has-done' : ''} ${hasSkipped ? 'has-skipped' : ''}`}
                    onClick={() => setSelected(ds)}>
                    <span className="cal-day-num">{d}</span>
                    {logs.length > 0 && (
                      <div className="cal-dots">
                        {done    > 0 && <span className="cal-dot done" />}
                        {skipped > 0 && <span className="cal-dot skipped" />}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="cal-legend">
              <span className="cal-legend-item"><span className="cal-dot done" />Completed</span>
              <span className="cal-legend-item"><span className="cal-dot skipped" />Skipped</span>
            </div>
          </div>

          {/* ── Right: Day detail ── */}
          <div className="cal-detail">
            <div className="cal-detail-header">
              <div className="cal-detail-date">
                {new Date(selected + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div className="cal-detail-count">
                {selectedTasks.length} {selectedTasks.length === 1 ? 'entry' : 'entries'}
              </div>
            </div>

            {loading ? (
              <div className="loading">Loading...</div>
            ) : selectedTasks.length === 0 ? (
              <div className="cal-empty">
                <div style={{ fontSize: 40, marginBottom: 10 }}>📅</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>No activity</div>
                <div style={{ fontSize: 13, color: 'var(--text3)' }}>No tasks logged on this day</div>
              </div>
            ) : (
              <div className="cal-task-list">
                {selectedTasks.map((t, i) => (
                  <div key={i} className="cal-task-row" style={{ borderLeft: `3px solid ${t.color}` }}>
                    <div className="cal-task-body">
                      <div className="cal-task-title">{t.taskTitle}</div>
                      <div className="cal-task-habit" style={{ color: t.color }}>{t.habitName}</div>
                    </div>
                    <span className={`cal-task-status ${t.status}`}>{t.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}