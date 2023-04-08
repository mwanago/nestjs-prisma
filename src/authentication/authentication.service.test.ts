import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let password: string;
  let findUniqueMock: jest.Mock;
  beforeEach(async () => {
    password = 'strongPassword123';
    findUniqueMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: findUniqueMock,
            },
          },
        },
      ],
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secretOrPrivateKey: 'Secret key',
        }),
      ],
    }).compile();

    authenticationService = await module.get(AuthenticationService);
  });
  describe('when the getAuthenticatedUser method is called', () => {
    describe('and the user can be found in the database', () => {
      let user: User;
      beforeEach(async () => {
        const hashedPassword = await bcrypt.hash(password, 10);
        user = {
          id: 1,
          email: 'john@smith.com',
          name: 'John',
          password: hashedPassword,
          addressId: null,
        };
        findUniqueMock.mockResolvedValue(user);
      });
      describe('and a correct password is provided', () => {
        it('should return the new user', async () => {
          const result = await authenticationService.getAuthenticatedUser(
            user.email,
            password,
          );
          expect(result).toBe(user);
        });
      });
      describe('and an incorrect password is provided', () => {
        it('should throw the BadRequestException', () => {
          return expect(async () => {
            await authenticationService.getAuthenticatedUser(
              'john@smith.com',
              'wrongPassword',
            );
          }).rejects.toThrow(BadRequestException);
        });
      });
    });
    describe('and the user can not be found in the database', () => {
      beforeEach(() => {
        findUniqueMock.mockResolvedValue(undefined);
      });
      it('should throw the BadRequestException', () => {
        return expect(async () => {
          await authenticationService.getAuthenticatedUser(
            'john@smith.com',
            password,
          );
        }).rejects.toThrow(BadRequestException);
      });
    });
  });
});
