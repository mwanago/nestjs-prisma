import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VideoDto } from './dto/video.dto';
import { createReadStream } from 'fs';
import { join } from 'path';

@Injectable()
export class VideosService {
  constructor(private readonly prismaService: PrismaService) {}

  create({ path, mimetype, filename }: VideoDto) {
    return this.prismaService.video.create({
      data: {
        path,
        filename,
        mimetype,
      },
    });
  }

  async streamVideoById(id: number) {
    const videoMetadata = await this.prismaService.video.findUnique({
      where: {
        id,
      },
    });

    if (!videoMetadata) {
      throw new NotFoundException();
    }

    const stream = createReadStream(join(process.cwd(), videoMetadata.path));

    return new StreamableFile(stream, {
      disposition: `inline; filename="${videoMetadata.filename}"`,
      type: videoMetadata.mimetype,
    });
  }
}
