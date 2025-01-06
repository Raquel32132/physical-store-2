import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsNumber, IsEnum, IsOptional, ValidateNested } from 'class-validator';
import { AddressDto } from './address.dto';

export class CreateStoreDto {
  @IsString()
  storeName: string;

  @IsBoolean()
  takeOutInStore: boolean;

  @IsNumber()
  shippingTimeInDays: number;

  @IsEnum(['PDV', 'LOJA'])
  type: string;

  @IsOptional()
  @IsString()
  telephoneNumber?: string;

  @IsOptional()
  @IsString()
  emailAddress?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  address?: AddressDto;
}
