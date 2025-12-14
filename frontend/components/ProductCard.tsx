import React from 'react';
import Link from 'next/link';
import { Product } from '../types';
import { formatPrice, getUnitDisplay } from '../utils/helpers';
import { getImageUrl } from '../lib/api';

interface ProductCardProps {
  product: Product;
  theme?: any;
}

export default function ProductCard({ product, theme }: ProductCardProps) {
  const primaryImage = product.images?.[0];
  const lowestPrice = product.pricing?.reduce((min, p) => 
    p.price < min ? p.price : min, 
    product.pricing[0]?.price || 0
  );

  const buttonStyle = theme?.buttonStyle || 'rounded';
  const borderRadiusMap = {
    rounded: '8px',
    square: '0px',
    pill: '50px',
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div style={{
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        backgroundColor: theme?.mode === 'dark' ? '#1F2937' : '#FFFFFF',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
        {/* Image */}
        <div style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#F3F4F6',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {primaryImage ? (
            <img
              src={getImageUrl(primaryImage.url)}
              alt={primaryImage.alternativeText || product.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
            }}>
              🥩
            </div>
          )}
          
          {!product.isAvailable && (
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              right: '0.5rem',
              backgroundColor: '#DC2626',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}>
              Out of Stock
            </div>
          )}

          {product.featured && (
            <div style={{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              backgroundColor: theme?.accentColor || '#F59E0B',
              color: theme?.mode === 'dark' ? '#111827' : '#FFFFFF',
              padding: '0.25rem 0.75rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
            }}>
              ⭐ Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1rem' }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            color: theme?.mode === 'dark' ? '#F9FAFB' : '#1F2937',
          }}>
            {product.name}
          </h3>

          {product.shortDescription && (
            <p style={{
              fontSize: '0.875rem',
              color: theme?.mode === 'dark' ? '#D1D5DB' : '#6B7280',
              marginBottom: '0.75rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}>
              {product.shortDescription}
            </p>
          )}

          {lowestPrice && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 'bold',
                color: theme?.primaryColor || '#DC2626',
              }}>
                From {formatPrice(lowestPrice)}
              </span>
            </div>
          )}

          {product.pricing && product.pricing.length > 0 && (
            <div style={{
              marginTop: '0.5rem',
              fontSize: '0.75rem',
              color: theme?.mode === 'dark' ? '#9CA3AF' : '#6B7280',
            }}>
              Available in: {product.pricing.map(p => getUnitDisplay(p.unitType, p.unitValue)).join(', ')}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
