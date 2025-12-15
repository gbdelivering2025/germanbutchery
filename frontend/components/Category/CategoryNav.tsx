import React from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
}

interface CategoryNavProps {
  categories: Category[];
  activeCategory?: string;
}

export default function CategoryNav({ categories, activeCategory }: CategoryNavProps) {
  return (
    <div style={styles.container}>
      <div style={styles.scrollContainer}>
        <Link href="/products" style={{ textDecoration: 'none' }}>
          <button
            style={{
              ...styles.categoryButton,
              ...(activeCategory === undefined ? styles.activeButton : {}),
            }}
          >
            <span style={styles.icon}>🏪</span>
            <span>All</span>
          </button>
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            style={{ textDecoration: 'none' }}
          >
            <button
              style={{
                ...styles.categoryButton,
                ...(activeCategory === category.slug ? styles.activeButton : {}),
              }}
            >
              {category.icon && <span style={styles.icon}>{category.icon}</span>}
              <span>{category.name}</span>
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '100%',
    marginBottom: '2rem',
    position: 'relative',
  },
  scrollContainer: {
    display: 'flex',
    gap: '0.75rem',
    overflowX: 'auto',
    padding: '0.5rem 0',
    scrollbarWidth: 'thin',
    WebkitOverflowScrolling: 'touch',
  },
  categoryButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    border: '2px solid var(--color-border)',
    borderRadius: '24px',
    backgroundColor: 'white',
    color: 'var(--color-text)',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  activeButton: {
    backgroundColor: 'var(--color-primary)',
    borderColor: 'var(--color-primary)',
    color: 'white',
  },
  icon: {
    fontSize: '18px',
  },
};
