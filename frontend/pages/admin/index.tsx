import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ordersApi, productsApi } from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          ordersApi.getAll({ limit: 5 }),
          productsApi.getAll({ limit: 1 }),
        ]);

        const orders = ordersRes.data.data || [];
        const pendingOrders = orders.filter((o: any) => o.status === 'pending');
        const revenue = orders.reduce((sum: number, o: any) => sum + parseFloat(o.totalAmount), 0);

        setStats({
          totalOrders: ordersRes.data.pagination?.total || 0,
          totalProducts: productsRes.data.pagination?.total || 0,
          pendingOrders: pendingOrders.length,
          revenue,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <h1 style={styles.title}>Dashboard</h1>

      {/* Stats Grid */}
      <div style={styles.statsGrid}>
        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>📦</div>
          <div>
            <div style={styles.statValue}>{stats.totalOrders}</div>
            <div style={styles.statLabel}>Total Orders</div>
          </div>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>⏳</div>
          <div>
            <div style={styles.statValue}>{stats.pendingOrders}</div>
            <div style={styles.statLabel}>Pending Orders</div>
          </div>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>🥩</div>
          <div>
            <div style={styles.statValue}>{stats.totalProducts}</div>
            <div style={styles.statLabel}>Total Products</div>
          </div>
        </div>

        <div className="card" style={styles.statCard}>
          <div style={styles.statIcon}>💰</div>
          <div>
            <div style={styles.statValue}>{formatPrice(stats.revenue)}</div>
            <div style={styles.statLabel}>Total Revenue</div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card" style={styles.section}>
        <h2 style={styles.sectionTitle}>Recent Orders</h2>
        
        {recentOrders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td style={styles.td}>{order.id.substring(0, 8)}</td>
                  <td style={styles.td}>{order.phone || 'N/A'}</td>
                  <td style={styles.td}>{formatPrice(order.totalAmount)}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: order.status === 'pending' ? '#FFA500' : '#4CAF50',
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={styles.td}>{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '2rem',
    color: 'var(--color-text)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
  },
  statIcon: {
    fontSize: '40px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
  },
  statLabel: {
    fontSize: '14px',
    color: 'var(--color-text-light)',
  },
  section: {
    padding: '1.5rem',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: 'var(--color-text)',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    padding: '12px',
    borderBottom: '2px solid var(--color-border)',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text)',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid var(--color-border)',
    fontSize: '14px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
  },
};
