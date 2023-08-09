from litestar import get, post, Controller
from litestar.di import Provide
from litestar.exceptions import *
from utils import depends_plugins, depends_user, guard_admin, guard_logged_in, Plugins
from models import PluginComponentModel, PluginItemModel
from litestar.response import File
import os
from tinydb import TinyDB, where


class PluginController(Controller):
    path = "/plugins"
    guards = [guard_logged_in]
    dependencies = {"plugins": Provide(depends_plugins), "user": Provide(depends_user)}

    @get("/")
    async def get_plugins(self, plugins: Plugins, db: TinyDB) -> list[PluginItemModel]:
        return [
            PluginItemModel.from_item(item, db)
            for _, item in plugins.plugins.items()
        ]
    
    @post("/{pluginId:str}/active", guards=[guard_admin])
    async def set_plugin_active(self, db: TinyDB, pluginId: str, plugins: Plugins, data: dict[str, bool]) -> PluginItemModel:
        try:
            plugin = plugins.plugin(pluginId)
        except KeyError:
            raise NotFoundException(detail="Plugin not found")
        
        db.table("plugins").upsert({"enabled": data["active"]}, where("id") == pluginId)
        return PluginItemModel.from_item(plugin, db)
        


@get("/plugins/{pluginId:str}/icon", dependencies={"plugins": Provide(depends_plugins)})
async def get_plugin_icon(pluginId: str, plugins: Plugins) -> File:
    try:
        path = plugins.plugin(pluginId)["icon_path"]
        return File(
            path=path, filename=f"{pluginId}.icon.{os.path.splitext(path)[1][1:]}"
        )
    except:
        raise NotFoundException()
