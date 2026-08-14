import pytest
import httpx
from rest_framework import status
from config.wsgi import application  # Import Django WSGI application


@pytest.mark.django_db
def test_full_auth_and_crud_workflow_with_httpx(test_user, test_user_credentials):
    """
    End-to-end integration test using HTTPX Client + WSGITransport:
    1. Login & Obtain JWT Token
    2. Create Note (POST)
    3. List Notes (GET)
    4. Update Note (PUT)
    5. Delete Note (DELETE)
    """
    # Connect HTTPX directly to Django WSGI app & Pytest test database
    transport = httpx.WSGITransport(app=application)

    with httpx.Client(transport=transport, base_url="http://testserver/api") as client:
        # Step 1: Login via JWT Endpoint
        login_res = client.post("/token/", json={
            "username": test_user_credentials["username"],
            "password": test_user_credentials["password"]
        })
        assert login_res.status_code == status.HTTP_200_OK
        tokens = login_res.json()
        assert "access" in tokens
        access_token = tokens["access"]

        # Prepare Authorization Header
        headers = {"Authorization": f"Bearer {access_token}"}

        # Step 2: Create Note (POST)
        create_res = client.post("/notes/", json={
            "title": "HTTPX Integration Note",
            "content": "Testing API using httpx Client"
        }, headers=headers)
        assert create_res.status_code == status.HTTP_201_CREATED
        note_data = create_res.json()
        note_id = note_data["id"]

        # Step 3: List Notes (GET)
        list_res = client.get("/notes/", headers=headers)
        assert list_res.status_code == status.HTTP_200_OK
        notes_list = list_res.json()
        assert len(notes_list) >= 1

        # Step 4: Update Note (PUT)
        update_res = client.put(f"/notes/{note_id}/", json={
            "title": "Updated HTTPX Title",
            "content": "Updated content body"
        }, headers=headers)
        assert update_res.status_code == status.HTTP_200_OK
        assert update_res.json()["title"] == "Updated HTTPX Title"

        # Step 5: Delete Note (DELETE)
        delete_res = client.delete(f"/notes/{note_id}/", headers=headers)
        assert delete_res.status_code == status.HTTP_204_NO_CONTENT