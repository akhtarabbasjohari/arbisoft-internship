import pytest
from rest_framework import status

from .models import Note


@pytest.mark.django_db
def test_create_note_success(api_client, test_user):
    payload = {
        'user': test_user.id,
        'title': 'New Note Title',
        'content': 'Valid content text body',
    }
    response = api_client.post('/api/notes/', payload, format='json')
    assert response.status_code == status.HTTP_201_CREATED
    assert response.data['title'] == 'New Note Title'
    assert Note.objects.filter(id=response.data['id']).exists()


@pytest.mark.django_db
def test_create_note_empty_title_fails(api_client, test_user):
    payload = {
        'user': test_user.id,
        'title': '   ',
        'content': 'Valid content text body',
    }
    response = api_client.post('/api/notes/', payload, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'title' in response.data
    msg = 'Title cannot be empty or whitespace only.'
    assert msg in response.data['title']


@pytest.mark.django_db
def test_create_note_short_content_fails(api_client, test_user):
    payload = {
        'user': test_user.id,
        'title': 'Valid Title',
        'content': 'Hey',
    }
    response = api_client.post('/api/notes/', payload, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert 'content' in response.data
    msg = 'Content must be at least 5 characters.'
    assert msg in response.data['content']


@pytest.mark.django_db
def test_fetch_notes_list(api_client, test_note):
    response = api_client.get('/api/notes/')
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
    assert response.data[0]['id'] == test_note.id


@pytest.mark.django_db
def test_fetch_single_note(api_client, test_note):
    response = api_client.get(f'/api/notes/{test_note.id}/')
    assert response.status_code == status.HTTP_200_OK
    assert response.data['id'] == test_note.id
    assert response.data['title'] == test_note.title
    assert response.data['content'] == test_note.content


@pytest.mark.django_db
def test_fetch_non_existent_note(api_client, db):
    response = api_client.get('/api/notes/99999/')
    assert response.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.django_db
def test_update_note_success(api_client, test_user, test_note):
    payload = {
        'user': test_user.id,
        'title': 'Updated Title',
        'content': 'Updated content text body',
    }
    url = f'/api/notes/{test_note.id}/'
    response = api_client.put(url, payload, format='json')
    assert response.status_code == status.HTTP_200_OK
    assert response.data['title'] == 'Updated Title'
    test_note.refresh_from_db()
    assert test_note.title == 'Updated Title'
    assert test_note.content == 'Updated content text body'


@pytest.mark.django_db
def test_delete_note_success(api_client, test_note):
    note_id = test_note.id
    response = api_client.delete(f'/api/notes/{note_id}/')
    assert response.status_code == status.HTTP_204_NO_CONTENT
    assert not Note.objects.filter(id=note_id).exists()
