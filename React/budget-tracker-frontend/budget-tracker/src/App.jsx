import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import IncomePage from './pages/IncomePage';
import ExpensesPage from './pages/ExpensesPage';
import BudgetsPage from './pages/BudgetsPage';
import GoalsPage from './pages/GoalsPage';
import CategoriesPage from './pages/CategoriesPage';
import UsersPage from './pages/UsersPage';
import NotificationsPage from './pages/NotificationsPage';

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const { loading, error, currentUser, setCurrentUser } = useApp();

  const handleLogin = (user) => setCurrentUser(user);
  const handleLogout = () => setCurrentUser(null);

  // Show login page if not logged in
  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const pages = {
    dashboard: <Dashboard />,
    income: <IncomePage />,
    expenses: <ExpensesPage />,
    budgets: <BudgetsPage />,
    goals: <GoalsPage />,
    categories: <CategoriesPage />,
    users: <UsersPage />,
    notifications: <NotificationsPage />,
  };

  return (
    <div style={styles.app}>
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />
      <main style={styles.main}>
        {loading && <div style={styles.loader}>⏳ Loading...</div>}
        {error && <div style={styles.error}>⚠️ {error}</div>}
        {!loading && pages[activePage]}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = {
  app: { minHeight: '100vh', background: '#0f172a', fontFamily: "'Inter', -apple-system, sans-serif" },
  main: { minHeight: 'calc(100vh - 60px)' },
  loader: { color: '#6366f1', textAlign: 'center', padding: 60, fontSize: 18 },
  error: {
    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
    color: '#f87171', padding: '16px 24px', margin: 24, borderRadius: 10, fontSize: 14,
  },
};
