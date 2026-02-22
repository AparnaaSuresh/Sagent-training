import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [goals, setGoals] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [u, i, e, c, b, g, n] = await Promise.all([
        api.users.getAll(),
        api.income.getAll(),
        api.expenses.getAll(),
        api.categories.getAll(),
        api.budgets.getAll(),
        api.goals.getAll(),
        api.notifications.getAll(),
      ]);
      setUsers(u || []);
      setIncome(i || []);
      setExpenses(e || []);
      setCategories(c || []);
      setBudgets(b || []);
      setGoals(g || []);
      setNotifications(n || []);
    } catch (err) {
      setError('Failed to connect to backend. Make sure the server is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const totalIncome = income
    .filter(i => !currentUser || i.user?.userId === currentUser.userId)
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  const totalExpenses = expenses
    .filter(e => !currentUser || e.user?.userId === currentUser.userId)
    .reduce((sum, e) => sum + (e.amount || 0), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser,
      users, setUsers,
      income, setIncome,
      expenses, setExpenses,
      categories, setCategories,
      budgets, setBudgets,
      goals, setGoals,
      notifications, setNotifications,
      loading, error,
      totalIncome, totalExpenses, balance,
      refresh: fetchAll,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
