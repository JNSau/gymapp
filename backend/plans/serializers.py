from rest_framework import serializers
from .models import TrainingPlan, TrainingDay, ExerciseInPlan, WorkoutSession, WorkoutLog
from exercises.serializers import ExerciseSerializer


# --- SERIALIZERY PLANÓW ---

class ExerciseInPlanSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)
    exercise_image = serializers.URLField(source='exercise.image_url', read_only=True)

    class Meta:
        model = ExerciseInPlan
        fields = ['id', 'exercise', 'exercise_name', 'exercise_image', 'sets', 'reps', 'rest_time']


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


# --- SERIALIZERY HISTORII ---

class WorkoutLogSerializer(serializers.ModelSerializer):
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)

    class Meta:
        model = WorkoutLog
        fields = ['id', 'exercise', 'exercise_name', 'set_number', 'reps_done', 'weight_kg']


class WorkoutSessionSerializer(serializers.ModelSerializer):
    logs = WorkoutLogSerializer(many=True)
    plan_name = serializers.CharField(source='training_day.plan.name', read_only=True, default="Custom Workout")

    class Meta:
        model = WorkoutSession
        # --- ZMIANA: DODAŁEM 'custom_name' DO LISTY PÓL ---
        fields = ['id', 'start_time', 'end_time', 'duration_minutes', 'logs', 'plan_name', 'custom_name']

    def create(self, validated_data):
        logs_data = validated_data.pop('logs')
        session = WorkoutSession.objects.create(**validated_data)
        for log_data in logs_data:
            WorkoutLog.objects.create(session=session, **log_data)
        return session