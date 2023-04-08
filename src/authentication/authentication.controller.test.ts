import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthenticationController } from './authentication.controller';

describe('The AuthenticationController', () => {
  let createUserMock: jest.Mock;
  let app: INestApplication;
  beforeEach(async () => {
    createUserMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: createUserMock,
            },
          },
        },
      ],
      controllers: [AuthenticationController],
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secretOrPrivateKey: 'Secret key',
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });
  describe('when the register endpoint is called', () => {
    describe('and the user is successfully created in the database', () => {
      let user: User;
      beforeEach(async () => {
        user = {
          id: 1,
          email: 'john@smith.com',
          name: 'John',
          password: 'strongPassword',
          addressId: null,
        };
        createUserMock.mockResolvedValue(user);
      });
      it('should return the new user without the password', async () => {
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            email: user.email,
            name: user.name,
            password: user.password,
          })
          .expect({
            id: user.id,
            name: user.name,
            email: user.email,
            addressId: null,
          });
      });
    });
  });
});
