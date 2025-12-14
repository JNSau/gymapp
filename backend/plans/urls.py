from django.urls import path
from .views import (
    PublicPlanListView,
    UserPlanListView,
    TrainingPlanDetail,
    CopyPlanView,
    WorkoutHistoryView
)

urlpatterns = [
    # 1. Katalog publiczny (dla "Browse Plans")
    path("public/", PublicPlanListView.as_view(), name="public_plans"),

    # 2. Plany użytkownika (dla "My Workouts")
    path("my-plans/", UserPlanListView.as_view(), name="user_plans"),

    # 3. Kopiowanie planu (Akcja przycisku "Add to My Workouts")
    path("<int:pk>/copy/", CopyPlanView.as_view(), name="copy_plan"),

    # 4. Historia treningów
    path("history/", WorkoutHistoryView.as_view(), name="workout_history"),

    # 5. Szczegóły / Edycja / Usuwanie planu (Musi być na końcu, bo <int:pk> łapie wszystko)
    path("<int:pk>/", TrainingPlanDetail.as_view(), name="plan_detail"),
]