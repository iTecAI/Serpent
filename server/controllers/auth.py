from litestar import Controller, get, post, Request
from tinydb import TinyDB, where
from litestar.params import Parameter
from litestar.di import Provide
from litestar.exceptions import *
from typing import Optional
from uuid import uuid4
from utils import guard_session, depends_session, depends_user, guard_logged_in
from time import time
from models import SessionModel, UserModel, LoginModel, SESSION_EXPIRE, UpdatePasswordModel, UpdateAlertsModel


class AuthController(Controller):
    path = "/auth"
    dependencies = {"session": Provide(depends_session)}

    @get("/session")
    async def refresh_session(
        self, db: TinyDB, token: Optional[str] = Parameter(header="authorization")
    ) -> SessionModel:
        results = SessionModel.load(db.table("sessions"), where("token") == token)
        if len(results) == 0:
            session = SessionModel(token=uuid4().hex, uid=None, last_seen=time())
        else:
            session = results[0]
            if session.last_seen + SESSION_EXPIRE < time():
                db.table("sessions").remove(where("token") == session.token)
                session = SessionModel(token=uuid4().hex, uid=None, last_seen=time())
            else:
                session.last_seen = time()
        session.dump(db.table("sessions"))
        return session.anonymized
    
    @post("/login", guards=[guard_session])
    async def login(self, db: TinyDB, data: LoginModel, session: SessionModel) -> dict:
        req_user = UserModel.load_one(db.table("users"), where("username") == data.username)
        if req_user and req_user.verify(data.password):
            session.uid = req_user.uid
            session.dump(db.table("sessions"))
            return req_user.secured
        raise NotFoundException(detail="Username or password incorrect")
    
    @get("/", guards=[guard_session, guard_logged_in], dependencies={"user": Provide(depends_user)})
    async def get_self(self, user: UserModel) -> dict:
        return user.secured
    
    @post("/logout", guards=[guard_session, guard_logged_in])
    async def logout(self, session: SessionModel, db: TinyDB) -> None:
        session.uid = None
        session.dump(db.table("sessions"))

    @post("/settings/username", guards=[guard_session, guard_logged_in], dependencies={"user": Provide(depends_user)})
    async def update_username(self, db: TinyDB, user: UserModel, data: dict) -> dict:
        existing = UserModel.load(db.table("users"), where("username") == user.username and where("uid") != user.uid)
        if len(existing) > 0:
            raise MethodNotAllowedException(detail="Username already registered")
        
        user.username = data.get("username", user.username)
        user.dump(db.table("users"))
        return user.secured
    
    @post("/settings/password", guards=[guard_session, guard_logged_in], dependencies={"user": Provide(depends_user)})
    async def update_password(self, db: TinyDB, user: UserModel, data: UpdatePasswordModel) -> dict:
        update_result = user.update_password(data.currentPassword, data.newPassword)
        if not update_result:
            raise PermissionDeniedException(detail="Incorrect current password")
        user.dump(db.table("users"))
        return user.secured
    
    @post("/settings/alerts", guards=[guard_session, guard_logged_in], dependencies={"user": Provide(depends_user)})
    async def update_alerts(self, db: TinyDB, user: UserModel, data: UpdateAlertsModel) -> dict:
        user.alert_email = data.email
        user.alerts = data.enabled
        user.dump(db.table("users"))
        return user.secured

