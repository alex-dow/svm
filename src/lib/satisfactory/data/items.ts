import items from "./items.json";

export type Item = {
  className: string;
  name: string;
  description: string;
  unlockedBy: string;
  stackSize: number;
  energy: number;
  radioactive: number;
  canBeDiscarded: boolean;
  sinkPoints: number;
  abbreviation: string | null;
  form: "solid" | "liquid" | "gas";
  fluidColor: string;
  alienItem: boolean;
  stable: boolean;
  experimental: boolean;
};

export function getItems(): Item[] {
  return Object.values(items).flat() as Item[];
}

// Cached alphabetically sorted items list
let cachedSortedItems: Item[] | null = null;

export function getSortedItems(): Item[] {
  if (cachedSortedItems === null) {
    const allItems = getItems();
    cachedSortedItems = [...allItems].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }
  return cachedSortedItems;
}
