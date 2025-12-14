import React from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import { api, getImageUrl } from '../lib/api';
import { Product, Category, Theme, SiteSettings } from '../types';

interface HomeProps {
  products: Product[];
  categories: Category[];
  theme: Theme | null;
  siteSettings: SiteSettings | null;
}

export default function Home({ products, categories, theme, siteSettings }: HomeProps) {
  const featuredProducts = products.filter(p => p.featured && p.isAvailable);
  const featuredCategories = categories.filter(c => c.featured);

  return (
    <Layout theme={theme} siteSettings={siteSettings}>
      {/* Hero Section */}
      <section style={{
        backgroundColor: theme?.primaryColor || '#DC2626',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}>
            {siteSettings?.businessName || 'German Butchery'}
          </h1>
          <p style={{
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: 0.9,
          }}>
            {siteSettings?.businessDescription || 'Premium quality meats delivered fresh to your door'}
          </p>
          <Link href="/categories">
            <button style={{
              backgroundColor: 'white',
              color: theme?.primaryColor || '#DC2626',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: theme?.buttonStyle === 'pill' ? '50px' : theme?.buttonStyle === 'square' ? '0' : '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              Browse Categories
            </button>
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      {featuredCategories.length > 0 && (
        <section style={{
          padding: '4rem 2rem',
          backgroundColor: theme?.mode === 'dark' ? '#111827' : '#F9FAFB',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
              textAlign: 'center',
              color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
            }}>
              Shop by Category
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem',
            }}>
              {featuredCategories.map((category) => (
                <Link key={category.id} href={`/categories/${category.slug}`}>
                  <div style={{
                    backgroundColor: theme?.mode === 'dark' ? '#1F2937' : 'white',
                    padding: '2rem',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '1px solid #E5E7EB',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    {category.icon ? (
                      <img
                        src={getImageUrl(category.icon.url)}
                        alt={category.name}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '50%',
                          margin: '0 auto 1rem',
                        }}
                      />
                    ) : (
                      <div style={{
                        fontSize: '3rem',
                        marginBottom: '1rem',
                      }}>
                        🥩
                      </div>
                    )}
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
                    }}>
                      {category.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section style={{
          padding: '4rem 2rem',
          backgroundColor: theme?.mode === 'dark' ? '#0F172A' : 'white',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '2rem',
              textAlign: 'center',
              color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
            }}>
              Featured Products
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '2rem',
            }}>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} theme={theme} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section style={{
        padding: '4rem 2rem',
        backgroundColor: theme?.secondaryColor || '#1F2937',
        color: 'white',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
          }}>
            Order via WhatsApp
          </h2>
          <p style={{
            fontSize: '1.125rem',
            marginBottom: '2rem',
            opacity: 0.9,
          }}>
            Browse our products, add them to your cart, and send your order directly through WhatsApp!
          </p>
          <Link href="/categories">
            <button style={{
              backgroundColor: theme?.primaryColor || '#DC2626',
              color: 'white',
              padding: '1rem 2rem',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: theme?.buttonStyle === 'pill' ? '50px' : theme?.buttonStyle === 'square' ? '0' : '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              Start Shopping
            </button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [productsRes, categoriesRes, themesRes, settingsRes] = await Promise.all([
      api.get('/products?populate=*&filters[publishedAt][$notNull]=true'),
      api.get('/categories?populate=*'),
      api.get('/themes?filters[isActive][$eq]=true'),
      api.get('/site-setting?populate=*'),
    ]);

    return {
      props: {
        products: productsRes.data.data || [],
        categories: categoriesRes.data.data || [],
        theme: themesRes.data.data?.[0] || null,
        siteSettings: settingsRes.data.data || null,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        products: [],
        categories: [],
        theme: null,
        siteSettings: null,
      },
    };
  }
};

