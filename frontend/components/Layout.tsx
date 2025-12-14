import React, { ReactNode } from 'react';
import Link from 'next/link';
import { useCartStore } from '../stores/cartStore';

interface LayoutProps {
  children: ReactNode;
  theme?: any;
  siteSettings?: any;
}

export default function Layout({ children, theme, siteSettings }: LayoutProps) {
  const totalItems = useCartStore((state) => state.getTotalItems());

  const primaryColor = theme?.primaryColor || '#DC2626';
  const secondaryColor = theme?.secondaryColor || '#1F2937';
  const fontFamily = theme?.fontFamily || 'Inter';

  return (
    <div style={{ fontFamily: `${fontFamily}, sans-serif`, minHeight: '100vh' }}>
      <style jsx global>{`
        :root {
          --primary-color: ${primaryColor};
          --secondary-color: ${secondaryColor};
          --accent-color: ${theme?.accentColor || '#F59E0B'};
          --border-radius: ${theme?.borderRadius || 8}px;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: ${fontFamily}, sans-serif;
          background-color: ${theme?.mode === 'dark' ? '#111827' : '#FFFFFF'};
          color: ${theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937'};
        }

        a {
          color: inherit;
          text-decoration: none;
        }
      `}</style>

      {/* Header */}
      <header style={{
        backgroundColor: primaryColor,
        color: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}>
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <Link href="/">
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer' }}>
              {siteSettings?.businessName || 'German Butchery'}
            </h1>
          </Link>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <Link href="/">
              <span style={{ cursor: 'pointer' }}>Home</span>
            </Link>
            <Link href="/categories">
              <span style={{ cursor: 'pointer' }}>Categories</span>
            </Link>
            <Link href="/cart">
              <div style={{
                position: 'relative',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>🛒 Cart</span>
                {totalItems > 0 && (
                  <span style={{
                    backgroundColor: theme?.accentColor || '#F59E0B',
                    borderRadius: '50%',
                    width: '1.5rem',
                    height: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}>
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </nav>
      </header>

      {/* Announcement Banner */}
      {siteSettings?.showAnnouncement && siteSettings?.announcement && (
        <div style={{
          backgroundColor: theme?.accentColor || '#F59E0B',
          color: theme?.mode === 'dark' ? '#111827' : '#1F2937',
          padding: '0.75rem 2rem',
          textAlign: 'center',
          fontSize: '0.875rem',
        }}>
          <div dangerouslySetInnerHTML={{ __html: siteSettings.announcement }} />
        </div>
      )}

      {/* Main Content */}
      <main style={{ minHeight: 'calc(100vh - 200px)' }}>
        {children}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: secondaryColor,
        color: 'white',
        padding: '2rem',
        marginTop: '4rem',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <p style={{ marginBottom: '1rem' }}>
            {siteSettings?.businessDescription || 'Quality meats delivered to your door'}
          </p>
          {siteSettings?.email && (
            <p style={{ marginBottom: '0.5rem' }}>
              Email: {siteSettings.email}
            </p>
          )}
          {siteSettings?.address && (
            <p style={{ marginBottom: '1rem' }}>
              {siteSettings.address}
            </p>
          )}
          <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
            © {new Date().getFullYear()} {siteSettings?.businessName || 'German Butchery'}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
