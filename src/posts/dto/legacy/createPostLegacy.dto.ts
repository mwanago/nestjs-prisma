import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsISO8601,
} from 'class-validator';
import { Exclude } from 'class-transformer';

export class CreatePostLegacyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsNumber({}, { each: true })
  categoryIds?: number[];

  @IsISO8601({
    strict: true,
  })
  @IsOptional()
  scheduledDate?: string;

  @Exclude({
    toPlainOnly: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  get paragraphs() {
    return [this.content];
  }
}
