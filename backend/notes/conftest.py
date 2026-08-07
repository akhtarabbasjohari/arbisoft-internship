import pytest
from decouple import config
from django.contrib.auth import get_user_model

# Read test user credentials from environment variables via python-decouple
TEST_USER_USERNAME = config("TEST_USER_USERNAME", default="default_test_user")
TEST_USER_PASSWORD = config("TEST_USER_PASSWORD", default="default_test_password")


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
        username=test_user_credentials["username"]
    )
    if created or not user.check_password(test_user_credentials["password"]):
        user.set_password(test_user_credentials["password"])
        user.save()
    return user
