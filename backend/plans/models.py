from django.db import models
from exercises.models import Exercise

class TrainingPlan(models.Model):
    class Level(models.TextChoices):
        BEGINNER = "BEGINNER", "Beginner"
        INTERMEDIATE = "INTERMEDIATE", "Intermediate"
        ADVANCED = "ADVANCED", "Advanced"

    name = models.CharField(max_length=100)
    level = models.CharField(max_length=20, choices=Level.choices)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["pk"]

    def __str__(self):
        return f"{self.name} ({self.level})"


class TrainingDay(models.Model):
    plan = models.ForeignKey(TrainingPlan, on_delete=models.CASCADE, related_name="days")
    day_number = models.IntegerField()

    class Meta:
        ordering = ["day_number"]

    def __str__(self):
        return f"Dzień {self.day_number} – {self.plan.name}"


class ExerciseInPlan(models.Model):
    training_day = models.ForeignKey(TrainingDay, on_delete=models.CASCADE, related_name="exercises")
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.PositiveIntegerField()
    reps = models.CharField(max_length=20)
    rest_time = models.CharField(max_length=20)

    class Meta:
        ordering = ["training_day", "pk"]

    def __str__(self):
        return f"{self.exercise.name} – {self.sets}x{self.reps}"
