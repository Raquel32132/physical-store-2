import { Expose } from 'class-transformer';
import { IsString, IsOptional, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class AddressDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  address1: string;

  @Expose()
  @IsOptional()
  @IsString()
  address2?: string;

  @Expose()
  @IsOptional()
  @IsString()
  address3?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  city: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  state: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  country: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(-90)
  @Max(90)
  latitude: number;

  @Expose()
  @IsNumber()
  @IsNotEmpty()
  @Min(-180)
  @Max(180)
  longitude: number;
}
