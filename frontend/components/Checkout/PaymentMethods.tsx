import React from 'react';

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

export default function PaymentMethods({
  selectedMethod,
  onMethodChange,
}: PaymentMethodsProps) {
  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: '💵',
      description: 'Pay with cash when you receive your order',
    },
    {
      id: 'mtn_momo',
      name: 'MTN Mobile Money',
      icon: '📱',
      description: 'Pay with MTN MoMo',
    },
    {
      id: 'airtel_money',
      name: 'Airtel Money',
      icon: '📱',
      description: 'Pay with Airtel Money',
    },
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: '🏦',
      description: 'Transfer to our bank account',
    },
  ];

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Payment Method</h3>
      
      <div style={styles.methodsGroup}>
        {paymentMethods.map((method) => (
          <label key={method.id} style={styles.methodLabel}>
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selectedMethod === method.id}
              onChange={() => onMethodChange(method.id)}
              style={styles.radio}
            />
            <span style={styles.methodContent}>
              <span style={styles.methodIcon}>{method.icon}</span>
              <span style={styles.methodText}>
                <strong>{method.name}</strong>
                <span style={styles.methodDescription}>{method.description}</span>
              </span>
            </span>
          </label>
        ))}
      </div>

      {selectedMethod === 'mtn_momo' && (
        <div style={styles.info}>
          <p style={styles.infoText}>
            You will receive payment instructions via WhatsApp after placing your order.
          </p>
        </div>
      )}

      {selectedMethod === 'airtel_money' && (
        <div style={styles.info}>
          <p style={styles.infoText}>
            You will receive payment instructions via WhatsApp after placing your order.
          </p>
        </div>
      )}

      {selectedMethod === 'bank_transfer' && (
        <div style={styles.info}>
          <p style={styles.infoText}>
            You will receive our bank details via WhatsApp after placing your order.
          </p>
        </div>
      )}
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '1rem',
    color: 'var(--color-text)',
  },
  methodsGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  methodLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  radio: {
    marginTop: '2px',
    cursor: 'pointer',
  },
  methodContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    flex: 1,
  },
  methodIcon: {
    fontSize: '24px',
  },
  methodText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  methodDescription: {
    fontSize: '14px',
    color: 'var(--color-text-light)',
    fontWeight: 'normal',
  },
  info: {
    marginTop: '1rem',
    padding: '0.75rem',
    backgroundColor: '#F0F9FF',
    border: '1px solid #BFDBFE',
    borderRadius: 'var(--border-radius)',
  },
  infoText: {
    fontSize: '14px',
    color: '#1E40AF',
    margin: 0,
  },
};
