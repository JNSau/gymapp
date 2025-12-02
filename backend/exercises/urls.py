from django.urls import path
from .views import ExerciseList, ExerciseDetail

urlpatterns = [
    path("", ExerciseList.as_view(), name="exercise_list"),
    path("<int:pk>/", ExerciseDetail.as_view(), name="exercise_detail"),
]
