from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Note


class NoteAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='password123'
        )
        self.note = Note.objects.create(
            user=self.user,
            title='Initial Note',
            content='Initial content for testing',
        )

    def test_create_note_success_returns_201(self):
        payload = {
            'user': self.user.id,
            'title': 'New Note',
            'content': 'Valid content length',
        }
        response = self.client.post('/api/notes/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'New Note')
        self.assertEqual(response.data['content'], 'Valid content length')

    def test_fetch_notes_list_returns_200(self):
        response = self.client.get('/api/notes/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_retrieve_single_note_returns_200(self):
        response = self.client.get(f'/api/notes/{self.note.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.note.title)

    def test_update_note_returns_200(self):
        payload = {
            'user': self.user.id,
            'title': 'Updated Title',
            'content': 'Updated content body text',
        }
        url = f'/api/notes/{self.note.id}/'
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Updated Title')

    def test_delete_note_returns_204(self):
        response = self.client.delete(f'/api/notes/{self.note.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Note.objects.filter(id=self.note.id).exists())

    def test_validation_fails_empty_title_returns_400(self):
        payload = {
            'user': self.user.id,
            'title': '   ',
            'content': 'Valid content length',
        }
        response = self.client.post('/api/notes/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)
        msg = 'Title cannot be empty or whitespace only.'
        self.assertIn(msg, response.data['title'])

    def test_validation_fails_short_title_returns_400(self):
        payload = {
            'user': self.user.id,
            'title': 'Hi',
            'content': 'Valid content length',
        }
        response = self.client.post('/api/notes/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data)
        self.assertIn('Title must be at least 3 characters.', response.data['title'])

    def test_validation_fails_empty_content_returns_400(self):
        payload = {
            'user': self.user.id,
            'title': 'Valid Title',
            'content': '   ',
        }
        response = self.client.post('/api/notes/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('content', response.data)
        msg = 'Content cannot be empty or whitespace only.'
        self.assertIn(msg, response.data['content'])

    def test_validation_fails_short_content_returns_400(self):
        payload = {
            'user': self.user.id,
            'title': 'Valid Title',
            'content': 'Hey',
        }
        response = self.client.post('/api/notes/', payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('content', response.data)
        msg = 'Content must be at least 5 characters.'
        self.assertIn(msg, response.data['content'])

    def test_nonexistent_note_returns_404(self):
        response = self.client.get('/api/notes/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
