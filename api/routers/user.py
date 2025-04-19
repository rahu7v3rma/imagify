from math import floor
import os
import random
from fastapi import APIRouter

from utils.email import send_email
from models.user import find_user_by_email, create_user, update_user_email_verified
from validators.user import RegisterRequestBody, VerifyEmailRequestBody
from utils.bcrypt import hash_password

user_router = APIRouter(prefix="/user")


@user_router.post("/register")
def register(request_body: RegisterRequestBody):
    find_user = find_user_by_email(request_body.email)
    if find_user:
        return {
            "success": False,
            "message": "User already exists",
            "data": None,
        }

    name = request_body.name
    email = request_body.email
    password = hash_password(request_body.password)
    email_verified = False
    email_verification_code = str(floor(random.random() * 1000000))

    create_user(name, email, password, email_verified, email_verification_code)

    send_email(
        email,
        f"{os.getenv('WEBSITE_NAME')} email verification",
        email_verification_code,
    )

    return {"success": True, "message": "User registered successfully", "data": None}


@user_router.post("/verify-email")
def verify_email(request_body: VerifyEmailRequestBody):
    user = find_user_by_email(request_body.email)
    if not user:
        return {
            "success": False,
            "message": "User not found",
            "data": None,
        }

    if user.email_verification_code != request_body.email_verification_code:
        return {
            "success": False,
            "message": "User not found",
            "data": None,
        }

    update_user_email_verified(user.email, True)

    return {
        "success": True,
        "message": "Email verified successfully",
        "data": None,
    }
