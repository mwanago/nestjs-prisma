import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import PostsController from './posts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import PostsLegacyController from './postsLegacy.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PostsController, PostsLegacyController],
  providers: [PostsService],
})
export class PostsModule {}
