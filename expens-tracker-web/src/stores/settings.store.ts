import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SettingsState {
    currency: string;
    dateFormat: string;
    startDay: string;
    alertThreshold: number;
    darkMode: boolean;
    hideBalances: boolean;

    updateSetting: (settings: Partial<Omit<SettingsState, "updateSetting">>) => void;
}
export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            currency: "BRL",
            dateFormat: "DD/MM/YYYY",
            startDay: "1",
            alertThreshold: 80,
            darkMode: false,
            hideBalances: false,

            updateSetting: (newSettings) => set((state) => ({ ...state, ...newSettings })),
        }),
        {
            name: "expense-tracker-settings"
        }

    )
);