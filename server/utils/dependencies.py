from litestar import Request
from litestar.types import Logger
from litestar.datastructures import State
from tinydb import TinyDB

async def depends_db(state: State) -> TinyDB:
    return state.db

async def depends_log(request: Request) -> Logger:
    return request.logger