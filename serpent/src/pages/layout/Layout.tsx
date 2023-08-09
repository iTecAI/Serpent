import {
    ActionIcon,
    AppShell,
    Box,
    Button,
    Group,
    Header,
    Title,
} from "@mantine/core";
import { useColorMode } from "../../utils/theming";
import { GiSnake } from "react-icons/gi";
import { MdDarkMode, MdLightMode, MdLogout } from "react-icons/md";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { AccountProvider, useAccount } from "../../utils/account";
import { useEffect } from "react";

function LayoutHeader() {
    const [mode, setMode] = useColorMode();
    const { user, logout } = useAccount();
    const nav = useNavigate();
    const loc = useLocation();

    useEffect(() => {
        if (!user && loc.pathname !== "/login") {
            nav("/login");
        }
    });

    return (
        <Header height={60} p="xs" className="app-header">
            <Group position="apart">
                <Group spacing="md" className="app-brand">
                    <GiSnake size={24} className="logo" />
                    <Title order={3} className="app-name">
                        Serpent
                    </Title>
                </Group>
                <Group spacing="md">
                    <ActionIcon
                        onClick={() =>
                            setMode(mode === "dark" ? "light" : "dark")
                        }
                        variant={mode === "dark" ? "light" : "gradient"}
                    >
                        {mode === "dark" ? <MdLightMode /> : <MdDarkMode />}
                    </ActionIcon>
                    {user && (
                        <Button
                            leftIcon={<MdLogout size={16} />}
                            onClick={() => logout()}
                        >
                            Log Out
                        </Button>
                    )}
                </Group>
            </Group>
        </Header>
    );
}

export function Layout() {
    return (
        <AccountProvider>
            <AppShell
                className="serpent-app"
                padding="md"
                header={<LayoutHeader />}
                styles={(theme) => ({
                    main: {
                        backgroundColor:
                            theme.colorScheme === "dark"
                                ? theme.colors.dark[8]
                                : theme.colors.gray[0],
                    },
                })}
            >
                <Box className="app-container" p="md">
                    <Outlet />
                </Box>
            </AppShell>
        </AccountProvider>
    );
}
