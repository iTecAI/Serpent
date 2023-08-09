import { MantineThemeOverride } from "@mantine/core";
import { ReactNode, useMemo, useState } from "react";
import { ThemeContext } from "./context";
import { MdVisibilityOff, MdVisibility } from "react-icons/md";

const PRIMARY_COLORS = [
  '#fee6ff',
  '#edb9fb',
  '#da8cf3',
  '#c65eee',
  '#b031e8',
  '#9018ce',
  '#6b12a1',
  '#540c74',
  '#370647',
  '#17011c',
]

export function ThemeProvider({children}: {children?: ReactNode | ReactNode[]}) {
    const [mode, setMode] = useState<"dark" | "light">("dark");
    const derivedTheme = useMemo<MantineThemeOverride>(
        () => ({
            colorScheme: mode,
            colors: {
                primary: PRIMARY_COLORS as any,
            },
            primaryColor: "primary",
            primaryShade: { light: 3, dark: 6 },
            components: {
                PasswordInput: {
                    defaultProps: {
                        visibilityToggleIcon: ({
                            reveal,
                            size,
                        }: {
                            reveal: boolean;
                            size: number | string;
                        }) =>
                            reveal ? (
                                <MdVisibilityOff size={size} />
                            ) : (
                                <MdVisibility size={size} />
                            ),
                    },
                },
            },
        }),
        [mode]
    );

    return <ThemeContext.Provider value={{
        theme: derivedTheme,
        mode, setMode
    }}>
        {children}
    </ThemeContext.Provider>
}