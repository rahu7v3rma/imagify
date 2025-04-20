import re
from pydantic import field_validator


class EmailValidator:
    @field_validator("email")
    def validate_email(cls, v):
        if not re.match(r".+@.+\..+", v):
            raise ValueError("Invalid email address")
        return v


class PasswordValidator:
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
        if re.match(r"^[a-zA-Z0-9]+$", v):
            raise ValueError("Password must contain at least one special character")
        return v
