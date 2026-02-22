import React, { useState, useEffect } from 'react';
import { healthDataAPI, patientAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

const emptyForm = { heartRate: '', bloodPressure: '', oxygenLevel: '', temperature: '' };

export default function HealthDataPage() {
  const [healthData, setHealthData] = useState([]);
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
      const [hdRes, pRes] = await Promise.all([healthDataAPI.getAll(), patientAPI.getAll()]);
      setHealthData(hdRes.data);
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
      heartRate: h.heartRate, bloodPressure: h.bloodPressure,
      oxygenLevel: h.oxygenLevel, temperature: h.temperature,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await healthDataAPI.update(editing.healthId, form);
        showNotification('Health data updated');
      } else {
        if (!selectedPatientId) { showNotification('Select a patient', 'error'); return; }
        await healthDataAPI.create(selectedPatientId, form);
        showNotification('Health data added successfully');
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
      await healthDataAPI.delete(id);
      showNotification('Record deleted');
      fetchAll();
    } catch {
      showNotification('Failed to delete', 'error');
    }
  };

  const getHeartRateStatus = (hr) => {
    if (!hr) return '';
    if (hr < 60) return 'badge-yellow';
    if (hr > 100) return 'badge-red';
    return 'badge-green';
  };

  const filtered = filterPatientId
    ? healthData.filter((h) => String(h.patientId) === String(filterPatientId))
    : healthData;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Health Data</h1>
        <p className="page-subtitle">Track daily health readings — heart rate, blood pressure, oxygen levels & temperature</p>
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
          <button className="btn btn-primary" onClick={openCreate}>➕ Add Reading</button>
        </div>

        {loading ? (
          <div className="loading">Loading health data...</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="icon">💓</div>
            <h3>No health records found</h3>
            <p>Add a daily reading to start tracking.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Heart Rate</th>
                  <th>Blood Pressure</th>
                  <th>Oxygen Level</th>
                  <th>Temperature</th>
                  <th>Recorded At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((h) => (
                  <tr key={h.healthId}>
                    <td><span className="badge badge-blue">#{h.healthId}</span></td>
                    <td>
                      <span className={`badge ${getHeartRateStatus(h.heartRate)}`}>
                        {h.heartRate} bpm
                      </span>
                    </td>
                    <td>{h.bloodPressure}</td>
                    <td>
                      <span className={`badge ${h.oxygenLevel < 95 ? 'badge-red' : 'badge-green'}`}>
                        {h.oxygenLevel}%
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${h.temperature > 37.5 ? 'badge-yellow' : 'badge-blue'}`}>
                        {h.temperature}°C
                      </span>
                    </td>
                    <td className="text-sm text-muted">
                      {h.recordedAt ? new Date(h.recordedAt).toLocaleString() : '—'}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-success btn-sm" onClick={() => openEdit(h)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(h.healthId)}>🗑️</button>
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
        <Modal title={editing ? 'Edit Health Reading' : 'Add Health Reading'} onClose={() => setShowModal(false)}>
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
              <label className="form-label">Heart Rate (bpm)</label>
              <input type="number" className="form-control" value={form.heartRate}
                onChange={(e) => setForm({ ...form, heartRate: e.target.value })} placeholder="e.g. 72" />
            </div>
            <div className="form-group">
              <label className="form-label">Blood Pressure</label>
              <input className="form-control" value={form.bloodPressure}
                onChange={(e) => setForm({ ...form, bloodPressure: e.target.value })} placeholder="e.g. 120/80" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Oxygen Level (%)</label>
              <input type="number" step="0.1" className="form-control" value={form.oxygenLevel}
                onChange={(e) => setForm({ ...form, oxygenLevel: e.target.value })} placeholder="e.g. 98.5" />
            </div>
            <div className="form-group">
              <label className="form-label">Temperature (°C)</label>
              <input type="number" step="0.1" className="form-control" value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: e.target.value })} placeholder="e.g. 36.6" />
            </div>
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {editing ? 'Update Reading' : 'Save Reading'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
