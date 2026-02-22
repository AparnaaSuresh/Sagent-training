import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const memberNav = [
  { label: 'Dashboard', icon: '🏠', path: '/' },
  { label: 'Browse Books', icon: '📚', path: '/books' },
  { label: 'My Borrows', icon: '📖', path: '/my-borrows' },
  { label: 'My Fines', icon: '💰', path: '/my-fines' },
  { label: 'Notifications', icon: '🔔', path: '/notifications' },
];

const librarianNav = [
  { group: 'Overview', items: [
    { label: 'Dashboard', icon: '🏠', path: '/' },
  ]},
  { group: 'Catalog', items: [
    { label: 'Books & Inventory', icon: '📚', path: '/books' },
    { label: 'Borrow Records', icon: '📋', path: '/borrows' },
  ]},
  { group: 'People', items: [
    { label: 'Members', icon: '👥', path: '/members' },
    { label: 'Fines', icon: '💰', path: '/fines' },
  ]},
  { group: 'System', items: [
    { label: 'Notifications', icon: '🔔', path: '/notifications' },
  ]},
];

export default function Sidebar() {
  const { user, logout, isLibrarian } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Library<br/>System</h1>
        <p>Management Portal</p>
      </div>

      <div className={`sidebar-role-badge ${isLibrarian ? 'librarian' : 'member'}`}>
        {isLibrarian ? '⚙ Librarian' : '🎓 Member'}
      </div>

      <nav className="sidebar-nav">
        {isLibrarian ? (
          librarianNav.map(group => (
            <div key={group.group}>
              <div className="nav-group-label">{group.group}</div>
              {group.items.map(item => (
                <div
                  key={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <span className="icon">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          memberNav.map(item => (
            <div
              key={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <span className="icon">{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-name">{user?.name}</div>
        <div>{user?.email}</div>
        <button className="logout-btn" onClick={logout}>Sign Out</button>
      </div>
    </aside>
  );
}
