import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', address: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Map form fields to backend Customer entity
      const payload = {
        name: form.name,
        email: form.email,
        address: form.address,
        contactDetails: form.phone,
      };
      const res = await customerAPI.register(payload);
      login(res.data);
      navigate('/products');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Registration failed. Please check your details or backend connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'name', label: 'Full Name', type: 'text', placeholder: 'John Doe' },
    { name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com' },
    { name: 'address', label: 'Delivery Address', type: 'text', placeholder: '123 Green St, Mumbai' },
    { name: 'phone', label: 'Contact Number', type: 'tel', placeholder: '+91 98765 43210' },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🥦</div>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join FreshBasket today</p>
        </div>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          {fields.map((f) => (
            <div key={f.name} style={styles.field}>
              <label style={styles.label}>{f.label}</label>
              <input
                type={f.type}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                required
                style={styles.input}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={styles.footer}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
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
    maxWidth: '440px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  icon: { fontSize: '3rem', marginBottom: '0.5rem' },
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
    gap: '1.1rem',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
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
};

export default Register;
