import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from '../WhatsApp/WhatsAppButton';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={styles.wrapper}>
      <Header />
      <main style={styles.main}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    paddingTop: '2rem',
    paddingBottom: '2rem',
  },
};
