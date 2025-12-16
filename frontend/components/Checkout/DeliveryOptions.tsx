import React from 'react';

interface DeliveryZone {
  id: string;
  name: string;
  fee: number;
}

interface DeliveryOptionsProps {
  deliveryType: 'delivery' | 'pickup';
  onDeliveryTypeChange: (type: 'delivery' | 'pickup') => void;
  deliveryZones: DeliveryZone[];
  selectedZone?: string;
  onZoneChange: (zone: string) => void;
}

export default function DeliveryOptions({
  deliveryType,
  onDeliveryTypeChange,
  deliveryZones,
  selectedZone,
  onZoneChange,
}: DeliveryOptionsProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Delivery Options</h3>
      
      {/* Delivery Type */}
      <div style={styles.optionsGroup}>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            name="deliveryType"
            value="delivery"
            checked={deliveryType === 'delivery'}
            onChange={() => onDeliveryTypeChange('delivery')}
            style={styles.radio}
          />
          <span style={styles.labelText}>
            <strong>🚚 Delivery</strong>
            <span style={styles.labelSubtext}>Get your order delivered to your address</span>
          </span>
        </label>

        <label style={styles.radioLabel}>
          <input
            type="radio"
            name="deliveryType"
            value="pickup"
            checked={deliveryType === 'pickup'}
            onChange={() => onDeliveryTypeChange('pickup')}
            style={styles.radio}
          />
          <span style={styles.labelText}>
            <strong>🏪 Pickup</strong>
            <span style={styles.labelSubtext}>Pick up from our store (No delivery fee)</span>
          </span>
        </label>
      </div>

      {/* Delivery Zones */}
      {deliveryType === 'delivery' && (
        <div style={styles.zonesContainer}>
          <label style={styles.label}>Delivery Zone *</label>
          <select
            value={selectedZone || ''}
            onChange={(e) => onZoneChange(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">Select your area...</option>
            {deliveryZones.map((zone) => (
              <option key={zone.id} value={zone.id}>
                {zone.name} - {formatPrice(zone.fee)}
              </option>
            ))}
          </select>
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
  optionsGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  radioLabel: {
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
  labelText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  labelSubtext: {
    fontSize: '14px',
    color: 'var(--color-text-light)',
    fontWeight: 'normal',
  },
  zonesContainer: {
    marginTop: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: 'var(--color-text)',
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    fontSize: '16px',
    outline: 'none',
    cursor: 'pointer',
  },
};
