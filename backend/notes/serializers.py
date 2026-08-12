from rest_framework import serializers
from .models import Note
from django.contrib.auth.models import User

class NoteSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    title = serializers.CharField(max_length=255)
    content = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        return Note.objects.create(**validated_data)

    
    def update(self, instance, validated_data):
        instance.user = validated_data.get('user', instance.user)
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance