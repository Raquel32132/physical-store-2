import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsNumber, IsEnum, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { AddressDto } from './address.dto';

enum StoreType {
  PDV = 'PDV',
  LOJA = 'LOJA',
}

export class CreateStoreDto {
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @IsBoolean()
  @IsNotEmpty()
  takeOutInStore: boolean;

  @IsNumber()
  @IsNotEmpty()
  shippingTimeInDays: number;

  @IsEnum(StoreType)
  @IsNotEmpty()
  type: StoreType;

  @IsOptional()
  @IsString()
  telephoneNumber?: string;

  @IsOptional()
  @IsString()
  emailAddress?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty()
  address: AddressDto;
}
