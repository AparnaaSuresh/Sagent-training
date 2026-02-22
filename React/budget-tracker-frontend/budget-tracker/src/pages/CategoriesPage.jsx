import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../api/api';
import Modal from '../components/Modal';
import { formStyles, FormField } from '../components/FormField';

function CategoryForm({ initial, onSubmit, onCancel }) {
  const [form, setForm] = useState(initial || { categoryName: '', categoryType: 'EXPENSE' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div>
      <FormField label="Category Name *">
        <input style={formStyles.input} placeholder="e.g. Food, Travel, Shopping" value={form.categoryName} onChange={e => set('categoryName', e.target.value)} />
      </FormField>
      <FormField label="Type *">
        <select style={formStyles.select} value={form.categoryType} onChange={e => set('categoryType', e.target.value)}>
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
      </FormField>
      <div style={formStyles.btnRow}>
        <button style={formStyles.btnSecondary} onClick={onCancel}>Cancel</button>
        <button style={formStyles.btnPrimary} onClick={() => {
          if (!form.categoryName) return alert('Enter category name.');
          onSubmit(form);
        }}>Save</button>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { categories, refresh } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const handleCreate = async (data) => { await api.categories.create(data); setShowModal(false); refresh(); };
  const handleUpdate = async (data) => { await api.categories.update(editing.categoryId, data); setEditing(null); refresh(); };
  const handleDelete = async (id) => { if (!confirm('Delete?')) return; await api.categories.delete(id); refresh(); };

  const incomeCategories = categories.filter(c => c.categoryType === 'INCOME');
  const expenseCategories = categories.filter(c => c.categoryType === 'EXPENSE');

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🏷️ Categories</h2>
        <button style={formStyles.btnPrimary} onClick={() => setShowModal(true)}>+ Add Category</button>
      </div>

      <div style={styles.grid}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}><span style={{ color: '#10b981' }}>●</span> Income Categories</h3>
          {incomeCategories.length === 0
            ? <p style={styles.empty}>No income categories.</p>
            : incomeCategories.map(c => (
              <div key={c.categoryId} style={styles.item}>
                <span style={styles.itemName}>{c.categoryName}</span>
                <div>
                  <button style={formStyles.btnEdit} onClick={() => setEditing(c)}>Edit</button>{' '}
                  <button style={formStyles.btnDanger} onClick={() => handleDelete(c.categoryId)}>Delete</button>
                </div>
              </div>
            ))}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}><span style={{ color: '#ef4444' }}>●</span> Expense Categories</h3>
          {expenseCategories.length === 0
            ? <p style={styles.empty}>No expense categories.</p>
            : expenseCategories.map(c => (
              <div key={c.categoryId} style={styles.item}>
                <span style={styles.itemName}>{c.categoryName}</span>
                <div>
                  <button style={formStyles.btnEdit} onClick={() => setEditing(c)}>Edit</button>{' '}
                  <button style={formStyles.btnDanger} onClick={() => handleDelete(c.categoryId)}>Delete</button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {showModal && (
        <Modal title="Add Category" onClose={() => setShowModal(false)}>
          <CategoryForm onSubmit={handleCreate} onCancel={() => setShowModal(false)} />
        </Modal>
      )}
      {editing && (
        <Modal title="Edit Category" onClose={() => setEditing(null)}>
          <CategoryForm
            initial={{ categoryName: editing.categoryName, categoryType: editing.categoryType }}
            onSubmit={handleUpdate} onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 24, maxWidth: 900, margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { color: '#e2e8f0', margin: 0, fontSize: 22, fontWeight: 700 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  section: { background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid rgba(255,255,255,0.08)' },
  sectionTitle: { color: '#e2e8f0', fontSize: 16, fontWeight: 700, marginTop: 0, marginBottom: 16 },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  itemName: { color: '#cbd5e1', fontSize: 14 },
  empty: { color: '#475569', fontSize: 14 },
};
