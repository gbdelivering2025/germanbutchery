import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { settingsApi } from '../../lib/api';

export default function AdminSettings() {
  const [storeInfo, setStoreInfo] = useState({
    name: 'German Butchery',
    address: 'Kigali, Rwanda',
    phone: '+250 123 456 789',
    whatsapp: '+250123456789',
    email: 'info@germanbutchery.rw',
  });

  const [deliveryZones, setDeliveryZones] = useState<any[]>([
    { name: 'Kigali Center', fee: 2000 },
    { name: 'Kigali Suburbs', fee: 3000 },
    { name: 'Outside Kigali', fee: 5000 },
  ]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [storeRes, zonesRes] = await Promise.all([
          settingsApi.getOne('store_info'),
          settingsApi.getOne('delivery_zones'),
        ]);
        if (storeRes.data) setStoreInfo(storeRes.data);
        if (zonesRes.data?.zones) setDeliveryZones(zonesRes.data.zones);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleSaveStoreInfo = async () => {
    try {
      await settingsApi.update('store_info', storeInfo);
      alert('Store information updated successfully!');
    } catch (error) {
      console.error('Error saving store info:', error);
      alert('Error saving store information');
    }
  };

  const handleSaveDeliveryZones = async () => {
    try {
      await settingsApi.update('delivery_zones', { zones: deliveryZones });
      alert('Delivery zones updated successfully!');
    } catch (error) {
      console.error('Error saving delivery zones:', error);
      alert('Error saving delivery zones');
    }
  };

  const addDeliveryZone = () => {
    setDeliveryZones([...deliveryZones, { name: '', fee: 0 }]);
  };

  const updateDeliveryZone = (index: number, field: string, value: any) => {
    const updated = [...deliveryZones];
    updated[index] = { ...updated[index], [field]: value };
    setDeliveryZones(updated);
  };

  const removeDeliveryZone = (index: number) => {
    setDeliveryZones(deliveryZones.filter((_, i) => i !== index));
  };

  return (
    <AdminLayout>
      <h1 style={styles.title}>Settings</h1>

      {/* Store Information */}
      <div className="card" style={styles.section}>
        <h2 style={styles.sectionTitle}>Store Information</h2>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Store Name</label>
            <input
              type="text"
              value={storeInfo.name}
              onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Address</label>
            <input
              type="text"
              value={storeInfo.address}
              onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone</label>
            <input
              type="tel"
              value={storeInfo.phone}
              onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>WhatsApp Number</label>
            <input
              type="tel"
              value={storeInfo.whatsapp}
              onChange={(e) => setStoreInfo({ ...storeInfo, whatsapp: e.target.value })}
              style={styles.input}
              placeholder="+250123456789"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={storeInfo.email}
              onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
              style={styles.input}
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSaveStoreInfo}>
          Save Store Information
        </button>
      </div>

      {/* Delivery Zones */}
      <div className="card" style={styles.section}>
        <h2 style={styles.sectionTitle}>Delivery Zones & Fees</h2>
        
        <div style={styles.zonesList}>
          {deliveryZones.map((zone, index) => (
            <div key={index} style={styles.zoneItem}>
              <input
                type="text"
                value={zone.name}
                onChange={(e) => updateDeliveryZone(index, 'name', e.target.value)}
                style={styles.input}
                placeholder="Zone name"
              />
              <div style={styles.feeInput}>
                <span>RWF</span>
                <input
                  type="number"
                  value={zone.fee}
                  onChange={(e) => updateDeliveryZone(index, 'fee', parseFloat(e.target.value))}
                  style={styles.input}
                  placeholder="Delivery fee"
                />
              </div>
              <button
                style={styles.removeButton}
                onClick={() => removeDeliveryZone(index)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div style={styles.buttonGroup}>
          <button className="btn" onClick={addDeliveryZone}>
            Add Delivery Zone
          </button>
          <button className="btn btn-primary" onClick={handleSaveDeliveryZones}>
            Save Delivery Zones
          </button>
        </div>
      </div>

      {/* WhatsApp Templates */}
      <div className="card" style={styles.section}>
        <h2 style={styles.sectionTitle}>WhatsApp Message Templates</h2>
        <p style={styles.infoText}>
          WhatsApp message templates feature coming soon! You'll be able to customize
          automated messages for order confirmations and status updates.
        </p>
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
  section: {
    padding: '1.5rem',
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: 'var(--color-text)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
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
  zonesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  zoneItem: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr auto',
    gap: '1rem',
    alignItems: 'center',
  },
  feeInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  removeButton: {
    padding: '10px 16px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    backgroundColor: 'white',
    color: '#d32f2f',
    cursor: 'pointer',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  },
  infoText: {
    fontSize: '16px',
    color: 'var(--color-text-light)',
  },
};
