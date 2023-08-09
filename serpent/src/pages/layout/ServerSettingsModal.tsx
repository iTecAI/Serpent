import {
    Avatar,
    Badge,
    Card,
    ColorSwatch,
    Group,
    Modal,
    Paper,
    SimpleGrid,
    Stack,
    Switch,
    Text,
} from "@mantine/core";
import { memo, useEffect, useState } from "react";
import { MdExtension } from "react-icons/md";
import { PluginItem } from "../../types/plugin";
import { useApi } from "../../utils/api/api";

const PluginRenderer = memo(
    ({ plugin, update }: { plugin: PluginItem; update: () => void }) => {
        const { post } = useApi();
        const [enabled, setEnabled] = useState(plugin.enabled);
        return (
            <Card p="sm" className="plugin-item">
                <Stack spacing="sm">
                    <Group position="apart">
                        <Group spacing="md">
                            <Avatar
                                src={plugin.icon}
                                alt="Plugin icon"
                                color="gray"
                            />
                            <Text fw={600} size={"lg"}>
                                {plugin.name}
                            </Text>
                        </Group>
                        <Switch
                            checked={enabled}
                            onChange={(event) => {
                                setEnabled(event.target.checked);
                                post<PluginItem>(
                                    `/plugins/${plugin.id}/active`,
                                    { data: { active: event.target.checked } }
                                ).then((result) => result.success && update());
                            }}
                        />
                    </Group>
                    <Text fw={300} color="dimmed">
                        {plugin.description}
                    </Text>
                    <SimpleGrid spacing="sm" cols={2}>
                        {Object.values(plugin.components).map(
                            (component, i) => (
                                <Paper
                                    p={"xs"}
                                    withBorder
                                    key={i}
                                    className="plugin-component"
                                >
                                    <Stack spacing={"sm"}>
                                        <Group position="apart">
                                            <Text fw={500}>
                                                {component.name}
                                            </Text>
                                            <ColorSwatch
                                                size={12}
                                                color={
                                                    component.healthy
                                                        ? "green"
                                                        : "red"
                                                }
                                            />
                                        </Group>
                                        <Text color="dimmed">
                                            {component.description}
                                        </Text>
                                        <Group position="left">
                                            <Badge variant="dot">
                                                {component.type.toLocaleUpperCase()}
                                            </Badge>
                                        </Group>
                                    </Stack>
                                </Paper>
                            )
                        )}
                    </SimpleGrid>
                </Stack>
            </Card>
        );
    }
);

function PluginsCard() {
    const [plugins, setPlugins] = useState<PluginItem[]>([]);
    const { get } = useApi();

    useEffect(() => {
        get<PluginItem[]>("/plugins").then((result) =>
            result.success ? setPlugins(result.value) : setPlugins([])
        );
    }, []);

    return (
        <Card withBorder p="md" className="server-form plugins">
            <Stack spacing="md">
                <Group position="apart">
                    <MdExtension size={24} />
                    <Text fw={600}>Plugins</Text>
                </Group>
                <Paper shadow="md" className="plugin-view" p="sm">
                    <Stack spacing="sm">
                        {plugins.map((plugin, i) => (
                            <PluginRenderer
                                plugin={plugin}
                                key={i}
                                update={() =>
                                    get<PluginItem[]>("/plugins").then(
                                        (result) =>
                                            result.success
                                                ? setPlugins(result.value)
                                                : setPlugins([])
                                    )
                                }
                            />
                        ))}
                    </Stack>
                </Paper>
            </Stack>
        </Card>
    );
}

export function ServerSettingsModal({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
}) {
    return (
        <Modal
            title="Server Settings"
            opened={open}
            onClose={() => setOpen(false)}
            size="xl"
        >
            <Stack spacing="md">
                <PluginsCard />
            </Stack>
        </Modal>
    );
}
