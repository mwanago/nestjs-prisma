import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserNotFoundException } from '../users/exceptions/userNotFound.exception';
import { BadRequestException } from '@nestjs/common';

describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let password: string;
  let getByEmailMock: jest.Mock;
  beforeEach(async () => {
    getByEmailMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        {
          provide: UsersService,
          useValue: {
            getByEmail: getByEmailMock,
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
  describe('when calling the getCookieForLogOut method', () => {
    it('should return a correct string', () => {
      const result = authenticationService.getCookieForLogOut();
      expect(result).toBe('Authentication=; HttpOnly; Path=/; Max-Age=0');
    });
  });
  describe('when the getAuthenticatedUser method is called', () => {
    describe('and a valid email and password are provided', () => {
      let userData: User;
      beforeEach(async () => {
        password = 'strongPassword123';
        const hashedPassword = await bcrypt.hash(password, 10);
        userData = {
          id: 1,
          email: 'john@smith.com',
          name: 'John',
          password: hashedPassword,
          addressId: null,
        };
        getByEmailMock.mockResolvedValue(userData);
      });
      it('should return the new user', async () => {
        const result = await authenticationService.getAuthenticatedUser(
          userData.email,
          password,
        );
        expect(result).toBe(userData);
      });
    });
    describe('and an invalid email is provided', () => {
      beforeEach(() => {
        getByEmailMock.mockRejectedValue(new UserNotFoundException());
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
