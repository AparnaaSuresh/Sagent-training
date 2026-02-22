import React, { useState, useEffect } from 'react';
import { patientAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

const emptyForm = {
  pName: '', pMobileNo: '', mailId: '', password: '',
  address: '', gender: '', dob: '',
};

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const { showNotification } = useApp();

  const fetchPatients = async () => {
    try {
      const res = await patientAPI.getAll();
      setPatients(res.data);
    } catch {
      showNotification('Failed to load patients', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPatients(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      pName: p.pName, pMobileNo: p.pMobileNo, mailId: p.mailId,
      password: p.password, address: p.address, gender: p.gender,
      dob: p.dob ? p.dob.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await patientAPI.update(editing.patientId, form);
        showNotification('Patient updated successfully');
      } else {
        await patientAPI.create(form);
        showNotification('Patient registered successfully');
      }
      setShowModal(false);
      fetchPatients();
    } catch {
      showNotification('Failed to save patient', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this patient?')) return;
    try {
      await patientAPI.delete(id);
      showNotification('Patient deleted');
      fetchPatients();
    } catch {
      showNotification('Failed to delete', 'error');
    }
  };

  const filtered = patients.filter(
    (p) => p.pName?.toLowerCase().includes(search.toLowerCase()) ||
           p.mailId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Patients</h1>
        <p className="page-subtitle">Manage patient registrations and profiles</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex gap-3">
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search patients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '280px' }}
            />
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            ➕ Register Patient
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading patients...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👤</div>
            <h3>No patients found</h3>
            <p>Register a new patient to get started.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>DOB</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.patientId}>
                    <td><span className="badge badge-blue">#{p.patientId}</span></td>
                    <td className="fw-600">{p.pName}</td>
                    <td>{p.pMobileNo}</td>
                    <td>{p.mailId}</td>
                    <td>
                      <span className={`badge ${p.gender === 'Male' ? 'badge-blue' : 'badge-purple'}`}>
                        {p.gender}
                      </span>
                    </td>
                    <td>{p.dob}</td>
                    <td className="text-sm text-muted">{p.address}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-success btn-sm" onClick={() => openEdit(p)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.patientId)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Patient' : 'Register Patient'} onClose={() => setShowModal(false)}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-control" value={form.pName}
                onChange={(e) => setForm({ ...form, pName: e.target.value })} placeholder="Patient name" />
            </div>
            <div className="form-group">
              <label className="form-label">Mobile Number *</label>
              <input className="form-control" value={form.pMobileNo}
                onChange={(e) => setForm({ ...form, pMobileNo: e.target.value })} placeholder="Mobile no." />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-control" value={form.mailId}
                onChange={(e) => setForm({ ...form, mailId: e.target.value })} placeholder="Email address" />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <input type="password" className="form-control" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select className="form-control" value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input type="date" className="form-control" value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <input className="form-control" value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Address" />
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {editing ? 'Update Patient' : 'Register Patient'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
