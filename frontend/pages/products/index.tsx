import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/ui/Layout';
import ProductCard from '../../components/store/ProductCard';
import { productsApi, categoriesApi } from '../../lib/api';

export default function ProductsPage() {
  const router = useRouter();
  const { category, search } = router.query;

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
    router.push(`/products?search=${searchQuery}`);
  };

  return (
    <Layout>
      <div className="container">
        <h1 style={styles.title}>Products</h1>

        {/* Search */}
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        {/* Category Filter */}
        <div style={styles.filters}>
          <button
            onClick={() => router.push('/products')}
            className={!category ? 'btn btn-primary' : 'btn'}
            style={!category ? styles.activeFilter : styles.filterButton}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => router.push(`/products?category=${cat.slug}`)}
              className={category === cat.slug ? 'btn btn-primary' : 'btn'}
              style={category === cat.slug ? styles.activeFilter : styles.filterButton}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid grid-4" style={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    marginBottom: '2rem',
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
    padding: '12px',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--border-radius)',
    fontSize: '16px',
    outline: 'none',
  },
  filters: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap',
  },
  filterButton: {
    backgroundColor: 'white',
    color: 'var(--color-text)',
    border: '1px solid var(--color-border)',
  },
  activeFilter: {
    backgroundColor: 'var(--color-primary)',
    color: 'white',
  },
  grid: {
    marginTop: '2rem',
  },
};
