import { type IItemAmountSchema } from "./IItemAmountSchema";

export interface ISchematicSchema {
  className: string;
  type: string;
  name: string;
  slug: string;
  icon?: string;
  cost: IItemAmountSchema[];
  unlock: ISchematicUnlockSchema;
  requiredSchematics: string[];
  tier: number;
  time: number;
  mam: boolean;
  alternate: boolean;
}

export interface ISchematicUnlockSchema {
  recipes: string[];
  scannerResources: string[];
  inventorySlots: number;
  giveItems: IItemAmountSchema[];
}
