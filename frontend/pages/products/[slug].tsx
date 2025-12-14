import React, { useState } from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../components/Layout';
import { api, getImageUrl } from '../../lib/api';
import { Product, Theme, SiteSettings, UnitPrice } from '../../types';
import { formatPrice, getUnitDisplay } from '../../utils/helpers';
import { useCartStore } from '../../stores/cartStore';
import { useRouter } from 'next/router';

interface ProductPageProps {
  product: Product;
  theme: Theme | null;
  siteSettings: SiteSettings | null;
}

export default function ProductPage({ product, theme, siteSettings }: ProductPageProps) {
  const [selectedPricing, setSelectedPricing] = useState<UnitPrice | null>(
    product.pricing?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    if (selectedPricing) {
      addItem(product, selectedPricing, quantity);
      alert('Added to cart!');
    }
  };

  const handleBuyNow = () => {
    if (selectedPricing) {
      addItem(product, selectedPricing, quantity);
      router.push('/cart');
    }
  };

  const buttonStyle = theme?.buttonStyle || 'rounded';
  const borderRadiusMap = {
    rounded: '8px',
    square: '0px',
    pill: '50px',
  };

  return (
    <Layout theme={theme} siteSettings={siteSettings}>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '3rem',
        }}>
          {/* Images */}
          <div>
            <div style={{
              width: '100%',
              height: '500px',
              backgroundColor: '#F3F4F6',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '1rem',
            }}>
              {product.images && product.images[selectedImageIndex] ? (
                <img
                  src={getImageUrl(product.images[selectedImageIndex].url)}
                  alt={product.images[selectedImageIndex].alternativeText || product.name}
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
                  fontSize: '6rem',
                }}>
                  🥩
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
              }}>
                {product.images.map((image, index) => (
                  <div
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    style={{
                      width: '100px',
                      height: '100px',
                      backgroundColor: '#F3F4F6',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selectedImageIndex === index ? `3px solid ${theme?.primaryColor || '#DC2626'}` : '1px solid #E5E7EB',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={getImageUrl(image.url)}
                      alt={image.alternativeText || product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
            }}>
              {product.name}
            </h1>

            {product.sku && (
              <p style={{
                fontSize: '0.875rem',
                color: theme?.mode === 'dark' ? '#9CA3AF' : '#6B7280',
                marginBottom: '1rem',
              }}>
                SKU: {product.sku}
              </p>
            )}

            {!product.isAvailable && (
              <div style={{
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontWeight: '600',
              }}>
                ⚠️ Currently out of stock
              </div>
            )}

            {product.description && (
              <div
                style={{
                  fontSize: '1rem',
                  color: theme?.mode === 'dark' ? '#D1D5DB' : '#4B5563',
                  marginBottom: '2rem',
                  lineHeight: '1.6',
                }}
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}

            {/* Pricing Options */}
            {product.pricing && product.pricing.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
                }}>
                  Select Unit:
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {product.pricing.map((pricing) => (
                    <button
                      key={pricing.id}
                      onClick={() => setSelectedPricing(pricing)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        border: `2px solid ${selectedPricing?.id === pricing.id ? theme?.primaryColor || '#DC2626' : '#E5E7EB'}`,
                        backgroundColor: selectedPricing?.id === pricing.id
                          ? theme?.primaryColor || '#DC2626'
                          : theme?.mode === 'dark' ? '#1F2937' : 'white',
                        color: selectedPricing?.id === pricing.id
                          ? 'white'
                          : theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
                        borderRadius: borderRadiusMap[buttonStyle],
                        cursor: 'pointer',
                        fontWeight: '600',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div>{getUnitDisplay(pricing.unitType, pricing.unitValue)}</div>
                      <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                        {formatPrice(pricing.price)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
              }}>
                Quantity:
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: theme?.mode === 'dark' ? '#1F2937' : 'white',
                    color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                  }}
                >
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{
                    width: '80px',
                    height: '40px',
                    textAlign: 'center',
                    border: '1px solid #E5E7EB',
                    backgroundColor: theme?.mode === 'dark' ? '#1F2937' : 'white',
                    color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: theme?.mode === 'dark' ? '#1F2937' : 'white',
                    color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                  }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Display */}
            {selectedPricing && (
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: theme?.primaryColor || '#DC2626',
                marginBottom: '2rem',
              }}>
                Total: {formatPrice(selectedPricing.price * quantity)}
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleAddToCart}
                disabled={!product.isAvailable || !selectedPricing}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '1rem 2rem',
                  backgroundColor: product.isAvailable
                    ? theme?.secondaryColor || '#1F2937'
                    : '#9CA3AF',
                  color: 'white',
                  border: 'none',
                  borderRadius: borderRadiusMap[buttonStyle],
                  cursor: product.isAvailable ? 'pointer' : 'not-allowed',
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (product.isAvailable) e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  if (product.isAvailable) e.currentTarget.style.opacity = '1';
                }}
              >
                🛒 Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!product.isAvailable || !selectedPricing}
                style={{
                  flex: 1,
                  minWidth: '200px',
                  padding: '1rem 2rem',
                  backgroundColor: product.isAvailable
                    ? theme?.primaryColor || '#DC2626'
                    : '#9CA3AF',
                  color: 'white',
                  border: 'none',
                  borderRadius: borderRadiusMap[buttonStyle],
                  cursor: product.isAvailable ? 'pointer' : 'not-allowed',
                  fontSize: '1.125rem',
                  fontWeight: 'bold',
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (product.isAvailable) e.currentTarget.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  if (product.isAvailable) e.currentTarget.style.opacity = '1';
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await api.get('/products');
    const products = response.data.data || [];

    const paths = products.map((product: Product) => ({
      params: { slug: product.slug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching product paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;

    const [productRes, themesRes, settingsRes] = await Promise.all([
      api.get(`/products?filters[slug][$eq]=${slug}&populate=*`),
      api.get('/themes?filters[isActive][$eq]=true'),
      api.get('/site-setting?populate=*'),
    ]);

    const product = productRes.data.data?.[0];

    if (!product) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        product,
        theme: themesRes.data.data?.[0] || null,
        siteSettings: settingsRes.data.data || null,
      },
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      notFound: true,
    };
  }
};
