import { Body, Controller, Post } from "@nestjs/common";
import { CreateStoreDto } from "../dto/create-store.dto";


@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }
}