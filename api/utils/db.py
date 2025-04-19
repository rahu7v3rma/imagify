from contextlib import contextmanager
from sqlmodel import Session


@contextmanager
def get_session():
    from main import engine

    with Session(engine) as session:
        yield session
