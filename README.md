# UoMe

This project will serve to workaround Splitwise predatory plans and to put in practice ML and AI concepts.

## Goals
- [X] Track expenses
    - [ ] One-on-one
    - [X] Group
- [ ] Predict expense type
- [ ] Analyse expenses
    - TBD

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
- `uome-backend` is the backend service and will be running on port 8000
- `uome-frontend` is the frontend service and will be running on port 3000
- `uome-db` is the database service and will be running on port 5432


# Services

## Backend

The backend service is a [FastAPI](https://fastapi.tiangolo.com/) application that will serve as the API for the frontend service.

## Frontend

The frontend service is a [Next](https://nextjs.org/) application that will serve as the user interface for the project.

Most of the content is client side rendered, with some exceptions that will be server side rendered.

The component library used is [shadcn/ui](https://ui.shadcn.com/).

# Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.
