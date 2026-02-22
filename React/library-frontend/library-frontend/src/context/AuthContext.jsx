import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Since the backend has no auth endpoint, we simulate login by:
// - Librarian: special hardcoded credentials (librarian / lib123)
// - Member: any member can log in with their email + password (matched client-side against /members)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('lms_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    sessionStorage.setItem('lms_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('lms_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLibrarian: user?.role === 'LIBRARIAN' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
