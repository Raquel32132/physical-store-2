import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StoreSchema } from './schemas/store.schema';
import { StoreController } from './controllers/store.controller';
import { StoreService } from './services/store.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Store', schema: StoreSchema }])],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
