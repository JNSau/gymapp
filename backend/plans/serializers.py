from rest_framework import serializers
from .models import TrainingPlan, TrainingDay, ExerciseInPlan
from exercises.serializers import ExerciseSerializer

class ExerciseInPlanSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer()

    class Meta:
        model = ExerciseInPlan
        fields = "__all__"

class TrainingDaySerializer(serializers.ModelSerializer):
    exercises = ExerciseInPlanSerializer(many=True, read_only=True)

    class Meta:
        model = TrainingDay
        fields = "__all__"

class TrainingPlanSerializer(serializers.ModelSerializer):
    days = TrainingDaySerializer(many=True, read_only=True)

    class Meta:
        model = TrainingPlan
        fields = "__all__"
