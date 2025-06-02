import { type IColorSchema } from "./IColorSchema";

export interface IItemSchema {
  slug: string;
  icon?: string;
  name: string;
  sinkPoints: number;
  description: string;
  className: string;
  stackSize: number;
  energyValue: number;
  radioactiveDecay: number;
  liquid: boolean;
  fluidColor: IColorSchema;
}
