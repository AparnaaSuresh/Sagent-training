import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { booksApi, inventoryApi } from '../services/api';
import { useToast } from '../components/Toast';

const STATUS_OPTIONS = ['Available', 'Not Available', 'Damaged'];

function availabilityBadge(status) {
  if (status === 'Available') return <span className="badge badge-green">Available</span>;
  if (status === 'Damaged') return <span className="badge badge-red">Damaged</span>;
  return <span className="badge badge-amber">Not Available</span>;
}

export default function BooksPage() {
  const { isLibrarian } = useAuth();
  const toast = useToast();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit-book' | 'edit-inv'
  const [selected, setSelected] = useState(null);

  // Form states
  const [bookForm, setBookForm] = useState({ bookName: '', author: '', availabilityStatus: 'Available' });
  const [invForm, setInvForm] = useState({ totalCopies: '', availableCopies: '', lostCopies: 0, damagedCopies: 0 });

  const load = async () => {
    try {
      const data = await inventoryApi.getAll();
      setInventory(data);
    } catch (e) {
      toast('Failed to load inventory: ' + e.message, 'error');
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = inventory.filter(inv =>
    inv.book?.bookName?.toLowerCase().includes(search.toLowerCase()) ||
    inv.book?.author?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setBookForm({ bookName: '', author: '', availabilityStatus: 'Available' });
    setInvForm({ totalCopies: '', availableCopies: '', lostCopies: 0, damagedCopies: 0 });
    setModal('add');
  };

  const openEdit = (inv) => {
    setSelected(inv);
    setBookForm({ bookName: inv.book.bookName, author: inv.book.author, availabilityStatus: inv.book.availabilityStatus });
    setInvForm({ totalCopies: inv.totalCopies, availableCopies: inv.availableCopies, lostCopies: inv.lostCopies, damagedCopies: inv.damagedCopies });
    setModal('edit');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const book = await booksApi.create(bookForm);
      await inventoryApi.create({ book: { bookId: book.bookId }, ...invForm });
      toast('Book added successfully!');
      setModal(null);
      load();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await booksApi.update(selected.book.bookId, bookForm);
      await inventoryApi.update(selected.inventoryId, {
        book: { bookId: selected.book.bookId }, ...invForm
      });
      toast('Book updated!');
      setModal(null);
      load();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  };

  const handleDelete = async (inv) => {
    if (!window.confirm(`Delete "${inv.book.bookName}"? This will also remove its inventory record.`)) return;
    try {
      await inventoryApi.delete(inv.inventoryId);
      await booksApi.delete(inv.book.bookId);
      toast('Book deleted.');
      load();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading books…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>{isLibrarian ? 'Books & Inventory' : 'Browse Books'}</h2>
          <p>{isLibrarian ? 'Manage the library catalog and inventory' : 'Search for available books'}</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Search by title or author…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {isLibrarian && <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>}
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Book Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Total</th>
                <th>Available</th>
                <th>Lost</th>
                <th>Damaged</th>
                {isLibrarian && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={isLibrarian ? 9 : 8} style={{ textAlign: 'center', padding: 40, color: 'var(--ink-soft)' }}>No books found</td></tr>
              ) : filtered.map(inv => (
                <tr key={inv.inventoryId}>
                  <td>{inv.book?.bookId}</td>
                  <td>{inv.book?.bookName}</td>
                  <td>{inv.book?.author}</td>
                  <td>{availabilityBadge(inv.book?.availabilityStatus)}</td>
                  <td>{inv.totalCopies}</td>
                  <td><strong style={{ color: inv.availableCopies > 0 ? 'var(--forest-mid)' : 'var(--red)' }}>{inv.availableCopies}</strong></td>
                  <td>{inv.lostCopies}</td>
                  <td>{inv.damagedCopies}</td>
                  {isLibrarian && (
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEdit(inv)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(inv)}>Delete</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <div className="modal-backdrop" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modal === 'add' ? 'Add New Book' : 'Edit Book'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={modal === 'add' ? handleAdd : handleEdit}>
              <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--forest)', fontWeight: 600, marginBottom: 10 }}>Book Details</p>
              <div className="form-grid">
                <div className="form-group">
                  <label>Title</label>
                  <input required value={bookForm.bookName} onChange={e => setBookForm(f => ({ ...f, bookName: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Author</label>
                  <input required value={bookForm.author} onChange={e => setBookForm(f => ({ ...f, author: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={bookForm.availabilityStatus} onChange={e => setBookForm(f => ({ ...f, availabilityStatus: e.target.value }))}>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <p style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--forest)', fontWeight: 600, margin: '16px 0 10px' }}>Inventory</p>
              <div className="form-grid">
                {[['totalCopies','Total Copies'],['availableCopies','Available'],['lostCopies','Lost'],['damagedCopies','Damaged']].map(([field,label]) => (
                  <div className="form-group" key={field}>
                    <label>{label}</label>
                    <input type="number" min="0" required value={invForm[field]}
                      onChange={e => setInvForm(f => ({ ...f, [field]: parseInt(e.target.value) || 0 }))} />
                  </div>
                ))}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{modal === 'add' ? 'Add Book' : 'Save Changes'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
