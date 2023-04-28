import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class AuthorIdQueryDto {
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  authorId: number;
}
