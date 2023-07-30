import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VideosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(path: string, filename: string, mimetype: string) {
    return this.prismaService.video.create({
      data: {
        path,
        filename,
        mimetype,
      },
    });
  }
}
