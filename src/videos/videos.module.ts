import { Module } from '@nestjs/common';
import VideosController from './videos.controller';
import { VideosService } from './videos.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [VideosController],
  providers: [VideosService],
})
export class VideosModule {}
