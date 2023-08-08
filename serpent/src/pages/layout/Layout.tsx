import { ActionIcon, AppShell, Group, Header, Title } from "@mantine/core";
import { useColorMode } from "../../utils/theming";
import { GiSnake } from "react-icons/gi";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { Outlet } from "react-router-dom";
import "./style.scss";

export function Layout() {
    const [mode, setMode] = useColorMode();
    return (
        <AppShell
            className="serpent-app"
            padding="md"
            header={
                <Header height={48} p="xs" className="app-header">
                    <Group position="apart">
                        <Group spacing="md">
                            <GiSnake size={24} className="logo" />
                            <Title order={3} className="app-name">
                                Serpent
                            </Title>
                        </Group>
                        <ActionIcon
                            onClick={() =>
                                setMode(mode === "dark" ? "light" : "dark")
                            }
                            variant={mode === "dark" ? "light" : "gradient"}
                        >
                            {mode === "dark" ? <MdLightMode /> : <MdDarkMode />}
                        </ActionIcon>
                    </Group>
                </Header>
            }
            styles={(theme) => ({
                main: {
                    backgroundColor:
                        theme.colorScheme === "dark"
                            ? theme.colors.dark[8]
                            : theme.colors.gray[0],
                },
            })}
        >
            <Outlet />
        </AppShell>
    );
}
