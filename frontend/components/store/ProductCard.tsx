import React from 'react';
import Link from 'next/link';
import ProductBadge from '../Product/ProductBadge';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug?: string;
    description?: string;
    pricePerBaseUnit: number;
    comparePrice?: number;
    baseUnit: string;
    currency: string;
    badge?: 'new' | 'popular' | 'sale' | 'out_of_stock';
    stockStatus?: string;
    isFeatured?: boolean;
    images?: Array<{ imageUrl: string; isPrimary: boolean }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find(img => img.isPrimary)?.imageUrl || '/placeholder.svg';
  const formattedPrice = new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: product.currency || 'RWF',
    minimumFractionDigits: 0,
  }).format(product.pricePerBaseUnit);

  const compareFormattedPrice = product.comparePrice ? new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: product.currency || 'RWF',
    minimumFractionDigits: 0,
  }).format(product.comparePrice) : null;

  const productUrl = product.slug ? `/products/${product.slug}` : `/products/${product.id}`;

  return (
    <Link href={productUrl} style={{ textDecoration: 'none' }}>
      <div className="card" style={styles.card}>
        <div style={styles.imageContainer}>
          <img 
            src={primaryImage} 
            alt={product.title}
            style={styles.image}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          {product.badge && (
            <div style={styles.badgeContainer}>
              <ProductBadge badge={product.badge} />
            </div>
          )}
          {product.isFeatured && !product.badge && (
            <div style={styles.badgeContainer}>
              <span style={styles.featuredBadge}>⭐ Featured</span>
            </div>
          )}
        </div>
        
        <div style={styles.content}>
          <h3 style={styles.title}>{product.title}</h3>
          {product.description && (
            <p style={styles.description}>
              {product.description.substring(0, 80)}
              {product.description.length > 80 ? '...' : ''}
            </p>
          )}
          <div style={styles.priceContainer}>
            <div>
              {compareFormattedPrice && (
                <span style={styles.comparePrice}>{compareFormattedPrice}</span>
              )}
              <div style={styles.priceRow}>
                <span style={styles.price}>{formattedPrice}</span>
                <span style={styles.unit}>/{product.baseUnit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    overflow: 'hidden',
    position: 'relative',
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    top: '8px',
    left: '8px',
  },
  featuredBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    backgroundColor: '#FFD700',
    color: '#000',
    fontSize: '12px',
    fontWeight: 'bold',
    borderRadius: '4px',
  },
  content: {
    padding: 'var(--spacing-md)',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'var(--color-text)',
    marginBottom: '0.5rem',
  },
  description: {
    fontSize: '14px',
    color: 'var(--color-text-light)',
    marginBottom: '1rem',
    lineHeight: '1.4',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  comparePrice: {
    fontSize: '14px',
    color: 'var(--color-text-light)',
    textDecoration: 'line-through',
    marginRight: '8px',
  },
  priceRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '4px',
  },
  price: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
  },
  unit: {
    fontSize: '14px',
    color: 'var(--color-text-light)',
  },
};
