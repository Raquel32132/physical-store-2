import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Address {
  @Prop({ required: true, trim: true })
  address1: string;

  @Prop({ trim: true })
  address2: string;

  @Prop({ trim: true })
  address3: string;

  @Prop({ required: true, trim: true })
  neighborhood: string;

  @Prop({ required: true, trim: true })
  city: string;

  @Prop({ required: true, trim: true })
  state: string;

  @Prop({ required: true, trim: true })
  country: string;

  @Prop({ required: true, trim: true })
  postalCode: string;

  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

@Schema({ timestamps: true })
export class Store extends Document {
  @Prop({ required: true, trim: true })
  storeName: string;

  @Prop({ required: true })
  takeOutInStore: boolean;

  @Prop({ required: true })
  shippingTimeInDays: number;

  @Prop({ required: true, enum: ['PDV', 'LOJA'] })
  type: string

  @Prop({ trim: true })
  telephoneNumber: string;

  @Prop({ trim: true })
  emailAddress: string;

  @Prop({ type: Address, required: true })
  address: Address;
}

export const StoreSchema = SchemaFactory.createForClass(Store);