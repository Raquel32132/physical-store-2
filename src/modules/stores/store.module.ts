// src/modules/stores/store.module.ts
import { Module } from '@nestjs/common';
import { StoreService } from './services/store.service';
import { StoreController } from './controllers/store.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Store, StoreSchema } from './schemas/store.schema';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Store.name, schema: StoreSchema }]),
    LoggerModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
