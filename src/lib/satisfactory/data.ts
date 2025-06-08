import data10 from '@/lib/satisfactory/data1.0.json';
export const { buildings,generators,items,miners,recipes,resources,schematics } = data10;

export const itemsArray = Object.values(data10.items);

export type ItemType = keyof typeof data10.items;
