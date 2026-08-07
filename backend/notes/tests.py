import pytest
from decouple import config


@pytest.mark.django_db
def test_user_credentials_from_env(test_user_credentials, test_user):
    """Verify test user credentials and user instance match environment variables."""
    expected_username = config("TEST_USER_USERNAME", default="default_test_user")
    expected_password = config("TEST_USER_PASSWORD", default="default_test_password")

    assert test_user_credentials["username"] == expected_username
    assert test_user_credentials["password"] == expected_password
    assert test_user.username == expected_username
    assert test_user.check_password(expected_password)
