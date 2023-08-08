import { MantineProvider } from "@mantine/core";
import { ThemeProvider, useAppTheme } from "./utils/theming";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

function MantineRoot() {
    const theme = useAppTheme();

    return (
        <MantineProvider
            withCSSVariables
            withGlobalStyles
            withNormalizeCSS
            theme={theme}
        >
            <Notifications />
            <ModalsProvider>
                <></>
            </ModalsProvider>
        </MantineProvider>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <MantineRoot />
        </ThemeProvider>
    );
}
