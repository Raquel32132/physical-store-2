import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { StoreRequestDto } from "../dto/store.dto";
import { StoreService } from "../services/store.service";
import { AddressService } from "../services/address.service";

@Controller('api/v1/store')
export class StoreController {
  constructor(private readonly storeService: StoreService, private readonly addressService: AddressService) {}

  // CRUD
  @Post()
  async createStore(@Body() createStoreDto: StoreRequestDto, @Request() req) {
    const store = await this.storeService.createStore(createStoreDto, req);

    return {
      statusCode: 201,
      message: 'Store created successfully',
      store: store
    }
  }

  @Put(':id')
  async updateStore(@Param('id') id: string, @Body() storeDto: StoreRequestDto, @Request() req) {
    const updatedStore = await this.storeService.updateStore(id, storeDto, req);

    return {
      statusCode: 200,
      message: 'Store updated successfully',
      data: updatedStore
    }
  }

  @Delete(':id')
  async deleteStore(@Param('id') id: string, @Request() req) {
    await this.storeService.deleteStore(id, req);

    return {
      statusCode: 200,
      message: 'Store deleted successfully'
    }
  }


  // Requested enpoints
  @Get()
  async getAllStores(@Query('limit') limit: number = 10, @Query('offset') offset: number = 1, @Request() req) {
    const { stores, total } = await this.storeService.getAllStores(limit, offset, req);

    return {
      statusCode: 200,
      message: 'Stores fetched successfully',
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
      statusCode: 200,
      message: 'Store fetched successfully',
      stores: store
    }
  }

  // @Get('coordinates/:postalCode')
  // async getAddressAndCoordinates(@Param('postalCode') postalCode: string, @Request() req) {
  //   return await this.addressService.getCoordinates(postalCode, req);
  // }
  
}