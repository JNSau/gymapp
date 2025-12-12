from django.urls import path
from .views import TrainingPlanList, TrainingPlanDetail, WorkoutHistoryView

urlpatterns = [
    # Lista planów
    path("", TrainingPlanList.as_view(), name="plan_list"),

    # Historia treningów (Musi być przed 'plan_detail'!)
    path("history/", WorkoutHistoryView.as_view(), name="workout_history"),

    # Szczegóły planu (np. /plans/1/)
    path("<int:pk>/", TrainingPlanDetail.as_view(), name="plan_detail"),
]