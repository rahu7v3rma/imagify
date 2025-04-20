from fastapi import HTTPException, Request
from utils.jwt import verify_token
from models.user import find_user


async def verify_auth_token(request: Request):
    auth_header = request.headers.get("authorization")
    if not auth_header:
        raise HTTPException(status_code=401)

    auth_token = auth_header.replace("Bearer ", "")
    if not auth_token:
        raise HTTPException(status_code=401)

    auth_token = verify_token(auth_token)
    if not auth_token:
        raise HTTPException(status_code=401)

    if not isinstance(auth_token, dict):
        raise HTTPException(status_code=401)

    user_id = auth_token.get("user_id")
    if not user_id:
        raise HTTPException(status_code=401)

    user = find_user({"id": user_id})
    if not user:
        raise HTTPException(status_code=401)

    if not user.email_verified:
        raise HTTPException(status_code=401)

    return user
