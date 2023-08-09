from typings import MEDIA_TYPES, PluginMeta, SearchResult, MetadataResult
from tinydb.table import Table

class MetadataComponent:
    media_types: list[MEDIA_TYPES]

    def __init__(self, plugin_data: PluginMeta, table: Table) -> None:
        self.plugin = plugin_data
        self.table = table
        self.healthy = False

    def get_metadata(self, resource: SearchResult) -> list[MetadataResult]:
        raise NotImplementedError