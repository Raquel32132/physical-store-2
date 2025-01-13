import { Body, Controller, Delete, Get, Param, Post, Put, Query, Request } from "@nestjs/common";
import { LOJAStoreDto, PDVStoreDto, StoreRequestDto, StoreResponseDto } from "../dto/store.dto";
import { StoreService } from "../services/store.service";
import { ApiBody, ApiExtraModels, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";

@ApiTags('store')
@Controller('api/v1/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  // CRUD
  @Post()
  @ApiOperation({ summary: 'Create a store' })
  @ApiResponse({ status: 200, description: 'Store created successfully', type: StoreResponseDto })
  @ApiResponse({ status: 500, description: 'Error creating store' })
  @ApiBody({ type: StoreRequestDto })
  async createStore(@Body() createStoreDto: StoreRequestDto, @Request() req) {
    const store = await this.storeService.createStore(createStoreDto, req);

    return {
      store: store
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a store with the ID passed' })
  @ApiResponse({ status: 200, description: 'Store updated successfully', type: StoreResponseDto })
  @ApiResponse({ status: 500, description: 'Error updating store' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID of the store to update', example: '677c0fe604e90373e571054e' })
  @ApiBody({ type: StoreRequestDto })
  async updateStore(@Param('id') id: string, @Body() storeDto: StoreRequestDto, @Request() req) {
    const updatedStore = await this.storeService.updateStore(id, storeDto, req);

    return {
      data: updatedStore
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a store with the ID passed' })
  @ApiResponse({ status: 200, description: 'Store deleted successfully'})
  @ApiResponse({ status: 500, description: 'Error deleting store' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID of the store to delete', example: '677c0fe604e90373e571054e' })
  async deleteStore(@Param('id') id: string, @Request() req) {
    await this.storeService.deleteStore(id, req);
  }

  // Endpoints requisitadas
  @Get()
  @ApiOperation({ summary: 'List all stores' })
  @ApiResponse({ status: 200, description: 'All stores fetched successfully', 
    schema: { type: 'object', properties: {
      stores: {
        type: 'array',
        items: { $ref: getSchemaPath(StoreResponseDto) }
      },
      limit: { type: 'number', example: 10 },
      offset: { type: 'number', example: 1 },
      total: { type: 'number', example: 100 },
    }}
  })
  @ApiResponse({ status: 500, description: 'Error fetching all stores' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Amount of items to be listed per page', example: 10 })
  @ApiQuery({ name: 'offset', type: Number, required: false, description: 'Amount of items to skip before starting to list', example: 1 })
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
  @ApiOperation({ summary: 'List the store of with the ID passed' })
  @ApiResponse({ status: 200, description: 'Store with ID fetched successfully', schema: { type: 'object', properties: {
    stores: { type: 'object', $ref: getSchemaPath(StoreResponseDto) }
  }}})
  @ApiResponse({ status: 500, description: 'Error fetching store with ID passed' })
  @ApiParam({ name: 'id', type: 'string', description: 'ID of the store to fetch', example: '677c0fe604e90373e571054e' })
  async getStoreById(@Param('id') id: string, @Request() req) {
    const store = await this.storeService.getStoreById(id, req);

    return {
      stores: store
    }
  }

  @Get('state/:state')
  @ApiOperation({ summary: 'List all stores within state passed' })
  @ApiResponse({ status: 200, description: 'All stores within state passed fetched successfully', 
    schema: { type: 'object', properties: {
      stores: {
        type: 'array',
        items: { $ref: getSchemaPath(StoreResponseDto) }
      },
      limit: { type: 'number', example: 10 },
      offset: { type: 'number', example: 1 },
      total: { type: 'number', example: 100 },
    }}
  })
  @ApiResponse({ status: 500, description: 'Error fetching all stores within state passed' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Amount of items to be listed per page', example: 10 })
  @ApiQuery({ name: 'offset', type: Number, required: false, description: 'Amount of items to skip before starting to list', example: 1 })
  @ApiParam({ name: 'state', type: 'string', description: 'State of the stores do be listed', example: 'Rio de Janeiro' })
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
  @ApiOperation({ summary: 'List all stores with shipping information to the postal code passed' })
  @ApiResponse({ status: 200, description: 'All stores with shipping information fetched successfully', 
    schema: { type: 'object', properties: {
      stores: {
        type: 'array',
        items: { 
          oneOf: [
            { $ref: getSchemaPath(PDVStoreDto) },
            { $ref: getSchemaPath(LOJAStoreDto) },
          ],
        }
      },
      pins: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            position: {
              type: 'object',
              properties: {
                lat: { type: 'number', example: -27.8917272 },
                lng: { type: 'number', example: -48.5898012 }
              }
            },
            title: { type: 'string', example: 'Fazenda Store' }
          }
        }
      },
      limit: { type: 'number', example: 10 },
      offset: { type: 'number', example: 1 },
      total: { type: 'number', example: 100 },
    }}
  })
  @ApiExtraModels(PDVStoreDto, LOJAStoreDto)
  @ApiResponse({ status: 500, description: 'Error fetching all stores with shipping information' })
  @ApiQuery({ name: 'limit', type: Number, required: false, description: 'Amount of items to be listed per page', example: 10 })
  @ApiQuery({ name: 'offset', type: Number, required: false, description: 'Amount of items to skip before starting to list', example: 1 })
  @ApiParam({ name: 'postalCode', type: 'string', description: 'Postal code reference to delivery the item', example: '88080080' })
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