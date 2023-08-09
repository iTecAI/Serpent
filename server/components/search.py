from typings import MEDIA_TYPES, PluginMeta, SearchResult, SEARCH_FIELDS, SEARCH_TERMS
from tinydb.table import Table

class SearchComponent:
    id: str
    name: str
    description: str
    media_types: list[MEDIA_TYPES]
    additional_fields: list[SEARCH_FIELDS]

    def __init__(self, plugin_data: PluginMeta, table: Table) -> None:
        self.plugin = plugin_data
        self.table = table
        self.healthy = False

    def search(self, general: str, fields: dict[str, SEARCH_TERMS]) -> list[SearchResult]:
        raise NotImplementedError