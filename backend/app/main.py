import uvicorn
from fastapi import FastAPI

from app.auth.auth_router import auth_router

app = FastAPI()

app.include_router(auth_router)


@app.get("/")
def tmp():
    return {"message": "Hello World"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
