import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import MembersPage from './pages/MembersPage';
import BorrowsPage from './pages/BorrowsPage';
import FinesPage from './pages/FinesPage';
import NotificationsPage from './pages/NotificationsPage';
import './styles.css';

function AppRoutes() {
  const { user, isLibrarian } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Member routes */}
          {!isLibrarian && (
            <>
              <Route path="/my-borrows" element={<BorrowsPage />} />
              <Route path="/my-fines" element={<FinesPage />} />
            </>
          )}

          {/* Librarian routes */}
          {isLibrarian && (
            <>
              <Route path="/borrows" element={<BorrowsPage />} />
              <Route path="/members" element={<MembersPage />} />
              <Route path="/fines" element={<FinesPage />} />
            </>
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
