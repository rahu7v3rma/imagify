import jwt
import os


def create_token(user_id: int):
    return jwt.encode({"user_id": user_id}, os.getenv("JWT_SECRET"), algorithm="HS256")


def verify_token(token: str):
    try:
        return jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
    except Exception:
        return None
