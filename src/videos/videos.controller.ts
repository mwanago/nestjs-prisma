import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { Express } from 'express';
import LocalFilesInterceptor from '../utils/localFiles.interceptor';
import { VideosService } from './videos.service';

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
  async addVideo(@UploadedFile() file: Express.Multer.File) {
    return this.videosService.create({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
    });
  }
}
