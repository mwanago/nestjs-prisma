import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsISO8601,
} from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';

export class ReplacePostLegacyDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsISO8601({
    strict: true,
  })
  @IsOptional()
  scheduledDate: string | null = null;

  @Exclude({ toClassOnly: true })
  content: string;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.content) {
      return [obj.content];
    }
  })
  paragraphs: string[];
}
