import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';

describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthenticationService],
      imports: [
        UsersModule,
        ConfigModule.forRoot(),
        JwtModule.register({
          secretOrPrivateKey: 'Secret key',
        }),
        PrismaModule,
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
});
