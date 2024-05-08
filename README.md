# TBD

This project will serve to workaround Splitwise predatory plans and to put in practice ML and AI concepts.

## Goals
- [ ] Track expenses
    - [ ] One-on-one
    - [ ] Group
- [ ] Predict expense type
- [ ] Analyse expenses
    - TBH

# Getting Started

## Prerequisites

- Docker
- Docker Compose

## Running

You can pretty much have this project up and running by running the following commands:

```bash
docker compose build
```

This will build the images with all the dependencies needed to run the project.

```bash
docker compose up
```

This will start the containers:
- `et-backend` is the backend service and will be running on port 8000
- `et-frontend` is the frontend service and will be running on port 8501


# Services

## Backend

The backend service is a [FastAPI](https://fastapi.tiangolo.com/) application that will serve as the API for the frontend service.

## Frontend

The frontend service is a [Streamlit](https://streamlit.io/) application that will serve as the user interface for the project.

Streamlit was chosen because it's a very simple way of creating prototypes.

# Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.
