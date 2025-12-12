from django.urls import path
from .views import FeedbackView

urlpatterns = [
    # Adres to po prostu /api/feedback/
    # Dane (plan_id i rating) są w środku zapytania
    path("", FeedbackView.as_view(), name="feedback_create"),
]