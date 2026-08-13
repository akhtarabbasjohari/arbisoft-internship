from rest_framework import serializers
from .models import Note
from django.contrib.auth.models import User

class UserRegistrationSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=6)
    is_staff = serializers.BooleanField(read_only=True)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is not available.")
        return value
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email= validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class NoteSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    user_id = serializers.IntegerField(read_only=True, source='user.id')
    user_username = serializers.CharField(read_only=True, source='user.username')
    title = serializers.CharField(max_length=255)
    content = serializers.CharField()
    created_at = serializers.DateTimeField(read_only=True)

    def validate_title(self, value):
        stripped = value.strip()
        if not stripped:
            raise serializers.ValidationError("Title cannot be empty")
        if len(stripped) < 3:
            raise serializers.ValidationError("Title must be atleast 3 characters")
        return stripped

    def validate_content(self, value):
        stripped = value.strip()
        if not stripped:
            raise serializers.ValidationError("content cannot be empty please write something")
        if len(stripped) < 5:
            raise serializers.ValidationError("Content must be atleast 5 characters")
        return stripped

    def create(self, validated_data):
        return Note.objects.create(**validated_data)

    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.content = validated_data.get('content', instance.content)
        instance.save()
        return instance