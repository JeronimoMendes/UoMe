import uvicorn
from fastapi import FastAPI

from app.routers.auth_router import auth_router
from app.routers.group_router import group_router

app = FastAPI()

app.include_router(auth_router, tags=["Auth"])
app.include_router(group_router, tags=["Group"])


@app.get("/")
def tmp():
    return {"message": "Hello World"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
