import React, { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';

const STATUS_COLORS = {
  CONFIRMED: { bg: '#e8f5e9', color: '#2e7d32', label: '✅ Order Confirmed' },
  OUT_FOR_DELIVERY: { bg: '#fff8e1', color: '#f57f17', label: '🚴 Out for Delivery' },
  DELIVERED: { bg: '#e3f2fd', color: '#1565c0', label: '📦 Delivered' },
  CANCELLED: { bg: '#fdecea', color: '#b71c1c', label: '❌ Cancelled' },
  PENDING: { bg: '#f3e5f5', color: '#6a1b9a', label: '⏳ Pending' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { user } = useAuth();

  const fetchOrders = () => {
    setLoading(true);
    orderAPI.getAll()
      .then((res) => {
        // Filter orders belonging to logged-in user
        const userOrders = res.data.filter(
          (o) => o.customer?.id === user?.id || o.customerId === user?.id
        );
        setOrders(userOrders.reverse()); // newest first
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderAPI.cancelOrder(orderId);
      setToast({ message: 'Order cancelled successfully', type: 'info' });
      fetchOrders();
    } catch {
      setToast({ message: 'Failed to cancel order', type: 'error' });
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading your orders...</div>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>My Orders</h1>
        <button onClick={fetchOrders} style={styles.refreshBtn}>↻ Refresh</button>
      </div>

      {orders.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyEmoji}>📋</div>
          <p style={styles.emptyText}>No orders yet. Start shopping!</p>
        </div>
      ) : (
        <div style={styles.list}>
          {orders.map((order) => {
            const status = order.status || 'PENDING';
            const statusInfo = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
            return (
              <div key={order.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <span style={styles.orderId}>Order #{order.id}</span>
                    <span
                      style={{
                        ...styles.statusBadge,
                        background: statusInfo.bg,
                        color: statusInfo.color,
                      }}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                  <div style={styles.orderDate}>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })
                      : 'Recent'}
                  </div>
                </div>

                <div style={styles.cardBody}>
                  {order.product && (
                    <div style={styles.productRow}>
                      <span style={styles.productName}>{order.product.name || `Product #${order.product.id}`}</span>
                      <span style={styles.productQty}>× {order.quantity}</span>
                    </div>
                  )}

                  {order.deliveryAddress && (
                    <div style={styles.addressRow}>
                      📍 {order.deliveryAddress}
                    </div>
                  )}

                  {order.totalAmount !== undefined && (
                    <div style={styles.amountRow}>
                      Total: <strong>₹{order.totalAmount}</strong>
                      {order.discount > 0 && (
                        <span style={styles.saved}> (Saved ₹{order.discount})</span>
                      )}
                    </div>
                  )}
                </div>

                {status !== 'DELIVERED' && status !== 'CANCELLED' && (
                  <div style={styles.cardFooter}>
                    <button onClick={() => handleCancel(order.id)} style={styles.cancelBtn}>
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const styles = {
  page: { maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  heading: {
    fontFamily: "'Georgia', serif",
    fontSize: '2rem',
    color: '#1a2e1a',
    margin: 0,
    fontWeight: 700,
  },
  refreshBtn: {
    background: 'transparent',
    border: '1px solid #c8e6c9',
    color: '#2e7d32',
    padding: '0.4rem 0.9rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: "'Georgia', serif",
    fontSize: '0.9rem',
  },
  loading: {
    textAlign: 'center',
    padding: '4rem',
    color: '#666',
    fontFamily: "'Georgia', serif",
  },
  empty: { textAlign: 'center', padding: '4rem 2rem' },
  emptyEmoji: { fontSize: '3.5rem', marginBottom: '1rem' },
  emptyText: {
    color: '#666',
    fontFamily: "'Georgia', serif",
    fontSize: '1.1rem',
  },
  list: { display: 'flex', flexDirection: 'column', gap: '1rem' },
  card: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8f5e9',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 1.25rem',
    background: '#f9fbe7',
    borderBottom: '1px solid #e8f5e9',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  orderId: {
    fontFamily: "'Georgia', serif",
    fontWeight: 700,
    color: '#1a2e1a',
    marginRight: '0.75rem',
  },
  statusBadge: {
    padding: '0.2rem 0.7rem',
    borderRadius: '12px',
    fontSize: '0.82rem',
    fontWeight: 600,
    fontFamily: "'Georgia', serif",
  },
  orderDate: {
    color: '#888',
    fontSize: '0.85rem',
    fontFamily: "'Georgia', serif",
  },
  cardBody: {
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  productRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productName: {
    fontFamily: "'Georgia', serif",
    color: '#333',
    fontSize: '0.95rem',
    fontWeight: 600,
  },
  productQty: {
    fontFamily: "'Georgia', serif",
    color: '#666',
    fontSize: '0.9rem',
  },
  addressRow: {
    fontFamily: "'Georgia', serif",
    color: '#555',
    fontSize: '0.875rem',
  },
  amountRow: {
    fontFamily: "'Georgia', serif",
    color: '#333',
    fontSize: '0.95rem',
  },
  saved: { color: '#2e7d32', fontStyle: 'italic' },
  cardFooter: {
    padding: '0.75rem 1.25rem',
    borderTop: '1px solid #e8f5e9',
    textAlign: 'right',
  },
  cancelBtn: {
    background: 'transparent',
    border: '1px solid #ef9a9a',
    color: '#b71c1c',
    padding: '0.35rem 0.9rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: "'Georgia', serif",
  },
};

export default Orders;
