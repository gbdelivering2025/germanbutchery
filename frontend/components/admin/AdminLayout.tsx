import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/products', label: 'Products', icon: '🥩' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/design', label: 'Design', icon: '🎨' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.sidebarTitle}>Admin Panel</h2>
        </div>
        
        <nav style={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...styles.navItem,
                ...(router.pathname === item.href ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.icon}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <Link href="/" style={styles.backLink}>
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    width: '250px',
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
  },
  sidebarHeader: {
    padding: '2rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  sidebarTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    margin: 0,
  },
  nav: {
    flex: 1,
    padding: '1rem 0',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1.5rem',
    color: 'white',
    textDecoration: 'none',
    transition: 'background-color 0.2s ease',
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderLeft: '4px solid white',
  },
  icon: {
    fontSize: '20px',
  },
  sidebarFooter: {
    padding: '1.5rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  },
  backLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
  },
  main: {
    flex: 1,
    overflow: 'auto',
  },
  content: {
    padding: '2rem',
    maxWidth: '1400px',
  },
};
