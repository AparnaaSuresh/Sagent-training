import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api/api';
import Modal from '../components/Modal';
import { formStyles, FormField } from '../components/FormField';

function NotifForm({ initial, onSubmit, onCancel, users }) {
  const [form, setForm] = useState(initial || { message: '', userId: '', status: 'UNREAD', notificationDate: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <FormField label="User *">
        <select style={formStyles.select} value={form.userId} onChange={e => set('userId', e.target.value)}>
          <option value="">Select user</option>
          {users.map(u => <option key={u.userId} value={u.userId}>{u.name}</option>)}
        </select>
      </FormField>
      <FormField label="Message *">
        <input style={formStyles.input} placeholder="Notification message" value={form.message} onChange={e => set('message', e.target.value)} />
      </FormField>
      <FormField label="Status">
        <select style={formStyles.select} value={form.status} onChange={e => set('status', e.target.value)}>
          <option value="UNREAD">Unread</option>
          <option value="READ">Read</option>
        </select>
      </FormField>
      <FormField label="Date">
        <input style={formStyles.input} type="date" value={form.notificationDate} onChange={e => set('notificationDate', e.target.value)} />
      </FormField>
      <div style={formStyles.btnRow}>
        <button style={formStyles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={formStyles.btnPrimary} onClick={() => {
          if (!form.message || !form.userId) return alert('Fill required fields.');
          onSubmit({
            message: form.message,
            status: form.status,
            notificationDate: form.notificationDate || new Date().toISOString().slice(0, 10),
            user: { userId: Number(form.userId) },
          });
        }}>Save</button>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const { notifications, users, refresh, currentUser } = useApp();
  const [showModal, setShowModal] = useState(false);

  const filtered = currentUser ? notifications.filter(n => n.user?.userId === currentUser.userId) : notifications;
  const unread = filtered.filter(n => n.status === 'UNREAD').length;

  const markRead = async (notif) => {
    await api.notifications.update(notif.notificationId, { ...notif, status: 'READ', user: { userId: notif.user?.userId } });
    refresh();
  };

  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.notifications.delete(id); refresh(); };
  const handleCreate = async (data) => { await api.notifications.create(data); setShowModal(false); refresh(); };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🔔 Notifications</h2>
          {unread > 0 && <span style={styles.badge}>{unread} unread</span>}
        </div>
        <button style={formStyles.btnPrimary} onClick={() => setShowModal(true)}>+ New Notification</button>
      </div>

      {filtered.length === 0
        ? <div style={styles.empty}><p>No notifications.</p></div>
        : filtered.map(n => (
          <div key={n.notificationId} style={{ ...styles.item, opacity: n.status === 'READ' ? 0.6 : 1 }}>
            <div style={styles.dot(n.status)} />
            <div style={styles.content}>
              <div style={styles.message}>{n.message}</div>
              <div style={styles.meta}>{n.user?.name} · {n.notificationDate}</div>
            </div>
            <div style={styles.actions}>
              {n.status === 'UNREAD' && (
                <button style={formStyles.btnEdit} onClick={() => markRead(n)}>Mark Read</button>
              )}
              <button style={formStyles.btnDanger} onClick={() => handleDelete(n.notificationId)}>Delete</button>
            </div>
          </div>
        ))}

      {showModal && (
        <Modal title="New Notification" onClose={() => setShowModal(false)}>
          <NotifForm users={users} onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 24, maxWidth: 800, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { color: '#e2e8f0', margin: 0, fontSize: 22, fontWeight: 700 },
  badge: { background: 'rgba(239,68,68,0.2)', color: '#f87171', padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600 },
  item: {
    background: '#1e293b', borderRadius: 10, padding: 16, marginBottom: 10,
    display: 'flex', alignItems: 'center', gap: 14,
    border: '1px solid rgba(255,255,255,0.08)',
  },
  dot: (status) => ({
    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
    background: status === 'UNREAD' ? '#6366f1' : '#374151',
  }),
  content: { flex: 1 },
  message: { color: '#cbd5e1', fontSize: 14, marginBottom: 4 },
  meta: { color: '#475569', fontSize: 12 },
  actions: { display: 'flex', gap: 8 },
  empty: { background: '#1e293b', borderRadius: 12, padding: 60, textAlign: 'center', color: '#475569' },
};
