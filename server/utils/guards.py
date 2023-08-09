from litestar.connection import ASGIConnection
from litestar.exceptions import NotAuthorizedException
from litestar.handlers.base import BaseRouteHandler
from tinydb import TinyDB, where
from models import SessionModel

def guard_session(connection: ASGIConnection, _: BaseRouteHandler) -> None:
    db: TinyDB = connection.app.state.db
    auth_header = connection.headers.get("authorization")
    if auth_header:
        results = db.table("sessions").search(where("token") == auth_header)
        if len(results) > 0:
            return
    
    raise NotAuthorizedException(detail="Session required")

def guard_logged_in(connection: ASGIConnection, _: BaseRouteHandler) -> None:
    db: TinyDB = connection.app.state.db
    auth_header = connection.headers.get("authorization")
    if auth_header:
        session = SessionModel.load_one(db.table("sessions"), where("token") == auth_header)
        if session and session.uid:
            return

    raise NotAuthorizedException(detail="Must be logged in")