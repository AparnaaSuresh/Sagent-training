import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/', icon: '🏠', label: 'Dashboard' },
  { to: '/patients', icon: '👤', label: 'Patients' },
  { to: '/doctors', icon: '🩺', label: 'Doctors' },
  { to: '/health-data', icon: '💓', label: 'Health Data' },
  { to: '/medical-history', icon: '📋', label: 'Medical History' },
  { to: '/feedback', icon: '💬', label: 'Feedback' },
  { to: '/reports', icon: '📊', label: 'Reports' },
];

export default function Layout({ children }) {
  const { currentUser, setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>🏥 HealthMonitor</h2>
          <p>Patient Monitoring System</p>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-title">Navigation</div>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '10px' }}>
            <span style={{ fontWeight: 600, color: '#e2e8f0' }}>{currentUser?.name}</span>
            <br />
            <span style={{ textTransform: 'capitalize' }}>{currentUser?.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ width: '100%', justifyContent: 'center', background: 'rgba(255,255,255,0.07)', color: '#cbd5e1' }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
