import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api/api';
import Modal from '../components/Modal';
import { formStyles, FormField } from '../components/FormField';

function UserForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { name: '', email: '', password: '', mobileNo: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <FormField label="Full Name *">
        <input style={formStyles.input} placeholder="John Doe" value={form.name} onChange={e => set('name', e.target.value)} />
      </FormField>
      <FormField label="Email *">
        <input style={formStyles.input} type="email" placeholder="john@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
      </FormField>
      <FormField label="Password *">
        <input style={formStyles.input} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
      </FormField>
      <FormField label="Mobile No">
        <input style={formStyles.input} placeholder="+1 234 567 8900" value={form.mobileNo} onChange={e => set('mobileNo', e.target.value)} />
      </FormField>
      <div style={formStyles.btnRow}>
        <button style={formStyles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={formStyles.btnPrimary} onClick={() => {
          if (!form.name || !form.email || !form.password) return alert('Fill all required fields.');
          onSubmit(form);
        }}>Save</button>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { users, income, expenses, refresh } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleCreate = async (data) => { await api.users.create(data); setShowModal(false); refresh(); };
  const handleUpdate = async (data) => { await api.users.update(editing.userId, data); setEditing(null); refresh(); };
  const handleDelete = async (id) => { if (!confirm('Delete user? This may affect related data.')) return; await api.users.delete(id); refresh(); };

  const fmt = n => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const getUserStats = (userId) => {
    const userIncome = income.filter(i => i.user?.userId === userId).reduce((s, i) => s + i.amount, 0);
    const userExpenses = expenses.filter(e => e.user?.userId === userId).reduce((s, e) => s + e.amount, 0);
    return { income: userIncome, expenses: userExpenses, balance: userIncome - userExpenses };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>👤 Users</h2>
        <button style={formStyles.btnPrimary} onClick={() => setShowModal(true)}>+ Add User</button>
      </div>

      <div style={styles.grid}>
        {users.length === 0
          ? <p style={styles.empty}>No users yet. Register the first user!</p>
          : users.map(u => {
            const stats = getUserStats(u.userId);
            return (
              <div key={u.userId} style={styles.card}>
                <div style={styles.avatar}>{u.name[0]?.toUpperCase()}</div>
                <div style={styles.name}>{u.name}</div>
                <div style={styles.email}>{u.email}</div>
                {u.mobileNo && <div style={styles.mobile}>{u.mobileNo}</div>}
                <div style={styles.stats}>
                  <div style={styles.stat}><span style={{ color: '#10b981' }}>{fmt(stats.income)}</span><br /><span style={styles.statLabel}>Income</span></div>
                  <div style={styles.stat}><span style={{ color: '#ef4444' }}>{fmt(stats.expenses)}</span><br /><span style={styles.statLabel}>Expenses</span></div>
                  <div style={styles.stat}><span style={{ color: stats.balance >= 0 ? '#6366f1' : '#f59e0b' }}>{fmt(stats.balance)}</span><br /><span style={styles.statLabel}>Balance</span></div>
                </div>
                <div style={styles.joined}>Joined {u.createdAt?.slice(0, 10)}</div>
                <div style={styles.actions}>
                  <button style={formStyles.btnEdit} onClick={() => setEditing(u)}>Edit</button>
                  <button style={formStyles.btnDanger} onClick={() => handleDelete(u.userId)}>Delete</button>
                </div>
              </div>
            );
          })}
      </div>

      {showModal && (
        <Modal title="Register User" onClose={() => setShowModal(false)}>
          <UserForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
      {editing && (
        <Modal title="Edit User" onClose={() => setEditing(null)}>
          <UserForm
            initial={{ name: editing.name, email: editing.email, password: '', mobileNo: editing.mobileNo || '' }}
            onSubmit={handleUpdate} onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 24, maxWidth: 1000, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { color: '#e2e8f0', margin: 0, fontSize: 22, fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 },
  card: { background: '#1e293b', borderRadius: 12, padding: 24, border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' },
  avatar: {
    width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 24, fontWeight: 700, color: '#fff', margin: '0 auto 12px',
  },
  name: { color: '#e2e8f0', fontWeight: 700, fontSize: 16, marginBottom: 4 },
  email: { color: '#64748b', fontSize: 13, marginBottom: 4 },
  mobile: { color: '#64748b', fontSize: 12, marginBottom: 12 },
  stats: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '12px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', margin: '12px 0' },
  stat: { fontSize: 13, fontWeight: 700 },
  statLabel: { color: '#475569', fontSize: 11, fontWeight: 400 },
  joined: { color: '#475569', fontSize: 11, marginBottom: 12 },
  actions: { display: 'flex', gap: 8, justifyContent: 'center' },
  empty: { color: '#475569', padding: 40 },
};
