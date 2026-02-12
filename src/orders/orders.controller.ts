import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post('place')
  place(@Req() req: any) {
    return this.ordersService.placeOrder(req.user);
  }

  @Get('my')
  my(@Req() req: any) {
    return this.ordersService.myOrders(req.user);
  }
}
