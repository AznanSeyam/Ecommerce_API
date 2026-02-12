import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getMyCart(@Req() req: any) {
    return this.cartService.getMyCart(req.user);
  }

  @Post('add')
  add(@Req() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user, dto);
  }

  @Delete('remove/:productId')
  remove(@Req() req: any, @Param('productId') productId: string) {
    return this.cartService.removeFromCart(req.user, Number(productId));
  }
}
