import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api/api';
import Modal from '../components/Modal';
import { formStyles, FormField } from '../components/FormField';

function GoalForm({ initial, onSubmit, onCancel, users }) {
  const [form, setForm] = useState(initial || { goalName: '', targetAmount: '', targetDate: '', userId: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.goalName || !form.targetAmount || !form.userId) return alert('Fill all required fields.');
    onSubmit({
      goalName: form.goalName,
      targetAmount: parseFloat(form.targetAmount),
      targetDate: form.targetDate || null,
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
      <FormField label="Goal Name *">
        <input style={formStyles.input} placeholder="e.g. Vacation Fund, Emergency Savings" value={form.goalName} onChange={e => set('goalName', e.target.value)} />
      </FormField>
      <FormField label="Target Amount *">
        <input style={formStyles.input} type="number" step="0.01" placeholder="0.00" value={form.targetAmount} onChange={e => set('targetAmount', e.target.value)} />
      </FormField>
      <FormField label="Target Date">
        <input style={formStyles.input} type="date" value={form.targetDate} onChange={e => set('targetDate', e.target.value)} />
      </FormField>
      <div style={formStyles.btnRow}>
        <button style={formStyles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={formStyles.btnPrimary} onClick={handleSubmit}>Save</button>
      </div>
    </div>
  );
}

export default function GoalsPage() {
  const { goals, users, income, expenses, refresh, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const filtered = currentUser ? goals.filter(g => g.user?.userId === currentUser.userId) : goals;

  const handleCreate = async (data) => { await api.goals.create(data); setShowModal(false); refresh(); };
  const handleUpdate = async (data) => { await api.goals.update(editing.goalId, data); setEditing(null); refresh(); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.goals.delete(id); refresh(); };

  const fmt = n => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  const getUserBalance = (userId) => {
    const userIncome = income.filter(i => i.user?.userId === userId).reduce((s, i) => s + i.amount, 0);
    const userExpenses = expenses.filter(e => e.user?.userId === userId).reduce((s, e) => s + e.amount, 0);
    return userIncome - userExpenses;
  };

  const getDaysLeft = (targetDate) => {
    if (!targetDate) return null;
    const diff = new Date(targetDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🎯 Savings Goals</h2>
        <button style={formStyles.btnPrimary} onClick={() => setShowModal(true)}>+ New Goal</button>
      </div>

      {filtered.length === 0
        ? <div style={styles.empty}><p>No goals yet. Set your first savings goal!</p></div>
        : (
          <div style={styles.grid}>
            {filtered.map(goal => {
              const balance = getUserBalance(goal.user?.userId);
              const pct = goal.targetAmount > 0 ? Math.min((balance / goal.targetAmount) * 100, 100) : 0;
              const daysLeft = getDaysLeft(goal.targetDate);
              const achieved = balance >= goal.targetAmount;
              return (
                <div key={goal.goalId} style={{ ...styles.card, borderTop: `3px solid ${achieved ? '#10b981' : '#8b5cf6'}` }}>
                  <div style={styles.cardTop}>
                    <div>
                      <div style={styles.goalIcon}>{achieved ? '✅' : '🎯'}</div>
                      <div style={styles.goalName}>{goal.goalName}</div>
                      <div style={styles.goalUser}>{goal.user?.name}</div>
                    </div>
                    <div style={styles.actions}>
                      <button style={formStyles.btnEdit} onClick={() => setEditing(goal)}>Edit</button>
                      <button style={formStyles.btnDanger} onClick={() => handleDelete(goal.goalId)}>Del</button>
                    </div>
                  </div>

                  <div style={styles.targetAmt}>{fmt(goal.targetAmount)}</div>
                  <div style={styles.currentAmt}>Current balance: {fmt(balance)}</div>

                  <div style={styles.barBg}>
                    <div style={{ ...styles.barFill, width: `${Math.max(0, pct)}%` }} />
                  </div>

                  <div style={styles.footer}>
                    <span style={{ color: achieved ? '#10b981' : '#8b5cf6', fontWeight: 600 }}>
                      {achieved ? '🎉 Goal reached!' : `${pct.toFixed(1)}% complete`}
                    </span>
                    {daysLeft !== null && (
                      <span style={{ color: daysLeft < 0 ? '#ef4444' : '#64748b', fontSize: 13 }}>
                        {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {showModal && (
        <Modal title="New Savings Goal" onClose={() => setShowModal(false)}>
          <GoalForm users={users} onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
      {editing && (
        <Modal title="Edit Goal" onClose={() => setEditing(null)}>
          <GoalForm
            users={users}
            initial={{ goalName: editing.goalName, targetAmount: editing.targetAmount, targetDate: editing.targetDate, userId: editing.user?.userId }}
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 },
  card: { background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.08)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  goalIcon: { fontSize: 24, marginBottom: 4 },
  goalName: { color: '#e2e8f0', fontWeight: 700, fontSize: 16 },
  goalUser: { color: '#64748b', fontSize: 12 },
  actions: { display: 'flex', gap: 6 },
  targetAmt: { color: '#8b5cf6', fontSize: 26, fontWeight: 800, marginBottom: 2 },
  currentAmt: { color: '#64748b', fontSize: 13, marginBottom: 12 },
  barBg: { background: 'rgba(255,255,255,0.05)', borderRadius: 6, height: 8, marginBottom: 10 },
  barFill: { height: '100%', background: 'linear-gradient(90deg, #8b5cf6, #6366f1)', borderRadius: 6, transition: 'width 0.5s' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  empty: { background: '#1e293b', borderRadius: 12, padding: 60, textAlign: 'center', color: '#475569' },
};
