import re
from pydantic import BaseModel, field_validator


class RegisterRequestBody(BaseModel):
    name: str
    email: str
    password: str

    @field_validator("name")
    def validate_name(cls, v):
        if len(v) < 3:
            raise ValueError("Name must be at least 3 characters long")
        return v

    @field_validator("email")
    def validate_email(cls, v):
        if not re.match(r".+@.+\..+", v):
            raise ValueError("Invalid email address")
        return v

    @field_validator("password")
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters long")
        if not any(char.isupper() for char in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(char.islower() for char in v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not any(char.isdigit() for char in v):
            raise ValueError("Password must contain at least one digit")
        return v


class VerifyEmailRequestBody(BaseModel):
    email: str
    email_verification_code: str
