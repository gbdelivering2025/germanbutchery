import React from 'react';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    description?: string;
    pricePerBaseUnit: number;
    baseUnit: string;
    currency: string;
    images?: Array<{ imageUrl: string; isPrimary: boolean }>;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find(img => img.isPrimary)?.imageUrl || '/placeholder.jpg';
  const formattedPrice = new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: product.currency || 'RWF',
    minimumFractionDigits: 0,
  }).format(product.pricePerBaseUnit);

  return (
    <Link href={`/products/${product.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={styles.card}>
        <div style={styles.imageContainer}>
          <img 
            src={primaryImage} 
            alt={product.title}
            style={styles.image}
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.jpg';
            }}
          />
        </div>
        
        <div style={styles.content}>
          <h3 style={styles.title}>{product.title}</h3>
          {product.description && (
            <p style={styles.description}>
              {product.description.substring(0, 100)}
              {product.description.length > 100 ? '...' : ''}
            </p>
          )}
          <div style={styles.priceContainer}>
            <span style={styles.price}>{formattedPrice}</span>
            <span style={styles.unit}>/{product.baseUnit}</span>
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
  },
  imageContainer: {
    width: '100%',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
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
