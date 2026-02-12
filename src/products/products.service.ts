import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectRepository(Product) private repo: Repository<Product>) {}

  findAll() {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Product not found');
    return p;
  }

  async create(dto: CreateProductDto, user: any) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin only');

    const product = this.repo.create({
      name: dto.name,
      price: dto.price.toFixed(2),
      stock: dto.stock,
      description: dto.description,
    });
    return this.repo.save(product);
  }

  async update(id: number, dto: UpdateProductDto, user: any) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin only');

    const product = await this.findOne(id);

    if (dto.name !== undefined) product.name = dto.name;
    if (dto.price !== undefined) {
      if (dto.price < 0) throw new BadRequestException('Invalid price');
      product.price = dto.price.toFixed(2);
    }
    if (dto.description !== undefined) product.description = dto.description;

    return this.repo.save(product);
  }

  async updateStock(id: number, dto: UpdateStockDto, user: any) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin only');

    const product = await this.findOne(id);
    product.stock = dto.stock;
    return this.repo.save(product);
  }

  async remove(id: number, user: any) {
    if (user.role !== 'ADMIN') throw new ForbiddenException('Admin only');

    const product = await this.findOne(id);
    await this.repo.remove(product);
    return { message: 'Deleted' };
  }
}
