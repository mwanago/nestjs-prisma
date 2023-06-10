import { Prisma } from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';
import IsJsonObject from '../../utils/isJsonObject';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsJsonObject()
  @IsOptional()
  properties?: Prisma.InputJsonObject;

  @IsNumber()
  @IsPositive()
  price: number;
}

export default CreateProductDto;
