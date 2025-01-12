import { Exclude, Expose, Transform } from 'class-transformer';
import { IsString, IsBoolean, IsNumber, IsEnum, IsOptional, IsNotEmpty, Min, Max } from 'class-validator';

export enum StoreType {
  PDV = 'PDV',
  LOJA = 'LOJA',
}

export class StoreRequestDto {
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

  @IsString()
  @IsNotEmpty()
  address1: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsOptional()
  @IsString()
  address3?: string;

  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  longitude: number;
}

export class StoreResponseDto {
  @Expose({ name: '_id' })
  @Transform(({ obj }) => obj._id.toString())
  storeID: string;

  @Expose()
  storeName: string;

  @Expose()
  takeOutInStore: boolean;

  @Expose()
  shippingTimeInDays: number;

  @Expose()
  type: StoreType;

  @Expose()
  telephoneNumber?: string;

  @Expose()
  emailAddress?: string;

  @Expose()
  address1: string;

  @Expose()
  address2?: string;

  @Expose()
  address3?: string;

  @Expose()
  neighborhood: string;

  @Expose()
  city: string;

  @Expose()
  state: string;

  @Expose()
  country: string;

  @Expose()
  postalCode: string;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;

  @Exclude()
  createdAt: string;

  @Exclude()
  updatedAt: string;

  @Exclude()
  __v?: number;
}

export class PDVStoreDto {
  name: string;
  city: string;
  postalCode: string;
  type: StoreType.PDV;
  distance: string;
  value: {
    prazo: string;
    price: string;
    description: string;
  }[]
}

export class LOJAStoreDto {
  name: string;
  city: string;
  postalCode: string;
  type: StoreType.LOJA;
  distance: string;
  value: {
    prazo: string;
    codProdutoAgencia: string;
    price: string;
    description: string;
  }[];
}