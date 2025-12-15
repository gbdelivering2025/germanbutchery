import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderDelivery } from './order-delivery.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_number', unique: true, nullable: true })
  orderNumber: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'customer_name' })
  customerName: string;

  @Column({ name: 'customer_phone' })
  customerPhone: string;

  @Column({ name: 'customer_email', nullable: true })
  customerEmail: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ name: 'delivery_address', type: 'text', nullable: true })
  deliveryAddress: string;

  @Column({ name: 'delivery_zone', nullable: true })
  deliveryZone: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'delivery_fee', default: 0 })
  deliveryFee: number;

  @Column({ name: 'delivery_type', default: 'delivery' })
  deliveryType: string; // 'delivery', 'pickup'

  @Column({ name: 'delivery_time', nullable: true })
  deliveryTime: string;

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod: string;

  @Column({ name: 'payment_status', default: 'pending' })
  paymentStatus: string; // 'pending', 'paid', 'failed'

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'subtotal' })
  subtotal: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({ length: 3, default: 'RWF' })
  currency: string;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => OrderItem, item => item.order)
  items: OrderItem[];

  @OneToOne(() => OrderDelivery, delivery => delivery.order)
  delivery: OrderDelivery;
}
