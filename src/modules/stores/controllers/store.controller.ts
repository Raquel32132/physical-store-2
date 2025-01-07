import { Body, Controller, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { StoreDto } from "../dto/store.dto";
import { StoreService } from "../services/store.service";

@Controller('api/v1/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async createStore(@Body() createStoreDto: StoreDto, @Request() req) {
    const store = await this.storeService.createStore(createStoreDto, req);

    return {
      statusCode: 201,
      message: 'Store created successfully',
      data: store
    }
  }

  @Get()
  async getAllStores(@Query('limit') limit: number = 10, @Query('offset') offset: number = 0, @Request() req, ) {
    const { stores, total } = await this.storeService.getAllStores(limit, offset, req);

    return {
      statusCode: 200,
      message: 'Stores fetched successfully',
      data: {
        stores,
        limit,
        offset, 
        total
      }
    }
  }

  @Put(':id')
  async updateStore(@Param('id') id: string, @Body() storeDto: StoreDto, @Request() req) {
    const updatedStore = await this.storeService.updateStore(id, storeDto, req);

    return {
      statusCode: 200,
      message: 'Store updated successfully',
      data: updatedStore
    }
  }

  @Get(':id')
  async getStoreById(@Param('id') id: string, @Request() req ) {
    const store = await this.storeService.getStoreById(id, req);

    return {
      statusCode: 200,
      message: 'Store fetched successfully',
      data: store
    }
  }

}