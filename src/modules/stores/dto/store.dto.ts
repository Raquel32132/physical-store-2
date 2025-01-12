import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsString, IsBoolean, IsNumber, IsEnum, IsOptional, IsNotEmpty, Min, Max } from 'class-validator';

export enum StoreType {
  PDV = 'PDV',
  LOJA = 'LOJA',
}

export class StoreRequestDto {
  @ApiProperty({ description: 'Name of the store', type: 'string', example: 'Bolachudos' })
  @IsString()
  @IsNotEmpty()
  storeName: string;

  @ApiProperty({ description: 'If it is possible to take out the item in the store', type: 'boolean', example: true })
  @IsBoolean()
  @IsNotEmpty()
  takeOutInStore: boolean;

  @ApiProperty({ description: 'Shipping time before delivery', type: 'number', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  shippingTimeInDays: number;

  @ApiProperty({ description: 'Type of the store', type: StoreType, example: StoreType.LOJA, enumName: 'StoreType' })
  @IsEnum(StoreType)
  @IsNotEmpty()
  type: StoreType;

  @ApiProperty({ description: 'Telephone number of the store', type: 'string', example: '91234-5678' })
  @IsOptional()
  @IsString()
  telephoneNumber?: string;

  @ApiProperty({ description: 'Email address of the store', type: 'string', example: 'bolachudos@email.com' })
  @IsOptional()
  @IsString()
  emailAddress?: string;

  @ApiProperty({ description: 'Address information of the store', type: 'string', example: 'Rua Santos Carvalho' })
  @IsString()
  @IsNotEmpty()
  address1: string;

  @ApiProperty({ description: 'Address information of the store', type: 'string', example: 'Número 12' })
  @IsOptional()
  @IsString()
  address2?: string;

  @ApiProperty({ description: 'Address information of the store', type: 'string', example: 'APTO 123' })
  @IsOptional()
  @IsString()
  address3?: string;

  @ApiProperty({ description: 'Neighborhood of the store', type: 'string', example: 'Campo Largo' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ description: 'City of the store', type: 'string', example: 'São José' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State that the store resides', type: 'string', example: 'Bahia' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Country of the store', type: 'string', example: 'Brasil' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'Postal code of the store', type: 'string', example: '88080080' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ description: 'Latitude of the store', type: 'number', example: -22.283294 })
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  latitude: number;

  @ApiProperty({ description: 'Longitude of the store', type: 'number', example: -48.124668 })
  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  longitude: number;
}

export class StoreResponseDto {
  @ApiProperty({ description: 'Identificator of the store', type: 'string', example: '6784490d4b4b495e3fceaf9f' })
  @Expose({ name: '_id' })
  @Transform(({ obj }) => obj._id ? obj._id.toString() : null)
  storeID: string;

  @ApiProperty({ description: 'Name of the store', type: 'string', example: 'Bolachudos' })
  @Expose()
  storeName: string;

  @ApiProperty({ description: 'If it is possible to take out the item in the store', type: 'boolean', example: true })
  @Expose()
  takeOutInStore: boolean;

  @ApiProperty({ description: 'Shipping time before delivery', type: 'number', example: 10 })
  @Expose()
  shippingTimeInDays: number;

  @ApiProperty({ description: 'Type of the store', type: StoreType, example: StoreType.LOJA, enumName: 'StoreType' })
  @Expose()
  type: StoreType;

  @ApiProperty({ description: 'Telephone number of the store', type: 'string', example: '91234-5678' })
  @Expose()
  telephoneNumber?: string;

  @ApiProperty({ description: 'Email address of the store', type: 'string', example: 'bolachudos@email.com' })
  @Expose()
  emailAddress?: string;

  @ApiProperty({ description: 'Address information of the store', type: 'string', example: 'Rua Santos Carvalho' })
  @Expose()
  address1: string;

  @ApiProperty({ description: 'Address information of the store', type: 'string', example: 'Número 12' })
  @Expose()
  address2?: string;

  @ApiProperty({ description: 'Address information of the store', type: 'string', example: 'APTO 123' })
  @Expose()
  address3?: string;

  @ApiProperty({ description: 'Neighborhood of the store', type: 'string', example: 'Campo Largo' })
  @Expose()
  neighborhood: string;

  @ApiProperty({ description: 'City of the store', type: 'string', example: 'São José' })
  @Expose()
  city: string;

  @ApiProperty({ description: 'State that the store resides', type: 'string', example: 'Bahia' })
  @Expose()
  state: string;

  @ApiProperty({ description: 'Country of the store', type: 'string', example: 'Brasil' })
  @Expose()
  country: string;

  @ApiProperty({ description: 'Postal code of the store', type: 'string', example: '88080080' })
  @Expose()
  postalCode: string;

  @ApiProperty({ description: 'Latitude of the store', type: 'number', example: -22.283294 })
  @Expose()
  latitude: number;

  @ApiProperty({ description: 'Longitude of the store', type: 'number', example: -48.124668 })
  @Expose()
  longitude: number;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;

  @Exclude()
  __v?: number;
}

class PDVValueDto {
  @ApiProperty({ description: 'Delivery time', type: String, example: '4 dias úteis' })
  prazo: string;

  @ApiProperty({ description: 'Delivery price', type: String, example: 'R$ 42,05' })
  price: string;

  @ApiProperty({ description: 'Type of agency for the delivery', type: String, example: 'Sedex a encomenda expressa dos Correios' })
  description: string;
}

export class PDVStoreDto {
  @ApiProperty({ description: 'Name of the store', type: 'string', example: 'Bolachudos' })
  name: string;

  @ApiProperty({ description: 'City of the store', type: 'string', example: 'São José' })
  city: string;

  @ApiProperty({ description: 'Postal code of the store', type: 'string', example: '88080080' })
  postalCode: string;

  @ApiProperty({ description: 'Type of the store', type: StoreType, example: StoreType.LOJA, enumName: 'StoreType' })
  type: StoreType.PDV;

  @ApiProperty({ description: 'Distance between the store to the postal code informed', type: 'string', example: '2.1 km' })
  distance: string;

  @ApiProperty({ description: 'List of values that contains delivery time, distance and value', type: [PDVValueDto] })
  value: PDVValueDto[];
}

class LOJAValueDto {
  @ApiProperty({ description: 'Delivery time', type: String, example: '4 dias úteis' })
  prazo: string;

  @ApiProperty({ description: 'Correios agency code', type: String, example: '04014' })
  codProdutoAgencia: string;

  @ApiProperty({ description: 'Delivery price', type: String, example: 'R$ 42,05' })
  price: string;

  @ApiProperty({ description: 'Type of agency for the delivery', type: String, example: 'Sedex a encomenda expressa dos Correios' })
  description: string;
}

export class LOJAStoreDto {
  @ApiProperty({ description: 'Name of the store', type: 'string', example: 'Bolachudos' })
  name: string;

  @ApiProperty({ description: 'City of the store', type: 'string', example: 'São José' })
  city: string;

  @ApiProperty({ description: 'Postal code of the store', type: 'string', example: '88080080' })
  postalCode: string;

  @ApiProperty({ description: 'Type of the store', type: StoreType, example: StoreType.LOJA, enumName: 'StoreType' })
  type: StoreType.LOJA;

  @ApiProperty({ description: 'Distance between the store to the postal code informed', type: 'string', example: '2.1 km' })
  distance: string;

  @ApiProperty({ description: 'List of values that contains delivery time, distance, value and Correios agency code', type: [PDVValueDto] })
  value: LOJAValueDto[];
}