import React, { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import { api, getImageUrl } from '../lib/api';
import { Theme, SiteSettings } from '../types';
import { useCartStore } from '../stores/cartStore';
import { formatPrice, getUnitDisplay, generateWhatsAppMessage, generateWhatsAppUrl } from '../utils/helpers';
import Link from 'next/link';

interface CartProps {
  theme: Theme | null;
  siteSettings: SiteSettings | null;
}

export default function Cart({ theme, siteSettings }: CartProps) {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Layout theme={theme} siteSettings={siteSettings}>
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </Layout>
    );
  }

  const handleWhatsAppOrder = () => {
    const primaryWhatsApp = siteSettings?.whatsappNumbers?.find(w => w.isPrimary);
    const whatsappNumber = primaryWhatsApp?.number || siteSettings?.whatsappNumbers?.[0]?.number;

    if (!whatsappNumber) {
      alert('WhatsApp number not configured. Please contact the business directly.');
      return;
    }

    const message = generateWhatsAppMessage(items, siteSettings?.businessName);
    const whatsappUrl = generateWhatsAppUrl(whatsappNumber, message);

    window.open(whatsappUrl, '_blank');
  };

  const buttonStyle = theme?.buttonStyle || 'rounded';
  const borderRadiusMap = {
    rounded: '8px',
    square: '0px',
    pill: '50px',
  };

  if (items.length === 0) {
    return (
      <Layout theme={theme} siteSettings={siteSettings}>
        <div style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
          }}>
            Your cart is empty
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: theme?.mode === 'dark' ? '#D1D5DB' : '#6B7280',
            marginBottom: '2rem',
          }}>
            Start adding some delicious products to your cart!
          </p>
          <Link href="/categories">
            <button style={{
              backgroundColor: theme?.primaryColor || '#DC2626',
              color: 'white',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: borderRadiusMap[buttonStyle],
              cursor: 'pointer',
            }}>
              Browse Products
            </button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout theme={theme} siteSettings={siteSettings}>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
          }}>
            Shopping Cart
          </h1>
          <button
            onClick={clearCart}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: theme?.mode === 'dark' ? '#EF4444' : '#DC2626',
              border: `1px solid ${theme?.mode === 'dark' ? '#EF4444' : '#DC2626'}`,
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Clear Cart
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
        }}>
          {/* Cart Items */}
          <div>
            {items.map((item) => {
              const primaryImage = item.product.images?.[0];
              const itemTotal = item.unitPrice.price * item.quantity;

              return (
                <div
                  key={`${item.product.id}-${item.unitPrice.id}`}
                  style={{
                    backgroundColor: theme?.mode === 'dark' ? '#1F2937' : 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto',
                    gap: '1.5rem',
                    alignItems: 'center',
                  }}
                >
                  {/* Image */}
                  <Link href={`/products/${item.product.slug}`}>
                    <div style={{
                      width: '120px',
                      height: '120px',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                    }}>
                      {primaryImage ? (
                        <img
                          src={getImageUrl(primaryImage.url)}
                          alt={primaryImage.alternativeText || item.product.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '3rem',
                        }}>
                          🥩
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div>
                    <Link href={`/products/${item.product.slug}`}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        marginBottom: '0.5rem',
                        color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
                        cursor: 'pointer',
                      }}>
                        {item.product.name}
                      </h3>
                    </Link>
                    <p style={{
                      fontSize: '1rem',
                      color: theme?.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                      marginBottom: '1rem',
                    }}>
                      {getUnitDisplay(item.unitPrice.unitType, item.unitPrice.unitValue)} × {formatPrice(item.unitPrice.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.unitPrice.id, item.quantity - 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: '1px solid #E5E7EB',
                          backgroundColor: theme?.mode === 'dark' ? '#374151' : 'white',
                          color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        -
                      </button>
                      <span style={{
                        fontSize: '1rem',
                        fontWeight: '600',
                        minWidth: '40px',
                        textAlign: 'center',
                        color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
                      }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.unitPrice.id, item.quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: '1px solid #E5E7EB',
                          backgroundColor: theme?.mode === 'dark' ? '#374151' : 'white',
                          color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: theme?.primaryColor || '#DC2626',
                      marginBottom: '1rem',
                    }}>
                      {formatPrice(itemTotal)}
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.unitPrice.id)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'transparent',
                        color: theme?.mode === 'dark' ? '#EF4444' : '#DC2626',
                        border: `1px solid ${theme?.mode === 'dark' ? '#EF4444' : '#DC2626'}`,
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div style={{
          backgroundColor: theme?.mode === 'dark' ? '#1F2937' : '#F9FAFB',
          padding: '2rem',
          borderRadius: '12px',
          marginTop: '2rem',
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
          }}>
            Order Summary
          </h2>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            fontSize: '1.125rem',
            color: theme?.mode === 'dark' ? '#D1D5DB' : '#4B5563',
          }}>
            <span>Subtotal:</span>
            <span>{formatPrice(getTotalPrice)}</span>
          </div>
          <div style={{
            borderTop: '2px solid #E5E7EB',
            paddingTop: '1rem',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
            marginBottom: '2rem',
          }}>
            <span>Total:</span>
            <span style={{ color: theme?.primaryColor || '#DC2626' }}>
              {formatPrice(getTotalPrice)}
            </span>
          </div>

          <button
            onClick={handleWhatsAppOrder}
            style={{
              width: '100%',
              padding: '1.25rem 2rem',
              backgroundColor: '#25D366',
              color: 'white',
              border: 'none',
              borderRadius: borderRadiusMap[buttonStyle],
              cursor: 'pointer',
              fontSize: '1.25rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <span style={{ fontSize: '1.5rem' }}>💬</span>
            Order via WhatsApp
          </button>

          <p style={{
            marginTop: '1rem',
            fontSize: '0.875rem',
            color: theme?.mode === 'dark' ? '#9CA3AF' : '#6B7280',
            textAlign: 'center',
          }}>
            Your order will be sent to us via WhatsApp for confirmation
          </p>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [themesRes, settingsRes] = await Promise.all([
      api.get('/themes?filters[isActive][$eq]=true'),
      api.get('/site-setting?populate=*'),
    ]);

    return {
      props: {
        theme: themesRes.data.data?.[0] || null,
        siteSettings: settingsRes.data.data || null,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        theme: null,
        siteSettings: null,
      },
    };
  }
};
