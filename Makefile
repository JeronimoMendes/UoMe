message := ""
tests := ""

generate-migration:
	@echo "Generating database migration..."
	@docker run --rm --mount type=bind,source=${PWD}/backend,target=/code -it --workdir /code et-backend alembic revision -m "$(message)" --autogenerate

migrate:
	@echo "Migrating database..."
	@docker run --rm --mount type=bind,source=${PWD}/backend,target=/code -it --workdir /code et-backend alembic upgrade head

prepare-test-db:
	@echo "Preparing test database..."
	@docker exec -it et-database psql -U postgres -c "DROP DATABASE IF EXISTS test_db;" > /dev/null
	@docker exec -it et-database psql -U postgres -c "CREATE DATABASE test_db;" > /dev/null

test: prepare-test-db
	@echo "Running tests..."
	@docker run --name testing -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/test_db --rm --mount type=bind,source=${PWD}/backend,target=/code -it --workdir /code et-backend pytest -k "$(tests)"
