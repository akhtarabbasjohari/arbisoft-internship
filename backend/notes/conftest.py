import pytest
from decouple import config
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

# Read test user credentials from environment variables via python-decouple
TEST_USER_USERNAME = config("TEST_USER_USERNAME", default="testuser")
TEST_USER_PASSWORD = config("TEST_USER_PASSWORD", default="password123")


@pytest.fixture
def test_user_credentials():
    """Fixture providing test user credentials loaded from environment variables."""
    return {
        "username": TEST_USER_USERNAME,
        "password": TEST_USER_PASSWORD,
    }


@pytest.fixture
def test_user(db, test_user_credentials):
    """Fixture creating and returning a test user model instance using env credentials."""
    User = get_user_model()
    user, created = User.objects.get_or_create(
        username=test_user_credentials["username"],
        defaults={"email": "test@example.com"}
    )
    if created or not user.check_password(test_user_credentials["password"]):
        user.set_password(test_user_credentials["password"])
        user.save()
    return user


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def admin_user(db):
    User = get_user_model()
    return User.objects.create_superuser(username="adminuser", password="adminpassword", email="admin@example.com")


@pytest.fixture
def other_user(db):
    User = get_user_model()
    return User.objects.create_user(username="otheruser", password="password123", email="other@example.com")


@pytest.fixture
def auth_client(api_client, test_user):
    api_client.force_authenticate(user=test_user)
    return api_client


@pytest.fixture
def other_auth_client(api_client, other_user):
    api_client.force_authenticate(user=other_user)
    return api_client


@pytest.fixture
def admin_auth_client(api_client, admin_user):
    api_client.force_authenticate(user=admin_user)
    return api_client