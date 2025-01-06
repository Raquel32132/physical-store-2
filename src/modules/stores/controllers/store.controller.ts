import { Body, Controller, Post, Request } from "@nestjs/common";
import { CreateStoreDto } from "../dto/create-store.dto";
import { StoreService } from "../services/store.service";
import { plainToClass } from "class-transformer";

@Controller('api/v1/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async createStore(@Body() createStoreDto: CreateStoreDto, @Request() req) {
    const store = await this.storeService.createStore(createStoreDto, req);
    const transformedStore = plainToClass(CreateStoreDto, store, { excludeExtraneousValues: true });

    return {
      statusCode: 201,
      message: 'Store created successfully',
      data: transformedStore
    }
  }
}