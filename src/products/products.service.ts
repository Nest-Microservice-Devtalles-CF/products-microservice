import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaClient } from '@prisma/client';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private logger = new Logger("Products_service")
  onModuleInit() {
   this.logger.log("Base de datos funcionando")
  }
  create(createProductDto: CreateProductDto) {

     return this.product.create({
      data:createProductDto
    });
  }

  async findAll(paginationDto:PaginationDto) {
    const {page, limit} = paginationDto;
    const totaPage = await this.product.count({where:{avalible:true}});
    const lagePage = Math.ceil(totaPage/limit)
    return {
      data:await this.product.findMany({
        skip:(page -1) *10,
        take:limit,
        where:{
          avalible:true
        }
      }),
      meta:{
        page,
        total:totaPage,
        lagePage
      }
    }
    }

  async findOne(id: number) {
    const product =  await this.product.findFirst({
      where:{id, avalible:true}
    });

    if(!product){
      throw  new NotFoundException(`Product with id ${id} not found`)
    }

    return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    const {id:__, ...data} = updateProductDto
    const product = this.findOne(id);
    if(!product){
      throw new BadRequestException("El producto no se encuentra registrado")
    }
    return this.product.update({
      where:{id},
      data:data
    })
  }

  async remove(id: number) {
    this.findOne(id)
    // return this.product.delete({
    //   where:{id}
    // })
    const product = await this.product.update({
      where:{id},
      data:{avalible:false}
    })
    return product
  }
}
