import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Store } from '../schemas/store.schema';
import { LOJAStoreDto, PDVStoreDto, StoreRequestDto, StoreResponseDto, StoreType } from '../dto/store.dto';
import { LoggerService } from '../../../common/logger/logger.service';
import { plainToInstance } from 'class-transformer';
import { PinsProps } from 'src/common/interfaces/pins.interface';
import { AddressService } from './address.service';

@Injectable()
export class StoreService {
  constructor(
    private readonly addressService: AddressService,

    @InjectModel(Store.name) private readonly storeModel: Model<Store>,
    private readonly logger: LoggerService,
  ) {}

  // CRUD service
  async createStore(createStoreDto: StoreRequestDto, req: Request): Promise<StoreResponseDto> {
    const correlationId = req['correlationId'];
    this.logger.log('Creating new store.', correlationId);

    try {
      const newStore = new this.storeModel(createStoreDto);
      await newStore.save();

      const transformedStore = plainToInstance(StoreResponseDto, newStore.toObject(), { excludeExtraneousValues: true });
      
      this.logger.log('Store created successfully!', correlationId);
      return transformedStore;

    } catch (error) {
      this.logger.error('Error creating store.', error.stack, correlationId);
      throw new HttpException(`Failed to create store`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateStore(id: string, storeDto: StoreRequestDto, req: Request): Promise<StoreResponseDto> {
    const correlationId = req['correlationId'];
    this.logger.log(`Updating store with id: ${id}.`, correlationId);

    if (!Types.ObjectId.isValid(id)) {
      this.logger.warn(`Invalid ObjectId: ${id}.`, correlationId);
      throw new BadRequestException(`Invalid id format: ${id}`);
    }

    try {
      const updatedStore = await this.storeModel.findByIdAndUpdate(id, storeDto, {
        new: true, overwrite: true, runValidators: true, context: 'query'
      }).exec();

      if (!updatedStore) {
        this.logger.error(`Store with id: ${id} not found.`, correlationId);
        throw new NotFoundException(`Store with id: ${id} not found.`);
      }

      const transformedStore = plainToInstance(StoreResponseDto, updatedStore.toObject(), { excludeExtraneousValues: true });

      this.logger.log(`Store with id: ${id} updated successfully!`, correlationId);
      return transformedStore;

    } catch (error) {
      this.logger.error(`Error updating store with id: ${id}`, error.stack, correlationId);
      throw new HttpException(`Failed to update store with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteStore(id: string, req: Request): Promise<void> {
    const correlationId = req['correlationId'];
    this.logger.log(`Deleting store with id: ${id}.`, correlationId);

    if (!Types.ObjectId.isValid(id)) {
      this.logger.warn(`Invalid ObjectId: ${id}.`, correlationId);
      throw new BadRequestException(`Invalid id format: ${id}`);
    }

    try {
      const result = await this.storeModel.findByIdAndDelete(id).exec();

      if (!result) {
        this.logger.error(`Store with id: ${id} not found.`, correlationId);
        throw new NotFoundException(`Store with id: ${id} not found.`);
      }

      this.logger.log(`Store with id: ${id} deleted successfully!`, correlationId);

    } catch (error) {
      this.logger.error(`Error deleting store with id: ${id}`, error.stack, correlationId);
      throw new HttpException(`Failed to delete store with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Buscas
  async getAllStores(limit: number, offset: number, req: Request): Promise<{ stores: StoreResponseDto[], total: number }> {
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

      const transformedStores = plainToInstance(StoreResponseDto, stores, { excludeExtraneousValues: true });

      this.logger.log('Stores fetched successfully!', correlationId);
      return { stores: transformedStores, total };

    } catch (error) {
      this.logger.error('Error fetching stores.', error.stack, correlationId);
      throw new HttpException('Failed to fetch stores.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getStoreById(id: string, req: Request): Promise<StoreResponseDto> {
    const correlationId = req['correlationId'];
    this.logger.log(`Fetching store with id: ${id}.`, correlationId);

    try {
      const store = await this.storeModel.findById(id).exec();
  
      const transformedStore = plainToInstance(StoreResponseDto, store.toObject(), { excludeExtraneousValues: true });

      this.logger.log(`Store with id: ${id} fetched successfully!`, correlationId);
      return transformedStore;

    } catch (error) {
      this.logger.error(`Error fetching store with id: ${id}`, error.stack, correlationId);
      throw new HttpException(`Failed to fetch store with id: ${id}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getStoresByState(state: string, limit: number, offset: number, req: Request): Promise<{ stores: StoreResponseDto[], total: number }> {
    const correlationId = req['correlationId'];
    this.logger.log(`Fetching stores within state: ${state}.`, correlationId);

    try {
      const [stores, total] = await Promise.all([
        this.storeModel
          .find({ state })
          .skip(offset)
          .limit(limit)
          .exec(),
        this.storeModel.countDocuments({ state }).exec(),
      ]);

      const transformedStores = plainToInstance(StoreResponseDto, stores, { excludeExtraneousValues: true });

      this.logger.log(`Stores within state ${state} fetched successfully!`, correlationId);
      return { stores: transformedStores, total };

    } catch (error) {
      this.logger.error(`Error fetching stores within state: ${state}.`, error.stack, correlationId);
      throw new HttpException(`Failed to fetch store within state: ${state}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Buscar com frete
  async getStoreInformation(store: Store, postalCode: string, req: Request, pins: PinsProps[]): Promise<any> {
    let value;
    const { distanceText, distanceValue } = await this.addressService.getDistance(store.postalCode, postalCode, req);
    const distanceValueKM = parseFloat((distanceValue / 1000).toFixed(1));
  
    // 1- pdv +50km - sem entrega | não listar
    if (store.type === StoreType.PDV && distanceValueKM > 50) {
      return null;
    }
  
    // 2 - pdv -50km - entrega como PDV   |   3 - loja -50km - entrega como PDV
    if (store.type === StoreType.PDV || (store.type === StoreType.LOJA && distanceValueKM <= 50)) {
      const prazoPDV = Math.ceil(distanceValueKM / 40);
      value = [{
        prazo: `${prazoPDV} hora${prazoPDV > 1 ? 's' : ''}`,
        price: "R$ 15,00",
        description: "Motoboy",
      }];
    } 
  
    // 4 - loja +50km - frete correios
    if (store.type === StoreType.LOJA && distanceValueKM > 50) {
      const shipping = await this.addressService.getShipping(store.postalCode, postalCode, req);
      value = shipping.map(item => ({
        prazo: item.prazo,
        codProdutoAgencia: item.codProdutoAgencia,
        price: item.precoPPN,
        description: item.urlTitulo,
      }));
    }

    const coordinates = await this.addressService.getCoordinatesWithOpenCage(store.postalCode, req);

    pins.push({
      position: {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      },
      title: store.storeName,
    });
  
    return {
      storeName: store.storeName,
      city: store.city,
      postalCode: store.postalCode,
      type: store.type,
      distanceText,
      value,
    };
  }

  async getStoresShipping(postalCode: string, limit: number, offset: number, req: Request): Promise<{ stores: (PDVStoreDto | LOJAStoreDto)[], pins: PinsProps[], total: number }> {
    const correlationId = req['correlationId'];
    this.logger.log(`Fetching stores with shipping to the postal code: ${postalCode}.`, correlationId);

    try {
      this.addressService.validatePostalCode(postalCode, req);

      const pins: PinsProps[] = [];

      // Buscar as todas as stores
      const [stores]: [Store[], number] = await Promise.all([
        this.storeModel
          .find()
          .skip(offset)
          .limit(limit)
          .exec(),
        this.storeModel.countDocuments().exec()
      ]);

      // Calculando frete, distancia e coordenadas
      const storesWithInformation = await Promise.all(
        stores.map(store => this.getStoreInformation(store, postalCode, req, pins))
      );

      const validStores = storesWithInformation.filter(store => store !== null);

      const transformedStores = validStores.map(store => {
        const transformedStore = store.type === StoreType.PDV
        ? new PDVStoreDto()
        : new LOJAStoreDto();

        transformedStore.name = store.storeName;
        transformedStore.city = store.city;
        transformedStore.postalCode = store.postalCode;
        transformedStore.type = store.type as StoreType;

        transformedStore.distance = store.distanceText; 
        transformedStore.value = store.value;

        return transformedStore;
      });

      const total = transformedStores.length;

      this.logger.log(`Stores with shipping to the postal code: ${postalCode} fetched successfully!`, correlationId);
      return { stores: transformedStores, pins, total };

    } catch (error) {
      this.logger.error(`Error fetching stores with shipping to the postal code: ${postalCode}.`, error.stack, correlationId);
      throw new HttpException(`Failed to fetch stores with shipping to the postal code: ${postalCode}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
