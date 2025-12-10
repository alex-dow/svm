import { expect, test, describe, vi } from "vitest";

// Mock the items.json import - must be hoisted before imports
vi.mock("../../../../src/lib/satisfactory/data/items.json", () => {
  return {
    default: require("./__fixtures__/items.json"),
  };
});

import {
  getItems,
  getSortedItems,
  type Item,
} from "../../../../src/lib/satisfactory/data/items";

describe("getItems", () => {
  test("returns an array of items", () => {
    const items = getItems();
    expect(Array.isArray(items)).toBe(true);
  });

  test("returns all items from the JSON", () => {
    const items = getItems();
    expect(items.length).toBeGreaterThan(0);
    // Using dummy data with 5 items
    expect(items.length).toBe(5);
  });

  test("returns items with correct structure", () => {
    const items = getItems();
    const firstItem = items[0];

    expect(firstItem).toHaveProperty("className");
    expect(firstItem).toHaveProperty("name");
    expect(firstItem).toHaveProperty("description");
    expect(firstItem).toHaveProperty("form");
    expect(firstItem).toHaveProperty("stackSize");
    expect(firstItem).toHaveProperty("sinkPoints");
  });

  test("returns items with valid form values", () => {
    const items = getItems();
    const validForms = ["solid", "liquid", "gas"];

    items.forEach((item) => {
      expect(validForms).toContain(item.form);
    });
  });

  test("returns unique items", () => {
    const items = getItems();
    const classNames = items.map((item) => item.className);
    const uniqueClassNames = new Set(classNames);

    expect(uniqueClassNames.size).toBe(items.length);
  });
});

describe("getSortedItems", () => {
  test("returns an array of items", () => {
    const items = getSortedItems();
    expect(Array.isArray(items)).toBe(true);
  });

  test("returns items sorted alphabetically by name", () => {
    const items = getSortedItems();

    for (let i = 1; i < items.length; i++) {
      const prevName = items[i - 1].name;
      const currentName = items[i].name;
      expect(prevName.localeCompare(currentName)).toBeLessThanOrEqual(0);
    }
  });

  test("returns all items", () => {
    const sortedItems = getSortedItems();
    const allItems = getItems();

    expect(sortedItems.length).toBe(allItems.length);
  });

  test("contains the same items as getItems", () => {
    const sortedItems = getSortedItems();
    const allItems = getItems();

    const sortedClassNames = new Set(sortedItems.map((item) => item.className));
    const allClassNames = new Set(allItems.map((item) => item.className));

    expect(sortedClassNames.size).toBe(allClassNames.size);
    sortedClassNames.forEach((className) => {
      expect(allClassNames).toContain(className);
    });
  });

  test("caches the sorted list", () => {
    // Get the sorted items twice
    const firstCall = getSortedItems();
    const secondCall = getSortedItems();

    // Should return the same array reference (cached)
    expect(firstCall).toBe(secondCall);
  });

  test("first item is alphabetically first", () => {
    const items = getSortedItems();
    const allItems = getItems();

    // Find the alphabetically first item
    const alphabeticallyFirst = [...allItems].sort((a, b) =>
      a.name.localeCompare(b.name)
    )[0];

    expect(items[0].name).toBe(alphabeticallyFirst.name);
  });

  test("last item is alphabetically last", () => {
    const items = getSortedItems();
    const allItems = getItems();

    // Find the alphabetically last item
    const alphabeticallyLast = [...allItems].sort((a, b) =>
      a.name.localeCompare(b.name)
    )[allItems.length - 1];

    expect(items[items.length - 1].name).toBe(alphabeticallyLast.name);
  });
});
