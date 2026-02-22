import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api/api';
import Modal from '../components/Modal';
import { formStyles, FormField } from '../components/FormField';

function BudgetForm({ initial, onSubmit, onCancel, users, categories }) {
  const expCategories = categories.filter(c => c.categoryType === 'EXPENSE');
  const [form, setForm] = useState(initial || { budgetAmount: '', monthYear: '', userId: '', categoryId: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.budgetAmount || !form.userId || !form.categoryId || !form.monthYear) return alert('Fill all fields.');
    onSubmit({
      budgetAmount: parseFloat(form.budgetAmount),
      monthYear: form.monthYear,
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
      <FormField label="Monthly Limit *">
        <input style={formStyles.input} type="number" step="0.01" placeholder="0.00" value={form.budgetAmount} onChange={e => set('budgetAmount', e.target.value)} />
      </FormField>
      <FormField label="Month/Year * (e.g. 2025-02)">
        <input style={formStyles.input} type="month" value={form.monthYear} onChange={e => set('monthYear', e.target.value)} />
      </FormField>
      <div style={formStyles.btnRow}>
        <button style={formStyles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={formStyles.btnPrimary} onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
}

export default function BudgetsPage() {
  const { budgets, expenses, users, categories, refresh, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = currentUser ? budgets.filter(b => b.user?.userId === currentUser.userId) : budgets;

  const handleCreate = async (data) => { await api.budgets.create(data); setShowModal(false); refresh(); };
  const handleUpdate = async (data) => { await api.budgets.update(editing.budgetId, data); setEditing(null); refresh(); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.budgets.delete(id); refresh(); };

  const fmt = n => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  // Calculate spending vs budget for each budget row
  const getSpent = (budget) => {
    return expenses
      .filter(e => e.user?.userId === budget.user?.userId
        && e.category?.categoryId === budget.category?.categoryId
        && e.expenseDate?.startsWith(budget.monthYear))
      .reduce((s, e) => s + e.amount, 0);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>📋 Budget Settings</h2>
        <button style={formStyles.btnPrimary} onClick={() => setShowModal(true)}>+ Set Budget</button>
      </div>

      {filtered.length === 0
        ? <div style={styles.empty}><p>No budgets set. Create monthly spending limits!</p></div>
        : (
          <div style={styles.grid}>
            {filtered.map(b => {
              const spent = getSpent(b);
              const pct = b.budgetAmount > 0 ? (spent / b.budgetAmount) * 100 : 0;
              const over = pct > 100;
              return (
                <div key={b.budgetId} style={{ ...styles.card, borderTop: `3px solid ${over ? '#ef4444' : '#10b981'}` }}>
                  <div style={styles.cardHeader}>
                    <div>
                      <div style={styles.catLabel}>{b.category?.categoryName}</div>
                      <div style={styles.monthLabel}>{b.monthYear} — {b.user?.name}</div>
                    </div>
                    <div style={styles.actions}>
                      <button style={formStyles.btnEdit} onClick={() => setEditing(b)}>Edit</button>
                      <button style={formStyles.btnDanger} onClick={() => handleDelete(b.budgetId)}>Del</button>
                    </div>
                  </div>
                  <div style={styles.amounts}>
                    <span style={styles.spent}>{fmt(spent)} <span style={styles.spentLabel}>spent</span></span>
                    <span style={styles.limit}>of {fmt(b.budgetAmount)}</span>
                  </div>
                  <div style={styles.barBg}>
                    <div style={{ ...styles.barFill, width: `${Math.min(pct, 100)}%`, background: over ? '#ef4444' : '#10b981' }} />
                  </div>
                  <div style={styles.pctRow}>
                    <span style={{ color: over ? '#ef4444' : '#10b981', fontSize: 13 }}>
                      {over ? '⚠️ Over budget!' : `${pct.toFixed(1)}% used`}
                    </span>
                    <span style={{ color: '#475569', fontSize: 13 }}>Remaining: {fmt(b.budgetAmount - spent)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {showModal && (
        <Modal title="Set Budget" onClose={() => setShowModal(false)}>
          <BudgetForm users={users} categories={categories} onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
      {editing && (
        <Modal title="Edit Budget" onClose={() => setEditing(null)}>
          <BudgetForm
            users={users} categories={categories}
            initial={{ budgetAmount: editing.budgetAmount, monthYear: editing.monthYear, userId: editing.user?.userId, categoryId: editing.category?.categoryId }}
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 },
  card: { background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  catLabel: { color: '#e2e8f0', fontWeight: 700, fontSize: 16 },
  monthLabel: { color: '#64748b', fontSize: 12, marginTop: 2 },
  actions: { display: 'flex', gap: 6 },
  amounts: { display: 'flex', justifyContent: 'space-between', marginBottom: 8 },
  spent: { color: '#e2e8f0', fontSize: 20, fontWeight: 700 },
  spentLabel: { color: '#64748b', fontSize: 13, fontWeight: 400 },
  limit: { color: '#64748b', fontSize: 13, alignSelf: 'flex-end' },
  barBg: { background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 8, marginBottom: 8 },
  barFill: { height: '100%', borderRadius: 6, transition: 'width 0.5s' },
  pctRow: { display: 'flex', justifyContent: 'space-between' },
  empty: { background: '#1e293b', borderRadius: 12, padding: 60, textAlign: 'center', color: '#475569' },
};
