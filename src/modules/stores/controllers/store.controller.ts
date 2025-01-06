import { Body, Controller, Get, Post, Query, Request } from "@nestjs/common";
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
}