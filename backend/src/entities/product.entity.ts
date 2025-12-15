import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToMany } from 'typeorm';
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

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'base_unit' })
  baseUnit: string; // 'g', 'kg', 'pc', 'pkt'

  @Column({ name: 'base_unit_in_grams', nullable: true })
  baseUnitInGrams: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'price_per_base_unit' })
  pricePerBaseUnit: number;

  @Column({ length: 3, default: 'RWF' })
  currency: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ProductCategory, pc => pc.product)
  productCategories: ProductCategory[];

  @OneToMany(() => ProductImage, img => img.product)
  images: ProductImage[];

  @OneToMany(() => ProductUnit, unit => unit.product)
  units: ProductUnit[];
}
