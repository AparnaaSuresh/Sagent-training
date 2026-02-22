export default function Modal({ title, onClose, children }) {
  return (
    <div style={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button style={styles.close} onClick={onClose}>✕</button>
        </div>
        <div style={styles.body}>{children}</div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
  },
  modal: {
    background: '#1e293b', borderRadius: 12, width: '90%', maxWidth: 480,
    boxShadow: '0 20px 60px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)',
    maxHeight: '90vh', overflow: 'auto',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px 0',
  },
  title: { color: '#e2e8f0', margin: 0, fontSize: 18, fontWeight: 700 },
  close: {
    background: 'transparent', border: 'none', color: '#94a3b8',
    fontSize: 18, cursor: 'pointer', padding: 4,
  },
  body: { padding: 24 },
};
