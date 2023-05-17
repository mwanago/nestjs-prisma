import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaError } from '../utils/prismaError';
import { PostNotFoundException } from './exceptions/postNotFound.exception';
import { User } from '@prisma/client';
import { PaginationParamsDto } from './dto/paginationParams.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPosts({ limit, offset, startingId }: PaginationParamsDto) {
    const [count, items] = await this.prismaService.$transaction([
      this.prismaService.post.count(),
      this.prismaService.post.findMany({
        take: limit,
        skip: offset,
        cursor: {
          id: startingId ?? 1,
        },
      }),
    ]);

    return {
      count,
      items,
    };
  }

  async getPostsByAuthor(
    authorId: number,
    { limit, offset, startingId }: PaginationParamsDto,
  ) {
    const [count, items] = await this.prismaService.$transaction([
      this.prismaService.post.count({
        where: {
          authorId,
        },
      }),
      this.prismaService.post.findMany({
        take: limit,
        skip: offset,
        where: {
          authorId,
        },
        cursor: {
          id: startingId ?? 1,
        },
      }),
    ]);

    return {
      count,
      items,
    };
  }

  async getPostById(id: number) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
    });
    if (!post) {
      throw new PostNotFoundException(id);
    }
    return post;
  }

  async createPost(post: CreatePostDto, user: User) {
    const categories = post.categoryIds?.map((category) => ({
      id: category,
    }));

    return this.prismaService.post.create({
      data: {
        title: post.title,
        content: post.content,
        scheduledDate: post.scheduledDate,
        author: {
          connect: {
            id: user.id,
          },
        },
        categories: {
          connect: categories,
        },
      },
      include: {
        categories: true,
      },
    });
  }

  async updatePost(id: number, post: UpdatePostDto) {
    try {
      return await this.prismaService.post.update({
        data: {
          ...post,
          id: undefined,
        },
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new PostNotFoundException(id);
      }
      throw error;
    }
  }

  async deletePost(id: number) {
    try {
      return this.prismaService.post.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PrismaError.RecordDoesNotExist
      ) {
        throw new PostNotFoundException(id);
      }
      throw error;
    }
  }

  deleteMultiplePosts(ids: number[]) {
    return this.prismaService.$transaction(async (transactionClient) => {
      const deleteResponse = await transactionClient.post.deleteMany({
        where: {
          id: {
            in: ids,
          },
        },
      });
      if (deleteResponse.count !== ids.length) {
        throw new NotFoundException('One of the posts cold not be deleted');
      }
    });
  }
}
