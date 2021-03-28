import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class UpdatePostDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
