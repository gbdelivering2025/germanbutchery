import React, { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../lib/store';
import CartDrawer from '../Cart/CartDrawer';

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <header style={styles.header}>
        <div className="container" style={styles.container}>
          <Link href="/" style={styles.logo}>
            <h1 style={styles.logoText}>German Butchery</h1>
          </Link>
          
          <nav style={styles.nav}>
            <Link href="/products" style={styles.navLink}>Products</Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              style={{ ...styles.navLink, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              🛒 Cart {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
            </button>
            <Link href="/orders" style={styles.navLink}>Orders</Link>
          </nav>
        </div>
      </header>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    padding: '1rem 0',
    boxShadow: 'var(--shadow-md)',
    position: 'sticky',
    top: 0,
    zIndex: 30,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    textDecoration: 'none',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    position: 'relative',
  },
  badge: {
    backgroundColor: 'var(--color-accent)',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: 'bold',
    marginLeft: '4px',
  },
};
