import type { StateCreator } from "zustand";

export type NotificationSlice = {
  notification: { text: string; error: boolean; show: boolean };
  showNotification: (payload: { text: string; error: boolean }) => void;
  hideNotification: () => void;
};

export const createNotificationSlice: StateCreator<NotificationSlice> = (set, get) => ({
  notification: {
    text: "",
    error: false,
    show: false,
  },

  showNotification: (payload: any) => {
    set({
      notification: {
        text: payload.text,
        error: payload.error,
        show: true,
      },
    });

    setTimeout(() => {
      get().hideNotification();
    }, 3000);
  },

  hideNotification: () => {
    set({
      notification: {
        text: "",
        error: false,
        show: false,
      },
    });
  },
});