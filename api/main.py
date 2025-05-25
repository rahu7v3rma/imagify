from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import HTTPException

app = FastAPI()


@app.get("/status")
def status_route():
    return JSONResponse(
        status_code=200,
        content={"success": True, "message": "socialify api status", "data": None},
    )


@app.get("/error")
def error_route():
    raise Exception("test exception")


@app.exception_handler(404)
async def not_found_route(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=404,
        content={"success": False, "message": "route not found", "data": None},
    )


@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "internal server error", "data": None},
    )
