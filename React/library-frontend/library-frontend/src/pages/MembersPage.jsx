import { useEffect, useState } from 'react';
import { membersApi } from '../services/api';
import { useToast } from '../components/Toast';

const BLANK = { name: '', email: '', password: '', phoneNo: '', address: '', category: 'Student' };

export default function MembersPage() {
  const toast = useToast();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(BLANK);

  const load = async () => {
    try { setMembers(await membersApi.getAll()); }
    catch (e) { toast('Error loading members: ' + e.message, 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const filtered = members.filter(m =>
    m.name?.toLowerCase().includes(search.toLowerCase()) ||
    m.email?.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setForm(BLANK); setSelected(null); setModal('form'); };
  const openEdit = (m) => { setForm({ ...m }); setSelected(m); setModal('form'); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selected) { await membersApi.update(selected.memberId, form); toast('Member updated!'); }
      else { await membersApi.create(form); toast('Member added!'); }
      setModal(null); load();
    } catch (err) { toast('Error: ' + err.message, 'error'); }
  };

  const handleDelete = async (m) => {
    if (!window.confirm(`Delete member "${m.name}"? This will also delete their borrow records and fines.`)) return;
    try { await membersApi.delete(m.memberId); toast('Member deleted.'); load(); }
    catch (err) { toast('Error: ' + err.message, 'error'); }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading members…</div>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h2>Members</h2>
          <p>Manage library member accounts</p>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-bar">
            <span>🔍</span>
            <input placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={openAdd}>+ Add Member</button>
        </div>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--ink-soft)' }}>No members found</td></tr>
              ) : filtered.map(m => (
                <tr key={m.memberId}>
                  <td>{m.memberId}</td>
                  <td>{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.phoneNo}</td>
                  <td>{m.address}</td>
                  <td><span className="badge badge-blue">{m.category}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEdit(m)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m)}>Delete</button>
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
              <h3>{selected ? 'Edit Member' : 'Add Member'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {[['name','Name','text'],['email','Email','email'],['password','Password','password'],['phoneNo','Phone','text'],['address','Address','text']].map(([field,label,type]) => (
                  <div className="form-group" key={field} style={field === 'address' ? { gridColumn: '1 / -1' } : {}}>
                    <label>{label}</label>
                    <input type={type} required value={form[field] || ''}
                      onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))} />
                  </div>
                ))}
                <div className="form-group">
                  <label>Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    <option>Student</option><option>Staff</option><option>Faculty</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">{selected ? 'Save Changes' : 'Add Member'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
