import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { ProductImage } from './product-image.entity';
import { ProductUnit } from './product-unit.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  sku: string;

  @Column()
  title: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'base_unit' })
  baseUnit: string; // 'g', 'kg', 'pc', 'pkt'

  @Column({ name: 'base_unit_in_grams', nullable: true })
  baseUnitInGrams: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'price_per_base_unit' })
  pricePerBaseUnit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'compare_price', nullable: true })
  comparePrice: number;

  @Column({ length: 3, default: 'RWF' })
  currency: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_featured', default: false })
  isFeatured: boolean;

  @Column({ name: 'stock_status', default: 'in_stock' })
  stockStatus: string; // 'in_stock', 'out_of_stock', 'low_stock'

  @Column({ nullable: true })
  badge: string; // 'new', 'popular', 'sale'

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ProductCategory, pc => pc.product)
  productCategories: ProductCategory[];

  @OneToMany(() => ProductImage, img => img.product)
  images: ProductImage[];

  @OneToMany(() => ProductUnit, unit => unit.product)
  units: ProductUnit[];
}
