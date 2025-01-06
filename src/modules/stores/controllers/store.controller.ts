import { Body, Controller, Post } from "@nestjs/common";
import { CreateStoreDto } from "../dto/create-store.dto";
import { StoreService } from "../services/store.service";

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    try {
      return this.storeService.create(createStoreDto);
    } catch (error) {
      throw new Error(`Error creating new store: ${error.message}`);
    }
  }
}