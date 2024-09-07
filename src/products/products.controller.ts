import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';
import { MessagePattern,Payload } from '@nestjs/microservices';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post() => no se usa porque no se expone en http se usa en TCP
  @MessagePattern({cmd:'create_product'})
  // create(@Body() createProductDto: CreateProductDto) { => esto se usa para HTTP
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({cmd:'find_all_product'})
  // findAll(@Query() paginationDto:PaginationDto) {
  findAll(@Payload() paginationDto:PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern({cmd:'find_one_product'})
  findOne(@Payload('id') id: string) {
    return this.productsService.findOne(+id);
  }

  // @Patch(':id')
  @MessagePattern({cmd:'update_product'})
  update(
    // @Param('id') id: string,
    // @Body() updateProductDto: UpdateProductDto
    @Payload() updateProductDto: UpdateProductDto
  ) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({cmd:'delete_product'})
  remove(@Payload('id') id: string) {
    return this.productsService.remove(+id);
  }
}
