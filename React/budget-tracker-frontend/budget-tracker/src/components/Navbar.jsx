import { useApp } from '../context/AppContext';

const tabs = [
  { id: 'dashboard', label: '📊 Dashboard' },
  { id: 'income', label: '💰 Income' },
  { id: 'expenses', label: '🧾 Expenses' },
  { id: 'budgets', label: '📋 Budgets' },
  { id: 'goals', label: '🎯 Goals' },
  { id: 'categories', label: '🏷️ Categories' },
  { id: 'users', label: '👤 Users' },
  { id: 'notifications', label: '🔔 Notifications' },
];

export default function Navbar({ activePage, setActivePage, onLogout }) {
  const { currentUser, notifications } = useApp();
  const unread = notifications.filter(n => n.user?.userId === currentUser?.userId && n.status === 'UNREAD').length;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <span style={styles.logo}>💼</span>
        <span style={styles.brandName}>BudgetManager</span>
      </div>

      <div style={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            style={{ ...styles.tab, ...(activePage === tab.id ? styles.activeTab : {}) }}
            onClick={() => setActivePage(tab.id)}
          >
            {tab.label}
            {tab.id === 'notifications' && unread > 0 && (
              <span style={styles.badge}>{unread}</span>
            )}
          </button>
        ))}
      </div>

      <div style={styles.userArea}>
        <div style={styles.userInfo}>
          <div style={styles.avatar}>{currentUser?.name?.[0]?.toUpperCase()}</div>
          <div style={styles.userDetails}>
            <div style={styles.userName}>{currentUser?.name}</div>
            <div style={styles.userEmail}>{currentUser?.email}</div>
          </div>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout}>⏏ Logout</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex', alignItems: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '0 20px', height: 60, position: 'sticky', top: 0, zIndex: 100,
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)', gap: 12,
  },
  brand: { display: 'flex', alignItems: 'center', gap: 8, minWidth: 150 },
  logo: { fontSize: 22 },
  brandName: { color: '#e2e8f0', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' },
  tabs: { display: 'flex', gap: 2, flex: 1, overflowX: 'auto' },
  tab: {
    padding: '6px 10px', background: 'transparent', border: 'none',
    color: '#94a3b8', cursor: 'pointer', borderRadius: 6, fontSize: 12,
    whiteSpace: 'nowrap', transition: 'all 0.2s', position: 'relative',
  },
  activeTab: { background: 'rgba(99,102,241,0.3)', color: '#a5b4fc', fontWeight: 600 },
  badge: {
    position: 'absolute', top: 2, right: 2, background: '#ef4444', color: '#fff',
    fontSize: 10, fontWeight: 700, borderRadius: '50%', width: 16, height: 16,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  userArea: {
    display: 'flex', alignItems: 'center', gap: 10, minWidth: 200,
    borderLeft: '1px solid rgba(255,255,255,0.08)', paddingLeft: 12,
  },
  userInfo: { display: 'flex', alignItems: 'center', gap: 8 },
  avatar: {
    width: 32, height: 32, borderRadius: '50%',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0,
  },
  userDetails: { display: 'flex', flexDirection: 'column' },
  userName: { color: '#e2e8f0', fontSize: 13, fontWeight: 600, lineHeight: 1.2 },
  userEmail: { color: '#475569', fontSize: 11 },
  logoutBtn: {
    padding: '5px 10px', background: 'rgba(239,68,68,0.15)',
    border: '1px solid rgba(239,68,68,0.25)', borderRadius: 6,
    color: '#f87171', cursor: 'pointer', fontSize: 11, fontWeight: 600,
    whiteSpace: 'nowrap',
  },
};
