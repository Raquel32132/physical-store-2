import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { StoreRequestDto } from "../dto/store.dto";
import { StoreService } from "../services/store.service";

@Controller('api/v1/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // CRUD
  @Post()
  async createStore(@Body() createStoreDto: StoreRequestDto, @Request() req) {
    const store = await this.storeService.createStore(createStoreDto, req);

    return {
      store: store
    }
  }

  @Put(':id')
  async updateStore(@Param('id') id: string, @Body() storeDto: StoreRequestDto, @Request() req) {
    const updatedStore = await this.storeService.updateStore(id, storeDto, req);

    return {
      data: updatedStore
    }
  }

  @Delete(':id')
  async deleteStore(@Param('id') id: string, @Request() req) {
    await this.storeService.deleteStore(id, req);
  }

  // Endpoints requisitadas
  @Get()
  async getAllStores(@Query('limit') limit: number = 10, @Query('offset') offset: number = 1, @Request() req) {
    const { stores, total } = await this.storeService.getAllStores(limit, offset, req);

    return {
      stores,
      limit,
      offset, 
      total
    }
  }

  @Get(':id')
  async getStoreById(@Param('id') id: string, @Request() req) {
    const store = await this.storeService.getStoreById(id, req);

    return {
      stores: store
    }
  }

  @Get('state/:state')
  async getStoresByState(@Param('state') state: string, @Query('limit') limit: number = 10, @Query('offset') offset: number = 1, @Request() req) {
    const { stores, total } = await this.storeService.getStoresByState(state, limit, offset, req);

    return {
      stores,
      limit,
      offset,
      total
    }
  }

  // Requisição que retorna fretes e valores nas stores
  @Get('shipping/:postalCode')
  async getStoresShipping(@Param('postalCode') postalCode: string, @Query('limit') limit: number = 10, @Query('offset') offset: number = 1, @Request() req) {
    const { stores, total, pins } = await this.storeService.getStoresShipping(postalCode, limit, offset, req);

    return {
      stores,
      pins,
      limit,
      offset,
      total
    }
  }
}