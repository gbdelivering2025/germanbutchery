import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { OrderDelivery } from '../entities/order-delivery.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(OrderDelivery)
    private orderDeliveryRepository: Repository<OrderDelivery>,
  ) {}

  async findAll(filters: any) {
    const { status, page = 1, limit = 20 } = filters;
    const queryBuilder = this.ordersRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('order.delivery', 'delivery')
      .orderBy('order.createdAt', 'DESC');

    if (status) {
      queryBuilder.where('order.status = :status', { status });
    }

    const total = await queryBuilder.getCount();
    const orders = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'delivery'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async create(createOrderDto: any) {
    const { items, delivery, ...orderData } = createOrderDto;

    // Create order
    const order = this.ordersRepository.create(orderData);
    const savedOrder = await this.ordersRepository.save(order) as unknown as Order;

    // Create order items
    if (items && items.length > 0) {
      const orderItems = items.map((item: any) => ({
        orderId: savedOrder.id,
        productId: item.productId,
        variantId: item.variantId,
        requestedQuantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      }));
      await this.orderItemsRepository.save(orderItems);
    }

    // Create delivery info
    if (delivery) {
      const orderDelivery = this.orderDeliveryRepository.create({
        orderId: savedOrder.id,
        customerName: delivery.customerName,
        deliveryAddress: delivery.deliveryAddress,
        deliveryPhone: delivery.deliveryPhone,
        deliveryFee: delivery.deliveryFee || 0,
        deliveryZone: delivery.deliveryZone,
      });
      await this.orderDeliveryRepository.save(orderDelivery);
    }

    return this.findOne(savedOrder.id);
  }

  async updateStatus(id: string, status: string) {
    const order = await this.findOne(id);
    await this.ordersRepository.update(id, { status });
    return this.findOne(id);
  }
}
