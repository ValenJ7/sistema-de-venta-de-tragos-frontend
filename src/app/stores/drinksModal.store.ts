import type { StateCreator } from "zustand";

export type DrinksModalSlice = {
  modal: boolean;
  selectedDrink: any | null;
  openDrinkModal: (data: any) => void;
  closeDrinkModal: () => void;
};

export const createDrinksModalSlice: StateCreator<DrinksModalSlice> = (set) => ({
  modal: false,
  selectedDrink: null,

  openDrinkModal: (data: any) => {
    set({
      modal: true,
      selectedDrink: data,
    });
  },

  closeDrinkModal: () => {
    set({
      modal: false,
      selectedDrink: null,
    });
  },
});