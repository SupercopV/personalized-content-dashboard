import { useAppDispatch, useAppSelector } from "@/store";
import { setTheme } from "@/store/slices/preferencesSlice";

export function useTheme() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.preferences.theme);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    dispatch(setTheme(nextTheme));
  };

  const setAppTheme = (newTheme: "light" | "dark" | "system") => {
    dispatch(setTheme(newTheme));
  };

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme,
    setAppTheme,
  };
}
