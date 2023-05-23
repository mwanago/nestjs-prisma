import { Prisma } from '@prisma/client';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import IsJsonObject from '../../utils/isJsonObject';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsJsonObject()
  @IsOptional()
  properties?: Prisma.InputJsonObject;
}

export default CreateProductDto;
