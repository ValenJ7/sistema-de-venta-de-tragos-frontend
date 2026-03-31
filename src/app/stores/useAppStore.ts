import { create } from "zustand";
import { createDrinksModalSlice, type DrinksModalSlice } from "./drinksModal.store";
import { createNotificationSlice, type NotificationSlice } from "./ui.store";
import { createAuthSlice, type AuthSlice } from "./auth.store";

type AppStore = AuthSlice & DrinksModalSlice & NotificationSlice;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createAuthSlice(...a),
  ...createDrinksModalSlice(...a),
  ...createNotificationSlice(...a),
}));
