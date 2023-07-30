import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VideoDto } from './dto/video.dto';
import { createReadStream } from 'fs';
import { stat } from 'fs/promises';
import { join } from 'path';
import * as rangeParser from 'range-parser';

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

  async getVideoMetadata(id: number) {
    const videoMetadata = await this.prismaService.video.findUnique({
      where: {
        id,
      },
    });

    if (!videoMetadata) {
      throw new NotFoundException();
    }

    return videoMetadata;
  }

  parseRange(range: string, size: number) {
    const parseResult = rangeParser(size, range);
    if (parseResult === -1 || parseResult === -2 || parseResult.length !== 1) {
      throw new BadRequestException();
    }
    return parseResult[0];
  }

  async getFileSize(path: string) {
    const status = await stat(path);

    return status.size;
  }

  async streamPartOfVideo(id: number, range: string) {
    const videoMetadata = await this.getVideoMetadata(id);
    const videoPath = join(process.cwd(), videoMetadata.path);
    const fileSize = await this.getFileSize(videoPath);

    const { start, end } = this.parseRange(range, fileSize);

    const stream = createReadStream(videoPath, { start, end });

    const chunkSize = end - start + 1;

    const streamableFile = new StreamableFile(stream, {
      disposition: `inline; filename="${videoMetadata.filename}"`,
      type: videoMetadata.mimetype,
      length: chunkSize,
    });

    const contentRange = `bytes ${start}-${end}/${fileSize}`;

    return {
      streamableFile,
      contentRange,
    };
  }

  async streamVideoById(id: number) {
    const videoMetadata = await this.getVideoMetadata(id);

    const stream = createReadStream(join(process.cwd(), videoMetadata.path));

    return new StreamableFile(stream, {
      disposition: `inline; filename="${videoMetadata.filename}"`,
      type: videoMetadata.mimetype,
    });
  }
}
