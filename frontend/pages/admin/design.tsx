import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { settingsApi } from '../../lib/api';

export default function AdminDesign() {
  const [theme, setTheme] = useState({
    primaryColor: '#8B0000',
    secondaryColor: '#B22222',
    fontFamily: 'Inter, system-ui',
    logoUrl: '/logo.png',
  });

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const res = await settingsApi.getOne('theme');
        setTheme(res.data || theme);
      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };
    fetchTheme();
  }, []);

  const handleSave = async () => {
    try {
      await settingsApi.update('theme', theme);
      alert('Theme updated successfully!');
    } catch (error) {
      console.error('Error saving theme:', error);
      alert('Error saving theme');
    }
  };

  return (
    <AdminLayout>
      <h1 style={styles.title}>Design & Customization</h1>

      <div className="card" style={styles.section}>
        <h2 style={styles.sectionTitle}>Theme Customization</h2>
        
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Primary Color</label>
            <div style={styles.colorInput}>
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                style={styles.colorPicker}
              />
              <input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Secondary Color</label>
            <div style={styles.colorInput}>
              <input
                type="color"
                value={theme.secondaryColor}
                onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                style={styles.colorPicker}
              />
              <input
                type="text"
                value={theme.secondaryColor}
                onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Font Family</label>
            <select
              value={theme.fontFamily}
              onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
              style={styles.input}
            >
              <option value="Inter, system-ui">Inter</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Courier New', monospace">Courier New</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Logo URL</label>
            <input
              type="text"
              value={theme.logoUrl}
              onChange={(e) => setTheme({ ...theme, logoUrl: e.target.value })}
              style={styles.input}
              placeholder="/logo.png"
            />
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSave}>
          Save Theme Settings
        </button>
      </div>

      <div className="card" style={styles.section}>
        <h2 style={styles.sectionTitle}>Preview</h2>
        <div style={{
          ...styles.preview,
          backgroundColor: theme.primaryColor,
          fontFamily: theme.fontFamily,
        }}>
          <h3 style={{ color: 'white' }}>German Butchery</h3>
          <p style={{ color: 'white' }}>This is how your primary color looks</p>
        </div>
        <div style={{
          ...styles.preview,
          backgroundColor: theme.secondaryColor,
          fontFamily: theme.fontFamily,
          marginTop: '1rem',
        }}>
          <h3 style={{ color: 'white' }}>Secondary Color</h3>
          <p style={{ color: 'white' }}>This is how your secondary color looks</p>
        </div>
      </div>

      <div className="card" style={styles.section}>
        <h2 style={styles.sectionTitle}>Layout Builder</h2>
        <p style={styles.infoText}>
          Layout builder feature coming soon! You'll be able to customize homepage sections,
          add/remove banners, and reorder content.
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
  colorInput: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
  },
  colorPicker: {
    width: '60px',
    height: '40px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    cursor: 'pointer',
  },
  preview: {
    padding: '2rem',
    borderRadius: 'var(--border-radius)',
    textAlign: 'center',
  },
  infoText: {
    fontSize: '16px',
    color: 'var(--color-text-light)',
  },
};
