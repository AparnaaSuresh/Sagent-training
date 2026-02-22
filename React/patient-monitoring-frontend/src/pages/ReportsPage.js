import React, { useState, useEffect } from 'react';
import { reportAPI, patientAPI, healthDataAPI } from '../services/api';
import { useApp } from '../context/AppContext';
import Modal from '../components/Modal';

const emptyForm = { reportTitle: '', summary: '', recommendations: '' };

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedHealthId, setSelectedHealthId] = useState('');
  const [patientHealthData, setPatientHealthData] = useState([]);
  const { showNotification } = useApp();

  const fetchAll = async () => {
    try {
      const [rRes, pRes, hRes] = await Promise.all([
        reportAPI.getAll(), patientAPI.getAll(), healthDataAPI.getAll(),
      ]);
      setReports(rRes.data);
      setPatients(pRes.data);
      setHealthData(hRes.data);
    } catch {
      showNotification('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handlePatientChange = async (patientId) => {
    setSelectedPatientId(patientId);
    setSelectedHealthId('');
    if (patientId) {
      try {
        const res = await healthDataAPI.getByPatient(patientId);
        setPatientHealthData(res.data);
      } catch {
        setPatientHealthData([]);
      }
    } else {
      setPatientHealthData([]);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setSelectedPatientId('');
    setSelectedHealthId('');
    setPatientHealthData([]);
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditing(r);
    setForm({
      reportTitle: r.reportTitle || '',
      summary: r.summary || '',
      recommendations: r.recommendations || '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await reportAPI.update(editing.reportId, form);
        showNotification('Report updated');
      } else {
        if (!selectedPatientId || !selectedHealthId) {
          showNotification('Select patient and health record', 'error'); return;
        }
        await reportAPI.create(selectedPatientId, selectedHealthId, form);
        showNotification('Report created successfully');
      }
      setShowModal(false);
      fetchAll();
    } catch {
      showNotification('Failed to save report', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await reportAPI.delete(id);
      showNotification('Report deleted');
      fetchAll();
    } catch {
      showNotification('Failed to delete', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
        <p className="page-subtitle">Generate and manage patient health reports stored securely for future reference</p>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">All Reports ({reports.length})</h2>
          <button className="btn btn-primary" onClick={openCreate}>📄 Create Report</button>
        </div>

        {loading ? (
          <div className="loading">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📊</div>
            <h3>No reports yet</h3>
            <p>Create a report to document patient health summaries.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '14px' }}>
            {reports.map((r) => (
              <div key={r.reportId} style={{
                border: '1px solid var(--gray-200)', borderRadius: '12px', padding: '20px',
                background: 'white', borderLeft: '4px solid var(--secondary)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span className="badge badge-purple">#{r.reportId}</span>
                      <h3 style={{ fontSize: '16px', fontWeight: 600 }}>{r.reportTitle || 'Health Report'}</h3>
                    </div>
                    {r.summary && (
                      <p style={{ fontSize: '14px', color: 'var(--gray-600)', marginBottom: '8px', lineHeight: '1.5' }}>
                        <strong>Summary:</strong> {r.summary}
                      </p>
                    )}
                    {r.recommendations && (
                      <p style={{ fontSize: '14px', color: 'var(--gray-600)', lineHeight: '1.5' }}>
                        <strong>Recommendations:</strong> {r.recommendations}
                      </p>
                    )}
                  </div>
                  <div className="actions-cell" style={{ marginLeft: '16px' }}>
                    <button className="btn btn-success btn-sm" onClick={() => openEdit(r)}>✏️ Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.reportId)}>🗑️</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={editing ? 'Edit Report' : 'Create Report'} onClose={() => setShowModal(false)}>
          {!editing && (
            <>
              <div className="form-group">
                <label className="form-label">Patient *</label>
                <select className="form-control" value={selectedPatientId}
                  onChange={(e) => handlePatientChange(e.target.value)}>
                  <option value="">Select a patient</option>
                  {patients.map((p) => (
                    <option key={p.patientId} value={p.patientId}>{p.pName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Health Record *</label>
                <select className="form-control" value={selectedHealthId}
                  onChange={(e) => setSelectedHealthId(e.target.value)}
                  disabled={!selectedPatientId}>
                  <option value="">
                    {selectedPatientId ? 'Select a health record' : 'Select a patient first'}
                  </option>
                  {patientHealthData.map((h) => (
                    <option key={h.healthId} value={h.healthId}>
                      #{h.healthId} — HR: {h.heartRate} bpm | BP: {h.bloodPressure} | O₂: {h.oxygenLevel}%
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">Report Title</label>
            <input className="form-control" value={form.reportTitle}
              onChange={(e) => setForm({ ...form, reportTitle: e.target.value })}
              placeholder="e.g. Monthly Health Summary" />
          </div>
          <div className="form-group">
            <label className="form-label">Summary</label>
            <textarea className="form-control" value={form.summary} rows={3}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Health data summary and observations..." />
          </div>
          <div className="form-group">
            <label className="form-label">Recommendations</label>
            <textarea className="form-control" value={form.recommendations} rows={3}
              onChange={(e) => setForm({ ...form, recommendations: e.target.value })}
              placeholder="Doctor's recommendations and follow-up actions..." />
          </div>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {editing ? 'Update Report' : 'Create Report'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
