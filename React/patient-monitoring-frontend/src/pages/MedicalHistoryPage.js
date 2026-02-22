import React, { useState, useEffect } from 'react';
import { medicalHistoryAPI, patientAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

const emptyForm = { condition: '', diagnosedDate: '', treatment: '', notes: '' };

export default function MedicalHistoryPage() {
  const [history, setHistory] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [filterPatientId, setFilterPatientId] = useState('');
  const { showNotification } = useApp();

  const fetchAll = async () => {
    try {
      const [hRes, pRes] = await Promise.all([medicalHistoryAPI.getAll(), patientAPI.getAll()]);
      setHistory(hRes.data);
      setPatients(pRes.data);
    } catch {
      showNotification('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setSelectedPatientId('');
    setShowModal(true);
  };

  const openEdit = (h) => {
    setEditing(h);
    setForm({
      condition: h.condition || '',
      diagnosedDate: h.diagnosedDate ? h.diagnosedDate.split('T')[0] : '',
      treatment: h.treatment || '',
      notes: h.notes || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await medicalHistoryAPI.update(editing.historyId, form);
        showNotification('History updated');
      } else {
        if (!selectedPatientId) { showNotification('Select a patient', 'error'); return; }
        await medicalHistoryAPI.create(selectedPatientId, form);
        showNotification('Medical history added');
      }
      setShowModal(false);
      fetchAll();
    } catch {
      showNotification('Failed to save', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await medicalHistoryAPI.delete(id);
      showNotification('Record deleted');
      fetchAll();
    } catch {
      showNotification('Failed to delete', 'error');
    }
  };

  const patientMap = {};
  patients.forEach((p) => { patientMap[p.patientId] = p.pName; });

  const filtered = filterPatientId
    ? history.filter((h) => String(h.patient?.patientId) === String(filterPatientId))
    : history;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Medical History</h1>
        <p className="page-subtitle">View and manage past medical records and diagnoses</p>
      </div>

      <div className="card">
        <div className="card-header">
          <select
            className="form-control"
            value={filterPatientId}
            onChange={(e) => setFilterPatientId(e.target.value)}
            style={{ width: '240px' }}
          >
            <option value="">All Patients</option>
            {patients.map((p) => (
              <option key={p.patientId} value={p.patientId}>{p.pName}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={openCreate}>➕ Add Record</button>
        </div>

        {loading ? (
          <div className="loading">Loading records...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📋</div>
            <h3>No medical history found</h3>
            <p>Add a patient's past medical records here.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient</th>
                  <th>Condition</th>
                  <th>Diagnosed Date</th>
                  <th>Treatment</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => (
                  <tr key={h.historyId}>
                    <td><span className="badge badge-blue">#{h.historyId}</span></td>
                    <td className="fw-600">{h.patient?.pName || '—'}</td>
                    <td><span className="badge badge-red">{h.condition}</span></td>
                    <td>{h.diagnosedDate}</td>
                    <td>{h.treatment}</td>
                    <td className="text-sm text-muted">{h.notes}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-success btn-sm" onClick={() => openEdit(h)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(h.historyId)}>🗑️</button>
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
        <Modal title={editing ? 'Edit Medical Record' : 'Add Medical Record'} onClose={() => setShowModal(false)}>
          {!editing && (
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
          )}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Condition / Diagnosis *</label>
              <input className="form-control" value={form.condition}
                onChange={(e) => setForm({ ...form, condition: e.target.value })} placeholder="e.g. Hypertension" />
            </div>
            <div className="form-group">
              <label className="form-label">Diagnosed Date</label>
              <input type="date" className="form-control" value={form.diagnosedDate}
                onChange={(e) => setForm({ ...form, diagnosedDate: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Treatment</label>
            <input className="form-control" value={form.treatment}
              onChange={(e) => setForm({ ...form, treatment: e.target.value })} placeholder="Treatment plan" />
          </div>
          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea className="form-control" value={form.notes} rows={3}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Additional notes..." />
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {editing ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
