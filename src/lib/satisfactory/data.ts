export { buildings,generators,items,miners,recipes,resources,schematics } from '@/lib/satisfactory/data1.0.json';
import { items } from '@/lib/satisfactory/data1.0.json';

export const itemsArray = Object.values(items);

export type ItemType = keyof typeof items;
