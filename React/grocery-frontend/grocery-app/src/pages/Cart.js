import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import Toast from '../components/Toast';

const Cart = () => {
  const { localCart, removeFromCart, updateQuantity, clearCart, subtotal, discount, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deliveryAddress, setDeliveryAddress] = useState(user?.address || '');
  const [placing, setPlacing] = useState(false);
  const [toast, setToast] = useState(null);

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.trim()) {
      setToast({ message: 'Please enter a delivery address', type: 'error' });
      return;
    }
    if (localCart.length === 0) {
      setToast({ message: 'Your cart is empty', type: 'error' });
      return;
    }

    setPlacing(true);
    try {
      // Place one order per cart item (backend API: /orders/{customerId}/{productId}/{quantity})
      const orderPromises = localCart.map((item) =>
        orderAPI.placeOrder(user.id, item.productId, item.quantity, deliveryAddress)
      );
      await Promise.all(orderPromises);
      clearCart();
      setToast({ message: '🎉 Order placed successfully!', type: 'success' });
      setTimeout(() => navigate('/orders'), 1800);
    } catch (err) {
      setToast({ message: 'Failed to place order. Check backend connection.', type: 'error' });
    } finally {
      setPlacing(false);
    }
  };

  if (localCart.length === 0) {
    return (
      <div style={styles.emptyPage}>
        <div style={styles.emptyEmoji}>🛒</div>
        <h2 style={styles.emptyTitle}>Your cart is empty</h2>
        <p style={styles.emptyText}>Add some fresh groceries to get started!</p>
        <button onClick={() => navigate('/products')} style={styles.shopBtn}>
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Your Cart</h1>

      <div style={styles.layout}>
        {/* Cart Items */}
        <div style={styles.itemsSection}>
          {localCart.map((item) => (
            <div key={item.productId} style={styles.item}>
              <div style={styles.itemInfo}>
                <span style={styles.itemName}>{item.name}</span>
                <span style={styles.itemPrice}>₹{item.price} each</span>
              </div>
              <div style={styles.itemControls}>
                <div style={styles.qtyGroup}>
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} style={styles.qtyBtn}>−</button>
                  <span style={styles.qtyVal}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} style={styles.qtyBtn}>+</button>
                </div>
                <span style={styles.itemTotal}>₹{item.price * item.quantity}</span>
                <button onClick={() => removeFromCart(item.productId)} style={styles.removeBtn}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h2 style={styles.summaryTitle}>Order Summary</h2>

          <div style={styles.summaryRow}>
            <span style={styles.summaryLabel}>Subtotal</span>
            <span style={styles.summaryVal}>₹{subtotal}</span>
          </div>

          {discount > 0 && (
            <div style={{ ...styles.summaryRow, ...styles.discountRow }}>
              <span style={styles.summaryLabel}>Discount (cart &gt; ₹200)</span>
              <span style={styles.discountVal}>−₹{discount}</span>
            </div>
          )}

          {subtotal <= 200 && (
            <div style={styles.discountHint}>
              Add ₹{200 - subtotal} more to get ₹25 off!
            </div>
          )}

          <div style={styles.divider} />

          <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
            <span style={styles.totalLabel}>Total</span>
            <span style={styles.totalVal}>₹{total}</span>
          </div>

          <div style={styles.addressField}>
            <label style={styles.label}>Delivery Address</label>
            <textarea
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your delivery address..."
              style={styles.textarea}
              rows={3}
            />
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placing}
            style={styles.orderBtn}
          >
            {placing ? 'Placing Order...' : `Place Order • ₹${total}`}
          </button>

          <button onClick={clearCart} style={styles.clearBtn}>Clear Cart</button>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

const styles = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.5rem' },
  heading: {
    fontFamily: "'Georgia', serif",
    fontSize: '2rem',
    color: '#1a2e1a',
    marginBottom: '1.5rem',
    fontWeight: 700,
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: '1.5rem',
    alignItems: 'start',
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  item: {
    background: '#fff',
    borderRadius: '10px',
    border: '1px solid #e8f5e9',
    padding: '1rem 1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  itemInfo: { flex: 1 },
  itemName: {
    display: 'block',
    fontFamily: "'Georgia', serif",
    fontWeight: 700,
    color: '#1a2e1a',
    marginBottom: '0.25rem',
  },
  itemPrice: {
    display: 'block',
    fontFamily: "'Georgia', serif",
    color: '#888',
    fontSize: '0.85rem',
  },
  itemControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  qtyGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    border: '1px solid #c8e6c9',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  qtyBtn: {
    background: '#f1f8e9',
    border: 'none',
    width: '30px',
    height: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#2e7d32',
  },
  qtyVal: {
    minWidth: '28px',
    textAlign: 'center',
    fontFamily: "'Georgia', serif",
    fontWeight: 700,
    color: '#222',
  },
  itemTotal: {
    fontFamily: "'Georgia', serif",
    fontWeight: 700,
    fontSize: '1.05rem',
    color: '#2e7d32',
    minWidth: '60px',
    textAlign: 'right',
  },
  removeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#999',
    fontSize: '1rem',
    padding: '0.25rem',
    transition: 'color 0.2s',
  },
  summary: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8f5e9',
    padding: '1.5rem',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  summaryTitle: {
    fontFamily: "'Georgia', serif",
    fontSize: '1.2rem',
    color: '#1a2e1a',
    margin: '0 0 1.25rem',
    fontWeight: 700,
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.75rem',
  },
  summaryLabel: {
    fontFamily: "'Georgia', serif",
    color: '#555',
    fontSize: '0.95rem',
  },
  summaryVal: {
    fontFamily: "'Georgia', serif",
    color: '#333',
    fontWeight: 600,
  },
  discountRow: {},
  discountVal: {
    fontFamily: "'Georgia', serif",
    color: '#2e7d32',
    fontWeight: 700,
  },
  discountHint: {
    background: '#fff9c4',
    border: '1px solid #f9a825',
    borderRadius: '8px',
    padding: '0.5rem 0.75rem',
    fontSize: '0.82rem',
    color: '#e65100',
    fontFamily: "'Georgia', serif",
    marginBottom: '0.75rem',
  },
  divider: {
    borderTop: '1px solid #e8f5e9',
    margin: '0.5rem 0 1rem',
  },
  totalRow: { marginBottom: '1.25rem' },
  totalLabel: {
    fontFamily: "'Georgia', serif",
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#1a2e1a',
  },
  totalVal: {
    fontFamily: "'Georgia', serif",
    fontSize: '1.3rem',
    fontWeight: 700,
    color: '#2e7d32',
  },
  addressField: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontFamily: "'Georgia', serif",
    fontSize: '0.875rem',
    color: '#333',
    fontWeight: 600,
    marginBottom: '0.4rem',
  },
  textarea: {
    width: '100%',
    padding: '0.7rem',
    border: '1.5px solid #c8e6c9',
    borderRadius: '8px',
    fontFamily: "'Georgia', serif",
    fontSize: '0.9rem',
    resize: 'vertical',
    outline: 'none',
    color: '#222',
    boxSizing: 'border-box',
  },
  orderBtn: {
    width: '100%',
    background: '#2e7d32',
    color: '#fff',
    border: 'none',
    padding: '0.9rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: "'Georgia', serif",
    fontWeight: 700,
    cursor: 'pointer',
    marginBottom: '0.75rem',
    transition: 'background 0.2s',
  },
  clearBtn: {
    width: '100%',
    background: 'transparent',
    color: '#b71c1c',
    border: '1px solid #ef9a9a',
    padding: '0.6rem',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontFamily: "'Georgia', serif",
    cursor: 'pointer',
  },
  // Empty state
  emptyPage: {
    textAlign: 'center',
    padding: '5rem 2rem',
  },
  emptyEmoji: { fontSize: '4rem', marginBottom: '1rem' },
  emptyTitle: {
    fontFamily: "'Georgia', serif",
    fontSize: '1.8rem',
    color: '#1a2e1a',
    margin: '0 0 0.5rem',
  },
  emptyText: {
    color: '#666',
    fontFamily: "'Georgia', serif",
    marginBottom: '1.5rem',
  },
  shopBtn: {
    background: '#2e7d32',
    color: '#fff',
    border: 'none',
    padding: '0.8rem 2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontFamily: "'Georgia', serif",
    fontWeight: 700,
    cursor: 'pointer',
  },
};

export default Cart;
