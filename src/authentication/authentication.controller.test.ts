import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthenticationController } from './authentication.controller';
import { PrismaError } from '../utils/prismaError';

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
    describe('and valid data is provided', () => {
      let user: User;
      beforeEach(async () => {
        user = {
          id: 1,
          email: 'john@smith.com',
          name: 'John',
          password: 'strongPassword',
          addressId: null,
        };
      });
      describe('and the user is successfully created in the database', () => {
        beforeEach(() => {
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
      describe('and the email is already taken', () => {
        beforeEach(async () => {
          createUserMock.mockImplementation(() => {
            throw new Prisma.PrismaClientKnownRequestError(
              'The user already exists',
              {
                code: PrismaError.UniqueConstraintFailed,
                clientVersion: '4.12.0',
              },
            );
          });
        });
        it('should result in 400 Bad Request', async () => {
          return request(app.getHttpServer())
            .post('/authentication/register')
            .send({
              email: user.email,
              name: user.name,
              password: user.password,
            })
            .expect(400);
        });
      });
    });
    describe('and the email is missing', () => {
      it('should result in 400 Bad Request', async () => {
        return request(app.getHttpServer())
          .post('/authentication/register')
          .send({
            name: 'John',
            password: 'strongPassword',
          })
          .expect(400);
      });
    });
  });
});
