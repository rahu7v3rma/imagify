from sqlmodel import Field, SQLModel, select
from utils.db import get_session


class User(SQLModel, table=True):
    id: int = Field(primary_key=True)
    name: str
    email: str
    password: str
    email_verified: bool
    email_verification_code: str


def create_user(
    name: str,
    email: str,
    password: str,
    email_verified: bool,
    email_verification_code: str,
):
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


def find_user(find_query):
    with get_session() as session:
        find_user_query = select(User)
        if find_query.get("id"):
            find_user_query = find_user_query.where(User.id == find_query.get("id"))
        if find_query.get("email"):
            find_user_query = find_user_query.where(
                User.email == find_query.get("email")
            )
        user = session.exec(find_user_query).first()
        return user


def update_user(find_query, update_data):
    with get_session() as session:
        find_user_query = select(User)
        if find_query.get("id"):
            find_user_query = find_user_query.where(User.id == find_query.get("id"))
        if find_query.get("email"):
            find_user_query = find_user_query.where(
                User.email == find_query.get("email")
            )
        user = session.exec(find_user_query).first()

        if update_data.get("name"):
            user.name = update_data.get("name")
        if update_data.get("email"):
            user.email = update_data.get("email")
        if update_data.get("password"):
            user.password = update_data.get("password")
        if update_data.get("email_verified"):
            user.email_verified = update_data.get("email_verified")
        if update_data.get("email_verification_code"):
            user.email_verification_code = update_data.get("email_verification_code")

        session.commit()
