from django.db import models
from django.conf import settings  # Potrzebne do powiązania z Użytkownikiem
from exercises.models import Exercise


# --- MODELE PLANU TRENINGOWEGO ---

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
        return f"Day {self.day_number} – {self.plan.name}"


class ExerciseInPlan(models.Model):
    training_day = models.ForeignKey(TrainingDay, on_delete=models.CASCADE, related_name="exercises")
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)

    # Parametry planowane (to co użytkownik MA zrobić)
    sets = models.PositiveIntegerField(default=3)
    reps = models.CharField(max_length=20, default="10-12")
    rest_time = models.CharField(max_length=20, default="60s")

    class Meta:
        ordering = ["training_day", "pk"]

    def __str__(self):
        return f"{self.exercise.name} – {self.sets}x{self.reps}"


# --- NOWE MODELE: HISTORIA TRENINGÓW (Active Workout) ---

class WorkoutSession(models.Model):
    """
    Reprezentuje jeden odbyty trening.
    """
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    # Jeśli usuniemy plan, historia zostaje (dlatego SET_NULL)
    training_day = models.ForeignKey(TrainingDay, on_delete=models.SET_NULL, null=True, blank=True)

    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    duration_minutes = models.IntegerField(default=0)  # Czas trwania w minutach
    notes = models.TextField(blank=True)  # Notatki użytkownika po treningu

    def __str__(self):
        date_str = self.start_time.strftime('%Y-%m-%d')
        return f"{self.user.username} - {date_str}"


class WorkoutLog(models.Model):
    """
    Reprezentuje konkretną serię wykonaną podczas treningu.
    """
    session = models.ForeignKey(WorkoutSession, related_name='logs', on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)

    # Parametry faktycznie wykonane (to co użytkownik ZROBIŁ)
    set_number = models.IntegerField(default=1)
    reps_done = models.IntegerField()
    weight_kg = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.exercise.name}: {self.weight_kg}kg x {self.reps_done}"