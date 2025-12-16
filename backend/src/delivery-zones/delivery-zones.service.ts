import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeliveryZone } from '../entities/delivery-zone.entity';

@Injectable()
export class DeliveryZonesService {
  constructor(
    @InjectRepository(DeliveryZone)
    private deliveryZoneRepository: Repository<DeliveryZone>,
  ) {}

  async findAll(): Promise<DeliveryZone[]> {
    return this.deliveryZoneRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<DeliveryZone> {
    return this.deliveryZoneRepository.findOne({ where: { id } });
  }

  async create(data: Partial<DeliveryZone>): Promise<DeliveryZone> {
    const zone = this.deliveryZoneRepository.create(data);
    return this.deliveryZoneRepository.save(zone);
  }

  async update(id: string, data: Partial<DeliveryZone>): Promise<DeliveryZone> {
    await this.deliveryZoneRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.deliveryZoneRepository.delete(id);
  }
}
