from typings import PluginMeta, COMPONENT_TYPES
from components import *
import os
import importlib.util
from tinydb import TinyDB
from litestar.types import Logger
from typing import TypedDict, TypeVar, Generic
import json

REQUIRED_KEYS = ["id", "name", "description", "iconPath", "components"]

T = TypeVar("T", SearchComponent, MetadataComponent, DownloadComponent)
class ComponentEntry(TypedDict, Generic[T]):
    plugin: str
    type: str
    id: str
    component: T

class PluginItem(TypedDict):
    id: str
    icon_path: str
    metadata: PluginMeta
    components: dict[str, ComponentEntry]

class Plugins:
    def __init__(self, path: str, database: TinyDB):
        self.path = path
        self.db = database
        self.plugins: dict[str, PluginItem] = {}

    def load_plugins(self, logger: Logger):
        self.plugins: dict[str, PluginItem] = {}
        for folder in os.listdir(self.path):
            if not "plugin.json" in os.listdir(os.path.join(self.path, folder)):
                logger.warning(f"Plugin folder {folder} does not have a plugin.json file.")
                continue

            with open(os.path.join(self.path, folder, "plugin.json"), "r") as metafile:
                try:
                    plugin_metadata: PluginMeta = json.load(metafile)
                except:
                    logger.warning(f"Plugin folder {folder} contains an invalid plugin.json file.")
                    continue
            
            valid = True
            for required_key in REQUIRED_KEYS:
                if not required_key in plugin_metadata.keys():
                    valid = False
                    logger.warning(f"Plugin folder {folder} contains an invalid plugin.json file: missing key {required_key}")
            if not valid:
                continue

            loaded_components = {}
            for component_type, components in plugin_metadata["components"].items():
                for component in components:
                    path, comp = component.split(":")
                    module_name = f"plugins.{plugin_metadata['id']}.{os.path.splitext(os.path.split(path)[1])[0]}"
                    try:
                        spec = importlib.util.spec_from_file_location(module_name, os.path.join(self.path, folder, path))
                        module = importlib.util.module_from_spec(spec)
                        spec.loader.exec_module(module)
                        component_class = getattr(module, comp)
                        loaded_components[component_class.id] = {
                            "plugin": plugin_metadata["id"],
                            "id": component_class.id,
                            "type": component_type,
                            "component": component_class(plugin_metadata, self.db.table("plugin." + plugin_metadata["id"] + "." + component_type))
                        }
                    except:
                        logger.exception(f"Failed to load {comp} from {path} in plugin {plugin_metadata['id']}")

            self.plugins[plugin_metadata["id"]] = {
                "id": plugin_metadata["id"],
                "icon_path": os.path.join(self.path, folder, plugin_metadata["iconPath"]),
                "metadata": plugin_metadata,
                "components": loaded_components
            }
            logger.info(f"Loaded plugin {plugin_metadata['id']}")

    def plugin(self, id: str) -> PluginItem:
        return self.plugins[id]
            
            