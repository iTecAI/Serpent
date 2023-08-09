from typings import MEDIA_TYPES, PluginMeta, SearchResult, MetadataResult, DOWNLOAD_TYPES, DownloadResult, DownloadStatus
from tinydb.table import Table

class DownloadComponent:
    id: str
    name: str
    description: str
    media_types: list[MEDIA_TYPES]
    download_types: list[DOWNLOAD_TYPES]

    def __init__(self, plugin_data: PluginMeta, table: Table) -> None:
        self.plugin = plugin_data
        self.table = table
        self.healthy = False

    def download(self, resource: SearchResult) -> DownloadResult:
        raise NotImplementedError
    
    def download_status(self, id: str) -> DownloadStatus:
        raise NotImplementedError