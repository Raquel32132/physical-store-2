import { Body, Controller, Get, Post, Request } from "@nestjs/common";
import { CreateStoreDto } from "../dto/create-store.dto";
import { StoreService } from "../services/store.service";
import { plainToInstance } from "class-transformer";

@Controller('api/v1/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async createStore(@Body() createStoreDto: CreateStoreDto, @Request() req) {
    const store = await this.storeService.createStore(createStoreDto, req);
    const transformedStore = plainToInstance(CreateStoreDto, store, { excludeExtraneousValues: true });

    return {
      statusCode: 201,
      message: 'Store created successfully',
      data: transformedStore
    }
  }

  @Get()
  async getStores(@Request() req) {
    const stores = await this.storeService.getAllStores(req);
    const transformedStores = plainToInstance(CreateStoreDto, stores, { excludeExtraneousValues: true });

    return {
      statusCode: 200,
      message: 'Stores fetched successfully',
      count: stores.length,
      data: transformedStores
    }
  }
}