import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { getUserHistory, getHabits, getTasks, getLogs } from '../api/api';
import './History.css';

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

const getLast30Days = () => {
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);
  }
  return days;
};

function getDatesInRange(start, end) {
  if (!start || !end) return [];
  const dates = [];
  const [sy,sm,sd] = start.split('-').map(Number);
  const [ey,em,ed] = end.split('-').map(Number);
  let cur = new Date(sy, sm-1, sd);
  const last = new Date(ey, em-1, ed);
  while (cur <= last) {
    dates.push(`${cur.getFullYear()}-${String(cur.getMonth()+1).padStart(2,'0')}-${String(cur.getDate()).padStart(2,'0')}`);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
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

function buildTaskDayEntries(task, taskLogs) {
  const startDate = nd(task.startDate) || nd(task.dueDate);
  const endDate   = nd(task.endDate)   || nd(task.dueDate);
  const allDays   = getDatesInRange(startDate, endDate);
  const logMap    = {};
  (taskLogs || []).forEach(l => { logMap[nd(l.date)] = l; });

  return allDays.map(day => {
    const log     = logMap[day];
    const isToday = day === TODAY;
    const future  = day > TODAY;
    let status;
    if (log)          status = log.status;
    else if (future)  status = 'future';
    else if (isToday) status = 'today';
    else              status = 'missed';
    return { day, log, status, isToday, future, task };
  });
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function History() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [logs,      setLogs]      = useState([]);
  const [habitData, setHabitData] = useState([]);
  const [logMap,    setLogMap]    = useState({});
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('all');
  const [tab,       setTab]       = useState('overview');

  const days30 = getLast30Days();

  useEffect(() => { init(); }, []);

  const init = async () => {
    try {
      const [logsRes, habitsRes] = await Promise.all([
        getUserHistory(user.userId),
        getHabits(user.userId),
      ]);

      const allLogs = logsRes.data;
      setLogs(allLogs);

      const map = {};
      allLogs.forEach(l => {
        const date = nd(l.date);
        if (l.status === 'completed' && date) map[date] = (map[date] || 0) + 1;
      });
      setLogMap(map);

      const hd = [];
      for (const habit of habitsRes.data) {
        try {
          const tasksRes = await getTasks(habit.habitId);
          const taskDetails = [];
          for (const task of tasksRes.data) {
            try {
              const lr = await getLogs(task.taskId);
              taskDetails.push({ task, logs: lr.data });
            } catch { taskDetails.push({ task, logs: [] }); }
          }
          hd.push({ habit, taskDetails });
        } catch {}
      }
      setHabitData(hd);

    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const normLogs = logs.map(l => ({ ...l, date: nd(l.date) })).filter(l => l.date);

  const missedEntries = habitData.flatMap(({ taskDetails }) =>
    taskDetails.flatMap(({ task, logs: tl }) =>
      buildTaskDayEntries(task, tl)
        .filter(e => e.status === 'missed')
        .map(e => ({ logId: null, date: e.day, status: 'missed', task }))
    )
  );

  /* completed + skipped (from backend) + missed (frontend calc) */
  const allEntries = [
    ...normLogs.filter(l => l.status === 'completed' || l.status === 'skipped'),
    ...missedEntries,
  ].sort((a, b) => b.date.localeCompare(a.date));

  const filtered = filter === 'all'
    ? allEntries
    : allEntries.filter(l => l.status === filter);

  const completed   = normLogs.filter(l => l.status === 'completed').length;
  const skipped     = normLogs.filter(l => l.status === 'skipped').length;
  const totalMissed = missedEntries.length;
  const totalDays   = completed + skipped + totalMissed;
  const rate        = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;
  const bestStreak  = calcBestStreak(normLogs);

  const maxDay    = Math.max(1, ...Object.values(logMap));
  const intensity = date => {
    const c = logMap[date] || 0;
    if (!c) return 0;
    return Math.ceil((c / maxDay) * 4);
  };

  const byMonth = {};
  filtered.forEach(l => {
    const m = l.date?.slice(0, 7);
    if (!m) return;
    if (!byMonth[m]) byMonth[m] = [];
    byMonth[m].push(l);
  });
  const monthKeys = Object.keys(byMonth).sort().reverse();

  const getLogMeta = log => ({
    habitName: log.task?.habit?.habitName || '—',
    taskTitle: log.task?.title || '—',
  });

  return (
    <div className="page">
      <Navbar />
      <div className="container">

        <div className="page-header animate-in">
          <div>
            <h1 className="page-title">History</h1>
            <p className="page-sub">Your habit journey over time</p>
          </div>
        </div>

        <div className="tab-row animate-in">
          <button className={`tab-btn ${tab==='overview'?'active':''}`} onClick={()=>setTab('overview')}>📊 Overview</button>
          <button className={`tab-btn ${tab==='logs'?'active':''}`} onClick={()=>setTab('logs')}>📋 Activity Log</button>
          <button className={`tab-btn ${tab==='habits'?'active':''}`} onClick={()=>setTab('habits')}>🎯 By Habit</button>
        </div>

        {loading ? <div className="loading">Loading history...</div> : (<>

          {/* ── OVERVIEW ── */}
          {tab === 'overview' && (
            <>
              <div className="history-stats animate-in">
                <div className="hstat hstat-purple">
                  <div className="hstat-icon">📋</div>
                  <div className="hstat-num">{totalDays}</div>
                  <div className="hstat-label">Total Days</div>
                </div>
                <div className="hstat hstat-green">
                  <div className="hstat-icon">✅</div>
                  <div className="hstat-num">{completed}</div>
                  <div className="hstat-label">Completed</div>
                </div>
                <div className="hstat hstat-red">
                  <div className="hstat-icon">⏭</div>
                  <div className="hstat-num">{skipped}</div>
                  <div className="hstat-label">Skipped</div>
                </div>
                <div className="hstat hstat-grey">
                  <div className="hstat-icon">✗</div>
                  <div className="hstat-num">{totalMissed}</div>
                  <div className="hstat-label">Missed</div>
                </div>
                <div className="hstat hstat-gold">
                  <div className="hstat-icon">🔥</div>
                  <div className="hstat-num">{bestStreak}</div>
                  <div className="hstat-label">Best Streak</div>
                </div>
              </div>

              <div className="rate-card card animate-in">
                <div className="rate-card-top">
                  <span className="rate-card-label">Overall Success Rate</span>
                  <span className="rate-card-pct">{rate}%</span>
                </div>
                <div className="rate-bar-track">
                  <div className="rate-bar-fill" style={{ width: `${rate}%` }} />
                </div>
                <div className="rate-card-sub">
                  {completed} completed · {skipped} skipped · {totalMissed} missed · out of {totalDays} total days
                </div>
              </div>

              <div className="card heatmap-card animate-in">
                <div className="heatmap-title">
                  <span>Activity — Last 30 Days</span>
                  <div className="heatmap-legend">
                    <span>Less</span>
                    {[0,1,2,3,4].map(i => <div key={i} className={`legend-cell lv-${i}`} />)}
                    <span>More</span>
                  </div>
                </div>
                <div className="heatmap-grid">
                  {days30.map(day => {
                    const lv = intensity(day);
                    const [,,d] = day.split('-').map(Number);
                    return (
                      <div key={day}
                        className={`heat-cell lv-${lv}${day===TODAY?' heat-today':''}`}
                        title={`${day}: ${logMap[day]||0} completions`}>
                        <span className="heat-date">{d}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {habitData.length > 0 && (
                <div className="card animate-in">
                  <div className="section-title">🏆 Habit Streaks</div>
                  <div className="streaks-list">
                    {habitData
                      .map(({ habit, taskDetails }) => ({
                        habit,
                        streak: calcBestStreak(taskDetails.flatMap(td => td.logs))
                      }))
                      .sort((a,b) => b.streak - a.streak)
                      .map(({ habit, streak }, i) => {
                        const maxS = Math.max(1, ...habitData.map(({ taskDetails }) =>
                          calcBestStreak(taskDetails.flatMap(td => td.logs))
                        ));
                        return (
                          <div key={habit.habitId} className="streak-item">
                            <div className="streak-rank">#{i+1}</div>
                            <div className="streak-info">
                              <div className="streak-name">{habit.habitName}</div>
                              <div className="streak-freq">{habit.frequency}</div>
                            </div>
                            <div className="streak-fire">🔥 <span>{streak}</span> days</div>
                            <div className="streak-bar-wrap">
                              <div className="streak-bar-fill"
                                style={{ width: `${maxS>0?(streak/maxS)*100:0}%` }} />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── ACTIVITY LOG ── */}
          {tab === 'logs' && (
            <>
              <div className="filter-row animate-in">
                {[
                  { key: 'all',       label: 'All',       count: allEntries.length },
                  { key: 'completed', label: 'Completed', count: completed },
                  { key: 'skipped',   label: 'Skipped',   count: skipped },
                  { key: 'missed',    label: 'Missed',    count: totalMissed },
                ].map(f => (
                  <button key={f.key}
                    className={`filter-btn ${filter===f.key?'active':''}`}
                    onClick={() => setFilter(f.key)}>
                    {f.label}
                    <span className="filter-count">{f.count}</span>
                  </button>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="empty-state animate-in">
                  <div className="empty-icon">📋</div>
                  <h3>No logs yet</h3>
                  <p>Complete tasks to see your activity here</p>
                </div>
              ) : monthKeys.map(month => (
                <div key={month} className="month-group animate-in">
                  <div className="month-label">
                    {MONTHS[parseInt(month.split('-')[1])-1]} {month.split('-')[0]}
                    <span className="month-count">{byMonth[month].length} entries</span>
                  </div>
                  <div className="log-list">
                    {byMonth[month]
                      .sort((a,b) => b.date.localeCompare(a.date))
                      .map((log, i) => {
                        const { habitName, taskTitle } = getLogMeta(log);
                        const isMissed  = log.status === 'missed';
                        const isSkipped = log.status === 'skipped';
                        return (
                          <div key={(log.logId||'m')+i} className="log-row">
                            <div className="log-indicator">
                              <div className={`log-dot ${log.status}`} />
                              {i < byMonth[month].length-1 && <div className="log-line" />}
                            </div>
                            <div className={`log-content card${isMissed?' log-content-missed':isSkipped?' log-content-skipped':''}`}>
                              <div className="log-left">
                                <div className="log-habit-name">{habitName}</div>
                                <div className="log-task-name">📌 {taskTitle}</div>
                                <div className="log-date">📅 {log.date}</div>
                              </div>
                              <span className={`badge badge-${
                                log.status === 'completed' ? 'done'
                                : log.status === 'skipped' ? 'skipped'
                                : 'missed'
                              }`}>
                                {log.status === 'completed' ? '✅ Completed'
                                 : log.status === 'skipped' ? '⏭ Skipped'
                                 : '✗ Missed'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* ── BY HABIT ── */}
          {tab === 'habits' && (
            <>
              {habitData.length === 0 ? (
                <div className="empty-state animate-in">
                  <div className="empty-icon">🎯</div>
                  <h3>No habits yet</h3>
                  <p>Create habits and complete tasks to see them here</p>
                </div>
              ) : habitData.map(({ habit, taskDetails }) => {

                const allTaskLogs = taskDetails.flatMap(td =>
                  (td.logs||[]).map(l => ({ ...l, date: nd(l.date) }))
                );
                const hDone    = new Set(allTaskLogs.filter(l=>l.status==='completed').map(l=>l.date)).size;
                const hSkipped = new Set(allTaskLogs.filter(l=>l.status==='skipped').map(l=>l.date)).size;
                const hMissed  = taskDetails.reduce((acc, { task, logs: tl }) =>
                  acc + buildTaskDayEntries(task, tl).filter(e=>e.status==='missed').length, 0
                );
                const hStreak  = calcBestStreak(allTaskLogs);

                return (
                  <div key={habit.habitId} className="habit-history-card card animate-in">

                    <div className="hhc-header">
                      <div className="hhc-left">
                        <div className="hhc-name">{habit.habitName}</div>
                        <div className="hhc-freq">{habit.frequency}</div>
                      </div>
                      <div className="hhc-stats">
                        <span className="hhc-stat hhc-done">✅ {hDone} done</span>
                        <span className="hhc-stat hhc-skip">⏭ {hSkipped} skipped</span>
                        <span className="hhc-stat hhc-missed">✗ {hMissed} missed</span>
                        <span className="hhc-stat hhc-streak">🔥 {hStreak} best streak</span>
                      </div>
                    </div>

                    {taskDetails.length === 0 ? (
                      <div className="hhc-no-tasks">No tasks yet</div>
                    ) : taskDetails.map(({ task, logs: taskLogs }) => {

                      const normTaskLogs = (taskLogs||[]).map(l=>({...l,date:nd(l.date)}));
                      const entries  = buildTaskDayEntries(task, taskLogs);
                      const tDone    = new Set(normTaskLogs.filter(l=>l.status==='completed').map(l=>l.date)).size;
                      const tSkipped = new Set(normTaskLogs.filter(l=>l.status==='skipped').map(l=>l.date)).size;
                      const tMissed  = entries.filter(e=>e.status==='missed').length;
                      const tStreak  = calcBestStreak(normTaskLogs);
                      const startDate = nd(task.startDate) || nd(task.dueDate);
                      const endDate   = nd(task.endDate)   || nd(task.dueDate);

                      return (
                        <div key={task.taskId} className="hhc-task">
                          <div className="hhc-task-header">
                            <div className="hhc-task-info">
                              <span className="hhc-task-title">{task.title}</span>
                              {startDate && endDate && (
                                <span className="hhc-task-dates">{startDate} → {endDate}</span>
                              )}
                            </div>
                            <div className="hhc-task-stats">
                              <span className="hhct-stat done">✅ {tDone}</span>
                              <span className="hhct-stat skip">⏭ {tSkipped}</span>
                              <span className="hhct-stat missed">✗ {tMissed}</span>
                              <span className="hhct-stat streak">🔥 {tStreak}</span>
                            </div>
                          </div>

                          {entries.length > 0 && (
                            <div className="hhc-task-logs">
                              {entries
                                .slice()
                                .sort((a,b) => b.day.localeCompare(a.day))
                                .map((entry, i) => (
                                  <div key={entry.day+i}
                                    className={`hhc-log-entry hhc-entry-${entry.status}`}>
                                    <span className={`hhc-log-dot ${entry.status}`} />
                                    <span className="hhc-log-date">{entry.day}</span>
                                    <span className={`hhc-log-status ${entry.status}`}>
                                      {entry.status === 'completed' ? '✅ Completed'
                                       : entry.status === 'skipped' ? '⏭ Skipped'
                                       : entry.status === 'missed'  ? '✗ Missed'
                                       : entry.status === 'today'   ? '⏳ Pending Today'
                                       : '📅 Upcoming'}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </>
          )}

        </>)}
      </div>
    </div>
  );
}