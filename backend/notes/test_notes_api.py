import pytest
from rest_framework import status
from notes.models import Note

# 1. User Registration & Validation Test
@pytest.mark.django_db
def test_user_registration_success_and_validation(api_client):
    payload = {"username": "newstudent", "email": "student@arbisoft.com", "password": "SecurePassword123"}
    response = api_client.post("/api/register/", payload)
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data["username"] == "newstudent"

    bad_payload = {"username": "baduser", "password": "123"}
    bad_response = api_client.post("/api/register/", bad_payload)
    assert bad_response.status_code == status.HTTP_400_BAD_REQUEST

# 2. JWT Login Test
@pytest.mark.django_db
def test_jwt_login_success_and_failure(api_client, test_user, test_user_credentials):
    login_payload = {
        "username": test_user_credentials["username"],
        "password": test_user_credentials["password"]
    }
    response = api_client.post("/api/token/", login_payload)
    assert response.status_code == status.HTTP_200_OK
    assert "access" in response.data
    invalid_payload = {
        "username": test_user_credentials["username"],
        "password": "wrongpassword"
    }
    response_fail = api_client.post("/api/token/", invalid_payload)
    assert response_fail.status_code == status.HTTP_401_UNAUTHORIZED

# 3. Unauthenticated Rejection Test
@pytest.mark.django_db
def test_unauthenticated_request_rejected(api_client):
    response = api_client.get("/api/notes/")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED

# 4. Authenticated Owner CRUD Flow Test
@pytest.mark.django_db
def test_authenticated_owner_crud_flow(auth_client, test_user):
    # Create
    res_create = auth_client.post("/api/notes/", {"title": "My Note", "content": "Valid Content"})
    assert res_create.status_code == status.HTTP_201_CREATED
    note_id = res_create.data["id"]

    # Read
    res_get = auth_client.get(f"/api/notes/{note_id}/")
    assert res_get.status_code == status.HTTP_200_OK

    # Update
    res_put = auth_client.put(f"/api/notes/{note_id}/", {"title": "New Title", "content": "New Content"})
    assert res_put.status_code == status.HTTP_200_OK

    # Delete
    res_del = auth_client.delete(f"/api/notes/{note_id}/")
    assert res_del.status_code == status.HTTP_204_NO_CONTENT

# 5. RBAC & Ownership Protection Test
@pytest.mark.django_db
def test_user_cannot_modify_other_users_note(auth_client, other_auth_client, test_user):
    note = Note.objects.create(user=test_user, title="Private Note", content="Secret content")
    res_delete = other_auth_client.delete(f"/api/notes/{note.id}/")
    assert res_delete.status_code == status.HTTP_403_FORBIDDEN
    assert Note.objects.filter(id=note.id).exists()

# 6. Admin Role Privilege Override Test
@pytest.mark.django_db
def test_admin_user_can_access_all_notes(admin_auth_client, test_user):
    note = Note.objects.create(user=test_user, title="User Note", content="User content")
    response = admin_auth_client.get(f"/api/notes/{note.id}/")
    assert response.status_code == status.HTTP_200_OK