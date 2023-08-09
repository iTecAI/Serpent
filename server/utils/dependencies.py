from typing import Optional, Union
from litestar import Request
from litestar.params import Parameter
from litestar.types import Logger
from litestar.datastructures import State
from litestar.exceptions import *
from tinydb import TinyDB, where
from models import SessionModel, SESSION_EXPIRE, UserModel
import time

async def depends_db(state: State) -> TinyDB:
    return state.db

async def depends_log(request: Request) -> Logger:
    return request.logger

async def depends_session(db: TinyDB, token: Optional[str] = Parameter(header="authorization")) -> Union[SessionModel, None]:
    if not token:
        return None
    
    session = SessionModel.load_one(db.table("sessions"), where("token") == token)
    if not session or session.last_seen + SESSION_EXPIRE < time.time():
        return None
    session.last_seen = time.time()
    session.dump(db.table("sessions"))
    return session

async def depends_user(db: TinyDB, token: Optional[str] = Parameter(header="authorization")) -> Union[UserModel, None]:
    if not token:
        return None
    
    session = SessionModel.load_one(db.table("sessions"), where("token") == token)
    if not session or session.last_seen + SESSION_EXPIRE < time.time() or not session.uid:
        return None
    
    user = UserModel.load_one(db.table("users"), where("uid") == session.uid)
    if not user:
        return None
    return user