import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient

from .models import Note


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def test_user(db):
    return User.objects.create_user(username='testuser', password='password123')


@pytest.fixture
def test_note(test_user):
    return Note.objects.create(
        user=test_user,
        title='Initial Note',
        content='Initial content for testing',
    )
