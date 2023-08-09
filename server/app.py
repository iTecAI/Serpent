from litestar import Litestar, get, Request, Response, MediaType
from litestar.di import Provide
from litestar.datastructures import State
from dotenv import load_dotenv
import os
import time
from tinydb import TinyDB
from utils import depends_db, depends_log
from controllers import *

load_dotenv()

@get("/")
async def get_root() -> str:
    return time.ctime()

DB_PATH = os.getenv("SERPENT_DATABASE", "./db/db.json")
if not os.path.exists(DB_PATH):
    os.makedirs(os.path.split(DB_PATH)[0], exist_ok=True)

db = TinyDB(DB_PATH)

def server_error_handler(request: Request, exc: Exception) -> Response:
    request.logger.exception("Encountered server error:\n")
    return Response(
        media_type=MediaType.TEXT,
        content=str(exc),
        status_code=500
    )

app = Litestar(route_handlers=[get_root, AuthController], state=State({"db": db}), dependencies={"db": Provide(depends_db), "log": Provide(depends_log)}, exception_handlers={
    500: server_error_handler
})