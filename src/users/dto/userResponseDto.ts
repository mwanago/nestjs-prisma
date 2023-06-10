import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto implements User {
  id: number;
  email: string;
  name: string;
  addressId: number;

  @Exclude()
  password: string;
}
