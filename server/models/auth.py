from utils.orm_ext import ORMModel
from typing import Union, Literal
from uuid import uuid4
import secrets
from hashlib import pbkdf2_hmac
import base64
from pydantic import BaseModel

SESSION_EXPIRE = 3600

class SessionModel(ORMModel):
    token: str
    uid: Union[str, None]
    last_seen: float


class UserModel(ORMModel):
    uid: str
    username: str
    password: str
    password_salt: str
    admin: Union[Literal["forced"], bool]
    alert_email: str
    alerts: bool

    @classmethod
    def create(cls, username: str, password: str) -> "UserModel":
        salt = secrets.token_bytes(32)
        passhash = pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 500000)
        return UserModel(
            uid=uuid4().hex,
            username=username,
            password=base64.urlsafe_b64encode(passhash).decode(),
            password_salt=base64.urlsafe_b64encode(salt).decode(),
            admin=False,
            alert_email="",
            alerts=False
        )
    
    def update_password(self, old: str, new: str) -> bool:
        if not self.verify(old):
            return False
        
        salt = secrets.token_bytes(32)
        passhash = pbkdf2_hmac("sha256", new.encode("utf-8"), salt, 500000)
        self.password = base64.urlsafe_b64encode(passhash).decode()
        self.password_salt = base64.urlsafe_b64encode(salt).decode()
        return True

    def verify(self, password: str) -> bool:
        return (
            base64.urlsafe_b64encode(
                pbkdf2_hmac(
                    "sha256",
                    password.encode("utf-8"),
                    base64.urlsafe_b64decode(self.password_salt.encode("utf-8")),
                    500000,
                )
            ).decode()
            == self.password
        )

    @property
    def secured(self) -> dict:
        full_anon = self.anonymized
        return {
            "uid": full_anon["uid"],
            "username": full_anon["username"],
            "admin": full_anon["admin"],
            "alert_email": full_anon["alert_email"],
            "alerts": full_anon["alerts"]
        }
    
class LoginModel(BaseModel):
    username: str
    password: str

class UpdatePasswordModel(BaseModel):
    currentPassword: str
    newPassword: str

class UpdateAlertsModel(BaseModel):
    email: str
    enabled: bool