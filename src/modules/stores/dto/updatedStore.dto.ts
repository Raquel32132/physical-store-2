import { PartialType } from "@nestjs/swagger";
import { StoreDto } from "./store.dto";


export class UpdatedStoreDto extends PartialType(StoreDto) {}