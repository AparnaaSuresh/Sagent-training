import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getHabits, getTasks, getReminders } from '../api/api';
import './Navbar.css';

function nd(val) {
  if (!val) return null;
  if (typeof val === 'string') return val.substring(0, 8);
  if (Array.isArray(val)) {
    const [h, m] = val;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
  }
  return String(val);
}

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const user      = JSON.parse(localStorage.getItem('user') || 'null');
  const [notifications, setNotifications] = useState([]);
  const [showBell, setShowBell] = useState(false);
  const bellRef = useRef();

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setShowBell(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchNotifications = async () => {
    try {
      const habitsRes = await getHabits(user.userId);
      const notifs = [];
      for (const habit of habitsRes.data) {
        const tasksRes = await getTasks(habit.habitId);
        for (const task of tasksRes.data) {
          const remindersRes = await getReminders(task.taskId);
          for (const r of remindersRes.data) {
            notifs.push({
              id:      r.reminderId,
              task:    task.title,
              habit:   habit.habitName,
              time:    nd(r.notificationTime),
              message: r.message || '',
            });
          }
        }
      }
      setNotifications(notifs);
    } catch (e) {}
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => navigate('/')}>
        <div className="nav-diamond">◆</div>
        <span className="nav-title">HabitTrack</span>
      </div>

      <div className="nav-links">
        
        <button className={`nav-link ${isActive('/') ? 'active' : ''}`}
          onClick={() => navigate('/')}>Dashboard</button>
        <button className={`nav-link ${isActive('/history') ? 'active' : ''}`}
          onClick={() => navigate('/history')}>History</button>
        <button className={`nav-link ${isActive('/calendarr') ? 'active' : ''}`}
          onClick={() => navigate('/calendar')}>Calendar</button>
          <button className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
  onClick={() => navigate('/analytics')}>Analytics</button>
  <button className={`nav-link ${isActive('/Challenge') ? 'active' : ''}`}
  onClick={() => navigate('/Challenge')}>Challenge</button>
  
      </div>

      <div className="nav-right">
        <div className="bell-wrap" ref={bellRef}>
          <button className="bell-btn" onClick={() => setShowBell(!showBell)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {notifications.length > 0 && (
              <span className="bell-badge">{notifications.length}</span>
            )}
          </button>

          {showBell && (
            <div className="bell-dropdown">
              <div className="bell-header">
                <span>Reminders</span>
                <span className="bell-count">{notifications.length}</span>
              </div>
              {notifications.length === 0 ? (
                <div className="bell-empty">No reminders set</div>
              ) : notifications.map(n => (
                <div key={n.id} className="bell-item">
                  <div className="bell-dot" />
                  <div className="bell-item-body">
                    <div className="bell-task">{n.task}</div>
                    <div className="bell-meta">
                      {n.message
                        ? <span className="bell-msg">💬 {n.message}</span>
                        : <span>{n.habit}</span>
                      }
                      <span className="bell-time">⏰ {n.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clicking the chip goes to /profile */}
        <div className="nav-user-chip" style={{ cursor: 'pointer' }}
          onClick={() => navigate('/profile')}>
          <div className="nav-avatar">{user?.name?.[0]?.toUpperCase()}</div>
          <span>{user?.name}</span>
        </div>

        <button className="btn btn-ghost btn-sm"
          onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}>
          Logout
        </button>
      </div>
    </nav>
  );
}