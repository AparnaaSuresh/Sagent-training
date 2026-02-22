import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { patientAPI, doctorAPI } from '../services/api';

export default function LoginPage() {
  const [role, setRole] = useState('patient');
  const [form, setForm] = useState({ id: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setCurrentUser, showNotification } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!form.id || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      let user;
      if (role === 'patient') {
        const res = await patientAPI.getById(form.id);
        const p = res.data;
        if (p.password !== form.password) throw new Error('Invalid credentials');
        user = { role: 'patient', id: p.patientId, name: p.pName };
      } else {
        const res = await doctorAPI.getById(form.id);
        const d = res.data;
        if (d.password !== form.password) throw new Error('Invalid credentials');
        user = { role: 'doctor', id: d.doctorId, name: d.dName };
      }
      setCurrentUser(user);
      showNotification(`Welcome back, ${user.name}!`);
      navigate('/');
    } catch {
      setError('Invalid ID or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span className="icon">🏥</span>
          <h1>HealthMonitor</h1>
          <p>Patient Monitoring System</p>
        </div>

        <div className="role-tabs">
          <button
            className={`role-tab${role === 'patient' ? ' active' : ''}`}
            onClick={() => setRole('patient')}
          >
            👤 Patient
          </button>
          <button
            className={`role-tab${role === 'doctor' ? ' active' : ''}`}
            onClick={() => setRole('doctor')}
          >
            🩺 Doctor
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">
              {role === 'patient' ? 'Patient ID' : 'Doctor ID'}
            </label>
            <input
              type="number"
              name="id"
              className="form-control"
              placeholder={`Enter your ${role === 'patient' ? 'patient' : 'doctor'} ID`}
              value={form.id}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {error && (
            <div style={{
              background: '#fee2e2', color: '#dc2626', padding: '10px 14px',
              borderRadius: '8px', fontSize: '13px', marginBottom: '16px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '15px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--gray-500)' }}>
          New patient?{' '}
          <span
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => navigate('/patients')}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
