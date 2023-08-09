from .search import SearchComponent
from .metadata import MetadataComponent
from .download import DownloadComponent

class ComponentError(Exception):
    def __init__(self, plugin: str, component: str, reason: str, *args: object) -> None:
        super().__init__(*args)
        self.plugin = plugin
        self.component = component
        self.reason = reason
    
    def __str__(self) -> str:
        return f"{self.plugin}.{self.component} has encountered an error: {self.reason}. Details:\n\n{super().__str__()}"