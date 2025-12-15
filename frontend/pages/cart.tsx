import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/ui/Layout';
import { useCartStore } from '../lib/store';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleCheckout = () => {
    if (!customerName || !phone || !address) {
      alert('Please fill in all delivery information');
      return;
    }

    // Generate WhatsApp message
    let message = `*New Order from German Butchery*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${customerName}\n`;
    message += `Phone: ${phone}\n`;
    message += `Address: ${address}\n\n`;
    message += `*Order Items:*\n`;
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.title}\n`;
      message += `   Qty: ${item.quantity} ${item.unit}\n`;
      message += `   Price: ${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    message += `*Total: ${formatPrice(getTotalPrice())}*`;

    const whatsappUrl = `https://wa.me/250123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Optionally clear cart after checkout
    // clearCart();
    // router.push('/orders');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container">
          <h1 style={styles.title}>Shopping Cart</h1>
          <div style={styles.emptyCart}>
            <p>Your cart is empty</p>
            <button 
              className="btn btn-primary"
              onClick={() => router.push('/products')}
              style={styles.shopButton}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container">
        <h1 style={styles.title}>Shopping Cart</h1>

        <div style={styles.container}>
          {/* Cart Items */}
          <div style={styles.itemsSection}>
            {items.map((item) => (
              <div key={item.id} className="card" style={styles.cartItem}>
                <img 
                  src={item.imageUrl || '/placeholder.svg'} 
                  alt={item.title}
                  style={styles.itemImage}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                
                <div style={styles.itemDetails}>
                  <h3 style={styles.itemTitle}>{item.title}</h3>
                  <p style={styles.itemPrice}>{formatPrice(item.price)} / {item.unit}</p>
                </div>

                <div style={styles.quantityControl}>
                  <button 
                    style={styles.qtyButton}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span style={styles.quantity}>{item.quantity}</span>
                  <button 
                    style={styles.qtyButton}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div style={styles.itemTotal}>
                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>

                <button 
                  style={styles.removeButton}
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Section */}
          <div style={styles.checkoutSection}>
            <div className="card" style={styles.checkoutCard}>
              <h2 style={styles.checkoutTitle}>Delivery Information</h2>
              
              <div style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Name *</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={styles.input}
                    placeholder="Your name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={styles.input}
                    placeholder="+250 XXX XXX XXX"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Delivery Address *</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ ...styles.input, minHeight: '80px' }}
                    placeholder="Full delivery address"
                  />
                </div>
              </div>

              <div style={styles.separator}></div>

              <div style={styles.totalSection}>
                <span style={styles.totalLabel}>Total:</span>
                <span style={styles.totalPrice}>{formatPrice(getTotalPrice())}</span>
              </div>

              <button 
                className="btn btn-whatsapp"
                style={styles.checkoutButton}
                onClick={handleCheckout}
              >
                Checkout via WhatsApp
              </button>
            </div>
          </div>
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
  container: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  shopButton: {
    marginTop: '1rem',
  },
  itemsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: 'var(--spacing-md)',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: 'var(--border-radius)',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '0.25rem',
  },
  itemPrice: {
    fontSize: '14px',
    color: 'var(--color-text-light)',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  qtyButton: {
    width: '32px',
    height: '32px',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    backgroundColor: 'white',
    fontSize: '18px',
    cursor: 'pointer',
  },
  quantity: {
    fontSize: '16px',
    fontWeight: '600',
    minWidth: '30px',
    textAlign: 'center',
  },
  itemTotal: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
    minWidth: '100px',
    textAlign: 'right',
  },
  removeButton: {
    padding: '8px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'white',
    color: 'var(--color-text-light)',
    cursor: 'pointer',
    fontSize: '14px',
  },
  checkoutSection: {
    position: 'sticky' as const,
    top: '2rem',
    height: 'fit-content',
  },
  checkoutCard: {
    padding: 'var(--spacing-lg)',
  },
  checkoutTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--color-text)',
  },
  input: {
    padding: '10px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    fontSize: '16px',
    outline: 'none',
  },
  separator: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '1.5rem 0',
  },
  totalSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  totalLabel: {
    fontSize: '18px',
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
  },
  checkoutButton: {
    width: '100%',
    fontSize: '18px',
    padding: '14px',
  },
};
