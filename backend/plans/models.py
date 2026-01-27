from django.db import models
from django.conf import settings
from exercises.models import Exercise




class TrainingPlan(models.Model):
    class Level(models.TextChoices):
        BEGINNER = "BEGINNER", "Beginner"
        INTERMEDIATE = "INTERMEDIATE", "Intermediate"
        ADVANCED = "ADVANCED", "Advanced"


    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True,
                             related_name="plans")

    name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=Level.choices)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["pk"]

    def __str__(self):
        owner = self.user.username if self.user else "SYSTEM"
        return f"{self.name} ({self.level}) - Owner: {owner}"


class TrainingDay(models.Model):
    plan = models.ForeignKey(TrainingPlan, on_delete=models.CASCADE, related_name="days")
    day_number = models.IntegerField()

    class Meta:
        ordering = ["day_number"]

    def __str__(self):
        return f"Day {self.day_number} – {self.plan.name}"


class ExerciseInPlan(models.Model):
    training_day = models.ForeignKey(TrainingDay, on_delete=models.CASCADE, related_name="exercises")
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)


    sets = models.PositiveIntegerField(default=3)
    reps = models.CharField(max_length=20, default="10-12")
    rest_time = models.CharField(max_length=20, default="60s")

    class Meta:
        ordering = ["training_day", "pk"]

    def __str__(self):
        return f"{self.exercise.name} – {self.sets}x{self.reps}"




class WorkoutSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    training_day = models.ForeignKey(TrainingDay, on_delete=models.SET_NULL, null=True, blank=True)
    custom_name = models.CharField(max_length=100, blank=True, default="My Workout")
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.custom_name}"


class WorkoutLog(models.Model):
    session = models.ForeignKey(WorkoutSession, related_name='logs', on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    set_number = models.IntegerField(default=1)
    reps_done = models.IntegerField()
    weight_kg = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.exercise.name}: {self.weight_kg}kg x {self.reps_done}"