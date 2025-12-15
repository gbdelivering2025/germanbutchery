import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ordersApi } from '../../lib/api';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filter !== 'all') params.status = filter;
      
      const res = await ordersApi.getAll(params);
      setOrders(res.data.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      alert('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

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

  const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];

  return (
    <AdminLayout>
      <h1 style={styles.title}>Orders Management</h1>

      {/* Filter Buttons */}
      <div style={styles.filters}>
        <button
          className={filter === 'all' ? 'btn btn-primary' : 'btn'}
          style={filter === 'all' ? styles.activeFilter : styles.filterButton}
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        {statuses.map((status) => (
          <button
            key={status}
            className={filter === status ? 'btn btn-primary' : 'btn'}
            style={filter === status ? styles.activeFilter : styles.filterButton}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="card" style={styles.tableContainer}>
        {loading ? (
          <p>Loading orders...</p>
        ) : orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Order ID</th>
                <th style={styles.th}>Customer</th>
                <th style={styles.th}>Items</th>
                <th style={styles.th}>Total</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={styles.td}>{order.id.substring(0, 8)}</td>
                  <td style={styles.td}>
                    <div>{order.delivery?.customerName || 'N/A'}</div>
                    <div style={styles.subText}>{order.phone}</div>
                  </td>
                  <td style={styles.td}>{order.items?.length || 0} items</td>
                  <td style={styles.td}>{formatPrice(order.totalAmount)}</td>
                  <td style={styles.td}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      style={styles.statusSelect}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={styles.td}>{formatDate(order.createdAt)}</td>
                  <td style={styles.td}>
                    <button 
                      style={styles.actionButton}
                      onClick={() => alert('Order details coming soon')}
                    >
                      View
                    </button>
                    <button 
                      style={styles.actionButton}
                      onClick={() => {
                        const message = `Order #${order.id.substring(0, 8)} status updated to: ${order.status}`;
                        const whatsappUrl = `https://wa.me/${order.phone}?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                    >
                      📱 WhatsApp
                    </button>
                  </td>
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
  filters: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: 'white',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  },
  activeFilter: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
  },
  tableContainer: {
    padding: '0',
    overflow: 'auto',
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
    backgroundColor: '#f9f9f9',
  },
  td: {
    padding: '12px',
    borderBottom: '1px solid var(--color-border)',
    fontSize: '14px',
  },
  subText: {
    fontSize: '12px',
    color: 'var(--color-text-light)',
  },
  statusSelect: {
    padding: '6px 12px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    fontSize: '14px',
    cursor: 'pointer',
  },
  actionButton: {
    background: 'none',
    border: 'none',
    color: 'var(--color-primary)',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginRight: '0.5rem',
  },
};
