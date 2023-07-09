import { IsString, IsNotEmpty, IsNumber, IsISO8601 } from 'class-validator';
import { CanBeUndefined } from '../../../utils/canBeUndefined';
import { CanBeNull } from '../../../utils/canBeNull';
import { Exclude, Expose, Transform } from 'class-transformer';

export class UpdatePostLegacyDto {
  @IsNumber()
  @CanBeUndefined()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  title?: string;

  @IsISO8601({
    strict: true,
  })
  @CanBeUndefined()
  @CanBeNull()
  scheduledDate?: string | null;

  @IsString()
  @IsNotEmpty()
  @Exclude({ toClassOnly: true })
  @CanBeUndefined()
  content?: string;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.content) {
      return [obj.content];
    }
  })
  paragraphs?: string[];
}
