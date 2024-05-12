from fastapi.testclient import TestClient

from app.schemas.group_schemas import GroupCreate


def test_create_group(authenticated_client: TestClient):
    create_group_schema = GroupCreate(name="test_group", description="test_group")
    response = authenticated_client.post("/groups", json=create_group_schema.model_dump())
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["name"] == "test_group"


def test_get_group(authenticated_client: TestClient, group: dict):
    group_id = group["id"]
    response = authenticated_client.get(f"/groups/{group_id}")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["name"] == "test_group"
    assert response_json["id"] == group_id
    assert response_json["description"] == "test_group"

    # unexpected group_id
    response = authenticated_client.get("/groups/3221b5cc-2c07-4ad0-a830-20e6b0582fc1")
    assert response.status_code == 404


def test_delete_group(app_client: TestClient, authenticated_client: TestClient, group: dict):
    group_id = group["id"]
    response = authenticated_client.delete(f"/groups/{group_id}")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["message"] == "Group deleted"

    # unexpected group_id
    response = authenticated_client.delete("/groups/3221b5cc-2c07-4ad0-a830-20e6b0582fc1")
    assert response.status_code == 404
    response_json = response.json()
    assert response_json["detail"] == "Group not found"


def test_delete_group_unauthorized(app_client: TestClient, group: dict):
    group_id = group["id"]
    # use unauthenticated client
    app_client.headers.clear()
    app_client.cookies.clear()
    response = app_client.delete(f"/groups/{group_id}")
    assert response.status_code == 401

    # authenticate with another user
    response = app_client.post(
        "/token",
        data={
            "username": "cristianoronaldo@gmail.com",
            "password": "easy-pw-123",
        },
    )
    assert response.status_code == 200
    access_token = response.json()["access_token"]
    app_client.headers.update(
        {
            "Authorization": f"Bearer {access_token}",
        }
    )
    response = app_client.delete(f"/groups/{group_id}")
    assert response.status_code == 403

    # check if the group is still in the database
    response = app_client.get(f"/groups/{group_id}")
    assert response.status_code == 200


def test_get_user_groups(authenticated_client: TestClient):
    response = authenticated_client.get("/users/me/groups")
    assert response.status_code == 200
    response_json = response.json()
    assert len(response_json) == 2
    assert response_json[0]["name"] == "Joe's personal group"
    assert response_json[1]["name"] == "General group"


def test_add_user_to_group(authenticated_client: TestClient, group: dict):
    response = authenticated_client.post(f"/groups/{group["id"]}/users/cristianoronaldo")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["message"] == "User added to the group"

    # check if the user is added to the group
    # login with another user
    response = authenticated_client.post(
        "/token",
        data={
            "username": "cristianoronaldo@gmail.com",
            "password": "easy-pw-123",
        },
    )
    assert response.status_code == 200
    access_token = response.json()["access_token"]
    authenticated_client.headers.update(
        {
            "Authorization": f"Bearer {access_token}",
        }
    )
    response = authenticated_client.get("/users/me/groups")
    assert response.status_code == 200
    response_json = response.json()
    assert len(response_json) == 2
    assert response_json[1]["name"] == group["name"]
    assert response_json[1]["id"] == group["id"]
    assert response_json[1]["description"] == group["description"]


def test_remove_user_from_group(authenticated_client: TestClient, group: dict):
    response = authenticated_client.post(f"/groups/{group["id"]}/users/cristianoronaldo")
    assert response.status_code == 200

    response = authenticated_client.delete(f"/groups/{group["id"]}/users/cristianoronaldo")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["message"] == "User removed from the group"

    # check if the user is removed from the group
    response = authenticated_client.post(
        "/token",
        data={
            "username": "cristianoronaldo@gmail.com",
            "password": "easy-pw-123",
        },
    )
    assert response.status_code == 200
    access_token = response.json()["access_token"]
    authenticated_client.headers.update(
        {
            "Authorization": f"Bearer {access_token}",
        }
    )
    response = authenticated_client.get("/users/me/groups")
    assert response.status_code == 200
    response_json = response.json()
    assert len(response_json) == 1


def test_remove_user_from_group_unauthorized(app_client: TestClient, authenticated_client: TestClient, group: dict):
    response = authenticated_client.post(f"/groups/{group["id"]}/users/cristianoronaldo")
    assert response.status_code == 200

    app_client.headers.clear()
    app_client.cookies.clear()
    response = app_client.delete(f"/groups/{group["id"]}/users/cristianoronaldo")
    assert response.status_code == 401

    # authenticate with another user
    response = app_client.post(
        "/token",
        data={
            "username": "louishamilton@gmail.com",
            "password": "easy-pw-123",
        },
    )
    assert response.status_code == 200
    access_token = response.json()["access_token"]
    app_client.headers.update(
        {
            "Authorization": f"Bearer {access_token}",
        }
    )
    response = app_client.delete(f"/groups/{group["id"]}/users/cristianoronaldo")
    assert response.status_code == 403
