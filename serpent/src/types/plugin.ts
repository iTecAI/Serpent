export type ComponentType = "search" | "metadata" | "download";

export type PluginComponent = {
    id: string;
    type: ComponentType;
    name: string;
    description: string;
    healthy: boolean;
};

export type PluginItem = {
    id: string;
    name: string;
    description: string;
    icon: string;
    components: { [key: string]: PluginComponent };
    enabled: boolean;
};
