from django.db import models
from django.contrib.auth import get_user_model
from plans.models import TrainingPlan

User = get_user_model()

class Feedback(models.Model):
    class Rating(models.IntegerChoices):
        TOO_EASY = 1, "Too Easy"
        GOOD = 2, "Good"
        TOO_HARD = 3, "Too Hard"

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="feedbacks")
    plan = models.ForeignKey(TrainingPlan, on_delete=models.CASCADE, related_name="feedbacks")
    rating = models.IntegerField(choices=Rating.choices)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        # To zapobiega dodaniu dwóch opinii do tego samego planu przez jedną osobę
        unique_together = ("user", "plan")

    def __str__(self):
        return f"{self.user.username} – {self.get_rating_display()}"