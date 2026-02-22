import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const colors = {
    success: { bg: '#2e7d32', border: '#4caf50' },
    error: { bg: '#b71c1c', border: '#e53935' },
    info: { bg: '#1565c0', border: '#1e88e5' },
  };

  return (
    <div style={{ ...styles.toast, background: colors[type].bg, borderLeft: `4px solid ${colors[type].border}` }}>
      <span>{message}</span>
      <button onClick={onClose} style={styles.close}>✕</button>
    </div>
  );
};

const styles = {
  toast: {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    color: '#fff',
    padding: '0.9rem 1.2rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    zIndex: 9999,
    fontFamily: "'Georgia', serif",
    fontSize: '0.9rem',
    maxWidth: '320px',
    animation: 'slideIn 0.3s ease',
  },
  close: {
    background: 'transparent',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '0.9rem',
    padding: 0,
    marginLeft: 'auto',
  },
};

export default Toast;
