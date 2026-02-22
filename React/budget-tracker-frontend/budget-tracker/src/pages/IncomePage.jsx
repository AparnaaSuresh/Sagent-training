import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api/api';
import Modal from '../components/Modal';
import { formStyles, FormField } from '../components/FormField';

function IncomeForm({ initial, onSubmit, onCancel, users }) {
  const [form, setForm] = useState(initial || { source: '', amount: '', incomeDate: '', userId: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.source || !form.amount || !form.userId) return alert('Please fill all required fields.');
    onSubmit({
      source: form.source,
      amount: parseFloat(form.amount),
      incomeDate: form.incomeDate || new Date().toISOString().slice(0, 10),
      user: { userId: Number(form.userId) },
    });
  };

  return (
    <div>
      <FormField label="User *">
        <select style={formStyles.select} value={form.userId} onChange={e => set('userId', e.target.value)}>
          <option value="">Select user</option>
          {users.map(u => <option key={u.userId} value={u.userId}>{u.name}</option>)}
        </select>
      </FormField>
      <FormField label="Source *">
        <input style={formStyles.input} placeholder="e.g. Salary, Freelance" value={form.source} onChange={e => set('source', e.target.value)} />
      </FormField>
      <FormField label="Amount *">
        <input style={formStyles.input} type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)} />
      </FormField>
      <FormField label="Date">
        <input style={formStyles.input} type="date" value={form.incomeDate} onChange={e => set('incomeDate', e.target.value)} />
      </FormField>
      <div style={formStyles.btnRow}>
        <button style={formStyles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={formStyles.btnPrimary} onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
}

export default function IncomePage() {
  const { income, users, refresh, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = currentUser ? income.filter(i => i.user?.userId === currentUser.userId) : income;
  const total = filtered.reduce((s, i) => s + i.amount, 0);

  const handleCreate = async (data) => {
    await api.income.create(data);
    setShowModal(false);
    refresh();
  };

  const handleUpdate = async (data) => {
    await api.income.update(editing.incomeId, data);
    setEditing(null);
    refresh();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this income record?')) return;
    await api.income.delete(id);
    refresh();
  };

  const fmt = n => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>💰 Income</h2>
          <p style={styles.sub}>Total: <span style={{ color: '#10b981', fontWeight: 700 }}>{fmt(total)}</span></p>
        </div>
        <button style={formStyles.btnPrimary} onClick={() => setShowModal(true)}>+ Add Income</button>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHead}>
          <span>User</span><span>Source</span><span>Amount</span><span>Date</span><span>Actions</span>
        </div>
        {filtered.length === 0
          ? <p style={styles.empty}>No income records. Add your first one!</p>
          : filtered.map(item => (
            <div key={item.incomeId} style={styles.row}>
              <span style={styles.cell}>{item.user?.name || '—'}</span>
              <span style={styles.cell}>{item.source}</span>
              <span style={{ ...styles.cell, color: '#10b981', fontWeight: 600 }}>{fmt(item.amount)}</span>
              <span style={styles.cell}>{item.incomeDate}</span>
              <span style={styles.cell}>
                <button style={formStyles.btnEdit} onClick={() => setEditing(item)}>Edit</button>
                {' '}
                <button style={formStyles.btnDanger} onClick={() => handleDelete(item.incomeId)}>Delete</button>
              </span>
            </div>
          ))}
      </div>

      {showModal && (
        <Modal title="Add Income" onClose={() => setShowModal(false)}>
          <IncomeForm users={users} onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
        </Modal>
      )}

      {editing && (
        <Modal title="Edit Income" onClose={() => setEditing(null)}>
          <IncomeForm
            users={users}
            initial={{ source: editing.source, amount: editing.amount, incomeDate: editing.incomeDate, userId: editing.user?.userId }}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 24, maxWidth: 1000, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { color: '#e2e8f0', margin: 0, fontSize: 22, fontWeight: 700 },
  sub: { color: '#64748b', margin: '4px 0 0', fontSize: 14 },
  table: { background: '#1e293b', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' },
  tableHead: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    padding: '12px 20px', background: '#0f172a', color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
  },
  row: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
    padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
    alignItems: 'center', transition: 'background 0.2s',
  },
  cell: { color: '#cbd5e1', fontSize: 14 },
  empty: { color: '#475569', textAlign: 'center', padding: 40 },
};
