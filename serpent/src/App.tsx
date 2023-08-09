import { MantineProvider } from "@mantine/core";
import { ThemeProvider, useAppTheme } from "./utils/theming";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/layout/Layout";
import { ApiProvider } from "./utils/api/provider";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
    },
]);

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
                <RouterProvider router={router} />
            </ModalsProvider>
        </MantineProvider>
    );
}

export default function App() {
    return (
        <ApiProvider>
            <ThemeProvider>
                <MantineRoot />
            </ThemeProvider>
        </ApiProvider>
    );
}
