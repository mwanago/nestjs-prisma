import { PostsResponseLegacyDto } from './postsResponseLegacy.dto';
import { Type } from 'class-transformer';

export class PostsPaginationResponseLegacyDto {
  count: number;
  @Type(() => PostsResponseLegacyDto)
  items: PostsResponseLegacyDto;
}
