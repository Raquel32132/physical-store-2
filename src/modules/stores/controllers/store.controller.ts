import { Body, Controller, Post, Request } from "@nestjs/common";
import { CreateStoreDto } from "../dto/create-store.dto";
import { StoreService } from "../services/store.service";

@Controller('api/v1/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async createStore(@Body() createStoreDto: CreateStoreDto, @Request() req) {
    return this.storeService.createStore(createStoreDto, req);
  }
}