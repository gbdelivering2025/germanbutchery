import React from 'react';
import Link from 'next/link';
import { useCartStore } from '../../lib/store';

export default function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <header style={styles.header}>
      <div className="container" style={styles.container}>
        <Link href="/" style={styles.logo}>
          <h1 style={styles.logoText}>German Butchery</h1>
        </Link>
        
        <nav style={styles.nav}>
          <Link href="/products" style={styles.navLink}>Products</Link>
          <Link href="/cart" style={styles.navLink}>
            Cart {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
          </Link>
          <Link href="/orders" style={styles.navLink}>Orders</Link>
        </nav>
      </div>
    </header>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    padding: '1rem 0',
    boxShadow: 'var(--shadow-md)',
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
