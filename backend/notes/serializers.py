from rest_framework import serializers
from .models import Note


class NoteSerializer(serializers.ModelSerializer):
    title = serializers.CharField(required=True, allow_blank=True)
    content = serializers.CharField(required=True, allow_blank=True)

    class Meta:
        model = Note
        fields = ['id', 'user', 'title', 'content', 'created_at']

    def validate_title(self, value):
        stripped = value.strip()
        if not stripped:
            raise serializers.ValidationError("Title cannot be empty or whitespace only.")
        if len(stripped) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters.")
        return stripped

    def validate_content(self, value):
        stripped = value.strip()
        if not stripped:
            raise serializers.ValidationError("Content cannot be empty or whitespace only.")
        if len(stripped) < 5:
            raise serializers.ValidationError("Content must be at least 5 characters.")
        return stripped

