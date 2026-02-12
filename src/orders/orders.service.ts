import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Cart } from '../cart/entities/cart.entity';
import { CartItem } from '../cart/entities/cart-item.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(private dataSource: DataSource) {}

  private ensureCustomer(user: any) {
    if (user.role !== 'CUSTOMER') throw new ForbiddenException('Customer only');
  }

  async placeOrder(userReq: any) {
    this.ensureCustomer(userReq);

    const userId = userReq.id;

    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const cartRepo = manager.getRepository(Cart);
      const cartItemRepo = manager.getRepository(CartItem);
      const productRepo = manager.getRepository(Product);
      const orderRepo = manager.getRepository(Order);
      const orderItemRepo = manager.getRepository(OrderItem);

      const user = await userRepo.findOne({ where: { id: userId } });
      if (!user) throw new BadRequestException('User not found');
      if (user.cancelCount >= 3) throw new ForbiddenException('Account blocked due to abuse');

      const cart = await cartRepo.findOne({
        where: { user: { id: userId } },
        relations: ['items', 'items.product'],
      });

      if (!cart || !cart.items || cart.items.length === 0) {
        throw new BadRequestException('Cart is empty');
      }

      let total = 0;

      for (const item of cart.items) {
        const product = await productRepo.findOne({
          where: { id: item.product.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) throw new BadRequestException('Product missing');
        if (item.quantity > product.stock) {
          throw new BadRequestException(`Insufficient stock for product ${product.id}`);
        }

        total += Number(product.price) * item.quantity;
      }

      for (const item of cart.items) {
        const product = await productRepo.findOne({
          where: { id: item.product.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) throw new BadRequestException('Product missing');

        const newStock = product.stock - item.quantity;
        if (newStock < 0) throw new BadRequestException('Negative inventory prevented');

        product.stock = newStock;
        await productRepo.save(product);
      }

      const order = orderRepo.create({
        user,
        totalAmount: total.toFixed(2),
        items: [],
      });
      const savedOrder = await orderRepo.save(order);

      const itemsToSave: OrderItem[] = [];
      for (const item of cart.items) {
        itemsToSave.push(
          orderItemRepo.create({
            order: savedOrder,
            product: item.product,
            quantity: item.quantity,
            priceAtPurchase: Number(item.product.price).toFixed(2),
          }),
        );
      }
      await orderItemRepo.save(itemsToSave);

      await cartItemRepo.remove(cart.items);

      const finalOrder = await orderRepo.findOne({
        where: { id: savedOrder.id },
        relations: ['items', 'items.product'],
      });

      return finalOrder;
    });
  }

  async myOrders(userReq: any) {
    this.ensureCustomer(userReq);

    return this.dataSource.getRepository(Order).find({
      where: { user: { id: userReq.id } },
      relations: ['items', 'items.product'],
      order: { id: 'DESC' },
    });
  }
}
