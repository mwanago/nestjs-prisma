import { Injectable, NotFoundException } from '@nestjs/common';
import CreateProductDto from './dto/createProduct.dto';
import UpdateProductDto from './dto/updateProduct.dto';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaError } from '../utils/prismaError';
import { Prisma } from '@prisma/client';

@Injectable()
export default class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getProductById(id: number) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }

  getAllProducts() {
    this.prismaService.product.findMany({
      where: {
        properties: {
          path: ['publicationYear'],
          lt: 2000,
        },
      },
    });
  }

  async createProduct(product: CreateProductDto) {
    return this.prismaService.product.create({
      data: product,
    });
  }

  async updateProduct(id: number, product: UpdateProductDto) {
    try {
      return await this.prismaService.product.update({
        data: {
          ...product,
          id: undefined,
          properties: product.properties ?? Prisma.DbNull,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException();
      }
      throw error;
    }
  }

  async deleteProduct(id: number) {
    try {
      return await this.prismaService.product.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
