import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { notificationsApi, membersApi } from '../services/api';
import { useToast } from '../components/Toast';

export default function NotificationsPage() {
  const { user, isLibrarian } = useAuth();
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ member: { memberId: '' }, message: '', sentDate: new Date().toISOString().split('T')[0] });

  const load = async () => {
    try {
      const [n, m] = await Promise.all([notificationsApi.getAll(), membersApi.getAll()]);
      setNotifications(n);
      setMembers(m);
    } catch (e) { toast('Error loading notifications', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const displayNotifications = isLibrarian
    ? notifications
    : notifications.filter(n => n.member?.memberId === user.memberId);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await notificationsApi.create(form);
      toast('Notification sent!');
      setModal(false);
      load();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  };

  const handleDelete = async (n) => {
    if (!window.confirm('Delete this notification?')) return;
    try { await notificationsApi.delete(n.notificationId); toast('Deleted.'); load(); }
    catch (err) { toast('Error: ' + err.message, 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Notifications</h2>
          <p>{isLibrarian ? 'Send and manage library notifications' : 'Your library reminders and alerts'}</p>
        </div>
        {isLibrarian && (
          <button className="btn btn-primary" onClick={() => {
            setForm({ member: { memberId: '' }, message: '', sentDate: new Date().toISOString().split('T')[0] });
            setModal(true);
          }}>+ Send Notification</button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {displayNotifications.length === 0 ? (
          <div className="card">
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <p>No notifications yet</p>
            </div>
          </div>
        ) : displayNotifications.map(n => (
          <div key={n.notificationId} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16, flex: 1 }}>
              <div style={{ width: 40, height: 40, background: 'var(--cream-dark)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>🔔</div>
              <div>
                {isLibrarian && <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--forest)', marginBottom: 2 }}>To: {n.member?.name}</div>}
                <div style={{ color: 'var(--ink)', fontSize: '0.92rem' }}>{n.message}</div>
                <div style={{ color: 'var(--ink-soft)', fontSize: '0.78rem', marginTop: 4 }}>📅 {n.sentDate}</div>
              </div>
            </div>
            {isLibrarian && (
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(n)}>Delete</button>
            )}
          </div>
        ))}
      </div>

      {modal && (
        <div className="modal-backdrop" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Send Notification</h3>
              <button className="modal-close" onClick={() => setModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAdd}>
              <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                <div className="form-group">
                  <label>Member</label>
                  <select required value={form.member.memberId}
                    onChange={e => setForm(f => ({ ...f, member: { memberId: parseInt(e.target.value) } }))}>
                    <option value="">Select member…</option>
                    {members.map(m => <option key={m.memberId} value={m.memberId}>{m.name} ({m.email})</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Message</label>
                  <input required value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="e.g. Your book is due tomorrow!" />
                </div>
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" required value={form.sentDate}
                    onChange={e => setForm(f => ({ ...f, sentDate: e.target.value }))} />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">Send</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
