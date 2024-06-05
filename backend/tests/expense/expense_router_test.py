from datetime import datetime
from uuid import UUID

from fastapi.testclient import TestClient

from app.schemas.expenses_schema import ExpenseCreate, ExpenseParticipantCreate, PaymentCreate


def test_expense_create(authenticated_client: TestClient):
    create_expense_schema = ExpenseCreate(
        amount=100.0,
        description="Test expense",
        date=datetime.now().isoformat(),
        group_id=UUID("c018fc08-0873-4355-bc95-40a07f146cf7"),
        type="test",
        participants=[
            ExpenseParticipantCreate(user_id=UUID("398a95d6-f521-4572-b65c-e8b024f04030"), amount=50.0),
            ExpenseParticipantCreate(user_id=UUID("d1a0fdd8-db0a-4368-bb5a-b01bdeed6563"), amount=-100.0),
        ],
    )
    response = authenticated_client.post("/expenses", json=create_expense_schema.model_dump(mode="json"))
    print(response.json())
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["description"] == "Test expense"
    assert response_json["amount"] == 100.0
    assert response_json["type"] == "test"
    assert response_json["group_id"] == "c018fc08-0873-4355-bc95-40a07f146cf7"
    assert response_json["participants"][0]["user"]["id"] == "398a95d6-f521-4572-b65c-e8b024f04030"
    assert response_json["participants"][0]["amount"] == 50.0
    assert response_json["participants"][1]["user"]["id"] == "d1a0fdd8-db0a-4368-bb5a-b01bdeed6563"
    assert response_json["participants"][1]["amount"] == -100.0

    create_payment = PaymentCreate(
        amount=50.0,
        date=datetime.now().isoformat(),
        group_id=UUID("c018fc08-0873-4355-bc95-40a07f146cf7"),
        user_payer_id=UUID("398a95d6-f521-4572-b65c-e8b024f04030"),
        user_payee_id=UUID("d1a0fdd8-db0a-4368-bb5a-b01bdeed6563"),
    )
    response = authenticated_client.post("/expenses/payment", json=create_payment.model_dump(mode="json"))
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["amount"] == 50.0
    assert response_json["group_id"] == "c018fc08-0873-4355-bc95-40a07f146cf7"
    assert response_json["user_payer_id"] == "398a95d6-f521-4572-b65c-e8b024f04030"
    assert response_json["user_payee_id"] == "d1a0fdd8-db0a-4368-bb5a-b01bdeed6563"

    # test group payments list
    response = authenticated_client.get("/groups/c018fc08-0873-4355-bc95-40a07f146cf7/payments")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["id"] == response_json["id"]


def test_expense_get(authenticated_client: TestClient):
    create_expense_schema = ExpenseCreate(
        amount=100.0,
        description="Test expense",
        date=datetime.now().isoformat(),
        group_id=UUID("c018fc08-0873-4355-bc95-40a07f146cf7"),
        type="test",
        participants=[
            ExpenseParticipantCreate(user_id=UUID("398a95d6-f521-4572-b65c-e8b024f04030"), amount=100.0),
            ExpenseParticipantCreate(user_id=UUID("d1a0fdd8-db0a-4368-bb5a-b01bdeed6563"), amount=-50.0),
        ],
    )
    response = authenticated_client.post("/expenses", json=create_expense_schema.model_dump(mode="json"))
    expense = response.json()
    expense_id = response.json()["id"]

    response = authenticated_client.get(f"/expenses/{expense_id}")
    assert response.status_code == 200
    assert response.json() == expense


def test_expense_delete(authenticated_client: TestClient):
    create_expense_schema = ExpenseCreate(
        amount=100.0,
        description="Test expense",
        date=datetime.now().isoformat(),
        group_id=UUID("c018fc08-0873-4355-bc95-40a07f146cf7"),
        type="test",
        participants=[
            ExpenseParticipantCreate(user_id=UUID("398a95d6-f521-4572-b65c-e8b024f04030"), amount=100.0),
            ExpenseParticipantCreate(user_id=UUID("d1a0fdd8-db0a-4368-bb5a-b01bdeed6563"), amount=-50.0),
        ],
    )
    response = authenticated_client.post("/expenses", json=create_expense_schema.model_dump(mode="json"))

    expense_id = response.json()["id"]
    response = authenticated_client.delete(f"/expenses/{expense_id}")
    assert response.status_code == 200
    response_json = response.json()
    assert response_json["message"] == "Expense deleted"

    # check if expense was deleted
    response = authenticated_client.get(f"/expenses/{expense_id}")
    assert response.status_code == 404


def test_user_expenses(authenticated_client: TestClient):
    response = authenticated_client.get("/users/me/expenses")
    assert response.status_code == 200
    assert response.json() == []

    create_expense_schema = ExpenseCreate(
        amount=100.0,
        description="Test expense",
        date=datetime.now().isoformat(),
        group_id=UUID("c018fc08-0873-4355-bc95-40a07f146cf7"),
        type="test",
        participants=[
            ExpenseParticipantCreate(user_id=UUID("398a95d6-f521-4572-b65c-e8b024f04030"), amount=100.0),
            ExpenseParticipantCreate(user_id=UUID("d1a0fdd8-db0a-4368-bb5a-b01bdeed6563"), amount=-50.0),
        ],
    )
    response = authenticated_client.post("/expenses", json=create_expense_schema.model_dump(mode="json"))
    expense = response.json()

    response = authenticated_client.get("/users/me/expenses")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0] == expense


def test_group_expenses(authenticated_client: TestClient):
    response = authenticated_client.get("/groups/c018fc08-0873-4355-bc95-40a07f146cf7/expenses")
    assert response.status_code == 200
    assert response.json() == []

    create_expense_schema = ExpenseCreate(
        amount=100.0,
        description="Test expense",
        date=datetime.now().isoformat(),
        group_id=UUID("c018fc08-0873-4355-bc95-40a07f146cf7"),
        type="test",
        participants=[
            ExpenseParticipantCreate(user_id=UUID("398a95d6-f521-4572-b65c-e8b024f04030"), amount=100.0),
            ExpenseParticipantCreate(user_id=UUID("d1a0fdd8-db0a-4368-bb5a-b01bdeed6563"), amount=-50.0),
        ],
    )
    response = authenticated_client.post("/expenses", json=create_expense_schema.model_dump(mode="json"))
    expense = response.json()

    response = authenticated_client.get("/groups/c018fc08-0873-4355-bc95-40a07f146cf7/expenses")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0] == expense
