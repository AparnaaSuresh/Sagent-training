import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import {
  getTasks, createTask, deleteTask, updateTask,
  getReminders, createReminder, deleteReminder,
  logHabit, getLogs
} from '../api/api';
import './HabitDetail.css';

const _t = new Date();
const TODAY = `${_t.getFullYear()}-${String(_t.getMonth()+1).padStart(2,'0')}-${String(_t.getDate()).padStart(2,'0')}`;

function nd(val) {
  if (!val) return null;
  if (typeof val === 'string') return val.substring(0, 10);
  if (Array.isArray(val)) {
    const [y, m, d] = val;
    return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  }
  return String(val).substring(0, 10);
}

function getTaskDates(task) {
  return {
    startDate: nd(task.startDate) || nd(task.dueDate),
    endDate:   nd(task.endDate)   || nd(task.dueDate),
  };
}

function getDatesInRange(start, end) {
  if (!start || !end) return [];
  const dates = [];
  // Use UTC to avoid DST/timezone shifting dates
  const [sy,sm,sd] = start.split('-').map(Number);
  const [ey,em,ed] = end.split('-').map(Number);
  let cur  = Date.UTC(sy, sm-1, sd);
  const last = Date.UTC(ey, em-1, ed);
  while (cur <= last) {
    const d = new Date(cur);
    dates.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`);
    cur += 86400000; // add exactly 1 day in ms
  }
  return dates;
}

function calcCurrentStreak(logs) {
  const doneSet = new Set(
    (logs || []).filter(l => l.status === 'completed').map(l => nd(l.date))
  );
  let streak = 0;
  const [ty,tm,td] = TODAY.split('-').map(Number);
  let cur = new Date(ty, tm-1, td);
  while (true) {
    const ds = `${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`;
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
    const [ay,am,ad] = sorted[i-1].split('-').map(Number);
    const [by,bm,bd] = sorted[i].split('-').map(Number);
    const diff = (new Date(by,bm-1,bd) - new Date(ay,am-1,ad)) / 86400000;
    cur = diff === 1 ? cur + 1 : 1;
    if (cur > best) best = cur;
  }
  return best;
}

/* ── Streak Grid ── */
function StreakGrid({ task, logs }) {
  const { startDate, endDate } = getTaskDates(task);
  const days = getDatesInRange(startDate, endDate);
  const logMap = {};
  (logs || []).forEach(l => { logMap[nd(l.date)] = l.status; });
  if (!days.length) return null;

  const doneDays     = days.filter(d => logMap[d] === 'completed').length;
  const skippedDays  = days.filter(d => logMap[d] === 'skipped').length;
  const upcomingDays = days.filter(d => d > TODAY && !logMap[d]).length;

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtShort = ds => {
    const [,m,d] = ds.split('-').map(Number);
    return `${MONTHS[m-1]} ${d}`;
  };

  // Map status → lv class (same intensity levels as History page)
  const getLv = (day) => {
    const status  = logMap[day];
    const future  = day > TODAY;
    const isToday = day === TODAY;
    if (status === 'completed') return 'lv-4';   // full vivid orange
    if (status === 'skipped')   return 'lv-2';   // red tint
    if (future)                 return 'lv-1';   // dim upcoming
    return 'lv-0';                               // empty/missed
  };

  return (
    <div className="streak-grid-wrap">
      <div className="streak-grid-header">
        <div className="streak-grid-label">
          📅 {startDate} → {endDate} &nbsp;·&nbsp; {days.length} day{days.length !== 1 ? 's' : ''}
        </div>
        <div className="streak-grid-summary">
          <span className="sgs-item sgs-done">✓ {doneDays} done</span>
          <span className="sgs-item sgs-skip">⏭ {skippedDays} skipped</span>
          <span className="sgs-item sgs-left">{upcomingDays} upcoming</span>
        </div>
      </div>

      <div className="streak-grid">
        {days.map((day, i) => {
          const isToday = day === TODAY;
          const lv      = getLv(day);
          return (
            <div key={day} className="sg-cell-wrap"
              title={`Day ${i+1} · ${fmtShort(day)}${isToday ? ' (Today)' : ''}${logMap[day] ? ' · ' + logMap[day] : ''}`}>
              <div className={`sg-cell ${lv}${isToday ? ' sg-today' : ''}`}>
                <span className="sg-day-num">{i + 1}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="streak-grid-legend">
        <span className="sg-legend-item"><span className="sg-swatch sg-swatch-done" /> Done</span>
        <span className="sg-legend-item"><span className="sg-swatch sg-swatch-skip" /> Skipped</span>
        <span className="sg-legend-item"><span className="sg-swatch sg-swatch-empty" /> No log</span>
        <span className="sg-legend-item"><span className="sg-swatch sg-swatch-future" /> Future</span>
      </div>
    </div>
  );
}

/* ── Day-by-Day List ── */
function DayByDayList({ task, logs, onMarkDone }) {
  const { startDate, endDate } = getTaskDates(task);
  const days = getDatesInRange(startDate, endDate);
  const logMap = {};
  (logs || []).forEach(l => { logMap[nd(l.date)] = l.status; });
  if (!days.length) return null;

  const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmt = ds => {
    const [y,m,d] = ds.split('-').map(Number);
    const date = new Date(y, m-1, d);
    return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`;
  };

  const rangeDatesSet = new Set(days);
  const doneDays = new Set(
    (logs || [])
      .filter(l => l.status === 'completed' && rangeDatesSet.has(nd(l.date)))
      .map(l => nd(l.date))
  ).size;

  return (
    <div className="daybyday-wrap">
      <div className="daybyday-header">
        <span className="daybyday-title">📆 Daily Progress</span>
        <span className="daybyday-count">{doneDays} / {days.length} days done</span>
      </div>
      <div className="daybyday-list">
        {days.map((day, i) => {
          const status  = logMap[day];
          const isToday = day === TODAY;
          const future  = day > TODAY;
          const done    = status === 'completed';
          const skipped = status === 'skipped';
          const past    = day < TODAY;
          const missed  = past && !done && !skipped;

          return (
            <div key={day} className={[
              'dbd-row',
              done    ? 'dbd-done'    : '',
              skipped ? 'dbd-skipped' : '',
              isToday ? 'dbd-today'   : '',
              future  ? 'dbd-future'  : '',
              missed  ? 'dbd-missed'  : '',
            ].filter(Boolean).join(' ')}>

              <div className="dbd-left">
                <div className="dbd-day-bubble">
                  {done ? '✓' : skipped ? '⏭' : i + 1}
                </div>
                <div className="dbd-info">
                  <span className="dbd-day-label">Day {i + 1}</span>
                  <span className="dbd-date">
                    {fmt(day)}
                    {isToday && <span className="dbd-today-pill">Today</span>}
                  </span>
                </div>
              </div>

              <div className="dbd-right">
                {done ? (
                  <span className="dbd-badge dbd-badge-done">✓ Completed</span>
                ) : skipped ? (
                  <span className="dbd-badge dbd-badge-skip">⏭ Skipped</span>
                ) : future ? (
                  <span className="dbd-badge dbd-badge-future">Upcoming</span>
                ) : missed ? (
                  <span className="dbd-badge dbd-badge-missed">✗ Missed</span>
                ) : isToday ? (
                  <div className="dbd-action-btns">
                    <button className="btn btn-green btn-sm dbd-done-btn"
                      onClick={() => onMarkDone(day, 'completed')}>
                      ✓ Done
                    </button>
                    <button className="btn btn-skip btn-sm"
                      onClick={() => onMarkDone(day, 'skipped')}>
                      ⏭ Skip
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Goal Reached Modal ── */
function GoalModal({ task, currentStreak, bestStreak, onMarkComplete, onExtend, onClose }) {
  const { startDate, endDate } = getTaskDates(task);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-trophy">🏆</div>
        <h2 className="modal-title">Goal Reached!</h2>
        <p className="modal-sub">
          You completed <strong>{task.title}</strong><br />
          from <strong>{startDate}</strong> to <strong>{endDate}</strong>
        </p>
        <div className="modal-streaks">
          <div className="modal-streak-item">
            <span className="modal-streak-num">🔥 {currentStreak}</span>
            <span className="modal-streak-label">Current Streak</span>
          </div>
          <div className="modal-streak-divider" />
          <div className="modal-streak-item">
            <span className="modal-streak-num">⭐ {bestStreak}</span>
            <span className="modal-streak-label">Best Streak</span>
          </div>
        </div>
        <p className="modal-question">Do you still want to continue?</p>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={onMarkComplete}>✅ Mark as Completed</button>
          <button className="btn btn-extend" onClick={onExtend}>📅 Extend Goal</button>
          <button className="btn btn-ghost" onClick={onClose}>Not now</button>
        </div>
      </div>
    </div>
  );
}

/* ── Extend Modal ── */
function ExtendModal({ task, onSave, onClose }) {
  const [newEnd, setNewEnd] = useState('');
  const { endDate } = getTaskDates(task);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-trophy">📅</div>
        <h2 className="modal-title">Extend Goal</h2>
        <p className="modal-sub">
          Extend <strong>{task.title}</strong><br />
          Current end: <strong>{endDate}</strong>
        </p>
        <div className="field" style={{ marginTop: 20 }}>
          <label className="label">New End Date</label>
          <input className="input" type="date"
            min={endDate}
            value={newEnd}
            onChange={e => setNewEnd(e.target.value)} />
        </div>
        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-primary" disabled={!newEnd}
            onClick={() => onSave(newEnd)}>Save</button>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── Select Task Modal ── */
function SelectTaskModal({ tasks, onSelect, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-trophy">📅</div>
        <h2 className="modal-title">Extend Goal</h2>
        <p className="modal-sub">Select a task to extend</p>
        <div className="select-task-list">
          {tasks.map(task => {
            const { startDate, endDate } = getTaskDates(task);
            return (
              <button key={task.taskId} className="select-task-btn"
                onClick={() => onSelect(task)}>
                <span className="stb-title">{task.title}</span>
                <span className="stb-dates">{startDate} → {endDate}</span>
              </button>
            );
          })}
        </div>
        <div className="modal-actions" style={{ marginTop: 16 }}>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
export default function HabitDetail() {
  const { habitId } = useParams();
  const navigate    = useNavigate();

  const [tasks,           setTasks]           = useState([]);
  const [showTaskForm,    setShowTaskForm]     = useState(false);
  const [taskForm,        setTaskForm]         = useState({ title: '', description: '', startDate: TODAY, endDate: '' });
  const [formError,       setFormError]        = useState('');
  const [reminders,       setReminders]        = useState({});
  const [showReminderFor, setShowReminderFor]  = useState(null);
  const [reminderForm,    setReminderForm]     = useState({ notificationTime: '', frequency: 'daily', message: '' });
  const [logsMap,         setLogsMap]          = useState({});
  const [error,           setError]            = useState('');
  const [loading,         setLoading]          = useState(true);
  const [goalModal,       setGoalModal]        = useState(null);
  const [extendModal,     setExtendModal]      = useState(null);
  const [selectTaskModal, setSelectTaskModal]  = useState(false);

  useEffect(() => { fetchAll(); }, [habitId]);

  const fetchAll = async () => {
    try {
      const res = await getTasks(habitId);
      setTasks(res.data);
      for (const t of res.data) {
        fetchReminders(t.taskId);
        fetchLogs(t.taskId);
      }
    } catch { setError('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  const fetchReminders = async (id) => {
    try { const r = await getReminders(id); setReminders(p => ({ ...p, [id]: r.data })); } catch {}
  };
  const fetchLogs = async (id) => {
    try { const r = await getLogs(id); setLogsMap(p => ({ ...p, [id]: r.data })); } catch {}
  };

  const addTask = async e => {
    e.preventDefault();
    setFormError('');
    if (!taskForm.endDate) { setFormError('Please set an end date.'); return; }
    if (taskForm.endDate < taskForm.startDate) { setFormError('End date must be on or after start date.'); return; }
    try {
      await createTask(habitId, {
        title:       taskForm.title,
        description: taskForm.description,
        startDate:   taskForm.startDate,
        endDate:     taskForm.endDate,
        dueDate:     taskForm.endDate,
      });
      setTaskForm({ title: '', description: '', startDate: TODAY, endDate: '' });
      setShowTaskForm(false);
      fetchAll();
    } catch { setError('Failed to create task'); }
  };

  const doneTask = async (task, date = TODAY, statusVal = 'completed') => {
    const logs = logsMap[task.taskId] || [];
    const alreadyLogged = logs.some(l => nd(l.date) === date);
    if (alreadyLogged) return;
    try {
      await logHabit(task.taskId, { status: statusVal, date });
      await fetchLogs(task.taskId);
      if (statusVal === 'completed') {
        const { endDate } = getTaskDates(task);
        if (endDate && date >= endDate) setGoalModal(task);
      }
    } catch { setError('Failed to log task'); }
  };

  const extendTask = async (task, newEnd) => {
    try {
      const { startDate } = getTaskDates(task);
      await updateTask(task.taskId, {
        title:       task.title,
        description: task.description,
        startDate,
        endDate:     newEnd,
        dueDate:     newEnd,
        status:      task.status,
      });
      setExtendModal(null); setGoalModal(null); setSelectTaskModal(false);
      fetchAll();
    } catch { setError('Failed to extend task'); }
  };

  const removeTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try { await deleteTask(id); fetchAll(); } catch { setError('Failed to delete task'); }
  };

  const addReminder = async (e, taskId) => {
    e.preventDefault();
    try {
      const time = reminderForm.notificationTime.length === 5
        ? reminderForm.notificationTime + ':00' : reminderForm.notificationTime;
      await createReminder(taskId, {
        notificationTime: time,
        frequency:        reminderForm.frequency,
        message:          reminderForm.message || '',
      });
      setShowReminderFor(null);
      setReminderForm({ notificationTime: '', frequency: 'daily', message: '' });
      fetchReminders(taskId);
    } catch { setError('Failed to create reminder'); }
  };

  const removeReminder = async (rid, taskId) => {
    try { await deleteReminder(rid); fetchReminders(taskId); } catch {}
  };

  const getTaskState = (task) => {
    const { startDate, endDate } = getTaskDates(task);
    const logs   = logsMap[task.taskId] || [];
    const logMap = {};
    logs.forEach(l => { logMap[nd(l.date)] = l.status; });

    const notStarted    = startDate && TODAY < startDate;
    const pastEnd       = endDate && TODAY > endDate;
    const doneToday     = logMap[TODAY] === 'completed';
    const skippedToday  = logMap[TODAY] === 'skipped';
    const allDays       = getDatesInRange(startDate, endDate);
    const daysToNow     = getDatesInRange(startDate, pastEnd ? endDate : TODAY);
    const rangeDatesSet = new Set(allDays);

    const doneDays = new Set(
      logs.filter(l => l.status === 'completed' && rangeDatesSet.has(nd(l.date))).map(l => nd(l.date))
    ).size;
    const skippedDays = new Set(
      logs.filter(l => l.status === 'skipped' && rangeDatesSet.has(nd(l.date))).map(l => nd(l.date))
    ).size;

    const totalDays     = allDays.length;
    const progress      = daysToNow.length > 0
      ? Math.min(100, Math.round((doneDays / daysToNow.length) * 100)) : 0;
    const normLogs      = logs.map(l => ({ ...l, date: nd(l.date) }));
    const currentStreak = calcCurrentStreak(normLogs);
    const bestStreak    = calcBestStreak(normLogs);
    const daysLeft      = !pastEnd && endDate
      ? Math.max(0, Math.ceil(
          (new Date(...endDate.split('-').map((v,i) => i===1?Number(v)-1:Number(v))) -
           new Date(...TODAY.split('-').map((v,i) => i===1?Number(v)-1:Number(v)))) / 86400000
        )) : null;

    return {
      notStarted, pastEnd, doneToday, skippedToday,
      currentStreak, bestStreak,
      doneDays, skippedDays, totalDays, progress,
      startDate, endDate, daysLeft
    };
  };

  const allLogs              = Object.values(logsMap).flat().map(l => ({ ...l, date: nd(l.date) }));
  const overallCurrentStreak = calcCurrentStreak(allLogs);
  const overallBestStreak    = calcBestStreak(allLogs);
  const overallTotalDone     = new Set(
    allLogs.filter(l => l.status === 'completed').map(l => `${l.taskId||''}-${l.date}`)
  ).size;

  return (
    <div className="page">
      <Navbar />
      <div className="container">

        <div className="page-header animate-in">
          <div>
            <button className="back-btn" onClick={() => navigate('/')}>← Back to Dashboard</button>
            <h1 className="page-title" style={{ marginTop: 8 }}>Tasks</h1>
            <div className="overall-streak-bar">
              <div className="osb-item">
                <span className="osb-icon">🔥</span>
                <span className="osb-num">{overallCurrentStreak}</span>
                <span className="osb-label">Current Streak</span>
              </div>
              <div className="osb-divider" />
              <div className="osb-item">
                <span className="osb-icon">⭐</span>
                <span className="osb-num">{overallBestStreak}</span>
                <span className="osb-label">Best Streak</span>
              </div>
              <div className="osb-divider" />
              <div className="osb-item">
                <span className="osb-icon">✅</span>
                <span className="osb-num">{overallTotalDone}</span>
                <span className="osb-label">Total Done</span>
              </div>
            </div>
          </div>
          <div className="page-header-actions">
            <button className="btn btn-extend"
              onClick={() => {
                if (!tasks.length) return;
                tasks.length === 1 ? setExtendModal(tasks[0]) : setSelectTaskModal(true);
              }}>
              📅 Extend Goal
            </button>
            <button className="btn btn-primary"
              onClick={() => { setShowTaskForm(v => !v); setFormError(''); }}>
              {showTaskForm ? '✕ Cancel' : '+ New Task'}
            </button>
          </div>
        </div>

        {error && <div className="error-msg">{error}</div>}

        {showTaskForm && (
          <div className="card form-card animate-in">
            <h3 className="form-title">New Task</h3>
            <form onSubmit={addTask}>
              <div className="field">
                <label className="label">Title</label>
                <input className="input" placeholder="e.g. Run 5km"
                  value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  required />
              </div>
              <div className="field">
                <label className="label">Description (optional)</label>
                <input className="input" placeholder="Details..."
                  value={taskForm.description}
                  onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="field" style={{ flex: 1 }}>
                  <label className="label">Start Date</label>
                  <input className="input" type="date"
                    value={taskForm.startDate}
                    onChange={e => { setTaskForm({ ...taskForm, startDate: e.target.value }); setFormError(''); }}
                    required />
                </div>
                <div className="field" style={{ flex: 1 }}>
                  <label className="label">End Date (Goal)</label>
                  <input className="input" type="date"
                    min={taskForm.startDate}
                    value={taskForm.endDate}
                    onChange={e => { setTaskForm({ ...taskForm, endDate: e.target.value }); setFormError(''); }}
                    required />
                </div>
              </div>
              {formError && <div className="form-error-msg">⚠️ {formError}</div>}
              <p className="task-date-hint">
                📅 Example: Mar 16 → Mar 18 gives Day 1, Day 2, Day 3 — mark each day done or skip it.
              </p>
              <button className="btn btn-primary" type="submit">Add Task</button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state animate-in">
            <div className="empty-icon">✅</div>
            <h3>No tasks yet</h3>
            <p>Add a task with a start and end date to begin tracking your streak</p>
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map(task => {
              const {
                notStarted, pastEnd, doneToday, skippedToday,
                currentStreak, bestStreak,
                doneDays, skippedDays, totalDays, progress,
                startDate, endDate, daysLeft
              } = getTaskState(task);
              const logs = logsMap[task.taskId] || [];

              return (
                <div key={task.taskId}
                  className={`task-card card animate-in${pastEnd ? ' task-goal-reached' : ''}`}>

                  <div className="task-main">
                    <div className={`task-status-dot ${doneToday ? 'done' : skippedToday ? 'skipped' : 'pending'}`} />
                    <div className="task-body">

                      <div className="task-top-row">
                        <h3 className="task-title">{task.title}</h3>
                        <div className="task-actions">
                          {pastEnd ? (
                            <button className="btn btn-goal btn-sm" onClick={() => setGoalModal(task)}>
                              🏆 Goal Reached
                            </button>
                          ) : notStarted ? (
                            <button className="btn btn-ghost btn-sm" disabled
                              style={{ opacity: 0.45, cursor: 'not-allowed' }}>
                              🔒 Starts {startDate}
                            </button>
                          ) : doneToday ? (
                            <button className="btn btn-done-today btn-sm" disabled>✓ Done Today</button>
                          ) : skippedToday ? (
                            <button className="btn btn-skipped-today btn-sm" disabled>⏭ Skipped Today</button>
                          ) : null}
                          <button className="btn btn-ghost btn-sm icon-btn"
                            onClick={() => setShowReminderFor(showReminderFor === task.taskId ? null : task.taskId)}>
                            ⏰
                          </button>
                          <button className="btn btn-danger btn-sm icon-btn"
                            onClick={() => removeTask(task.taskId)}>
                            🗑
                          </button>
                        </div>
                      </div>

                      {task.description && <p className="task-desc">{task.description}</p>}

                      <div className="task-date-range">
                        <span className="tdr-item">
                          <span className="tdr-label">Start</span>
                          <span className="tdr-val">{startDate || '—'}</span>
                        </span>
                        <span className="tdr-arrow">→</span>
                        <span className="tdr-item">
                          <span className="tdr-label">Goal</span>
                          <span className="tdr-val">{endDate || '—'}</span>
                        </span>
                        {!pastEnd && daysLeft !== null && (
                          <span className="tdr-item">
                            <span className="tdr-label">Days left</span>
                            <span className="tdr-val tdr-left">{daysLeft}</span>
                          </span>
                        )}
                        <span className="tdr-item">
                          <span className="tdr-label">🔥 Streak</span>
                          <span className="tdr-val tdr-streak">{currentStreak} days</span>
                        </span>
                        <span className="tdr-item">
                          <span className="tdr-label">⭐ Best</span>
                          <span className="tdr-val tdr-best">{bestStreak} days</span>
                        </span>
                      </div>

                      {totalDays > 0 && (
                        <div className="task-progress-wrap">
                          <div className="task-progress-bar">
                            <div className="task-progress-fill" style={{ width: `${progress}%` }} />
                          </div>
                          <span className="task-progress-text">
                            {doneDays}/{totalDays} done · {skippedDays} skipped · {progress}%
                          </span>
                        </div>
                      )}

                      <div className="task-meta-row">
                        {doneToday    && <span className="badge badge-done">✓ Done today</span>}
                        {skippedToday && <span className="badge badge-skip-today">⏭ Skipped today</span>}
                        {pastEnd      && <span className="badge badge-goal">🏆 Goal complete</span>}
                        {!doneToday && !skippedToday && !pastEnd && !notStarted && (
                          <span className="badge badge-pending">Pending today</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <StreakGrid task={task} logs={logs} />
                  <DayByDayList
                    task={task}
                    logs={logs}
                    onMarkDone={(date, status) => doneTask(task, date, status)}
                  />

                  {/* ── Reminders ── */}
                  {((reminders[task.taskId]?.length > 0) || showReminderFor === task.taskId) && (
                    <div className="reminders-panel">
                      <div className="reminders-title">⏰ Reminders</div>
                      <div className="reminders-chips">
                        {(reminders[task.taskId] || []).map(r => (
                          <div key={r.reminderId} className="reminder-chip">
                            ⏰ {r.notificationTime} · {r.frequency}
                            {r.message && <span className="chip-msg">· {r.message}</span>}
                            <button className="chip-remove"
                              onClick={() => removeReminder(r.reminderId, task.taskId)}>✕</button>
                          </div>
                        ))}
                      </div>
                      {showReminderFor === task.taskId && (
                        <form className="reminder-form" onSubmit={e => addReminder(e, task.taskId)}>
                          <input className="input" type="time"
                            value={reminderForm.notificationTime}
                            onChange={e => setReminderForm({ ...reminderForm, notificationTime: e.target.value })}
                            required style={{ width: '130px' }} />
                          <select className="input" style={{ width: '110px' }}
                            value={reminderForm.frequency}
                            onChange={e => setReminderForm({ ...reminderForm, frequency: e.target.value })}>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                          </select>
                          <input className="input" type="text"
                            placeholder="Message (optional)"
                            value={reminderForm.message}
                            onChange={e => setReminderForm({ ...reminderForm, message: e.target.value })}
                            style={{ flex: 1, minWidth: '150px' }} />
                          <button className="btn btn-primary btn-sm" type="submit">Add</button>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {goalModal && !extendModal && (
        <GoalModal
          task={goalModal}
          currentStreak={calcCurrentStreak((logsMap[goalModal.taskId]||[]).map(l=>({...l,date:nd(l.date)})))}
          bestStreak={calcBestStreak((logsMap[goalModal.taskId]||[]).map(l=>({...l,date:nd(l.date)})))}
          onMarkComplete={async () => {
            const { endDate } = getTaskDates(goalModal);
            await doneTask(goalModal, endDate, 'completed');
            setGoalModal(null);
          }}
          onExtend={() => setExtendModal(goalModal)}
          onClose={() => setGoalModal(null)}
        />
      )}

      {extendModal && (
        <ExtendModal
          task={extendModal}
          onSave={newEnd => extendTask(extendModal, newEnd)}
          onClose={() => { setExtendModal(null); setGoalModal(null); }}
        />
      )}

      {selectTaskModal && (
        <SelectTaskModal
          tasks={tasks}
          onSelect={task => { setSelectTaskModal(false); setExtendModal(task); }}
          onClose={() => setSelectTaskModal(false)}
        />
      )}
    </div>
  );
}