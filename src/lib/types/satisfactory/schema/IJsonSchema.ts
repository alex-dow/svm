import { type IBuildingSchema } from "./IBuildingSchema";
import { type IGeneratorSchema } from "./IGeneratorSchema";
import { type IItemSchema } from "./IItemSchema";
import { type IMinerSchema } from "./IMinerSchema";
import { type IAnyRecipeSchema } from "./IRecipeSchema";
import { type IResourceSchema } from "./IResourceSchema";
import { type ISchematicSchema } from "./ISchematicSchema";

export interface IJsonSchema {
  items: Record<string, IItemSchema>;
  recipes: Record<string, IAnyRecipeSchema>;
  schematics: Record<string, ISchematicSchema>;
  generators: Record<string, IGeneratorSchema>;
  resources: Record<string, IResourceSchema>;
  miners: Record<string, IMinerSchema>;
  buildings: Record<string, IBuildingSchema>;
}
