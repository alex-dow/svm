import {
  type IBuildingMetadataSchema,
  type IManufacturerAnyPowerMetadataSchema,
} from "./IBuildingMetadataSchema";
import { type ISizeSchema } from "./ISizeSchema";

export interface IBuildingSchema {
  slug: string;
  icon?: string;
  name: string;
  description: string;
  className: string;
  categories: string[];
  buildMenuPriority: number;
  metadata: IBuildingMetadataSchema;
  size: ISizeSchema;
}

export interface IManufacturerSchema extends IBuildingSchema {
  metadata: IManufacturerAnyPowerMetadataSchema;
}
