import { Exclude, Expose, Type } from 'class-transformer';
import { IsString, IsBoolean, IsNumber, IsEnum, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { AddressDto } from './address.dto';

enum StoreType {
  PDV = 'PDV',
  LOJA = 'LOJA',
}

export class CreateStoreDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @Expose()
  @IsBoolean()
  @IsNotEmpty()
  takeOutInStore: boolean;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  shippingTimeInDays: number;

  @Expose()
  @IsEnum(StoreType)
  @IsNotEmpty()
  type: StoreType;

  @Expose()
  @IsOptional()
  @IsString()
  telephoneNumber?: string;

  @Expose()
  @IsOptional()
  @IsString()
  emailAddress?: string;

  @Expose()
  @ValidateNested()
  @Type(() => AddressDto)
  @IsNotEmpty()
  address: AddressDto;

  @Exclude()
  _id?: string;

  @Exclude()
  createdAt?: string;

  @Exclude()
  updatedAt?: string;

  @Exclude()
  __v?: number;
}
