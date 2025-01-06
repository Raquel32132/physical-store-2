import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoConfig } from './config/mongo.config';
import { StoreModule } from './modules/stores/store.module';
import { CorrelationIdMiddleware } from './common/middlewares/correlation-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongoConfig
    }),
    StoreModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

    // aqui estou aplicando o middleware do correlationId para todas as rotas
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}

