from rest_framework import generics, permissions
from .models import TrainingPlan, WorkoutSession
from .serializers import TrainingPlanSerializer, WorkoutSessionSerializer

# --- WIDOKI PLANÓW ---

class TrainingPlanList(generics.ListAPIView):
    serializer_class = TrainingPlanSerializer

    def get_queryset(self):
        user = self.request.user
        # Jeśli użytkownik nie jest zalogowany lub nie ma poziomu, zwróć wszystko
        if not user.is_authenticated or not hasattr(user, 'level') or not user.level:
            return TrainingPlan.objects.all()
        # Filtrowanie po poziomie użytkownika
        return TrainingPlan.objects.filter(level=user.level)

class TrainingPlanDetail(generics.RetrieveAPIView):
    queryset = TrainingPlan.objects.all()
    serializer_class = TrainingPlanSerializer


# --- NOWY WIDOK: HISTORIA TRENINGÓW ---

class WorkoutHistoryView(generics.ListCreateAPIView):
    serializer_class = WorkoutSessionSerializer
    permission_classes = [permissions.IsAuthenticated] # Tylko dla zalogowanych

    def get_queryset(self):
        # Zwracamy historię TYLKO tego użytkownika, sortując od najnowszych
        return WorkoutSession.objects.filter(user=self.request.user).order_by('-start_time')

    def perform_create(self, serializer):
        # Automatycznie przypisz użytkownika, który wysyła zapytanie
        serializer.save(user=self.request.user)