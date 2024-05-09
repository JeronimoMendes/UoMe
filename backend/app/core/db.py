import os

from sqlmodel import Session, create_engine

db_engine = create_engine(
    os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:postgres@host.docker.internal:5432/et",
    )
)


def get_db():
    session = Session(db_engine)
    try:
        yield session
        session.commit()
    except:  # noqa
        session.rollback()
        raise
    finally:
        session.close()
