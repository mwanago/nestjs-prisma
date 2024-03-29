import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';
import IsJsonObject from '../../utils/isJsonObject';
import { Prisma } from '@prisma/client';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsJsonObject()
  @IsOptional()
  properties?: Prisma.InputJsonObject;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  price?: number;
}

export default CreateProductDto;
