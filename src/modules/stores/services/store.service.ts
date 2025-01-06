import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Store } from '../schemas/store.schema';
import { CreateStoreDto } from '../dto/create-store.dto';
import { LoggerService } from 'src/common/logger/logger.service';
import { plainToInstance } from 'class-transformer';

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

  async getAllStores(limit: number, offset: number, req: Request): Promise<{ stores: CreateStoreDto[], total: number }> {
    const correlationId = req['correlationId'];

    this.logger.log('Fetching all stores.', correlationId);

    try {
      const [stores, total] = await Promise.all([
        this.storeModel
          .find()
          .skip(offset)
          .limit(limit)
          .exec(),
        this.storeModel.countDocuments().exec()
      ]);

      const transformedStores = plainToInstance(CreateStoreDto, stores, { excludeExtraneousValues: true });

      this.logger.log('Stores fetched successfully!', correlationId);
      return { stores: transformedStores, total };

    } catch (error) {
      this.logger.error('Error fetching stores.', error.stack, correlationId);
      throw error;
    }
  }
}
