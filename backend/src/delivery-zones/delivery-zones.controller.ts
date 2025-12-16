import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { DeliveryZonesService } from './delivery-zones.service';

@Controller('api/delivery-zones')
export class DeliveryZonesController {
  constructor(private readonly deliveryZonesService: DeliveryZonesService) {}

  @Get()
  async findAll() {
    return this.deliveryZonesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.deliveryZonesService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.deliveryZonesService.create(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.deliveryZonesService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.deliveryZonesService.remove(id);
  }
}
