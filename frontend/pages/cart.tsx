import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/ui/Layout';
import DeliveryOptions from '../components/Checkout/DeliveryOptions';
import PaymentMethods from '../components/Checkout/PaymentMethods';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { useCartStore } from '../lib/store';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore();
  
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryZone, setDeliveryZone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');
  
  // Mock delivery zones (would come from API in production)
  const deliveryZones = [
    { id: '1', name: 'Kigali Center', fee: 2000 },
    { id: '2', name: 'Kigali Suburbs', fee: 3000 },
    { id: '3', name: 'Remera', fee: 2500 },
    { id: '4', name: 'Kimironko', fee: 3000 },
    { id: '5', name: 'Nyarutarama', fee: 3500 },
    { id: '6', name: 'Outside Kigali', fee: 5000 },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getDeliveryFee = () => {
    if (deliveryType === 'pickup') return 0;
    const zone = deliveryZones.find(z => z.id === deliveryZone);
    return zone ? zone.fee : 0;
  };

  const getTotal = () => {
    return getTotalPrice() + getDeliveryFee();
  };

  const handleCheckout = () => {
    if (!customerName || !phone) {
      alert('Please fill in your name and phone number');
      return;
    }

    if (deliveryType === 'delivery' && (!address || !deliveryZone)) {
      alert('Please fill in your delivery address and select a zone');
      return;
    }

    // Generate WhatsApp message
    let message = `*New Order from German Butchery*\n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${customerName}\n`;
    message += `Phone: ${phone}\n`;
    if (email) message += `Email: ${email}\n`;
    
    if (deliveryType === 'delivery') {
      message += `\n*Delivery Information:*\n`;
      message += `Address: ${address}\n`;
      const zone = deliveryZones.find(z => z.id === deliveryZone);
      message += `Zone: ${zone?.name || 'N/A'}\n`;
      message += `Delivery Fee: ${formatPrice(getDeliveryFee())}\n`;
    } else {
      message += `\n*Pickup at Store*\n`;
    }
    
    message += `\n*Payment Method:* ${paymentMethod.replace('_', ' ').toUpperCase()}\n`;
    
    if (notes) {
      message += `\n*Notes:* ${notes}\n`;
    }
    
    message += `\n*Order Items:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.title}\n`;
      message += `   Qty: ${item.quantity} ${item.unit}\n`;
      message += `   Price: ${formatPrice(item.price * item.quantity)}\n\n`;
    });
    
    message += `*Subtotal: ${formatPrice(getTotalPrice())}*\n`;
    if (deliveryType === 'delivery') {
      message += `*Delivery: ${formatPrice(getDeliveryFee())}*\n`;
    }
    message += `*Total: ${formatPrice(getTotal())}*`;

    const whatsappUrl = `https://wa.me/250123456789?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container">
          <h1 style={styles.title}>Shopping Cart</h1>
          <div style={styles.emptyCart}>
            <p style={styles.emptyText}>Your cart is empty</p>
            <Button onClick={() => router.push('/products')}>
              Continue Shopping
            </Button>
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
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Checkout Section */}
          <div style={styles.checkoutSection}>
            <div className="card" style={styles.checkoutCard}>
              <h2 style={styles.checkoutTitle}>Checkout</h2>
              
              <div style={styles.form}>
                <Input
                  label="Full Name"
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  required
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+250 XXX XXX XXX"
                  required
                />

                <Input
                  label="Email (Optional)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                />

                <DeliveryOptions
                  deliveryType={deliveryType}
                  onDeliveryTypeChange={setDeliveryType}
                  deliveryZones={deliveryZones}
                  selectedZone={deliveryZone}
                  onZoneChange={setDeliveryZone}
                />

                {deliveryType === 'delivery' && (
                  <div>
                    <label style={styles.label}>Delivery Address *</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={styles.textarea}
                      placeholder="Enter your full delivery address"
                      rows={3}
                      required
                    />
                  </div>
                )}

                <PaymentMethods
                  selectedMethod={paymentMethod}
                  onMethodChange={setPaymentMethod}
                />

                <div>
                  <label style={styles.label}>Order Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={styles.textarea}
                    placeholder="Any special instructions?"
                    rows={2}
                  />
                </div>
              </div>

              <div style={styles.separator}></div>

              <div style={styles.summary}>
                <div style={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>{formatPrice(getTotalPrice())}</span>
                </div>
                {deliveryType === 'delivery' && (
                  <div style={styles.summaryRow}>
                    <span>Delivery Fee:</span>
                    <span>{formatPrice(getDeliveryFee())}</span>
                  </div>
                )}
                <div style={{ ...styles.summaryRow, ...styles.totalRow }}>
                  <span>Total:</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>
              </div>

              <Button 
                variant="whatsapp"
                fullWidth
                onClick={handleCheckout}
              >
                Place Order via WhatsApp
              </Button>
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
  emptyText: {
    fontSize: '18px',
    color: 'var(--color-text-light)',
    marginBottom: '1.5rem',
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
    padding: '8px',
    border: 'none',
    backgroundColor: 'transparent',
    color: 'var(--color-text-light)',
    cursor: 'pointer',
    fontSize: '20px',
  },
  checkoutSection: {
    position: 'sticky' as const,
    top: '6rem',
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
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'var(--color-text)',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    fontSize: '16px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  separator: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
    margin: '1.5rem 0',
  },
  summary: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '16px',
  },
  totalRow: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
    paddingTop: '0.75rem',
    borderTop: '1px solid var(--color-border)',
  },
};
