import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { productsApi, categoriesApi } from '../../lib/api';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showBulkEdit, setShowBulkEdit] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productsApi.getAll({ limit: 100 }),
        categoriesApi.getAll(),
      ]);
      setProducts(productsRes.data.data || []);
      setCategories(categoriesRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsApi.delete(id);
      alert('Product deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleBulkUpdate = async (updates: any) => {
    if (selectedProducts.length === 0) {
      alert('Please select products to update');
      return;
    }

    try {
      await productsApi.bulkUpdate({
        productIds: selectedProducts,
        updates,
      });
      alert(`${selectedProducts.length} products updated successfully`);
      setSelectedProducts([]);
      setShowBulkEdit(false);
      fetchData();
    } catch (error) {
      console.error('Error updating products:', error);
      alert('Error updating products');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <AdminLayout>
      <div style={styles.header}>
        <h1 style={styles.title}>Products Management</h1>
        <button className="btn btn-primary">Add New Product</button>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="card" style={styles.bulkActions}>
          <span>{selectedProducts.length} products selected</span>
          <div style={styles.bulkButtons}>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowBulkEdit(!showBulkEdit)}
            >
              Bulk Edit
            </button>
            <button 
              className="btn"
              onClick={() => setSelectedProducts([])}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}

      {/* Bulk Edit Form */}
      {showBulkEdit && (
        <div className="card" style={styles.bulkEditForm}>
          <h3>Bulk Edit Products</h3>
          <div style={styles.formRow}>
            <label>
              Set Price:
              <input 
                type="number" 
                style={styles.input}
                placeholder="New price"
                id="bulkPrice"
              />
            </label>
            <label>
              Set Active Status:
              <select style={styles.input} id="bulkActive">
                <option value="">No change</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </label>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => {
              const price = (document.getElementById('bulkPrice') as HTMLInputElement).value;
              const active = (document.getElementById('bulkActive') as HTMLSelectElement).value;
              const updates: any = {};
              if (price) updates.pricePerBaseUnit = parseFloat(price);
              if (active) updates.isActive = active === 'true';
              handleBulkUpdate(updates);
            }}
          >
            Apply Changes
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="card" style={styles.tableContainer}>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProducts(products.map(p => p.id));
                      } else {
                        setSelectedProducts([]);
                      }
                    }}
                  />
                </th>
                <th style={styles.th}>Image</th>
                <th style={styles.th}>Title</th>
                <th style={styles.th}>SKU</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Unit</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const primaryImage = product.images?.find((img: any) => img.isPrimary)?.imageUrl || '/placeholder.svg';
                return (
                  <tr key={product.id}>
                    <td style={styles.td}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleToggleSelect(product.id)}
                      />
                    </td>
                    <td style={styles.td}>
                      <img 
                        src={primaryImage} 
                        alt={product.title}
                        style={styles.productImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </td>
                    <td style={styles.td}>{product.title}</td>
                    <td style={styles.td}>{product.sku || 'N/A'}</td>
                    <td style={styles.td}>{formatPrice(product.pricePerBaseUnit)}</td>
                    <td style={styles.td}>{product.baseUnit}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        backgroundColor: product.isActive ? '#4CAF50' : '#999',
                      }}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <button 
                        style={styles.actionButton}
                        onClick={() => alert('Edit feature coming soon')}
                      >
                        Edit
                      </button>
                      <button 
                        style={{...styles.actionButton, color: '#d32f2f'}}
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'var(--color-text)',
  },
  bulkActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#FFF3CD',
    border: '1px solid #FFE69C',
  },
  bulkButtons: {
    display: 'flex',
    gap: '0.5rem',
  },
  bulkEditForm: {
    padding: '1.5rem',
    marginBottom: '1rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    margin: '1rem 0',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '8px',
    marginTop: '0.25rem',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
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
  productImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
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
