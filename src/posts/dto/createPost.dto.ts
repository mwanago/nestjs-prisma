import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsISO8601,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @IsNotEmpty()
  paragraphs: string[];

  @IsOptional()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @IsISO8601({
    strict: true,
  })
  @IsOptional()
  scheduledDate?: string;
}
