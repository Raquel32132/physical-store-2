import { IsString, IsOptional, IsNumber } from 'class-validator';

export class AddressDto {
  @IsString()
  address1: string;

  @IsOptional()
  @IsString()
  address2?: string;

  @IsOptional()
  @IsString()
  address3?: string;

  @IsString()
  neighborhood: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  country: string;

  @IsString()
  postalCode: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;
}
