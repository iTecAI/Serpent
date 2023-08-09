from pydantic import BaseModel
from utils.plugins import PluginItem
from tinydb import TinyDB

class PluginComponentModel(BaseModel):
    id: str
    type: str
    name: str
    description: str
    healthy: bool

class PluginItemModel(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    components: dict[str, PluginComponentModel]
    enabled: bool

    @classmethod
    def from_item(self, item: PluginItem, db: TinyDB) -> "PluginItemModel":
        table = db.table("plugins")
        plugins_enabled = [i["id"] for i in table.all() if i["enabled"]]
        return PluginItemModel(
                enabled=item["id"] in plugins_enabled,
                id=item["id"],
                name=item["metadata"]["name"],
                description=item["metadata"]["description"],
                icon=f"/api/plugins/{item['id']}/icon",
                components={
                    k: PluginComponentModel(
                        id=v["id"],
                        type=v["type"],
                        healthy=v["component"].healthy,
                        name=v["component"].name,
                        description=v["component"].description
                    )
                    for k, v in item["components"].items()
                },
            )
