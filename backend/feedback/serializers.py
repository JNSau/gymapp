from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feedback
        fields = ["id", "plan", "rating", "created_at"]
        # Tylko user i data są automatyczne. 'plan' musi przyjść z Reacta.
        read_only_fields = ["id", "user", "created_at"]