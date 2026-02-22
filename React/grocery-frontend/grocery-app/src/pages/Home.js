import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div style={styles.page}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Fresh Groceries,<br />
            <span style={styles.accent}>Delivered Fast</span>
          </h1>
          <p style={styles.heroSub}>
            Order fruits, vegetables, dairy, and more from the comfort of your home.
            Fresh produce from local stores to your doorstep.
          </p>
          <div style={styles.heroButtons}>
            {isLoggedIn ? (
              <Link to="/products" style={styles.primaryBtn}>Shop Now →</Link>
            ) : (
              <>
                <Link to="/register" style={styles.primaryBtn}>Get Started</Link>
                <Link to="/login" style={styles.secondaryBtn}>Sign In</Link>
              </>
            )}
          </div>
        </div>
        <div style={styles.heroArt}>
          <div style={styles.emojiGrid}>
            {['🍎', '🥦', '🧀', '🍞', '🥕', '🍋', '🥑', '🫐'].map((e, i) => (
              <span key={i} style={{ ...styles.floatingEmoji, animationDelay: `${i * 0.3}s` }}>{e}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Discount Banner */}
      <div style={styles.banner}>
        🎁 <strong>Special Offer:</strong> Get ₹25 off when your cart exceeds ₹200!
      </div>

      {/* Features */}
      <section style={styles.features}>
        <h2 style={styles.sectionTitle}>Why FreshBasket?</h2>
        <div style={styles.featureGrid}>
          {[
            { icon: '🚴', title: 'Fast Delivery', desc: 'Orders delivered to your doorstep quickly.' },
            { icon: '🥗', title: 'Fresh Produce', desc: 'Sourced fresh daily from trusted local farms.' },
            { icon: '💳', title: 'Easy Payment', desc: 'Pay via card, UPI, wallet, or cash on delivery.' },
            { icon: '📱', title: 'Track Orders', desc: 'Real-time notifications: Confirmed → Delivered.' },
          ].map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2rem 1.5rem',
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    alignItems: 'center',
    minHeight: '420px',
    marginBottom: '2rem',
  },
  heroContent: {},
  heroTitle: {
    fontFamily: "'Georgia', serif",
    fontSize: '3rem',
    fontWeight: 700,
    color: '#1a2e1a',
    lineHeight: 1.2,
    margin: '0 0 1rem',
  },
  accent: { color: '#2e7d32' },
  heroSub: {
    fontFamily: "'Georgia', serif",
    color: '#555',
    fontSize: '1.05rem',
    lineHeight: 1.7,
    marginBottom: '2rem',
  },
  heroButtons: {
    display: 'flex',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  primaryBtn: {
    background: '#2e7d32',
    color: '#fff',
    padding: '0.8rem 2rem',
    borderRadius: '30px',
    textDecoration: 'none',
    fontFamily: "'Georgia', serif",
    fontWeight: 700,
    fontSize: '1.05rem',
    transition: 'background 0.2s',
  },
  secondaryBtn: {
    background: 'transparent',
    color: '#2e7d32',
    padding: '0.8rem 2rem',
    borderRadius: '30px',
    textDecoration: 'none',
    fontFamily: "'Georgia', serif",
    fontWeight: 700,
    fontSize: '1.05rem',
    border: '2px solid #2e7d32',
  },
  heroArt: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
  },
  floatingEmoji: {
    fontSize: '3.5rem',
    textAlign: 'center',
    animation: 'float 3s ease-in-out infinite alternate',
    display: 'block',
  },
  banner: {
    background: 'linear-gradient(90deg, #e8f5e9, #f1f8e9)',
    border: '1px solid #c8e6c9',
    borderRadius: '10px',
    padding: '1rem 1.5rem',
    marginBottom: '3rem',
    fontFamily: "'Georgia', serif",
    color: '#2e7d32',
    textAlign: 'center',
    fontSize: '1rem',
  },
  features: { marginBottom: '3rem' },
  sectionTitle: {
    fontFamily: "'Georgia', serif",
    fontSize: '1.8rem',
    color: '#1a2e1a',
    textAlign: 'center',
    marginBottom: '1.5rem',
    fontWeight: 700,
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.25rem',
  },
  featureCard: {
    background: '#fff',
    borderRadius: '12px',
    border: '1px solid #e8f5e9',
    padding: '1.5rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s',
  },
  featureIcon: { fontSize: '2.5rem', marginBottom: '0.75rem' },
  featureTitle: {
    fontFamily: "'Georgia', serif",
    color: '#1a2e1a',
    margin: '0 0 0.5rem',
    fontWeight: 700,
    fontSize: '1rem',
  },
  featureDesc: {
    fontFamily: "'Georgia', serif",
    color: '#666',
    fontSize: '0.875rem',
    margin: 0,
    lineHeight: 1.6,
  },
};

export default Home;
