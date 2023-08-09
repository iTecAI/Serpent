from litestar import Litestar, get, Request, Response, MediaType
from litestar.di import Provide
from litestar.datastructures import State
from dotenv import load_dotenv
import os
import time
from tinydb import TinyDB
from utils import depends_db, depends_log, Plugins
from controllers import *
import uuid

load_dotenv()


@get("/")
async def get_root() -> str:
    return time.ctime()


DB_PATH = os.getenv("SERPENT_DATABASE", "./db/db.json")
if not os.path.exists(DB_PATH):
    os.makedirs(os.path.split(DB_PATH)[0], exist_ok=True)
    _tempdb = TinyDB(DB_PATH)
    admin_user = UserModel.create("admin", "serpent")
    admin_user.admin = "forced"
    admin_user.dump(_tempdb.table("users"))

if not os.path.exists(os.getenv("SERPENT_DOWNLOADS", "./media")):
    os.makedirs(os.getenv("SERPENT_DOWNLOADS", "./media"), exist_ok=True)

if not os.path.exists(os.getenv("SERPENT_PLUGINS", "./plugins")):
    os.makedirs(os.getenv("SERPENT_PLUGINS", "./plugins"), exist_ok=True)

db = TinyDB(DB_PATH)


def server_error_handler(request: Request, exc: Exception) -> Response:
    request.logger.exception("Encountered server error:\n")
    return Response(media_type=MediaType.TEXT, content=str(exc), status_code=500)

async def load_plugins(app: Litestar) -> None:
    app.state.plugins.load_plugins(app.logger)


app = Litestar(
    route_handlers=[get_root, AuthController],
    state=State({"db": db, "download_root": os.getenv("SERPENT_DOWNLOADS", "./media"), "plugins": Plugins(os.getenv("SERPENT_PLUGINS", "./plugins"), db)}),
    dependencies={"db": Provide(depends_db), "log": Provide(depends_log)},
    exception_handlers={500: server_error_handler},
    on_startup=[load_plugins]
)
