import os

from sqlmodel import Session, create_engine

db_engine = create_engine(os.getenv("DATABASE_URL"))


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
