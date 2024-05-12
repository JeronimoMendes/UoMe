import pytest
from fastapi.testclient import TestClient

from app.schemas.group_schemas import GroupCreate


@pytest.fixture
def group(authenticated_client: TestClient):
    create_group_schema = GroupCreate(name="test_group", description="test_group")
    response = authenticated_client.post("/groups", json=create_group_schema.model_dump())
    assert response.status_code == 200
    response_json = response.json()
    return response_json
