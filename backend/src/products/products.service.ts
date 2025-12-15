import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductCategory } from '../entities/product-category.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductUnit } from '../entities/product-unit.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductCategory)
    private productCategoriesRepository: Repository<ProductCategory>,
    @InjectRepository(ProductImage)
    private productImagesRepository: Repository<ProductImage>,
    @InjectRepository(ProductUnit)
    private productUnitsRepository: Repository<ProductUnit>,
  ) {}

  async findAll(filters: any) {
    const { category, search, page = 1, limit = 20 } = filters;
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.units', 'units')
      .leftJoinAndSelect('product.productCategories', 'productCategories')
      .leftJoinAndSelect('productCategories.category', 'category')
      .where('product.isActive = :isActive', { isActive: true });

    if (category) {
      queryBuilder.andWhere('category.slug = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere('(product.title ILIKE :search OR product.description ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const total = await queryBuilder.getCount();
    const products = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: ['images', 'units', 'productCategories', 'productCategories.category'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async create(createProductDto: any) {
    const { categories, images, units, ...productData } = createProductDto;

    const product = this.productsRepository.create(productData);
    const savedProduct = await this.productsRepository.save(product);

    // Add categories
    if (categories && categories.length > 0) {
      const productCategories = categories.map((categoryId: string) => ({
        productId: savedProduct.id,
        categoryId,
      }));
      await this.productCategoriesRepository.save(productCategories);
    }

    // Add images
    if (images && images.length > 0) {
      const productImages = images.map((img: any, index: number) => ({
        productId: savedProduct.id,
        imageUrl: img.url,
        displayOrder: img.order || index,
        isPrimary: img.isPrimary || index === 0,
      }));
      await this.productImagesRepository.save(productImages);
    }

    // Add units
    if (units && units.length > 0) {
      const productUnits = units.map((unit: any) => ({
        productId: savedProduct.id,
        unit: unit.unit,
        multiplier: unit.multiplier,
        isDefault: unit.isDefault || false,
      }));
      await this.productUnitsRepository.save(productUnits);
    }

    return this.findOne(savedProduct.id);
  }

  async update(id: string, updateProductDto: any) {
    const product = await this.findOne(id);
    const { categories, images, units, ...productData } = updateProductDto;

    // Update product data
    await this.productsRepository.update(id, productData);

    // Update categories if provided
    if (categories) {
      await this.productCategoriesRepository.delete({ productId: id });
      if (categories.length > 0) {
        const productCategories = categories.map((categoryId: string) => ({
          productId: id,
          categoryId,
        }));
        await this.productCategoriesRepository.save(productCategories);
      }
    }

    // Update images if provided
    if (images) {
      await this.productImagesRepository.delete({ productId: id });
      if (images.length > 0) {
        const productImages = images.map((img: any, index: number) => ({
          productId: id,
          imageUrl: img.url,
          displayOrder: img.order || index,
          isPrimary: img.isPrimary || index === 0,
        }));
        await this.productImagesRepository.save(productImages);
      }
    }

    // Update units if provided
    if (units) {
      await this.productUnitsRepository.delete({ productId: id });
      if (units.length > 0) {
        const productUnits = units.map((unit: any) => ({
          productId: id,
          unit: unit.unit,
          multiplier: unit.multiplier,
          isDefault: unit.isDefault || false,
        }));
        await this.productUnitsRepository.save(productUnits);
      }
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }

  async bulkUpdate(bulkUpdateDto: any) {
    const { productIds, updates } = bulkUpdateDto;

    if (!productIds || productIds.length === 0) {
      throw new Error('No products selected for bulk update');
    }

    // Update common fields for all selected products
    await this.productsRepository.update(
      { id: In(productIds) },
      updates,
    );

    return { message: `${productIds.length} products updated successfully` };
  }
}
