from pydantic import BaseModel, field_validator
from validators.common import EmailValidator, PasswordValidator


class RegisterRequestBody(BaseModel, EmailValidator, PasswordValidator):
    name: str
    email: str
    password: str

    @field_validator("name")
    def validate_name(cls, v):
        if len(v) < 3:
            raise ValueError("Name must be at least 3 characters long")
        return v


class VerifyEmailRequestBody(BaseModel):
    email: str
    email_verification_code: str


class LoginRequestBody(BaseModel):
    email: str
    password: str


class UpdateProfileRequestBody(BaseModel):
    name: str | None = None
    email: str | None = None
    password: str | None = None


class ForgotPasswordRequestBody(BaseModel, EmailValidator):
    email: str


class ResetPasswordRequestBody(BaseModel, EmailValidator, PasswordValidator):
    email: str
    email_verification_code: str
    password: str


class EmailVerificationCodeRequestBody(BaseModel, EmailValidator):
    email: str
