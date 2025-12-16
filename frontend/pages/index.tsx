import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/ui/Layout';
import ProductCard from '../components/store/ProductCard';
import CategoryNav from '../components/Category/CategoryNav';
import { ProductCardSkeleton } from '../components/UI/Skeleton';
import { productsApi, categoriesApi } from '../lib/api';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.getAll({ limit: 8 }),
          categoriesApi.getAll(),
        ]);
        const allProducts = productsRes.data.data || [];
        setProducts(allProducts);
        setFeaturedProducts(allProducts.filter((p: any) => p.isFeatured));
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Layout>
      <div className="container">
        {/* Hero Section */}
        <section style={styles.hero}>
          <div style={styles.heroContent}>
            <h1 style={styles.heroTitle}>Premium Quality Meats</h1>
            <p style={styles.heroText}>
              Fresh from our butchery in Kigali, Rwanda. Order via WhatsApp for quick delivery!
            </p>
            <Link href="/products" className="btn btn-primary" style={styles.heroButton}>
              🛒 Shop Now
            </Link>
          </div>
        </section>

        {/* Categories Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
          <CategoryNav categories={categories} />
        </section>

        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>⭐ Featured Products</h2>
              <Link href="/products" style={styles.sectionLink}>
                View All →
              </Link>
            </div>
            {loading ? (
              <div className="grid grid-4">
                {[1, 2, 3, 4].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-4">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* All Products Preview */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Our Products</h2>
            <Link href="/products" style={styles.sectionLink}>
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="grid grid-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* WhatsApp CTA */}
        <section style={styles.whatsappSection}>
          <h2 style={styles.whatsappTitle}>💬 Order via WhatsApp</h2>
          <p style={styles.whatsappText}>
            Have questions? Want to place an order? Contact us directly on WhatsApp!
          </p>
          <a 
            href="https://wa.me/250123456789" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-whatsapp"
            style={styles.whatsappButton}
          >
            Chat on WhatsApp
          </a>
        </section>
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  hero: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'linear-gradient(135deg, var(--color-primary) 0%, #6B0000 100%)',
    color: 'white',
    borderRadius: 'var(--border-radius-lg)',
    marginBottom: '3rem',
  },
  heroContent: {
    maxWidth: '700px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  heroText: {
    fontSize: '20px',
    marginBottom: '2rem',
    opacity: 0.9,
  },
  heroButton: {
    fontSize: '18px',
    padding: '14px 32px',
    backgroundColor: 'white',
    color: 'var(--color-primary)',
    border: 'none',
  },
  section: {
    marginBottom: '3rem',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'var(--color-text)',
  },
  sectionLink: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--color-primary)',
    textDecoration: 'none',
  },
  whatsappSection: {
    textAlign: 'center',
    padding: '3rem 2rem',
    backgroundColor: '#F0FFF4',
    borderRadius: 'var(--border-radius-lg)',
    marginTop: '3rem',
  },
  whatsappTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '1rem',
    color: 'var(--color-text)',
  },
  whatsappText: {
    fontSize: '18px',
    marginBottom: '2rem',
    color: 'var(--color-text-light)',
  },
  whatsappButton: {
    fontSize: '18px',
    padding: '14px 32px',
  },
};

