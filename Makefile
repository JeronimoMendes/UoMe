message := ""
tests := ""

generate-migration:
	@echo "Generating database migration..."
	@docker run --env-file ./backend/.env --network uome_uome-network --rm --mount type=bind,source=${PWD}/backend,target=/code -it --workdir /code uome-backend alembic revision -m "$(message)" --autogenerate

migrate:
	@echo "Migrating database..."
	@docker run --env-file ./backend/.env --network uome_uome-network --rm --mount type=bind,source=${PWD}/backend,target=/code -it --workdir /code uome-backend alembic upgrade head

prepare-test-db:
	@echo "Preparing test database..."
	@docker exec -it uome-database psql -U postgres -c "DROP DATABASE IF EXISTS test_db;" > /dev/null
	@docker exec -it uome-database psql -U postgres -c "CREATE DATABASE test_db;" > /dev/null

test: prepare-test-db
	@echo "Running tests..."
	@docker run --name testing -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/test_db --rm --mount type=bind,source=${PWD}/backend,target=/code -it --workdir /code uome-backend pytest -k "$(tests)"

migrate-production:
	@echo "Migrating production database..."
	flyctl ssh console -a uome -C "poetry run alembic upgrade head"
