import { MantineThemeOverride } from "@mantine/core";
import { createContext, useContext } from "react";

export type ThemeContextType = {
    theme: MantineThemeOverride;
    mode: "dark" | "light";
    setMode: (mode: "dark" | "light") => void;
};

export const ThemeContext = createContext<ThemeContextType>(null as any);

export function useColorMode(): [
    "dark" | "light",
    (mode: "dark" | "light") => void
] {
    const { mode, setMode } = useContext(ThemeContext);
    return [mode, setMode];
}

export function useAppTheme(): MantineThemeOverride {
    const { theme } = useContext(ThemeContext);
    return theme;
}
