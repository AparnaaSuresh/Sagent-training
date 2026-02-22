import { useApp } from '../context/AppContext';

function StatCard({ label, value, color, icon }) {
  return (
    <div style={{ ...styles.card, borderTop: `3px solid ${color}` }}>
      <div style={styles.cardIcon}>{icon}</div>
      <div style={{ ...styles.cardValue, color }}>{value}</div>
      <div style={styles.cardLabel}>{label}</div>
    </div>
  );
}

function RecentList({ title, items, renderItem }) {
  return (
    <div style={styles.listCard}>
      <h3 style={styles.listTitle}>{title}</h3>
      {items.length === 0
        ? <p style={styles.empty}>No records yet.</p>
        : items.slice(0, 5).map(renderItem)}
    </div>
  );
}

export default function Dashboard() {
  const { totalIncome, totalExpenses, balance, income, expenses, goals, currentUser, budgets, categories } = useApp();

  const filteredIncome = currentUser
    ? income.filter(i => i.user?.userId === currentUser.userId)
    : income;

  const filteredExpenses = currentUser
    ? expenses.filter(e => e.user?.userId === currentUser.userId)
    : expenses;

  const filteredGoals = currentUser
    ? goals.filter(g => g.user?.userId === currentUser.userId)
    : goals;

  // Expense by category breakdown
  const expByCategory = {};
  filteredExpenses.forEach(e => {
    const name = e.category?.categoryName || 'Uncategorized';
    expByCategory[name] = (expByCategory[name] || 0) + e.amount;
  });

  const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>
        {currentUser ? `Welcome back, ${currentUser.name}!` : 'Overview Dashboard'}
      </h2>

      <div style={styles.statsGrid}>
        <StatCard label="Total Income" value={fmt(totalIncome)} color="#10b981" icon="💰" />
        <StatCard label="Total Expenses" value={fmt(totalExpenses)} color="#ef4444" icon="🧾" />
        <StatCard label="Balance" value={fmt(balance)} color={balance >= 0 ? '#6366f1' : '#f59e0b'} icon="⚖️" />
        <StatCard label="Savings Goals" value={filteredGoals.length} color="#8b5cf6" icon="🎯" />
      </div>

      <div style={styles.grid2}>
        <RecentList
          title="📈 Recent Income"
          items={filteredIncome.sort((a, b) => new Date(b.incomeDate) - new Date(a.incomeDate))}
          renderItem={item => (
            <div key={item.incomeId} style={styles.listItem}>
              <div>
                <span style={styles.itemName}>{item.source}</span>
                <span style={styles.itemDate}>{item.incomeDate}</span>
              </div>
              <span style={{ color: '#10b981', fontWeight: 600 }}>{fmt(item.amount)}</span>
            </div>
          )}
        />

        <RecentList
          title="💸 Recent Expenses"
          items={filteredExpenses.sort((a, b) => new Date(b.expenseDate) - new Date(a.expenseDate))}
          renderItem={item => (
            <div key={item.expenseId} style={styles.listItem}>
              <div>
                <span style={styles.itemName}>{item.description || item.category?.categoryName}</span>
                <span style={styles.itemDate}>{item.expenseDate}</span>
              </div>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>{fmt(item.amount)}</span>
            </div>
          )}
        />
      </div>

      {Object.keys(expByCategory).length > 0 && (
        <div style={styles.listCard}>
          <h3 style={styles.listTitle}>📊 Spending by Category</h3>
          <div style={styles.catGrid}>
            {Object.entries(expByCategory).map(([cat, amt]) => {
              const pct = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0;
              return (
                <div key={cat} style={styles.catItem}>
                  <div style={styles.catRow}>
                    <span style={styles.catName}>{cat}</span>
                    <span style={styles.catAmt}>{fmt(amt)}</span>
                  </div>
                  <div style={styles.barBg}>
                    <div style={{ ...styles.barFill, width: `${pct}%` }} />
                  </div>
                  <span style={styles.catPct}>{pct.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredGoals.length > 0 && (
        <div style={styles.listCard}>
          <h3 style={styles.listTitle}>🎯 Savings Goals Progress</h3>
          {filteredGoals.map(goal => {
            const progress = Math.min((balance / goal.targetAmount) * 100, 100);
            return (
              <div key={goal.goalId} style={styles.goalItem}>
                <div style={styles.catRow}>
                  <span style={styles.catName}>{goal.goalName}</span>
                  <span style={styles.catAmt}>{fmt(goal.targetAmount)}</span>
                </div>
                <div style={styles.barBg}>
                  <div style={{ ...styles.barFill, width: `${Math.max(0, progress)}%`, background: 'linear-gradient(90deg, #8b5cf6, #6366f1)' }} />
                </div>
                <span style={styles.catPct}>Target: {goal.targetDate}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 24, maxWidth: 1100, margin: '0 auto' },
  heading: { color: '#e2e8f0', marginBottom: 24, fontSize: 24, fontWeight: 700 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 },
  card: {
    background: '#1e293b', borderRadius: 12, padding: 20,
    textAlign: 'center', border: '1px solid rgba(255,255,255,0.08)',
  },
  cardIcon: { fontSize: 28, marginBottom: 8 },
  cardValue: { fontSize: 26, fontWeight: 800, marginBottom: 4 },
  cardLabel: { color: '#64748b', fontSize: 13 },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 16 },
  listCard: { background: '#1e293b', borderRadius: 12, padding: 20, marginBottom: 16, border: '1px solid rgba(255,255,255,0.08)' },
  listTitle: { color: '#e2e8f0', margin: '0 0 16px', fontSize: 16, fontWeight: 700 },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  itemName: { color: '#cbd5e1', fontSize: 14, display: 'block' },
  itemDate: { color: '#475569', fontSize: 11 },
  empty: { color: '#475569', textAlign: 'center', padding: 20 },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 },
  catItem: { },
  catRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 4 },
  catName: { color: '#cbd5e1', fontSize: 13 },
  catAmt: { color: '#94a3b8', fontSize: 13, fontWeight: 600 },
  barBg: { background: 'rgba(255,255,255,0.05)', borderRadius: 4, height: 6, marginBottom: 2 },
  barFill: { height: '100%', background: 'linear-gradient(90deg, #ef4444, #f59e0b)', borderRadius: 4, transition: 'width 0.5s' },
  catPct: { color: '#475569', fontSize: 11 },
  goalItem: { marginBottom: 16 },
};
