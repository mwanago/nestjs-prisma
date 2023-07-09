import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { FindOneParams } from '../utils/findOneParams';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { AuthorIdQueryDto } from './dto/authorIdQuery.dto';
import { PaginationParamsDto } from './dto/paginationParams.dto';
import { TransformDataInterceptor } from '../utils/transformData.interceptor';
import { PostsResponseLegacyDto } from './dto/legacy/postsResponseLegacy.dto';
import { PostsPaginationResponseLegacyDto } from './dto/legacy/postsPaginationResponseLegacy.dto';
import { CreatePostLegacyDto } from './dto/legacy/createPostLegacy.dto';
import { UpdatePostLegacyDto } from './dto/legacy/updatePostLegacy.dto';
import { ReplacePostLegacyDto } from './dto/legacy/replacePostLegacy.dto';

@Controller({
  version: VERSION_NEUTRAL,
  path: 'posts',
})
@UseInterceptors(ClassSerializerInterceptor)
export default class PostsLegacyController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @UseInterceptors(
    new TransformDataInterceptor(PostsPaginationResponseLegacyDto),
  )
  async getPosts(
    @Query() { authorId }: AuthorIdQueryDto,
    @Query() paginationParams: PaginationParamsDto,
  ) {
    if (authorId !== undefined) {
      return this.postsService.getPostsByAuthor(authorId, paginationParams);
    }
    return this.postsService.getPosts(paginationParams);
  }

  @Get(':id')
  @UseInterceptors(new TransformDataInterceptor(PostsResponseLegacyDto))
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(id);
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(new TransformDataInterceptor(PostsResponseLegacyDto))
  async createPost(
    @Body() post: CreatePostLegacyDto,
    @Req() req: RequestWithUser,
  ) {
    return this.postsService.createPost(post, req.user);
  }

  @Put(':id')
  @UseInterceptors(new TransformDataInterceptor(PostsResponseLegacyDto))
  async replacePost(
    @Param() { id }: FindOneParams,
    @Body() post: ReplacePostLegacyDto,
  ) {
    return this.postsService.replacePost(id, post);
  }

  @Patch(':id')
  @UseInterceptors(new TransformDataInterceptor(PostsResponseLegacyDto))
  async updatePost(
    @Param() { id }: FindOneParams,
    @Body() post: UpdatePostLegacyDto,
  ) {
    return this.postsService.updatePost(id, post);
  }

  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams) {
    return this.postsService.deletePost(Number(id));
  }
}
