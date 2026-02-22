import React, { useState, useEffect } from 'react';
import { notificationAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const NOTIFICATION_ICONS = {
  'Order Confirmed': '✅',
  'Out for Delivery': '🚴',
  'Delivered': '📦',
  default: '🔔',
};

const getIcon = (message = '') => {
  for (const [key, icon] of Object.entries(NOTIFICATION_ICONS)) {
    if (message.includes(key)) return icon;
  }
  return NOTIFICATION_ICONS.default;
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    notificationAPI.getAll()
      .then((res) => {
        // Filter notifications for this user if possible
        const data = res.data.filter(
          (n) => !n.customerId || n.customerId === user?.id || n.customer?.id === user?.id
        );
        setNotifications(data.reverse());
      })
      .catch(() => {
        // Fallback mock notifications
        setNotifications([
          { id: 1, message: 'Order Confirmed – Your order #1 has been confirmed!', createdAt: new Date().toISOString() },
          { id: 2, message: 'Out for Delivery – Your order is on the way!', createdAt: new Date(Date.now() - 3600000).toISOString() },
          { id: 3, message: 'Delivered – Your order #0 has been delivered!', createdAt: new Date(Date.now() - 86400000).toISOString() },
        ]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Notifications</h1>

      {loading ? (
        <div style={styles.loading}>Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyEmoji}>🔔</div>
          <p style={styles.emptyText}>No notifications yet.</p>
        </div>
      ) : (
        <div style={styles.list}>
          {notifications.map((notif) => (
            <div key={notif.id} style={styles.card}>
              <div style={styles.icon}>{getIcon(notif.message)}</div>
              <div style={styles.content}>
                <p style={styles.message}>{notif.message}</p>
                {notif.createdAt && (
                  <span style={styles.time}>
                    {new Date(notif.createdAt).toLocaleString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: { maxWidth: '680px', margin: '0 auto', padding: '2rem 1.5rem' },
  heading: {
    fontFamily: "'Georgia', serif",
    fontSize: '2rem',
    color: '#1a2e1a',
    marginBottom: '1.5rem',
    fontWeight: 700,
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
    fontFamily: "'Georgia', serif",
  },
  empty: { textAlign: 'center', padding: '4rem 2rem' },
  emptyEmoji: { fontSize: '3rem', marginBottom: '1rem' },
  emptyText: {
    color: '#666',
    fontFamily: "'Georgia', serif",
    fontSize: '1.05rem',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  card: {
    background: '#fff',
    borderRadius: '10px',
    border: '1px solid #e8f5e9',
    padding: '1rem 1.25rem',
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start',
    boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
  },
  icon: { fontSize: '1.8rem', flexShrink: 0 },
  content: { flex: 1 },
  message: {
    fontFamily: "'Georgia', serif",
    color: '#333',
    margin: '0 0 0.3rem',
    fontSize: '0.95rem',
    lineHeight: 1.5,
  },
  time: {
    fontFamily: "'Georgia', serif",
    color: '#999',
    fontSize: '0.8rem',
  },
};

export default Notifications;
