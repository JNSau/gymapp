from django.urls import path
from .views import (
    PublicPlanListView,
    UserPlanListView,
    TrainingPlanDetail,
    CopyPlanView,
    WorkoutHistoryView,
    ExerciseInPlanUpdateView # <--- Import nowego widoku
)

urlpatterns = [

    path("public/", PublicPlanListView.as_view(), name="public_plans"),


    path("my-plans/", UserPlanListView.as_view(), name="user_plans"),


    path("<int:pk>/copy/", CopyPlanView.as_view(), name="copy_plan"),


    path("history/", WorkoutHistoryView.as_view(), name="workout_history"),


    path("exercise-in-plan/<int:pk>/", ExerciseInPlanUpdateView.as_view(), name="update_exercise_in_plan"),


    path("<int:pk>/", TrainingPlanDetail.as_view(), name="plan_detail"),
]