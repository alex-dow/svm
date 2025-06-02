// based on the data from
// https://factoriolab.github.io/data/sfy/data.json

export interface BasicItem {
  id: string;
  name: string;
  icon?: string;
}

export interface Recipe {
  id: string;
  name: string;
  producers: string[];
  time: number;
  cost: number;
  out: object;
  in: object;
  category: string;
  flags: string[];
}

export interface Item {
  category: string;
  id: string;
  name: string;
  row: number;
  stack: number;
}

export interface Icon {
  id: string;
  position: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Defaults {
  minBelt: string;
  maxBelt: string;
  minPipe: string;
  maxPipe: string;
  cargoWagon: string;
  fluidWagon: string;
  excludedRecipes: string[];
  minMachineRank: string[];
  maxMachineRank: string[];
  moduleRank: string[];
  fuelRank: string[];
}

export interface Limitations {
  minig: string[];
  somersloop: string[];
}

