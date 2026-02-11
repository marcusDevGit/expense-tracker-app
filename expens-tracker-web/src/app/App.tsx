import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settings.store";
import "../styles/App.css";
import { AppRoutes } from "./router";

export function App() {
  const darkMode = useSettingsStore((state) => state.darkMode);

  useEffect(() => {
    const root = window.document.documentElement;

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);
  return <AppRoutes />;
}
