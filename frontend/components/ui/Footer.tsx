import React from 'react';

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.section}>
          <h3 style={styles.heading}>German Butchery</h3>
          <p style={styles.text}>Premium quality meats in Kigali, Rwanda</p>
        </div>
        
        <div style={styles.section}>
          <h3 style={styles.heading}>Contact</h3>
          <p style={styles.text}>Phone: +250 123 456 789</p>
          <p style={styles.text}>WhatsApp: +250123456789</p>
          <p style={styles.text}>Email: info@germanbutchery.rw</p>
        </div>
        
        <div style={styles.section}>
          <h3 style={styles.heading}>Hours</h3>
          <p style={styles.text}>Mon-Fri: 8:00 AM - 6:00 PM</p>
          <p style={styles.text}>Saturday: 8:00 AM - 4:00 PM</p>
          <p style={styles.text}>Sunday: Closed</p>
        </div>
      </div>
      
      <div style={styles.bottom}>
        <p>&copy; 2025 German Butchery. All rights reserved.</p>
      </div>
    </footer>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  footer: {
    backgroundColor: '#333',
    color: 'white',
    marginTop: '4rem',
    padding: '2rem 0 1rem',
  },
  container: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginBottom: '2rem',
  },
  section: {
    padding: '0',
  },
  heading: {
    fontSize: '18px',
    marginBottom: '1rem',
    color: 'var(--color-accent)',
  },
  text: {
    fontSize: '14px',
    marginBottom: '0.5rem',
    color: '#ccc',
  },
  bottom: {
    borderTop: '1px solid #555',
    paddingTop: '1rem',
    textAlign: 'center' as const,
    fontSize: '14px',
    color: '#999',
  },
};
