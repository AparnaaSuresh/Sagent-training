import React, { useState, useEffect } from 'react';
import { doctorAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

const emptyForm = { dName: '', specialization: '', dMobileNo: '', mailId: '', password: '' };

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const { showNotification } = useApp();

  const fetchDoctors = async () => {
    try {
      const res = await doctorAPI.getAll();
      setDoctors(res.data);
    } catch {
      showNotification('Failed to load doctors', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (d) => {
    setEditing(d);
    setForm({
      dName: d.dName, specialization: d.specialization,
      dMobileNo: d.dMobileNo, mailId: d.mailId, password: d.password,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await doctorAPI.update(editing.doctorId, form);
        showNotification('Doctor updated successfully');
      } else {
        await doctorAPI.create(form);
        showNotification('Doctor added successfully');
      }
      setShowModal(false);
      fetchDoctors();
    } catch {
      showNotification('Failed to save doctor', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doctor?')) return;
    try {
      await doctorAPI.delete(id);
      showNotification('Doctor deleted');
      fetchDoctors();
    } catch {
      showNotification('Failed to delete', 'error');
    }
  };

  const filtered = doctors.filter(
    (d) => d.dName?.toLowerCase().includes(search.toLowerCase()) ||
           d.specialization?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Doctors</h1>
        <p className="page-subtitle">Manage doctor profiles and specializations</p>
      </div>

      <div className="card">
        <div className="card-header">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search doctors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '280px' }}
          />
          <button className="btn btn-primary" onClick={openCreate}>➕ Add Doctor</button>
        </div>

        {loading ? (
          <div className="loading">Loading doctors...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🩺</div>
            <h3>No doctors found</h3>
            <p>Add a new doctor to get started.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.doctorId}>
                    <td><span className="badge badge-green">#{d.doctorId}</span></td>
                    <td className="fw-600">Dr. {d.dName}</td>
                    <td><span className="badge badge-blue">{d.specialization}</span></td>
                    <td>{d.dMobileNo}</td>
                    <td>{d.mailId}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-success btn-sm" onClick={() => openEdit(d)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.doctorId)}>🗑️</button>
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
        <Modal title={editing ? 'Edit Doctor' : 'Add Doctor'} onClose={() => setShowModal(false)}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-control" value={form.dName}
                onChange={(e) => setForm({ ...form, dName: e.target.value })} placeholder="Doctor's name" />
            </div>
            <div className="form-group">
              <label className="form-label">Specialization *</label>
              <input className="form-control" value={form.specialization}
                onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="e.g. Cardiology" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input className="form-control" value={form.dMobileNo}
                onChange={(e) => setForm({ ...form, dMobileNo: e.target.value })} placeholder="Mobile no." />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" value={form.mailId}
                onChange={(e) => setForm({ ...form, mailId: e.target.value })} placeholder="Email address" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input type="password" className="form-control" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {editing ? 'Update Doctor' : 'Add Doctor'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
