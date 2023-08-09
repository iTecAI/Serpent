from typings import MEDIA_TYPES, PluginMeta, SearchResult, SEARCH_FIELDS, SEARCH_TERMS

class SearchComponent:
    media_types: list[MEDIA_TYPES]
    additional_fields: list[SEARCH_FIELDS]

    def __init__(self, plugin_data: PluginMeta) -> None:
        self.plugin = plugin_data

    def search(self, general: str, fields: dict[str, SEARCH_TERMS]) -> list[SearchResult]:
        raise NotImplementedError