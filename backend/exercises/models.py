from django.db import models


class Exercise(models.Model):
    class MuscleGroup(models.TextChoices):
        CHEST = "CHEST", "Chest"
        BACK = "BACK", "Back"
        SHOULDERS = "SHOULDERS", "Shoulders"
        LEGS = "LEGS", "Legs"
        ARMS = "ARMS", "Arms"
        CORE = "CORE", "Core"
        FULLBODY = "FULLBODY", "Full Body"

    class Difficulty(models.TextChoices):
        EASY = "EASY", "Easy"
        MEDIUM = "MEDIUM", "Medium"
        HARD = "HARD", "Hard"

    name = models.CharField(max_length=100)
    description = models.TextField()
    muscle_group = models.CharField(max_length=20, choices=MuscleGroup.choices)
    difficulty = models.CharField(max_length=20, choices=Difficulty.choices)

    # --- ZMIANA TUTAJ ---
    # Zmieniono URLField na ImageField.
    # upload_to='exercises/' oznacza, że zdjęcia trafią do folderu media/exercises/
    image = models.ImageField(upload_to='exercises/', blank=True, null=True)
    # --------------------

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name