import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { patientAPI, doctorAPI, healthDataAPI, feedbackAPI } from '../services/api';

export default function Dashboard() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ patients: 0, doctors: 0, healthRecords: 0, feedbacks: 0 });
  const [recentHealth, setRecentHealth] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patients, doctors, health, feedbacks] = await Promise.all([
          patientAPI.getAll(),
          doctorAPI.getAll(),
          healthDataAPI.getAll(),
          feedbackAPI.getAll(),
        ]);
        setStats({
          patients: patients.data.length,
          doctors: doctors.data.length,
          healthRecords: health.data.length,
          feedbacks: feedbacks.data.length,
        });
        setRecentHealth(health.data.slice(-5).reverse());
        setRecentFeedback(feedbacks.data.slice(-3).reverse());
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    { label: 'Total Patients', value: stats.patients, icon: '👤', color: '#dbeafe', iconColor: '#2563eb', path: '/patients' },
    { label: 'Total Doctors', value: stats.doctors, icon: '🩺', color: '#d1fae5', iconColor: '#059669', path: '/doctors' },
    { label: 'Health Records', value: stats.healthRecords, icon: '💓', color: '#fce7f3', iconColor: '#9d174d', path: '/health-data' },
    { label: 'Feedback Messages', value: stats.feedbacks, icon: '💬', color: '#ede9fe', iconColor: '#6d28d9', path: '/feedback' },
  ];

  const quickActions = [
    { label: 'Register Patient', icon: '➕', path: '/patients', color: '#2563eb' },
    { label: 'Add Health Data', icon: '💊', path: '/health-data', color: '#059669' },
    { label: 'Medical History', icon: '📋', path: '/medical-history', color: '#d97706' },
    { label: 'View Reports', icon: '📊', path: '/reports', color: '#7c3aed' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">
          Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
          {currentUser?.name} 👋
        </h1>
        <p className="page-subtitle">
          Here's what's happening with your patients today — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {loading ? (
        <div className="loading">Loading dashboard...</div>
      ) : (
        <>
          <div className="stats-grid">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="stat-card"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(s.path)}
              >
                <div className="stat-icon" style={{ background: s.color }}>
                  {s.icon}
                </div>
                <div className="stat-info">
                  <h3>{s.value}</h3>
                  <p>{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card mb-4" style={{ marginBottom: '20px' }}>
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
              {quickActions.map((a) => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.path)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
                    padding: '20px 12px', border: '2px solid #e5e7eb', borderRadius: '12px',
                    cursor: 'pointer', background: 'white', transition: 'all 0.15s',
                    fontSize: '13px', fontWeight: '500', color: a.color,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.background = '#f8faff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.background = 'white'; }}
                >
                  <span style={{ fontSize: '28px' }}>{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Recent Health Data */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Health Records</h2>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/health-data')}>View All</button>
              </div>
              {recentHealth.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px' }}>
                  <p>No health data recorded yet.</p>
                </div>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Heart Rate</th>
                        <th>BP</th>
                        <th>O₂ Level</th>
                        <th>Temp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentHealth.map((h) => (
                        <tr key={h.healthId}>
                          <td><span className="badge badge-red">{h.heartRate} bpm</span></td>
                          <td>{h.bloodPressure}</td>
                          <td><span className="badge badge-blue">{h.oxygenLevel}%</span></td>
                          <td>{h.temperature}°C</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Feedback */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Recent Feedback</h2>
                <button className="btn btn-secondary btn-sm" onClick={() => navigate('/feedback')}>View All</button>
              </div>
              {recentFeedback.length === 0 ? (
                <div className="empty-state" style={{ padding: '30px' }}>
                  <p>No feedback messages yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recentFeedback.map((f) => (
                    <div key={f.feedbackId} style={{
                      background: 'var(--gray-50)', borderRadius: '10px', padding: '14px',
                      borderLeft: '3px solid var(--primary)'
                    }}>
                      <p style={{ fontSize: '14px', color: 'var(--gray-700)' }}>{f.message}</p>
                      <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '6px' }}>
                        Dr. {f.doctor?.dName} → Patient {f.patient?.pName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
