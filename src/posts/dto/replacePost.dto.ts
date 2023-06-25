import {IsString, IsNotEmpty, IsNumber, IsOptional, IsISO8601} from 'class-validator';

export class ReplacePostDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString({ each: true })
  @IsNotEmpty()
  paragraphs: string[];

  @IsISO8601({
    strict: true,
  })
  @IsOptional()
  scheduledDate: string | null = null;
}
