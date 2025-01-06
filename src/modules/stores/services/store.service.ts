import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Store } from '../schemas/store.schema';
import { CreateStoreDto } from '../dto/create-store.dto';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly logger: LoggerService,
  ) {}

  async createStore(createStoreDto: CreateStoreDto, req: Request): Promise<Store> {
    const correlationId = req['correlationId'];

    this.logger.log('Creating new store.', correlationId);

    try {
      const newStore = new this.storeModel(createStoreDto);
      await newStore.save();
      
      this.logger.log('Store created successfully!', correlationId);
      return newStore;
    } catch (error) {
      this.logger.error('Error creating store.', error.stack, correlationId);
      throw error;
    }
  }
}
