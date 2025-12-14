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
    # 1. Katalog publiczny
    path("public/", PublicPlanListView.as_view(), name="public_plans"),

    # 2. Plany użytkownika
    path("my-plans/", UserPlanListView.as_view(), name="user_plans"),

    # 3. Kopiowanie planu
    path("<int:pk>/copy/", CopyPlanView.as_view(), name="copy_plan"),

    # 4. Historia treningów
    path("history/", WorkoutHistoryView.as_view(), name="workout_history"),

    # 5. Edycja konkretnego ćwiczenia w planie (NOWOŚĆ)
    path("exercise-in-plan/<int:pk>/", ExerciseInPlanUpdateView.as_view(), name="update_exercise_in_plan"),

    # 6. Szczegóły / Edycja nazwy planu / Usuwanie planu
    path("<int:pk>/", TrainingPlanDetail.as_view(), name="plan_detail"),
]