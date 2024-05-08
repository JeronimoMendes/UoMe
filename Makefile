message := ""

generate-migration:
	@echo "Generating database migration..."
	@docker run --rm --mount type=bind,source=${PWD}/backend,target=/code -it --workdir /code et-backend alembic revision -m $(message) --autogenerate

migrate:
	@echo "Migrating database..."
	@docker run --rm --mount type=bind,source=${PWD}/backend,target=/code -it --workdir /code et-backend alembic upgrade head
