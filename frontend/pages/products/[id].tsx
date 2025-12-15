import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/ui/Layout';
import QuantitySelector from '../../components/store/QuantitySelector';
import { productsApi } from '../../lib/api';
import { useCartStore } from '../../lib/store';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [selectedUnit, setSelectedUnit] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await productsApi.getOne(id as string);
        setProduct(res.data);
        const defaultUnit = res.data.units?.find((u: any) => u.isDefault) || res.data.units?.[0];
        if (defaultUnit) {
          setSelectedUnit(defaultUnit.unit);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const selectedUnitData = product.units?.find((u: any) => u.unit === selectedUnit);
    const price = product.pricePerBaseUnit * (selectedUnitData?.multiplier || 1);

    addItem({
      id: `${product.id}-${selectedUnit}`,
      productId: product.id,
      title: product.title,
      price,
      quantity: selectedQuantity,
      unit: selectedUnit,
      imageUrl: product.images?.find((img: any) => img.isPrimary)?.imageUrl,
    });

    alert('Product added to cart!');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container">
          <p>Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container">
          <p>Product not found</p>
        </div>
      </Layout>
    );
  }

  const primaryImage = product.images?.find((img: any) => img.isPrimary)?.imageUrl || '/placeholder.jpg';
  const formattedPrice = new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: product.currency || 'RWF',
    minimumFractionDigits: 0,
  }).format(product.pricePerBaseUnit);

  return (
    <Layout>
      <div className="container">
        <div style={styles.container}>
          <div style={styles.imageSection}>
            <img 
              src={primaryImage} 
              alt={product.title}
              style={styles.image}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.jpg';
              }}
            />
          </div>

          <div style={styles.detailsSection}>
            <h1 style={styles.title}>{product.title}</h1>
            
            <div style={styles.priceContainer}>
              <span style={styles.price}>{formattedPrice}</span>
              <span style={styles.unit}>/{product.baseUnit}</span>
            </div>

            {product.description && (
              <p style={styles.description}>{product.description}</p>
            )}

            <div style={styles.separator}></div>

            <div style={styles.quantitySection}>
              <label style={styles.label}>Quantity</label>
              <QuantitySelector
                units={product.units || [{ unit: product.baseUnit, multiplier: 1, isDefault: true }]}
                onQuantityChange={(qty, unit) => {
                  setSelectedQuantity(qty);
                  setSelectedUnit(unit);
                }}
              />
            </div>

            <button 
              className="btn btn-primary"
              style={styles.addButton}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>

            <div style={styles.categories}>
              <strong>Categories:</strong>
              {product.productCategories?.map((pc: any) => (
                <span key={pc.category.id} style={styles.category}>
                  {pc.category.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '3rem',
    marginTop: '2rem',
  },
  imageSection: {
    width: '100%',
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: 'var(--border-radius)',
    boxShadow: 'var(--shadow-md)',
  },
  detailsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'var(--color-text)',
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
  },
  price: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'var(--color-primary)',
  },
  unit: {
    fontSize: '18px',
    color: 'var(--color-text-light)',
  },
  description: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: 'var(--color-text-light)',
  },
  separator: {
    height: '1px',
    backgroundColor: 'var(--color-border)',
  },
  quantitySection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--color-text)',
  },
  addButton: {
    fontSize: '18px',
    padding: '14px 32px',
    width: '100%',
  },
  categories: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    alignItems: 'center',
    fontSize: '14px',
  },
  category: {
    backgroundColor: 'var(--color-bg-light)',
    padding: '4px 12px',
    borderRadius: '12px',
    color: 'var(--color-text-light)',
  },
};
