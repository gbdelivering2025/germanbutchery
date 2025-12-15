import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_delivery')
export class OrderDelivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @OneToOne(() => Order, order => order.delivery, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'customer_name' })
  customerName: string;

  @Column({ name: 'delivery_address' })
  deliveryAddress: string;

  @Column({ name: 'delivery_phone', nullable: true })
  deliveryPhone: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'delivery_fee', default: 0 })
  deliveryFee: number;

  @Column({ name: 'delivery_zone', nullable: true })
  deliveryZone: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
