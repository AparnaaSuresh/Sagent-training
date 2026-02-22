import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { membersApi } from '../services/api';

const LIBRARIAN_EMAIL = 'librarian@library.com';
const LIBRARIAN_PASS = 'lib123';

export default function LoginPage() {
  const { login } = useAuth();
  const [tab, setTab] = useState('member'); // 'member' | 'librarian'
  const [form, setForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', phoneNo: '', address: '', category: 'Student' });
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMemberLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const members = await membersApi.getAll();
      const found = members.find(m => m.email === form.email && m.password === form.password);
      if (!found) { setError('Invalid email or password.'); return; }
      login({ role: 'MEMBER', name: found.name, email: found.email, memberId: found.memberId });
    } catch {
      setError('Could not connect to server. Make sure backend is running on port 8081.');
    } finally { setLoading(false); }
  };

  const handleLibrarianLogin = (e) => {
    e.preventDefault();
    setError('');
    if (form.email === LIBRARIAN_EMAIL && form.password === LIBRARIAN_PASS) {
      login({ role: 'LIBRARIAN', name: 'Head Librarian', email: LIBRARIAN_EMAIL });
    } else {
      setError('Invalid librarian credentials.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await membersApi.create(regForm);
      setMode('login');
      setForm({ email: regForm.email, password: regForm.password });
      setError('');
      alert('Registration successful! You can now log in.');
    } catch (err) {
      setError('Registration failed: ' + err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div className="decorative-line"></div>
        <h1>Library<br/>Management<br/>System</h1>
        <p>A unified platform for managing books, borrowing records, and library operations efficiently.</p>
      </div>
      <div className="login-right">
        <div className="login-box">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to access the library portal</p>

          <div className="login-tabs">
            <div className={`login-tab ${tab === 'member' ? 'active' : ''}`} onClick={() => { setTab('member'); setError(''); setMode('login'); }}>Member</div>
            <div className={`login-tab ${tab === 'librarian' ? 'active' : ''}`} onClick={() => { setTab('librarian'); setError(''); setMode('login'); }}>Librarian</div>
          </div>

          {mode === 'login' ? (
            <form onSubmit={tab === 'member' ? handleMemberLogin : handleLibrarianLogin}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Email</label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder={tab === 'librarian' ? 'librarian@library.com' : 'your@email.com'} />
              </div>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Password</label>
                <input type="password" required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder={tab === 'librarian' ? 'lib123' : '••••••••'} />
              </div>
              {error && <div className="login-error">{error}</div>}
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 16, padding: '11px' }} disabled={loading}>
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
              {tab === 'member' && (
                <p style={{ textAlign: 'center', marginTop: 14, fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                  No account?{' '}
                  <span style={{ color: 'var(--forest)', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setMode('register'); setError(''); }}>
                    Register here
                  </span>
                </p>
              )}
              {tab === 'librarian' && (
                <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.78rem', color: 'var(--ink-soft)' }}>
                  Demo: librarian@library.com / lib123
                </p>
              )}
            </form>
          ) : (
            <form onSubmit={handleRegister}>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                {[['name','Name','text'],['email','Email','email'],['password','Password','password'],['phoneNo','Phone','text'],['address','Address','text']].map(([field, label, type]) => (
                  <div className="form-group" key={field} style={field === 'address' ? { gridColumn: '1 / -1' } : {}}>
                    <label>{label}</label>
                    <input type={type} required value={regForm[field]}
                      onChange={e => setRegForm(f => ({ ...f, [field]: e.target.value }))} />
                  </div>
                ))}
                <div className="form-group">
                  <label>Category</label>
                  <select value={regForm.category} onChange={e => setRegForm(f => ({ ...f, category: e.target.value }))}>
                    <option>Student</option>
                    <option>Staff</option>
                    <option>Faculty</option>
                  </select>
                </div>
              </div>
              {error && <div className="login-error">{error}</div>}
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 8, padding: '11px' }} disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
              <p style={{ textAlign: 'center', marginTop: 12, fontSize: '0.85rem', color: 'var(--ink-soft)' }}>
                Already have an account?{' '}
                <span style={{ color: 'var(--forest)', cursor: 'pointer', fontWeight: 600 }} onClick={() => { setMode('login'); setError(''); }}>
                  Sign in
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
