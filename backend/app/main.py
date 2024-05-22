import os

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth_router import auth_router
from app.routers.expense_router import expense_router
from app.routers.group_router import group_router

app = FastAPI()

origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, tags=["Auth"])
app.include_router(group_router, tags=["Group"])
app.include_router(expense_router, tags=["Expense"])


@app.get("/")
def tmp():
    return {"message": "Hello World"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
