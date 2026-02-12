
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  private ensureCustomer(user: any) {
    if (user.role !== 'CUSTOMER') throw new ForbiddenException('Customer only');
  }

  async getMyCart(user: any) {
    this.ensureCustomer(user);

    let cart = await this.cartRepo.findOne({
      where: { user: { id: user.id } },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepo.create({ user: { id: user.id } as any, items: [] });
      cart = await this.cartRepo.save(cart);
    }

    return cart;
  }

  async addToCart(user: any, dto: AddToCartDto) {
    this.ensureCustomer(user);

    const product = await this.productRepo.findOne({ where: { id: dto.productId } });
    if (!product) throw new NotFoundException('Product not found');

    if (product.stock <= 0) throw new BadRequestException('Out of stock');
    if (dto.quantity > product.stock) throw new BadRequestException('Quantity exceeds stock');

    const cart = await this.getMyCart(user);

    const existing = await this.itemRepo.findOne({
      where: { cart: { id: cart.id }, product: { id: product.id } },
    });

    if (existing) {
      const newQty = existing.quantity + dto.quantity;
      if (newQty > product.stock) throw new BadRequestException('Quantity exceeds stock');
      existing.quantity = newQty;
      await this.itemRepo.save(existing);
    } else {
      const item = this.itemRepo.create({ cart: { id: cart.id } as any, product, quantity: dto.quantity });
      await this.itemRepo.save(item);
    }

    return this.getMyCart(user);
  }

  async removeFromCart(user: any, productId: number) {
    this.ensureCustomer(user);

    const cart = await this.getMyCart(user);

    const item = await this.itemRepo.findOne({
      where: { cart: { id: cart.id }, product: { id: productId } },
    });

    if (!item) throw new NotFoundException('Item not in cart');

    await this.itemRepo.remove(item);

    return this.getMyCart(user);
  }

  async clearCartByUserId(userId: number, managerItemRepo?: Repository<CartItem>, managerCartRepo?: Repository<Cart>) {
    const cartRepo = managerCartRepo ?? this.cartRepo;
    const itemRepo = managerItemRepo ?? this.itemRepo;

    const cart = await cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ['items'],
    });
    if (!cart) return;

    if (cart.items?.length) {
      await itemRepo.remove(cart.items);
    }
  }
}
