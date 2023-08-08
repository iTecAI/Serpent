from litestar import Litestar, get
import time

@get("/")
async def get_root() -> str:
    return time.ctime()

app = Litestar([get_root])