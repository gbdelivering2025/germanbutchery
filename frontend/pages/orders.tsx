import React from 'react';
import Layout from '../components/ui/Layout';

export default function OrdersPage() {
  return (
    <Layout>
      <div className="container">
        <h1 style={styles.title}>My Orders</h1>
        
        <div style={styles.info}>
          <p style={styles.text}>
            Order tracking is coming soon! For now, you can track your orders via WhatsApp.
          </p>
          <p style={styles.text}>
            Contact us on WhatsApp: <a href="https://wa.me/250123456789" target="_blank" rel="noopener noreferrer">+250 123 456 789</a>
          </p>
        </div>
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: 'var(--color-text)',
  },
  info: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-sm)',
  },
  text: {
    fontSize: '16px',
    marginBottom: '1rem',
    color: 'var(--color-text-light)',
  },
};
