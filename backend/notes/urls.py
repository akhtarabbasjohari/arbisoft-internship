from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_user, name='auth_register'),
    path('notes/', views.note_list_create, name='note-list-create'),
    path('notes/<int:pk>/', views.note_detail, name='note-detail'),
]