import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import Toast from '../components/Toast';

// Emoji icons for categories
const CATEGORY_ICONS = {
  fruits: '🍎', vegetables: '🥦', dairy: '🧀', bakery: '🍞',
  meat: '🥩', seafood: '🐟', beverages: '🥤', snacks: '🍿',
  default: '🛍️',
};

const getCategoryIcon = (name = '') => {
  const key = name.toLowerCase();
  return CATEGORY_ICONS[key] || CATEGORY_ICONS.default;
};

// Mock products since the backend provides categories, not a product endpoint
// In a real setup, you'd have a ProductController returning these
const MOCK_PRODUCTS_BY_CATEGORY = {
  Fruits: [
    { id: 1, name: 'Apple (1 kg)', price: 80, available: true },
    { id: 2, name: 'Banana (dozen)', price: 40, available: true },
    { id: 3, name: 'Mango (500g)', price: 120, available: true },
  ],
  Vegetables: [
    { id: 4, name: 'Tomato (1 kg)', price: 35, available: true },
    { id: 5, name: 'Onion (1 kg)', price: 30, available: true },
    { id: 6, name: 'Spinach (250g)', price: 25, available: true },
  ],
  Dairy: [
    { id: 7, name: 'Milk (1L)', price: 60, available: true },
    { id: 8, name: 'Curd (500g)', price: 40, available: true },
    { id: 9, name: 'Paneer (200g)', price: 90, available: false },
  ],
  Bakery: [
    { id: 10, name: 'Bread Loaf', price: 45, available: true },
    { id: 11, name: 'Croissant', price: 30, available: true },
  ],
};

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    categoryAPI.getAll()
      .then((res) => {
        setCategories(res.data);
      })
      .catch(() => {
        // fallback to mock categories if backend not running
        setCategories(Object.keys(MOCK_PRODUCTS_BY_CATEGORY).map((name, id) => ({ id: id + 1, name })));
      })
      .finally(() => setLoading(false));
  }, []);

  // Build product list from mock data, keyed by category name
  const allProducts = Object.entries(MOCK_PRODUCTS_BY_CATEGORY).flatMap(([cat, products]) =>
    products.map((p) => ({ ...p, category: cat }))
  );

  const filteredProducts = allProducts.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAdd = (product) => {
    addToCart(product, 1);
    setToast({ message: `${product.name} added to cart!`, type: 'success' });
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Fresh Groceries</h1>
        <p style={styles.sub}>Order fresh produce delivered to your door</p>
      </div>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="🔍  Search groceries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
        <div style={styles.catFilters}>
          {['All', ...Object.keys(MOCK_PRODUCTS_BY_CATEGORY)].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                ...styles.catBtn,
                ...(selectedCategory === cat ? styles.catBtnActive : {}),
              }}
            >
              {cat !== 'All' && getCategoryIcon(cat)} {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading products...</div>
      ) : (
        <div style={styles.grid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={handleAdd} />
          ))}
          {filteredProducts.length === 0 && (
            <div style={styles.empty}>No products found matching your search.</div>
          )}
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
};

const ProductCard = ({ product, onAdd }) => {
  const [qty, setQty] = useState(1);

  return (
    <div style={styles.card}>
      <div style={styles.cardEmoji}>{getCategoryIcon(product.category)}</div>
      <div style={styles.cardBody}>
        <h3 style={styles.productName}>{product.name}</h3>
        <p style={styles.category}>{product.category}</p>
        <div style={styles.priceRow}>
          <span style={styles.price}>₹{product.price}</span>
          {product.available ? (
            <span style={styles.inStock}>In Stock</span>
          ) : (
            <span style={styles.outStock}>Out of Stock</span>
          )}
        </div>
      </div>
      <div style={styles.addRow}>
        <div style={styles.qtyGroup}>
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} style={styles.qtyBtn}>−</button>
          <span style={styles.qtyVal}>{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} style={styles.qtyBtn}>+</button>
        </div>
        <button
          disabled={!product.available}
          onClick={() => onAdd({ ...product, quantity: qty })}
          style={{ ...styles.addBtn, opacity: product.available ? 1 : 0.4 }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  header: {
    marginBottom: '2rem',
  },
  heading: {
    fontFamily: "'Georgia', serif",
    fontSize: '2.2rem',
    color: '#1a2e1a',
    margin: '0 0 0.3rem',
    fontWeight: 700,
  },
  sub: {
    color: '#666',
    margin: 0,
    fontFamily: "'Georgia', serif",
  },
  controls: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  search: {
    padding: '0.75rem 1.25rem',
    border: '1.5px solid #c8e6c9',
    borderRadius: '30px',
    fontSize: '0.95rem',
    fontFamily: "'Georgia', serif",
    outline: 'none',
    width: '100%',
    maxWidth: '420px',
    background: '#f9fbe7',
    color: '#222',
  },
  catFilters: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  catBtn: {
    padding: '0.4rem 1rem',
    borderRadius: '20px',
    border: '1.5px solid #c8e6c9',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: "'Georgia', serif",
    color: '#2e7d32',
    transition: 'all 0.2s',
  },
  catBtnActive: {
    background: '#2e7d32',
    color: '#fff',
    border: '1.5px solid #2e7d32',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '1.25rem',
  },
  card: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8f5e9',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  cardEmoji: {
    fontSize: '3.5rem',
    textAlign: 'center',
    padding: '1.5rem 1rem 0.5rem',
    background: '#f1f8e9',
  },
  cardBody: {
    padding: '1rem 1.25rem 0.5rem',
    flex: 1,
  },
  productName: {
    fontFamily: "'Georgia', serif",
    margin: '0 0 0.2rem',
    fontSize: '1rem',
    color: '#1a2e1a',
    fontWeight: 700,
  },
  category: {
    color: '#888',
    fontSize: '0.8rem',
    fontFamily: "'Georgia', serif",
    margin: '0 0 0.75rem',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#2e7d32',
    fontFamily: "'Georgia', serif",
  },
  inStock: {
    fontSize: '0.75rem',
    color: '#2e7d32',
    background: '#e8f5e9',
    padding: '0.2rem 0.5rem',
    borderRadius: '10px',
    fontFamily: "'Georgia', serif",
  },
  outStock: {
    fontSize: '0.75rem',
    color: '#b71c1c',
    background: '#fdecea',
    padding: '0.2rem 0.5rem',
    borderRadius: '10px',
    fontFamily: "'Georgia', serif",
  },
  addRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 1.25rem 1rem',
    gap: '0.5rem',
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
    width: '28px',
    height: '28px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 700,
    color: '#2e7d32',
  },
  qtyVal: {
    minWidth: '24px',
    textAlign: 'center',
    fontFamily: "'Georgia', serif",
    fontWeight: 700,
    fontSize: '0.9rem',
    color: '#222',
  },
  addBtn: {
    background: '#2e7d32',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 0.9rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: "'Georgia', serif",
    fontWeight: 600,
    transition: 'background 0.2s',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#666',
    fontFamily: "'Georgia', serif",
  },
  empty: {
    gridColumn: '1/-1',
    textAlign: 'center',
    color: '#999',
    padding: '3rem',
    fontFamily: "'Georgia', serif",
  },
};

export default Products;
