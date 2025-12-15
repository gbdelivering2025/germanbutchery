import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { OrderDelivery } from './order-delivery.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'total_amount' })
  totalAmount: number;

  @Column({ length: 3, default: 'RWF' })
  currency: string;

  @Column({ default: 'pending' })
  status: string; // 'pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'

  @Column({ name: 'payment_method', nullable: true })
  paymentMethod: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => OrderItem, item => item.order)
  items: OrderItem[];

  @OneToOne(() => OrderDelivery, delivery => delivery.order)
  delivery: OrderDelivery;
}
