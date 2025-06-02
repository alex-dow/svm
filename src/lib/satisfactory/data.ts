import { IItemSchema } from "@/lib/types/satisfactory/schema/IItemSchema";

// TODO should store this into indexeddb I guess
let items: Record<string, IItemSchema> | null = null;
let itemsArray: IItemSchema[] | null = null;

export const refreshSatisfactoryData = async () => {
    const res = await fetch("/data/data1.0.json");
    const data = await res.json();        
    items = data.items;
    itemsArray = Object.values(data.items);
}

export const getSatisfactoryItems = async (): Promise<Record<string, IItemSchema>> => {
    if (items == null) {
        await refreshSatisfactoryData();
    }
    return items as Record<string, IItemSchema>;
}

export const getSatisfactoryItemsArray = async (): Promise<IItemSchema[]> => {
    if (itemsArray == null) {
        await refreshSatisfactoryData();
    }
    return itemsArray as IItemSchema[]
}




/**
 * Provides all satisfactory data and utils for refreshing this data
 *
export const useSatisfactoryStore = defineStore("satisfactory-store", () => {
  const items = shallowRef<Record<string, IItemSchema> | null>(null);

  const refresh = async () => {
    const res = await fetch("/data/data1.0.json");
    const data = await res.json();
    items.value = data.items;
  };

  const basicItems = computed<BasicItem[]>(() => {
    if (items.value == null) {
      return [];
    }

    return Object.values(items.value)
      .map((item) => {
        return { id: item.className, name: item.name, icon: item.icon };
      })
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
  });

  const itemIcons = computed(() => {
    if (items.value == null) {
      return {};
    }
    return Object.values(items.value).reduce(
      (a, item) => {
        a[item.className] = item.icon;
        return a;
      },
      {} as Record<string, string | undefined>,
    );
  });

  const itemNames = computed(() => {
    if (items.value == null) {
      return {};
    }
    return Object.values(items.value).reduce(
      (a, item) => {
        a[item.className] = item.name;
        return a;
      },
      {} as Record<string, string | undefined>,
    );
  });

  return { items, refresh, basicItems, itemIcons, itemNames };
});
*/