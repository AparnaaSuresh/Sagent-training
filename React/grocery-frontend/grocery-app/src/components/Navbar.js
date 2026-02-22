import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/products', label: 'Shop' },
    { to: '/orders', label: 'My Orders' },
    { to: '/notifications', label: 'Updates' },
  ];

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        🛒 <span style={styles.brandText}>FreshBasket</span>
      </Link>

      {/* Desktop links */}
      <div style={styles.links}>
        {isLoggedIn && navLinks.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            style={{
              ...styles.link,
              ...(location.pathname === l.to ? styles.activeLink : {}),
            }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div style={styles.right}>
        {isLoggedIn && (
          <Link to="/cart" style={styles.cartBtn}>
            🛍️
            {itemCount > 0 && <span style={styles.badge}>{itemCount}</span>}
          </Link>
        )}

        {isLoggedIn ? (
          <div style={styles.userGroup}>
            <span style={styles.greeting}>Hi, {user.name?.split(' ')[0]}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </div>
        ) : (
          <div style={styles.authGroup}>
            <Link to="/login" style={styles.loginBtn}>Login</Link>
            <Link to="/register" style={styles.registerBtn}>Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '64px',
    background: '#1a2e1a',
    boxShadow: '0 2px 12px rgba(0,0,0,0.25)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    textDecoration: 'none',
    fontSize: '1.4rem',
  },
  brandText: {
    fontFamily: "'Georgia', serif",
    fontWeight: 700,
    color: '#7ecb7e',
    letterSpacing: '-0.5px',
  },
  links: {
    display: 'flex',
    gap: '0.25rem',
  },
  link: {
    color: '#c8e6c9',
    textDecoration: 'none',
    padding: '0.4rem 0.9rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontFamily: "'Georgia', serif",
    transition: 'all 0.2s',
  },
  activeLink: {
    background: '#2e5c2e',
    color: '#7ecb7e',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  cartBtn: {
    position: 'relative',
    textDecoration: 'none',
    fontSize: '1.4rem',
    cursor: 'pointer',
  },
  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-8px',
    background: '#e53935',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '0.65rem',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
  },
  userGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  greeting: {
    color: '#a5d6a7',
    fontSize: '0.9rem',
    fontFamily: "'Georgia', serif",
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #4caf50',
    color: '#4caf50',
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    transition: 'all 0.2s',
  },
  authGroup: {
    display: 'flex',
    gap: '0.5rem',
  },
  loginBtn: {
    textDecoration: 'none',
    color: '#a5d6a7',
    padding: '0.3rem 0.9rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    border: '1px solid #4caf50',
    transition: 'all 0.2s',
  },
  registerBtn: {
    textDecoration: 'none',
    color: '#1a2e1a',
    padding: '0.3rem 0.9rem',
    borderRadius: '20px',
    fontSize: '0.85rem',
    background: '#4caf50',
    fontWeight: 600,
    transition: 'all 0.2s',
  },
};

export default Navbar;
