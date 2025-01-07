import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import { Store } from '../schemas/store.schema';
import { StoreDto } from '../dto/store.dto';
import { LoggerService } from 'src/common/logger/logger.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class StoreService {
  constructor(
    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly logger: LoggerService,
  ) {}

  async createStore(createStoreDto: StoreDto, req: Request): Promise<StoreDto> {
    const correlationId = req['correlationId'];

    this.logger.log('Creating new store.', correlationId);

    try {
      const newStore = new this.storeModel(createStoreDto);
      await newStore.save();

      const transformedStore = plainToInstance(StoreDto, newStore.toObject(), { excludeExtraneousValues: true });
      
      this.logger.log('Store created successfully!', correlationId);
      return transformedStore;

    } catch (error) {
      this.logger.error('Error creating store.', error.stack, correlationId);
      throw error;
    }
  }

  async getAllStores(limit: number, offset: number, req: Request): Promise<{ stores: StoreDto[], total: number }> {
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

      const transformedStores = plainToInstance(StoreDto, stores, { excludeExtraneousValues: true });

      this.logger.log('Stores fetched successfully!', correlationId);
      return { stores: transformedStores, total };

    } catch (error) {
      this.logger.error('Error fetching stores.', error.stack, correlationId);
      throw error;
    }
  }

  async updateStore(id: string, storeDto: StoreDto, req: Request): Promise<StoreDto> {
    const correlationId = req['correlationId'];

    this.logger.log(`Updating store with id: ${id}.`, correlationId);

    try {
      const updatedStore = await this.storeModel.findByIdAndUpdate(id, storeDto, {
        new: true, overwrite: true, runValidators: true, context: 'query'
      }).exec();

      if (!updatedStore) {
        this.logger.error(`Store with id: ${id} not found.`, correlationId);
        throw new Error(`Store with id: ${id} not found.`);
      }

      const transformedStore = plainToInstance(StoreDto, updatedStore.toObject(), { excludeExtraneousValues: true });

      this.logger.log(`Store with id: ${id} updated successfully!`, correlationId);
      return transformedStore;

    } catch (error) {
      this.logger.error('Error updating store.', error.stack, correlationId);
      throw error;
    }
  }

  async getStoreById(id: string, req: Request): Promise<StoreDto> {
    const correlationId = req['correlationId'];

    this.logger.log(`Fetching store with id: ${id}.`, correlationId);

    try {
      const store = await this.storeModel.findById(id).exec();

      if (!store) {
        this.logger.error(`Store with id: ${id} not found.`, correlationId);
        throw new Error(`Store with id: ${id} not found.`);
      }

      const transformedStore = plainToInstance(StoreDto, store.toObject(), { excludeExtraneousValues: true });

      this.logger.log(`Store with id: ${id} fetched successfully!`, correlationId);
      return transformedStore;

    } catch (error) {
      this.logger.error('Error fetching store.', error.stack, correlationId);
      throw error;
    }
  }

}
