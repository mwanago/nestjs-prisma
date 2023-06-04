import { Injectable } from '@nestjs/common';
import CreateCategoryDto from './dto/createCategory.dto';
import UpdateCategoryDto from './dto/updateCategory.dto';
import CategoryNotFoundException from './exceptions/categoryNotFound.exception';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaError } from '../utils/prismaError';

@Injectable()
export default class CategoriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteCategoryWithPosts(id: number) {
    const category = await this.getCategoryById(id);

    const postIds = category.posts.map((post) => post.id);

    await this.prismaService.$transaction([
      this.prismaService.post.deleteMany({
        where: {
          id: {
            in: postIds,
          },
        },
      }),
      this.prismaService.category.delete({
        where: {
          id,
        },
      }),
    ]);
  }

  async getCategoryById(id: number) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
      include: {
        posts: true,
      },
    });
    if (!category) {
      throw new CategoryNotFoundException(id);
    }
    return category;
  }

  getAllCategories() {
    return this.prismaService.category.findMany();
  }

  async createCategory(category: CreateCategoryDto) {
    return this.prismaService.category.create({
      data: category,
    });
  }

  async updateCategory(id: number, category: UpdateCategoryDto) {
    try {
      return await this.prismaService.category.update({
        data: {
          ...category,
          id: undefined,
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
        throw new CategoryNotFoundException(id);
      }
      throw error;
    }
  }

  async deleteCategory(id: number) {
    try {
      return await this.prismaService.category.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new CategoryNotFoundException(id);
      }
      throw error;
    }
  }
}
