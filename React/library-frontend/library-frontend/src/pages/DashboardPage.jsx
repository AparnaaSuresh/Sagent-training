import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { inventoryApi, borrowsApi, finesApi, membersApi, notificationsApi } from '../services/api';

export default function DashboardPage() {
  const { user, isLibrarian } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [recentBorrows, setRecentBorrows] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        if (isLibrarian) {
          const [inventory, borrows, fines, members, notifications] = await Promise.all([
            inventoryApi.getAll(),
            borrowsApi.getAll(),
            finesApi.getAll(),
            membersApi.getAll(),
            notificationsApi.getAll(),
          ]);
          const totalBooks = inventory.reduce((s, i) => s + (i.totalCopies || 0), 0);
          const available = inventory.reduce((s, i) => s + (i.availableCopies || 0), 0);
          const activeBorrows = borrows.filter(b => b.status === 'Issued' || b.status === 'Requested').length;
          const unpaidFines = fines.filter(f => f.status !== 'Paid').length;
          setStats({ totalBooks, available, activeBorrows, totalMembers: members.length, unpaidFines, notifications: notifications.length });
          setRecentBorrows(borrows.slice(-6).reverse());
        } else {
          const [borrows, fines, notifications] = await Promise.all([
            borrowsApi.getAll(),
            finesApi.getAll(),
            notificationsApi.getAll(),
          ]);
          const myBorrows = borrows.filter(b => b.member?.memberId === user.memberId);
          const myFines = fines.filter(f => f.borrow?.member?.memberId === user.memberId);
          const myNotifications = notifications.filter(n => n.member?.memberId === user.memberId);
          setStats({
            totalBorrows: myBorrows.length,
            activeBorrows: myBorrows.filter(b => b.status === 'Issued').length,
            pendingFines: myFines.filter(f => f.status !== 'Paid').length,
            notifications: myNotifications.length,
          });
          setRecentBorrows(myBorrows.slice(-5).reverse());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isLibrarian, user]);

  if (loading) return <div className="loading"><div className="spinner"></div>Loading dashboard…</div>;

  const statusBadge = (status) => {
    const map = { Issued: 'badge-green', Requested: 'badge-amber', Returned: 'badge-gray', Cancelled: 'badge-red' };
    return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Good day, {user.name.split(' ')[0]} 👋</h2>
          <p>{isLibrarian ? 'Library management overview' : 'Your library activity at a glance'}</p>
        </div>
      </div>

      <div className="stats-grid">
        {isLibrarian ? (
          <>
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-label">Total Books</div>
              <div className="stat-value">{stats.totalBooks ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-label">Available</div>
              <div className="stat-value">{stats.available ?? 0}</div>
            </div>
            <div className="stat-card amber">
              <div className="stat-icon">📖</div>
              <div className="stat-label">Active Borrows</div>
              <div className="stat-value">{stats.activeBorrows ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-label">Members</div>
              <div className="stat-value">{stats.totalMembers ?? 0}</div>
            </div>
            <div className="stat-card red">
              <div className="stat-icon">💰</div>
              <div className="stat-label">Unpaid Fines</div>
              <div className="stat-value">{stats.unpaidFines ?? 0}</div>
            </div>
          </>
        ) : (
          <>
            <div className="stat-card">
              <div className="stat-icon">📖</div>
              <div className="stat-label">Total Borrows</div>
              <div className="stat-value">{stats.totalBorrows ?? 0}</div>
            </div>
            <div className="stat-card amber">
              <div className="stat-icon">📚</div>
              <div className="stat-label">Currently Issued</div>
              <div className="stat-value">{stats.activeBorrows ?? 0}</div>
            </div>
            <div className="stat-card red">
              <div className="stat-icon">💰</div>
              <div className="stat-label">Pending Fines</div>
              <div className="stat-value">{stats.pendingFines ?? 0}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🔔</div>
              <div className="stat-label">Notifications</div>
              <div className="stat-value">{stats.notifications ?? 0}</div>
            </div>
          </>
        )}
      </div>

      {recentBorrows.length > 0 && (
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--forest)', marginBottom: 16, fontSize: '1.1rem' }}>
            {isLibrarian ? 'Recent Borrow Activity' : 'My Recent Borrows'}
          </h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  {isLibrarian && <th>Member</th>}
                  <th>Book</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBorrows.map(b => (
                  <tr key={b.borrowId}>
                    <td>{b.borrowId}</td>
                    {isLibrarian && <td>{b.member?.name}</td>}
                    <td>{b.book?.bookName}</td>
                    <td>{b.issueDate || '—'}</td>
                    <td>{b.dueDate || '—'}</td>
                    <td>{statusBadge(b.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
