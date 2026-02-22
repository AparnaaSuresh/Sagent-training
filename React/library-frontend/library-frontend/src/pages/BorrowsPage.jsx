import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { borrowsApi, membersApi, inventoryApi } from '../services/api';
import { useToast } from '../components/Toast';

const BLANK = { member: { memberId: '' }, book: { bookId: '' }, issueDate: '', dueDate: '', returnDate: '', status: 'Requested' };

function statusBadge(status) {
  const map = { Issued: 'badge-green', Requested: 'badge-amber', Returned: 'badge-gray', Cancelled: 'badge-red' };
  return <span className={`badge ${map[status] || 'badge-gray'}`}>{status}</span>;
}

export default function BorrowsPage() {
  const { user, isLibrarian } = useAuth();
  const toast = useToast();
  const [borrows, setBorrows] = useState([]);
  const [members, setMembers] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ ...BLANK });

  const load = async () => {
    try {
      const [b, m, inv] = await Promise.all([borrowsApi.getAll(), membersApi.getAll(), inventoryApi.getAll()]);
      setBorrows(b);
      setMembers(m);
      setInventory(inv);
    } catch (e) { toast('Error loading data', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const displayBorrows = isLibrarian
    ? borrows
    : borrows.filter(b => b.member?.memberId === user.memberId);

  const openAdd = () => {
    setForm({ ...BLANK, member: { memberId: isLibrarian ? '' : user.memberId } });
    setSelected(null);
    setModal('form');
  };

  const openEdit = (b) => {
    setSelected(b);
    setForm({
      member: { memberId: b.member?.memberId },
      book: { bookId: b.book?.bookId },
      issueDate: b.issueDate || '',
      dueDate: b.dueDate || '',
      returnDate: b.returnDate || '',
      status: b.status,
    });
    setModal('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        returnDate: form.returnDate || null,
      };
      if (selected) { await borrowsApi.update(selected.borrowId, payload); toast('Borrow record updated!'); }
      else { await borrowsApi.create(payload); toast('Borrow request created!'); }
      setModal(null); load();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  };

  const handleCancel = async (b) => {
    if (!window.confirm('Cancel this borrow request?')) return;
    try {
      await borrowsApi.update(b.borrowId, {
        member: { memberId: b.member.memberId },
        book: { bookId: b.book.bookId },
        issueDate: b.issueDate,
        dueDate: b.dueDate,
        returnDate: b.returnDate,
        status: 'Cancelled',
      });
      toast('Request cancelled.');
      load();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  };

  const handleDelete = async (b) => {
    if (!window.confirm('Delete this borrow record?')) return;
    try { await borrowsApi.delete(b.borrowId); toast('Deleted.'); load(); }
    catch (err) { toast('Error: ' + err.message, 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading borrows…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>{isLibrarian ? 'Borrow Records' : 'My Borrows'}</h2>
          <p>{isLibrarian ? 'Manage all borrowing activity' : 'Track your issued and requested books'}</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          {isLibrarian ? '+ New Record' : '+ Request Book'}
        </button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                {isLibrarian && <th>Member</th>}
                <th>Book</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayBorrows.length === 0 ? (
                <tr><td colSpan={isLibrarian ? 8 : 7} style={{ textAlign: 'center', padding: 40, color: 'var(--ink-soft)' }}>No records found</td></tr>
              ) : displayBorrows.map(b => (
                <tr key={b.borrowId}>
                  <td>{b.borrowId}</td>
                  {isLibrarian && <td>{b.member?.name}</td>}
                  <td>{b.book?.bookName}</td>
                  <td>{b.issueDate || '—'}</td>
                  <td>{b.dueDate || '—'}</td>
                  <td>{b.returnDate || '—'}</td>
                  <td>{statusBadge(b.status)}</td>
                  <td>
                    <div className="actions-cell">
                      {isLibrarian && <button className="btn btn-secondary btn-sm" onClick={() => openEdit(b)}>Edit</button>}
                      {!isLibrarian && b.status === 'Requested' && (
                        <button className="btn btn-amber btn-sm" onClick={() => handleCancel(b)}>Cancel</button>
                      )}
                      {isLibrarian && <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b)}>Delete</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal === 'form' && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selected ? 'Edit Borrow' : 'New Borrow Request'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {isLibrarian && (
                  <div className="form-group">
                    <label>Member</label>
                    <select required value={form.member.memberId}
                      onChange={e => setForm(f => ({ ...f, member: { memberId: parseInt(e.target.value) } }))}>
                      <option value="">Select member…</option>
                      {members.map(m => <option key={m.memberId} value={m.memberId}>{m.name}</option>)}
                    </select>
                  </div>
                )}
                <div className="form-group">
                  <label>Book</label>
                  <select required value={form.book.bookId}
                    onChange={e => setForm(f => ({ ...f, book: { bookId: parseInt(e.target.value) } }))}>
                    <option value="">Select book…</option>
                    {inventory.map(inv => (
                      <option key={inv.book.bookId} value={inv.book.bookId}>
                        {inv.book.bookName} — {inv.book.author} ({inv.availableCopies} avail.)
                      </option>
                    ))}
                  </select>
                </div>
                {[['issueDate','Issue Date'],['dueDate','Due Date'],['returnDate','Return Date']].map(([field,label]) => (
                  <div className="form-group" key={field}>
                    <label>{label}{field !== 'returnDate' ? ' *' : ''}</label>
                    <input type="date" required={field !== 'returnDate'} value={form[field] || ''}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
                  </div>
                ))}
                {isLibrarian && (
                  <div className="form-group">
                    <label>Status</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                      {['Requested','Issued','Returned','Cancelled'].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{selected ? 'Save' : 'Submit Request'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
