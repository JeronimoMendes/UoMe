from fastapi.testclient import TestClient


def test_authenticate(app_client: TestClient):
    response = app_client.post(
        "/token",
        data={
            "username": "joedoe@gmail.com",
            "password": "easy-pw-123",
        },
    )
    assert response.status_code == 200
    response_json = response.json()
    assert "access_token" in response_json
    assert response_json["token_type"] == "bearer"


def test_authenticate_fail(app_client: TestClient):
    response = app_client.post(
        "/token",
        data={
            "username": "joedoe@gmail.com",
            "password": "wrong-password",
        },
    )
    assert response.status_code == 401
    response_json = response.json()
    assert response_json["detail"] == "Invalid credentials"


def test_get_me(authenticated_client: TestClient):
    response = authenticated_client.get("/users/me")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["username"] == "joedoe"
    assert response_json["email"] == "joedoe@gmail.com"


def test_register(app_client: TestClient):
    response = app_client.post(
        "/register",
        json={"username": "test", "email": "test@gmail.com", "password": "test"},
    )

    assert response.status_code == 200
    response_json = response.json()
    assert response_json["username"] == "test"
    assert response_json["email"] == "test@gmail.com"
    assert "id" in response_json
    assert "password" not in response_json

    # login with the new user
    response = app_client.post(
        "/token",
        data={
            "username": "test@gmail.com",
            "password": "test",
        },
    )
    assert response.status_code == 200
