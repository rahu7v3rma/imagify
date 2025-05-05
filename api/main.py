import os
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from routers.user import user_router
from sqlmodel import create_engine, SQLModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()

engine = create_engine(os.getenv("POSTGRES_URI"))
SQLModel.metadata.create_all(engine)

app = FastAPI()

origins = [os.getenv("CORS_ORIGIN")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)


@app.get("/connect")
async def connect():
    return {"success": True, "message": "API connected", "data": None}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    return JSONResponse(
        content={
            "success": False,
            "message": "invalid_request",
            "data": None,
        },
    )


@app.exception_handler(StarletteHTTPException)
async def custom_404_handler(request, exc):
    if exc.status_code == 404:
        return JSONResponse(
            content={
                "success": False,
                "message": "Route not found",
                "data": None,
            },
        )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    if exc.status_code == 401:
        return JSONResponse(
            content={
                "success": False,
                "message": "Unauthorized",
                "data": None,
            },
        )


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Internal server error",
            "data": None,
        },
    )
