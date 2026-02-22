import React, { useState, useEffect } from 'react';
import { feedbackAPI, patientAPI, doctorAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ message: '' });
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const { showNotification } = useApp();

  const fetchAll = async () => {
    try {
      const [fRes, pRes, dRes] = await Promise.all([
        feedbackAPI.getAll(), patientAPI.getAll(), doctorAPI.getAll(),
      ]);
      setFeedbacks(fRes.data);
      setPatients(pRes.data);
      setDoctors(dRes.data);
    } catch {
      showNotification('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ message: '' });
    setSelectedPatientId('');
    setSelectedDoctorId('');
    setShowModal(true);
  };

  const openEdit = (f) => {
    setEditing(f);
    setForm({ message: f.message || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.message.trim()) { showNotification('Message is required', 'error'); return; }
    try {
      if (editing) {
        await feedbackAPI.update(editing.feedbackId, form);
        showNotification('Feedback updated');
      } else {
        if (!selectedPatientId || !selectedDoctorId) {
          showNotification('Select patient and doctor', 'error'); return;
        }
        await feedbackAPI.create(selectedPatientId, selectedDoctorId, form);
        showNotification('Feedback sent successfully');
      }
      setShowModal(false);
      fetchAll();
    } catch {
      showNotification('Failed to save feedback', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feedback?')) return;
    try {
      await feedbackAPI.delete(id);
      showNotification('Feedback deleted');
      fetchAll();
    } catch {
      showNotification('Failed to delete', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Doctor Consultation & Feedback</h1>
        <p className="page-subtitle">Doctors send advice and schedule appointments through the app</p>
      </div>

      {/* Message Cards View */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="btn btn-primary" onClick={openCreate}>✉️ Send Feedback</button>
      </div>

      {loading ? (
        <div className="loading">Loading feedback...</div>
      ) : feedbacks.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="icon">💬</div>
            <h3>No feedback yet</h3>
            <p>Doctors can send advice and appointment info to patients here.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {feedbacks.map((f) => (
            <div key={f.feedbackId} className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>From</p>
                  <p style={{ fontSize: '15px', fontWeight: 600 }}>Dr. {f.doctor?.dName}</p>
                  <span className="badge badge-blue" style={{ marginTop: '4px' }}>{f.doctor?.specialization}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>To</p>
                  <p style={{ fontSize: '15px', fontWeight: 600 }}>{f.patient?.pName}</p>
                </div>
              </div>
              <div style={{
                background: 'var(--gray-50)', borderRadius: '8px', padding: '12px',
                fontSize: '14px', color: 'var(--gray-700)', marginBottom: '14px', lineHeight: '1.6'
              }}>
                {f.message}
              </div>
              <div className="actions-cell">
                <button className="btn btn-success btn-sm" onClick={() => openEdit(f)}>✏️ Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(f.feedbackId)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editing ? 'Edit Feedback' : 'Send Feedback'} onClose={() => setShowModal(false)}>
          {!editing && (
            <>
              <div className="form-group">
                <label className="form-label">Doctor *</label>
                <select className="form-control" value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}>
                  <option value="">Select a doctor</option>
                  {doctors.map((d) => (
                    <option key={d.doctorId} value={d.doctorId}>Dr. {d.dName} — {d.specialization}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Patient *</label>
                <select className="form-control" value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}>
                  <option value="">Select a patient</option>
                  {patients.map((p) => (
                    <option key={p.patientId} value={p.patientId}>{p.pName}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">Message / Advice *</label>
            <textarea
              className="form-control"
              value={form.message}
              rows={5}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Write your advice, appointment details, or follow-up instructions..."
            />
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {editing ? 'Update Feedback' : 'Send Feedback'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
