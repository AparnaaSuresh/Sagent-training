import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Fetch all customers and find by email
      const res = await customerAPI.getAll();
      const customers = res.data;
      const found = customers.find(
        (c) => c.email?.toLowerCase() === email.toLowerCase()
      );
      if (!found) {
        setError('No account found with that email. Please register first.');
      } else {
        login(found);
        navigate('/products');
      }
    } catch (err) {
      setError('Could not connect to server. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🛒</div>
          <h1 style={styles.title}>FreshBasket</h1>
          <p style={styles.subtitle}>Sign in to your account</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>Register here</Link>
        </p>

        <div style={styles.note}>
          <small style={styles.noteText}>
            💡 Tip: Use the email you registered with. No password required for this demo.
          </small>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a2e1a 0%, #2d4a2d 50%, #1a3a1a 100%)',
    padding: '2rem',
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  icon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  title: {
    fontFamily: "'Georgia', serif",
    color: '#1a2e1a',
    margin: '0 0 0.25rem',
    fontSize: '1.8rem',
    fontWeight: 700,
  },
  subtitle: {
    color: '#666',
    margin: 0,
    fontFamily: "'Georgia', serif",
    fontSize: '0.95rem',
  },
  errorBox: {
    background: '#fdecea',
    border: '1px solid #f44336',
    color: '#c62828',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    marginBottom: '1.25rem',
    fontSize: '0.875rem',
    fontFamily: "'Georgia', serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontFamily: "'Georgia', serif",
    fontSize: '0.875rem',
    color: '#333',
    fontWeight: 600,
  },
  input: {
    padding: '0.75rem 1rem',
    border: '1.5px solid #ddd',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontFamily: "'Georgia', serif",
    outline: 'none',
    transition: 'border 0.2s',
    color: '#222',
  },
  btn: {
    background: '#2e7d32',
    color: '#fff',
    border: 'none',
    padding: '0.85rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: "'Georgia', serif",
    fontWeight: 700,
    cursor: 'pointer',
    marginTop: '0.25rem',
    transition: 'background 0.2s',
  },
  footer: {
    textAlign: 'center',
    marginTop: '1.5rem',
    fontFamily: "'Georgia', serif",
    fontSize: '0.9rem',
    color: '#555',
  },
  link: {
    color: '#2e7d32',
    fontWeight: 700,
    textDecoration: 'none',
  },
  note: {
    marginTop: '1rem',
    background: '#f1f8e9',
    borderRadius: '8px',
    padding: '0.75rem',
    textAlign: 'center',
  },
  noteText: {
    color: '#558b2f',
    fontFamily: "'Georgia', serif",
  },
};

export default Login;
