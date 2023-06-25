import { IsString, IsNotEmpty, IsNumber, IsISO8601 } from 'class-validator';
import { CanBeUndefined } from '../../utils/canBeUndefined';
import { CanBeNull } from '../../utils/canBeNull';

export class UpdatePostDto {
  @IsNumber()
  @CanBeUndefined()
  id?: number;

  @IsString()
  @IsNotEmpty()
  @CanBeUndefined()
  title?: string;

  @IsString({ each: true })
  @IsNotEmpty()
  @CanBeUndefined()
  paragraphs?: string[];

  @IsISO8601({
    strict: true,
  })
  @CanBeUndefined()
  @CanBeNull()
  scheduledDate?: string | null;
}
