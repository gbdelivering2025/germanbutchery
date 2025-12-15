import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/ui/Layout';
import ProductCard from '../components/store/ProductCard';
import { productsApi, categoriesApi } from '../lib/api';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.getAll({ limit: 8 }),
          categoriesApi.getAll(),
        ]);
        setProducts(productsRes.data.data || []);
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
          <h1 style={styles.heroTitle}>Premium Quality Meats</h1>
          <p style={styles.heroText}>
            Fresh from our butchery in Kigali, Rwanda. Order via WhatsApp for quick delivery!
          </p>
          <Link href="/products" className="btn btn-primary" style={styles.heroButton}>
            Shop Now
          </Link>
        </section>

        {/* Categories Section */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Shop by Category</h2>
          <div className="grid grid-4" style={styles.categoriesGrid}>
            {categories.map((category) => (
              <Link 
                key={category.id} 
                href={`/products?category=${category.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="card" style={styles.categoryCard}>
                  <h3 style={styles.categoryName}>{category.name}</h3>
                  {category.description && (
                    <p style={styles.categoryDescription}>{category.description}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Featured Products</h2>
          {loading ? (
            <p>Loading products...</p>
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
          <h2 style={styles.whatsappTitle}>Order via WhatsApp</h2>
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
    backgroundColor: 'var(--color-primary)',
    color: 'white',
    borderRadius: 'var(--border-radius)',
    marginBottom: '3rem',
  },
  heroTitle: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '1rem',
  },
  heroText: {
    fontSize: '20px',
    marginBottom: '2rem',
    maxWidth: '600px',
    margin: '0 auto 2rem',
  },
  heroButton: {
    fontSize: '18px',
    padding: '14px 32px',
  },
  section: {
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: 'var(--color-text)',
  },
  categoriesGrid: {
    gap: '1rem',
  },
  categoryCard: {
    cursor: 'pointer',
    textAlign: 'center',
    padding: '2rem',
    transition: 'all 0.2s ease',
  },
  categoryName: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--color-primary)',
    marginBottom: '0.5rem',
  },
  categoryDescription: {
    fontSize: '14px',
    color: 'var(--color-text-light)',
  },
  whatsappSection: {
    textAlign: 'center',
    padding: '3rem 2rem',
    backgroundColor: '#F0FFF4',
    borderRadius: 'var(--border-radius)',
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

