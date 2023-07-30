import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
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
    }),
  )
  async addVideo(@UploadedFile() file: Express.Multer.File) {
    return this.videosService.create(
      file.path,
      file.originalname,
      file.mimetype,
    );
  }
}
