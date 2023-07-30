import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Get,
  Param,
  Header,
  Headers,
  Res,
} from '@nestjs/common';
import { Express, Response } from 'express';
import LocalFilesInterceptor from '../utils/localFiles.interceptor';
import { VideosService } from './videos.service';
import { FindOneParams } from '../utils/findOneParams';

@Controller('videos')
export default class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Post()
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/videos',
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('video')) {
          return callback(
            new BadRequestException('Provide a valid video'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  addVideo(@UploadedFile() file: Express.Multer.File) {
    return this.videosService.create({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
    });
  }

  @Get(':id')
  @Header('Accept-Ranges', 'bytes')
  async streamVideo(
    @Param() { id }: FindOneParams,
    @Headers('range') range: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!range) {
      return this.videosService.getVideoStreamById(id);
    }
    const { streamableFile, contentRange } =
      await this.videosService.getPartOfVideoStream(id, range);

    response.status(206);

    response.set({
      'Content-Range': contentRange,
    });

    return streamableFile;
  }
}
