import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api/api';
import Modal from '../components/Modal';
import { formStyles, FormField } from '../components/FormField';

function ExpenseForm({ initial, onSubmit, onCancel, users, categories }) {
  const expCategories = categories.filter(c => c.categoryType === 'EXPENSE');
  const [form, setForm] = useState(initial || { description: '', amount: '', expenseDate: '', userId: '', categoryId: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.amount || !form.userId || !form.categoryId) return alert('Please fill all required fields.');
    onSubmit({
      description: form.description,
      amount: parseFloat(form.amount),
      expenseDate: form.expenseDate || new Date().toISOString().slice(0, 10),
      user: { userId: Number(form.userId) },
      category: { categoryId: Number(form.categoryId) },
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
      <FormField label="Category *">
        <select style={formStyles.select} value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
          <option value="">Select category</option>
          {expCategories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
        </select>
      </FormField>
      <FormField label="Description">
        <input style={formStyles.input} placeholder="What was this expense for?" value={form.description} onChange={e => set('description', e.target.value)} />
      </FormField>
      <FormField label="Amount *">
        <input style={formStyles.input} type="number" step="0.01" placeholder="0.00" value={form.amount} onChange={e => set('amount', e.target.value)} />
      </FormField>
      <FormField label="Date">
        <input style={formStyles.input} type="date" value={form.expenseDate} onChange={e => set('expenseDate', e.target.value)} />
      </FormField>
      <div style={formStyles.btnRow}>
        <button style={formStyles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={formStyles.btnPrimary} onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
}

export default function ExpensesPage() {
  const { expenses, users, categories, refresh, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterCat, setFilterCat] = useState('');

  const filtered = expenses
    .filter(e => !currentUser || e.user?.userId === currentUser.userId)
    .filter(e => !filterCat || e.category?.categoryId === Number(filterCat));

  const total = filtered.reduce((s, e) => s + e.amount, 0);
  const fmt = n => `₹${Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const handleCreate = async (data) => { await api.expenses.create(data); setShowModal(false); refresh(); };
  const handleUpdate = async (data) => { await api.expenses.update(editing.expenseId, data); setEditing(null); refresh(); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.expenses.delete(id); refresh(); };

  const expCategories = categories.filter(c => c.categoryType === 'EXPENSE');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🧾 Expenses</h2>
          <p style={styles.sub}>Total: <span style={{ color: '#ef4444', fontWeight: 700 }}>{fmt(total)}</span></p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select style={{ ...formStyles.select, width: 160 }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">All categories</option>
            {expCategories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
          </select>
          <button style={formStyles.btnPrimary} onClick={() => setShowModal(true)}>+ Add Expense</button>
        </div>
      </div>

      <div style={styles.table}>
        <div style={styles.tableHead}>
          <span>User</span><span>Category</span><span>Description</span><span>Amount</span><span>Date</span><span>Actions</span>
        </div>
        {filtered.length === 0
          ? <p style={styles.empty}>No expenses found.</p>
          : filtered.map(item => (
            <div key={item.expenseId} style={styles.row}>
              <span style={styles.cell}>{item.user?.name || '—'}</span>
              <span style={styles.cell}><span style={styles.badge}>{item.category?.categoryName || '—'}</span></span>
              <span style={styles.cell}>{item.description || '—'}</span>
              <span style={{ ...styles.cell, color: '#ef4444', fontWeight: 600 }}>{fmt(item.amount)}</span>
              <span style={styles.cell}>{item.expenseDate}</span>
              <span style={styles.cell}>
                <button style={formStyles.btnEdit} onClick={() => setEditing(item)}>Edit</button>{' '}
                <button style={formStyles.btnDanger} onClick={() => handleDelete(item.expenseId)}>Delete</button>
              </span>
            </div>
          ))}
      </div>

      {showModal && (
        <Modal title="Add Expense" onClose={() => setShowModal(false)}>
          <ExpenseForm users={users} categories={categories} onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
      {editing && (
        <Modal title="Edit Expense" onClose={() => setEditing(null)}>
          <ExpenseForm
            users={users} categories={categories}
            initial={{ description: editing.description, amount: editing.amount, expenseDate: editing.expenseDate, userId: editing.user?.userId, categoryId: editing.category?.categoryId }}
            onSubmit={handleUpdate} onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 24, maxWidth: 1100, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { color: '#e2e8f0', margin: 0, fontSize: 22, fontWeight: 700 },
  sub: { color: '#64748b', margin: '4px 0 0', fontSize: 14 },
  table: { background: '#1e293b', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' },
  tableHead: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr 1fr 1fr 1fr',
    padding: '12px 20px', background: '#0f172a', color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase',
  },
  row: {
    display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr 1fr 1fr 1fr',
    padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center',
  },
  cell: { color: '#cbd5e1', fontSize: 14 },
  badge: { background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', padding: '2px 8px', borderRadius: 12, fontSize: 12 },
  empty: { color: '#475569', textAlign: 'center', padding: 40 },
};
