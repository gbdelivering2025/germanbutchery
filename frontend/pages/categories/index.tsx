import React from 'react';
import { GetStaticProps } from 'next';
import Layout from '../components/Layout';
import Link from 'next/link';
import { api, getImageUrl } from '../lib/api';
import { Category, Theme, SiteSettings } from '../types';

interface CategoriesProps {
  categories: Category[];
  theme: Theme | null;
  siteSettings: SiteSettings | null;
}

export default function Categories({ categories, theme, siteSettings }: CategoriesProps) {
  return (
    <Layout theme={theme} siteSettings={siteSettings}>
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '2rem',
          color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
        }}>
          All Categories
        </h1>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '2rem',
        }}>
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`}>
              <div style={{
                backgroundColor: theme?.mode === 'dark' ? '#1F2937' : 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid #E5E7EB',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                {category.image ? (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    overflow: 'hidden',
                  }}>
                    <img
                      src={getImageUrl(category.image.url)}
                      alt={category.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '100%',
                    height: '200px',
                    backgroundColor: '#F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                  }}>
                    🥩
                  </div>
                )}

                <div style={{ padding: '1.5rem' }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    marginBottom: '0.5rem',
                    color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
                  }}>
                    {category.name}
                  </h2>

                  {category.description && (
                    <p style={{
                      fontSize: '0.875rem',
                      color: theme?.mode === 'dark' ? '#D1D5DB' : '#6B7280',
                      lineHeight: '1.5',
                    }}>
                      {category.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const [categoriesRes, themesRes, settingsRes] = await Promise.all([
      api.get('/categories?populate=*&sort=displayOrder:asc'),
      api.get('/themes?filters[isActive][$eq]=true'),
      api.get('/site-setting?populate=*'),
    ]);

    return {
      props: {
        categories: categoriesRes.data.data || [],
        theme: themesRes.data.data?.[0] || null,
        siteSettings: settingsRes.data.data || null,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      props: {
        categories: [],
        theme: null,
        siteSettings: null,
      },
      revalidate: 60,
    };
  }
};
