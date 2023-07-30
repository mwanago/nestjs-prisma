import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VideoDto } from './dto/video.dto';

@Injectable()
export class VideosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ path, mimetype, filename }: VideoDto) {
    return this.prismaService.video.create({
      data: {
        path,
        filename,
        mimetype,
      },
    });
  }
}
