from django.urls import path
from .views import FeedbackView

urlpatterns = [
    path("<int:plan_id>/", FeedbackView.as_view(), name="feedback_create"),
]
