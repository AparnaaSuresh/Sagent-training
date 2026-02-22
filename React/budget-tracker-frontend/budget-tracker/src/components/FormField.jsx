export const formStyles = {
  group: { marginBottom: 16 },
  label: { display: 'block', color: '#94a3b8', fontSize: 13, marginBottom: 6, fontWeight: 500 },
  input: {
    width: '100%', padding: '10px 14px', background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
    color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box',
    outline: 'none',
  },
  select: {
    width: '100%', padding: '10px 14px', background: '#0f172a',
    border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8,
    color: '#e2e8f0', fontSize: 14, boxSizing: 'border-box',
    cursor: 'pointer',
  },
  btnRow: { display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' },
  btnPrimary: {
    padding: '10px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    border: 'none', borderRadius: 8, color: '#fff', fontWeight: 600,
    cursor: 'pointer', fontSize: 14,
  },
  btnSecondary: {
    padding: '10px 20px', background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)', borderRadius: 8,
    color: '#94a3b8', cursor: 'pointer', fontSize: 14,
  },
  btnDanger: {
    padding: '6px 12px', background: 'rgba(239,68,68,0.2)',
    border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6,
    color: '#f87171', cursor: 'pointer', fontSize: 12,
  },
  btnEdit: {
    padding: '6px 12px', background: 'rgba(99,102,241,0.2)',
    border: '1px solid rgba(99,102,241,0.3)', borderRadius: 6,
    color: '#a5b4fc', cursor: 'pointer', fontSize: 12,
  },
};

export function FormField({ label, children }) {
  return (
    <div style={formStyles.group}>
      <label style={formStyles.label}>{label}</label>
      {children}
    </div>
  );
}
