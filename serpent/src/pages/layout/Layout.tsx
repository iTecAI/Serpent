import {
    ActionIcon,
    AppShell,
    Box,
    Group,
    Header,
    Menu,
    Title,
} from "@mantine/core";
import { useColorMode } from "../../utils/theming";
import { GiSnake } from "react-icons/gi";
import {
    MdAccountCircle,
    MdDarkMode,
    MdDownload,
    MdLightMode,
    MdLogout,
    MdSettings,
} from "react-icons/md";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import "./style.scss";
import { AccountProvider, useAccount } from "../../utils/account";
import { useEffect, useState } from "react";
import { AccountManagementModal } from "./AccountSettingsModal";

function LayoutHeader() {
    const [mode, setMode] = useColorMode();
    const { user, logout } = useAccount();
    const [editingUser, setEditingUser] = useState(false);
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
                        <Menu
                            shadow="md"
                            width={200}
                            trigger="hover"
                            position="bottom-end"
                        >
                            <Menu.Target>
                                <ActionIcon
                                    radius="xl"
                                    variant={
                                        mode === "dark" ? "light" : "gradient"
                                    }
                                >
                                    <MdAccountCircle />
                                </ActionIcon>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Label>Account</Menu.Label>
                                <Menu.Item icon={<MdDownload size={16} />}>
                                    Downloads
                                </Menu.Item>
                                <Menu.Item
                                    icon={<MdSettings size={16} />}
                                    onClick={() => setEditingUser(true)}
                                >
                                    Account Settings
                                </Menu.Item>
                                <Menu.Item
                                    icon={<MdLogout size={16} />}
                                    onClick={logout}
                                >
                                    Log Out
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    )}
                </Group>
            </Group>
            <AccountManagementModal
                open={editingUser}
                setOpen={setEditingUser}
            />
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
