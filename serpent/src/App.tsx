import { MantineProvider } from "@mantine/core";
import { ThemeProvider, useAppTheme } from "./utils/theming";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout } from "./pages/layout/Layout";
import { ApiProvider } from "./utils/api/provider";
import { LoginPage } from "./pages/login/Login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
        ],
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
            <Notifications autoClose={5000} />
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
