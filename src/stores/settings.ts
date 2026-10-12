import { create } from "zustand";
import { persist } from "zustand/middleware";

type SettingsState = {
  // show "Sexy move" instead of R U R' U' (etc.) in algs
  triggerNames: boolean;
  setTriggerNames: (on: boolean) => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      triggerNames: false,
      setTriggerNames: (triggerNames) => set({ triggerNames }),
    }),
    { name: "cfop-settings" },
  ),
);
