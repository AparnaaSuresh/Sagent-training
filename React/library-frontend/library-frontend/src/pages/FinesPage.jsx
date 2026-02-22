import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { finesApi, borrowsApi } from '../services/api';
import { useToast } from '../components/Toast';

function statusBadge(status) {
  return status === 'Paid'
    ? <span className="badge badge-green">Paid</span>
    : <span className="badge badge-red">Unpaid</span>;
}

export default function FinesPage() {
  const { user, isLibrarian } = useAuth();
  const toast = useToast();
  const [fines, setFines] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ borrow: { borrowId: '' }, fineAmount: '', status: 'Unpaid' });

  const load = async () => {
    try {
      const [f, b] = await Promise.all([finesApi.getAll(), borrowsApi.getAll()]);
      setFines(f);
      setBorrows(b);
    } catch (e) { toast('Error loading fines', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const displayFines = isLibrarian
    ? fines
    : fines.filter(f => f.borrow?.member?.memberId === user.memberId);

  const openAdd = () => {
    setForm({ borrow: { borrowId: '' }, fineAmount: '', status: 'Unpaid' });
    setSelected(null);
    setModal('form');
  };

  const openEdit = (f) => {
    setSelected(f);
    setForm({ borrow: { borrowId: f.borrow?.borrowId }, fineAmount: f.fineAmount, status: f.status });
    setModal('form');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selected) { await finesApi.update(selected.fineId, form); toast('Fine updated!'); }
      else { await finesApi.create(form); toast('Fine added!'); }
      setModal(null); load();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  };

  const handleDelete = async (f) => {
    if (!window.confirm('Delete this fine?')) return;
    try { await finesApi.delete(f.fineId); toast('Fine deleted.'); load(); }
    catch (err) { toast('Error: ' + err.message, 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading fines…</div>;

  const totalOwed = displayFines.filter(f => f.status !== 'Paid').reduce((s, f) => s + (f.fineAmount || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>{isLibrarian ? 'Fines Management' : 'My Fines'}</h2>
          <p>{isLibrarian ? 'View and manage all outstanding fines' : 'Track your library fines'}</p>
        </div>
        {isLibrarian && <button className="btn btn-primary" onClick={openAdd}>+ Add Fine</button>}
      </div>

      {totalOwed > 0 && (
        <div className="card" style={{ background: '#fff5f5', borderColor: '#f5c2c2', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.4rem' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--red)' }}>Outstanding Fines: ₹{totalOwed.toFixed(2)}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--ink-soft)' }}>Please clear your dues at the library counter.</div>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                {isLibrarian && <th>Member</th>}
                <th>Book</th>
                <th>Borrow ID</th>
                <th>Amount (₹)</th>
                <th>Status</th>
                {isLibrarian && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {displayFines.length === 0 ? (
                <tr><td colSpan={isLibrarian ? 7 : 5} style={{ textAlign: 'center', padding: 40, color: 'var(--ink-soft)' }}>No fines found 🎉</td></tr>
              ) : displayFines.map(f => (
                <tr key={f.fineId}>
                  <td>{f.fineId}</td>
                  {isLibrarian && <td>{f.borrow?.member?.name}</td>}
                  <td>{f.borrow?.book?.bookName}</td>
                  <td>{f.borrow?.borrowId}</td>
                  <td><strong>{f.fineAmount?.toFixed(2)}</strong></td>
                  <td>{statusBadge(f.status)}</td>
                  {isLibrarian && (
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(f)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f)}>Delete</button>
                      </div>
                    </td>
                  )}
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
              <h3>{selected ? 'Edit Fine' : 'Add Fine'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Borrow Record</label>
                  <select required value={form.borrow.borrowId}
                    onChange={e => setForm(f => ({ ...f, borrow: { borrowId: parseInt(e.target.value) } }))}>
                    <option value="">Select borrow…</option>
                    {borrows.map(b => (
                      <option key={b.borrowId} value={b.borrowId}>
                        #{b.borrowId} — {b.member?.name} / {b.book?.bookName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount (₹)</label>
                  <input type="number" step="0.01" min="0" required value={form.fineAmount}
                    onChange={e => setForm(f => ({ ...f, fineAmount: parseFloat(e.target.value) }))} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    <option>Unpaid</option>
                    <option>Paid</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{selected ? 'Save' : 'Add Fine'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
