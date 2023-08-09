from litestar import Controller, get, post, Request
from tinydb import TinyDB, where
from pydantic import BaseModel
from litestar.params import Parameter
from typing import Annotated, Optional, Union
from uuid import uuid4
from utils import ORMModel
from time import time

SESSION_EXPIRE = 3600

class SessionModel(ORMModel):
    token: str
    uid: Union[str, None]
    last_seen: float

class AuthController(Controller):
    path = "/auth"

    @get("/session")
    async def refresh_session(self, db: TinyDB, token: Optional[str] = Parameter(header="authorization")) -> SessionModel:
        results = SessionModel.load(db.table("sessions"), where("token") == token)
        if len(results) == 0:
            session = SessionModel(token=uuid4().hex, uid=None, last_seen=time())
        else:
            session = results[0]
            if session.last_seen + 3600 < time():
                db.table("sessions").remove(where("token") == session.token)
                session = SessionModel(token=uuid4().hex, uid=None, last_seen=time())
            else:
                session.last_seen = time()
        session.dump(db.table("sessions"))
        return session.anonymized
