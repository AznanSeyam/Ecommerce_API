import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() dto: CreateProductDto) {
    return this.productsService.create(dto, req.user);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(Number(id), dto, req.user);
  }

  @Patch(':id/stock')
  @UseGuards(JwtAuthGuard)
  updateStock(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateStockDto) {
    return this.productsService.updateStock(Number(id), dto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Req() req: any, @Param('id') id: string) {
    return this.productsService.remove(Number(id), req.user);
  }
}
