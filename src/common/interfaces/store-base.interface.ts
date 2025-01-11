import { StoreType } from "src/modules/stores/dto/store.dto";

export interface StoreBaseProps {
  name: string;
  city: string;
  postalCode: string;
  type: StoreType;
  distance: string;
  value: any[];
}