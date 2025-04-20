from math import floor
import os
import random
from fastapi import APIRouter, Depends, Request

from dependencies.auth_token import verify_auth_token
from utils.jwt import create_token
from utils.email import send_email
from models.user import (
    User,
    find_user,
    create_user,
    update_user,
)
from validators.user import (
    LoginRequestBody,
    RegisterRequestBody,
    UpdateProfileRequestBody,
    VerifyEmailRequestBody,
    ForgotPasswordRequestBody,
    ResetPasswordRequestBody,
    EmailVerificationCodeRequestBody,
)
from utils.bcrypt import hash_password, check_password

user_router = APIRouter(prefix="/user")


@user_router.post("/register")
def register(request_body: RegisterRequestBody):
    found_user = find_user({"email": request_body.email})
    if found_user:
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
    user = find_user({"email": request_body.email})
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

    update_user({"email": user.email}, {"email_verified": True})

    return {
        "success": True,
        "message": "Email verified successfully",
        "data": None,
    }


@user_router.post("/login")
def login(request_body: LoginRequestBody):
    user = find_user({"email": request_body.email})
    if not user:
        return {
            "success": False,
            "message": "User not found",
            "data": None,
        }

    if not check_password(request_body.password, user.password):
        return {
            "success": False,
            "message": "User not found",
            "data": None,
        }

    if not user.email_verified:
        return {
            "success": False,
            "message": "Email not verified",
            "data": None,
        }

    token = create_token(user.id)

    return {
        "success": True,
        "message": "User logged in successfully",
        "data": {
            "token": token,
        },
    }


@user_router.get("/profile")
def get_profile(request: Request, user: User = Depends(verify_auth_token)):
    response_data = {
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
        }
    }
    return {
        "success": True,
        "message": "User profile retrieved successfully",
        "data": response_data,
    }


@user_router.post("/profile")
def update_profile(
    request_body: UpdateProfileRequestBody, user: User = Depends(verify_auth_token)
):
    update_data = {}
    if request_body.name:
        update_data["name"] = request_body.name
    if request_body.email:
        update_data["email"] = request_body.email
    if request_body.password:
        update_data["password"] = hash_password(request_body.password)

    update_user({"id": user.id}, update_data)

    return {
        "success": True,
        "message": "User profile updated successfully",
        "data": None,
    }


@user_router.post("/forgot-password")
def forgot_password(request_body: ForgotPasswordRequestBody):
    user = find_user({"email": request_body.email})
    if not user:
        return {
            "success": False,
            "message": "User not found",
            "data": None,
        }

    email_verification_code = str(floor(random.random() * 1000000))
    update_user(
        {"email": user.email}, {"email_verification_code": email_verification_code}
    )

    send_email(
        user.email,
        f"{os.getenv('WEBSITE_NAME')} password reset",
        email_verification_code,
    )

    return {
        "success": True,
        "message": "Password reset email sent",
        "data": None,
    }


@user_router.post("/reset-password")
def reset_password(request_body: ResetPasswordRequestBody):
    user = find_user({"email": request_body.email})
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

    update_user(
        {"email": user.email}, {"password": hash_password(request_body.password)}
    )

    return {
        "success": True,
        "message": "Password reset successfully",
        "data": None,
    }


@user_router.post("/email-verification-code")
def email_verification_code(request_body: EmailVerificationCodeRequestBody):
    user = find_user({"email": request_body.email})
    if not user:
        return {
            "success": False,
            "message": "User not found",
            "data": None,
        }

    email_verification_code = str(floor(random.random() * 1000000))
    update_user(
        {"email": user.email}, {"email_verification_code": email_verification_code}
    )

    send_email(
        user.email,
        f"{os.getenv('WEBSITE_NAME')} email verification",
        email_verification_code,
    )

    return {
        "success": True,
        "message": "Email verification code sent",
        "data": None,
    }
