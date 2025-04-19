from sqlmodel import Field, SQLModel, select
from utils.db import get_session


class User(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str
    email: str
    password: str
    email_verified: bool
    email_verification_code: str


def create_user(name, email, password, email_verified, email_verification_code):
    with get_session() as session:
        user = User(
            name=name,
            email=email,
            password=password,
            email_verified=email_verified,
            email_verification_code=email_verification_code,
        )
        session.add(user)
        session.commit()
        return user


def find_user_by_email(email):
    with get_session() as session:
        user = session.exec(select(User).where(User.email == email)).first()
        return user


def update_user_email_verified(email, email_verified):
    with get_session() as session:
        user = session.exec(select(User).where(User.email == email)).first()
        user.email_verified = email_verified
        session.commit()
