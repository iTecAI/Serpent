from typing import Literal, TypedDict, Union, Optional
MEDIA_TYPES = Literal["tv", "movie", "video", "text", "textbook", "music", "audio"]
COMPONENT_TYPES = Literal["search", "metadata", "download"]
DOWNLOAD_TYPES = Literal["direct", "torrent"]
METADATA_TYPES = Literal["image", "rating", "description", "title", "authors", "tags"]
SEARCH_FIELD_TYPES = Literal["string", "datetime", "number", "boolean", "selection"]

class PluginMeta(TypedDict):
    id: str
    name: str
    description: str
    iconPath: str
    components: dict[COMPONENT_TYPES, list[str]]

class SearchField_String(TypedDict):
    type: Literal["string"]
    key: str

class SearchTerm_String(TypedDict):
    type: Literal["string"]
    key: str
    value: str
    mode: Literal["exact", "contains"]

class SearchField_Datetime(TypedDict):
    type: Literal["datetime"]
    key: str

class SearchTerm_Datetime(TypedDict):
    type: Literal["datetime"]
    key: str
    value: float
    mode: Literal["before", "after"]

class SearchField_Number(TypedDict):
    type: Literal["number"]
    key: str
    min: Union[float, None]
    max: Union[float, None]
    step: Union[float, None]

class SearchTerm_Number(TypedDict):
    type: Literal["number"]
    key: str
    value: Union[float, int]
    mode: Literal["gt", "gte", "lt", "lte", "eq", "neq"]

class SearchField_Boolean(TypedDict):
    type: Literal["boolean"]
    key: str

class SearchTerm_Boolean(TypedDict):
    type: Literal["boolean"]
    key: str
    value: bool

class SearchField_Selection(TypedDict):
    type: Literal["selection"]
    key: str
    options: dict[str, str]
    multiple: Optional[bool]

class SearchTerm_Selection(TypedDict):
    type: Literal["selection"]
    key: str
    value: Union[str, list[str]]

SEARCH_FIELDS = Union[SearchField_Boolean, SearchField_Datetime, SearchField_Number, SearchField_Selection, SearchField_String]
SEARCH_TERMS = Union[SearchTerm_Number, SearchTerm_Boolean, SearchTerm_Datetime, SearchTerm_Selection, SearchTerm_String]

class SearchResult(TypedDict):
    plugin: str
    download_type: Union[None, DOWNLOAD_TYPES]
    title: str
    description: str
    download_uri: Union[None, str]
    extra_data: dict

class MetadataResult(TypedDict):
    type: METADATA_TYPES
    fields: dict

class DownloadResult(TypedDict):
    download_type: DOWNLOAD_TYPES
    resource: SearchResult
    id: str

class DownloadStatus(TypedDict):
    id: str
    progress: float | None
    stage: str


