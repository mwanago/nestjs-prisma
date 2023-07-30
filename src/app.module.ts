import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthenticationModule } from './authentication/authentication.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { VideosModule } from './videos/videos.module';

@Module({
  imports: [
    PostsModule,
    AuthenticationModule,
    CategoriesModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),
        FRONTEND_URL: Joi.string(),
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      }),
    }),
    ProductsModule,
    VideosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
