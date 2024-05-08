FROM python:3.12-slim

WORKDIR /code

RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    git \
    && rm -rf /var/lib/apt/lists/*

RUN pip3 install poetry

RUN poetry config virtualenvs.create false

COPY pyproject.toml poetry.lock ./

RUN poetry install --no-dev

COPY . .

WORKDIR /code/app

EXPOSE 8000

CMD [ "fastapi", "dev", "--host", "0.0.0.0", "--port", "8000", "main.py"]
