import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/ui/Layout';
import ProductCard from '../../components/store/ProductCard';
import CategoryNav from '../../components/Category/CategoryNav';
import { ProductCardSkeleton } from '../../components/UI/Skeleton';
import { productsApi, categoriesApi } from '../../lib/api';

export default function ProductsPage() {
  const router = useRouter();
  const { category, search } = router.query;

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(String(search || ''));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoriesApi.getAll();
        setCategories(res.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (category) params.category = category;
        if (search) params.search = search;
        
        const res = await productsApi.getAll(params);
        setProducts(res.data.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${searchQuery}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <Layout>
      <div className="container">
        <h1 style={styles.title}>Our Products</h1>

        {/* Search */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" className="btn btn-primary">🔍 Search</button>
        </form>

        {/* Category Navigation */}
        <CategoryNav 
          categories={categories} 
          activeCategory={category as string}
        />

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No products found.</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchQuery('');
                router.push('/products');
              }}
            >
              View All Products
            </button>
          </div>
        ) : (
          <>
            <div style={styles.resultInfo}>
              <p style={styles.resultText}>
                {products.length} product{products.length !== 1 ? 's' : ''} found
                {category && ` in ${categories.find(c => c.slug === category)?.name || category}`}
                {search && ` matching "${search}"`}
              </p>
            </div>
            <div className="grid grid-4" style={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    color: 'var(--color-text)',
  },
  searchForm: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    maxWidth: '600px',
  },
  searchInput: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },
  grid: {
    marginTop: '2rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  emptyText: {
    fontSize: '18px',
    color: 'var(--color-text-light)',
    marginBottom: '1.5rem',
  },
  resultInfo: {
    marginBottom: '1rem',
  },
  resultText: {
    fontSize: '14px',
    color: 'var(--color-text-light)',
  },
};
