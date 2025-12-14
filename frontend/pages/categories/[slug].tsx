import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../components/Layout';
import ProductCard from '../../components/ProductCard';
import { api } from '../../lib/api';
import { Product, Category, Theme, SiteSettings } from '../../types';

interface CategoryPageProps {
  category: Category;
  products: Product[];
  theme: Theme | null;
  siteSettings: SiteSettings | null;
}

export default function CategoryPage({ category, products, theme, siteSettings }: CategoryPageProps) {
  return (
    <Layout theme={theme} siteSettings={siteSettings}>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '1rem',
          color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
        }}>
          {category.name}
        </h1>

        {category.description && (
          <p style={{
            fontSize: '1.125rem',
            color: theme?.mode === 'dark' ? '#D1D5DB' : '#6B7280',
            marginBottom: '2rem',
            lineHeight: '1.6',
          }}>
            {category.description}
          </p>
        )}

        {products.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            color: theme?.mode === 'dark' ? '#9CA3AF' : '#6B7280',
          }}>
            <p style={{ fontSize: '1.25rem' }}>No products available in this category yet.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '2rem',
          }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} theme={theme} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await api.get('/categories');
    const categories = response.data.data || [];

    const paths = categories.map((category: Category) => ({
      params: { slug: category.slug },
    }));

    return {
      paths,
      fallback: 'blocking',
    };
  } catch (error) {
    console.error('Error fetching category paths:', error);
    return {
      paths: [],
      fallback: 'blocking',
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;

    const [categoryRes, productsRes, themesRes, settingsRes] = await Promise.all([
      api.get(`/categories?filters[slug][$eq]=${slug}&populate=*`),
      api.get(`/products?filters[category][slug][$eq]=${slug}&filters[publishedAt][$notNull]=true&populate=*`),
      api.get('/themes?filters[isActive][$eq]=true'),
      api.get('/site-setting?populate=*'),
    ]);

    const category = categoryRes.data.data?.[0];

    if (!category) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        category,
        products: productsRes.data.data || [],
        theme: themesRes.data.data?.[0] || null,
        siteSettings: settingsRes.data.data || null,
      },
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return {
      notFound: true,
    };
  }
};
